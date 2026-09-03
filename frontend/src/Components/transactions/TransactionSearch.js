import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/config";

function TransactionSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    const searchValue = query.trim();

    if (!searchValue) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const response = await API.get(
        `/admin/search?q=${encodeURIComponent(searchValue)}`
      );

      setResults(response.data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === "user") {
      navigate("/Users");
    } else if (result.type === "transaction") {
      navigate("/Transactions");
    }

    setResults([]);
  };

  return (
    <div className="fg-transaction-search">
      <form onSubmit={handleSearch} className="fg-search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or transactions..."
          className="fg-search-input"
        />

        <button type="submit" className="fg-search-button">
          Search
        </button>
      </form>

      {loading && (
        <div className="fg-search-status">
          Searching...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="fg-search-results">
          {results.map((result, index) => (
            <button
              key={result._id || result.id || index}
              type="button"
              className="fg-search-result"
              onClick={() => handleResultClick(result)}
            >
              <div>
                <strong>
                  {result.name ||
                    result.username ||
                    result.transactionId ||
                    result._id}
                </strong>

                {result.email && (
                  <span>{result.email}</span>
                )}
              </div>

              <span className="fg-search-result-type">
                {result.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <div className="fg-search-status">
          No results found
        </div>
      )}
    </div>
  );
}

export default TransactionSearch;