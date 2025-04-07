import React, { useState } from "react";
import "./App.css";

const Home = () => {
  const [article, setArticle] = useState("");
  const [summary, setSummary] = useState("");

  const handleRefresh = async () => {
    const response = await fetch("http://localhost:5000/api/article");
    const data = await response.json();
    setArticle(data.article);
    setSummary("");
  };

  const handleGenerateSummary = async () => {
    const response = await fetch("http://localhost:5000/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article }),
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <>
      <div className="page">
        <h1>📝 Article Summary App</h1>
        <div className="container">
          <div className="content">
            <h2>Original Article</h2>
            <p>{article || "Click refresh to load an article."}</p>

            <h2>Generated Summary</h2>
            <p>{summary || "Summary will appear here after generation."}</p>

            <div className="button-group">
              <button onClick={handleRefresh}>🔄 Refresh Article</button>
              <button onClick={handleGenerateSummary}>
                ✨ Generate Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
