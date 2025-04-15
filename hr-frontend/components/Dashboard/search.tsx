// components/Dashboard/Search.tsx
import React, { useState } from "react";

interface SearchResult {
  id: number;
  // For people, we expect a "name" property
  name?: string;
 family?:string;

  // For propertiies, we expect an "address" property
  address?: string;
  inquirer?: string;
}

const SearchComponent: React.FC = () => {
  const [searchType, setSearchType] = useState<"people" | "propertiies">("people");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
     //const response = await fetch(`http://localhost:5000/api/propertiies/search?q=${encodeURIComponent(query)}`);
     const response = await fetch(`${API_URL}/api/${searchType}/search?q=${encodeURIComponent(query)}`);
      // Log the raw response text
      const text = await response.text();
      console.log("Raw response text:", text);
      // Attempt to parse JSON only if response.ok
      if (!response.ok) {
        setError("Error: " + text);
        return;
      }
      const data = JSON.parse(text);
      console.log("Parsed data:", data);
      setResults(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };
  

  return (
    <div>
      <form onSubmit={handleSearch}  className="flex space-x-2">
        <select
          className="border rounded px-2 py-1"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "people" | "propertiies")}
        >
          <option value="people">Contact Name</option>
          <option value="propertiies">landlord</option>
        </select>
        <input
          type="text"
          className="border rounded px-2 py-1" 
          placeholder="Enter search text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && results.length === 0 && query.trim() !== "" && !error && (
        <p>No results found.</p>
      )}

      <div>
        <h3>Results:</h3>
        <ul>
          {results.map((item) => (
            <li key={item.id}>
              {searchType === "people" ? item.name : item.inquirer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;
