const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Alert = require("../models/Alert");

exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTransactions = await Transaction.countDocuments();
    const totalFlagged = await Transaction.countDocuments({ status: "flagged" });
    const totalSuspicious = await Transaction.countDocuments({ status: "suspicious" });

    const todayTransactions = await Transaction.countDocuments({
      createdAt: { $gte: today }
    });
    const monthTransactions = await Transaction.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    const yearTransactions = await Transaction.countDocuments({
      createdAt: { $gte: thisYear }
    });

    const todayFraud = await Transaction.countDocuments({
      status: { $in: ["flagged", "suspicious"] },
      createdAt: { $gte: today }
    });
    const monthFraud = await Transaction.countDocuments({
      status: { $in: ["flagged", "suspicious"] },
      createdAt: { $gte: thisMonth }
    });
    const yearFraud = await Transaction.countDocuments({
      status: { $in: ["flagged", "suspicious"] },
      createdAt: { $gte: thisYear }
    });

    const pendingAlerts = await Alert.countDocuments({ status: "pending" });

    // ✅ Fixed last7Days loop
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i); // ✅ fixed: was -1 always
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await Transaction.countDocuments({
        status: { $in: ["flagged", "suspicious"] },
        createdAt: { $gte: date, $lt: nextDate }
      });

      last7Days.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        count
      });
    }

    // ✅ Recent transactions for table
    const recentTransactions = await Transaction.find()
      .populate("sender_id", "name account_number")
      .populate("receiver_id", "name account_number")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      totalUsers,
      totalTransactions,
      totalFlagged,
      totalSuspicious,
      todayTransactions,
      monthTransactions,
      yearTransactions,
      todayFraud,
      monthFraud,
      yearFraud,
      pendingAlerts,
      last7Days,
      recentTransactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("transaction_id")
      .populate("sender_id", "name email account_number")
      .sort({ createdAt: -1 });

    res.status(200).json({ alerts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      id, { status }, { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // ✅ Fixed - only one res.json()
    res.status(200).json({
      message: `Alert ${status} successfully`,
      alert
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      id, { status }, { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${status} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fixed getTodayStats - typo fixed
exports.getTodayStats = async (req, res) => {
  try {
    const hours = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const startHour = new Date(today);
      startHour.setHours(i);
      const endHour = new Date(today);
      endHour.setHours(i + 1);

      // ✅ Fixed typo: froudCount → fraudCount
      const fraudCount = await Transaction.countDocuments({
        status: { $in: ["flagged", "suspicious"] },
        createdAt: { $gte: startHour, $lt: endHour }
      });

      hours.push({
        label: `${i}:00`,
        fraud: fraudCount // ✅ matches now
      });
    }
    res.status(200).json({ hours });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMonthStats = async (req, res) => {
  try {
    const days = [];
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const startDay = new Date(now.getFullYear(), now.getMonth(), i);
      const endDay = new Date(now.getFullYear(), now.getMonth(), i + 1);

      const fraudCount = await Transaction.countDocuments({
        status: { $in: ["flagged", "suspicious"] },
        createdAt: { $gte: startDay, $lt: endDay }
      });

      days.push({ label: `${i}`, fraud: fraudCount });
    }
    res.status(200).json({ days });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── SEARCH ────────────────────────────────────────────
exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    const results = [];

    // ✅ Search users by name, email, account number
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { account_number: { $regex: q, $options: "i" } }
      ]
    }).select("-password").limit(5);

    users.forEach(u => results.push({
      type: "user",
      _id: u._id,
      name: u.name,
      email: u.email,
      account_number: u.account_number,
      status: u.status
    }));

    // ✅ Search transactions by txn_code, sender, receiver
    const transactions = await Transaction.find({
      $or: [
        { txn_code: { $regex: q, $options: "i" } },
        { sender_account: { $regex: q, $options: "i" } },
        { receiver_account: { $regex: q, $options: "i" } }
      ]
    }).limit(5);

    transactions.forEach(t => results.push({
      type: "transaction",
      _id: t._id,
      txn_code: t.txn_code,
      amount: t.amount,
      status: t.status,
      sender_account: t.sender_account,
      receiver_account: t.receiver_account
    }));

    res.status(200).json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};