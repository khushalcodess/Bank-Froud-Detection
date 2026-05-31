const Transaction = require("../models/Transaction");
const Alert = require("../models/Alert");
const User = require("../models/User");
const axios = require("axios");


exports.makeTransaction = async (req, res) => {
  try {
    const { receiver_account, amount } = req.body;
    const sender_id = req.user.id;

    const sender = await User.findById(sender_id);
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const receiver = await User.findOne({ account_number: receiver_account });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    const now = new Date();
    const hour = now.getHours();
    const day_of_week = now.getDay();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const freq_1hr = await Transaction.countDocuments({
      sender_id,
      createdAt: { $gte: oneHourAgo }
    });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const freq_24hr = await Transaction.countDocuments({
      sender_id,
      createdAt: { $gte: oneDayAgo }
    });

    const previousTxn = await Transaction.findOne({
      sender_id,
      receiver_account
    });
    const is_new_receiver = previousTxn ? 0 : 1;

    const userTxns = await Transaction.find({ sender_id });
    const user_avg_amount = userTxns.length > 0
      ? userTxns.reduce((sum, t) => sum + t.amount, 0) / userTxns.length
      : 5000;

    let risk_score = 0;
    let status = 'safe';
    let reasons = [];

    try {
      const mlResponse = await axios.post(
        'http://127.0.0.1:5000/predict',
        {
          amount,
          hour,
          day_of_week,
          freq_1hr,
          freq_24hr,
          is_new_receiver,
          user_avg_amount
        }
      );
      risk_score = mlResponse.data.risk_score;
      status = mlResponse.data.status;
      reasons = mlResponse.data.reasons.map(r => r.readable);

    } catch (mlError) {
      console.log("ML model error:", mlError.message);
      if (amount > 50000) { risk_score += 40; reasons.push("Very high amount"); }
      if (freq_1hr >= 5) { risk_score += 30; reasons.push("Too many transactions"); }
      if (is_new_receiver) { risk_score += 20; reasons.push("New receiver"); }
      risk_score = Math.min(risk_score, 100);
      if (risk_score >= 71) status = 'flagged';
      else if (risk_score >= 31) status = 'suspicious';
    }

    const txn_code = "TX" + Date.now();

    const transaction = await Transaction.create({
      txn_code,
      sender_id,
      receiver_id: receiver._id,
      sender_account: sender.account_number,
      receiver_account,
      amount,
      risk_score,
      status,
      reasons
    });

    if (status !== 'flagged') {
      await User.findByIdAndUpdate(sender_id, { $inc: { balance: -amount } });
      await User.findByIdAndUpdate(receiver._id, { $inc: { balance: amount } });
    }

    if (status === 'flagged' || status === 'suspicious') {
      await Alert.create({
        transaction_id: transaction._id,
        sender_id,
        reason: reasons.join(', '),
        risk_score,
        status: 'pending'
      });
    }

    res.status(201).json({
      message: "Transaction completed",
      transaction,
      risk_score,
      status,
      reasons
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { sender_id: req.user.id },
        { receiver_id: req.user.id }
      ]
    })
    .populate("sender_id", "name account_number")
    .populate("receiver_id", "name account_number")
    .sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("sender_id", "name email account_number")
      .populate("receiver_id", "name email account_number")
      .sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};