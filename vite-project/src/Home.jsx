import { useState } from "react";
import "./App.css";

function App() {
  const [article, setArticle] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/article");
      const data = await res.json();
      setArticle(data.article);
      setSummary(""); // clear previous summary
    } catch (err) {
      console.error("Error fetching article:", err);
    }
    setLoading(false);
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Article Summary App</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={fetchArticle} disabled={loading}>
          Refresh Article
        </button>
        <button
          onClick={generateSummary}
          disabled={!article || loading}
          style={{ marginLeft: "1rem" }}
        >
          Generate Summary
        </button>
      </div>

      <div>
        <h2>Original Article</h2>
        <p>{article || "Click refresh to load an article."}</p>
      </div>

      <div>
        <h2>Generated Summary</h2>
        <p>{summary || "Summary will appear here after generation."}</p>
      </div>
    </div>
  );
}

export default App;
