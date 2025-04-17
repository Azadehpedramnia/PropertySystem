import React, { useState, useEffect } from "react";


interface SearchResult {
  id: number;
  name?: string;
  family?: string;
  address?: string;
  inquirer?: string;
  post_code?:string;
}

const SearchComponent: React.FC = () => {
  const [searchType, setSearchType] = useState<"people" | "propertiies">("people");
  const [searchField, setSearchField] = useState<"name" | "inquirer" | "address" | "post_code">("name");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

 useEffect(() => {
    setResults([]);
    setHasSearched(false); // hide "no results" message
  }, [searchType, searchField]);

  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const url = `${API_URL}/api/${searchType}/search?q=${encodeURIComponent(query)}&field=${searchField}`;
        const response = await fetch(url);
        const text = await response.text();
        console.log("Raw response text:", text);

        if (!response.ok) {
            setError("Error: " + text);
            return;
        }
          
        //Limit for length of search
        if (query.trim().length < 2) {
            setError("Search term too short.");
            return;
        }
        
        const data = JSON.parse(text);
        setResults(data);
        } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred. Please try again.");
        }
        setLoading(false);
  };

  return (
    <div>

      <form onSubmit={handleSearch} className="d-flex gap-2 align-items-center mb-3">
        {/* Select table: people or properties */}
        <select
          className="form-select"
          value={searchType}
          onChange={(e) => {
            const selected = e.target.value as "people" | "propertiies";
            setSearchType(selected);
            setSearchField(selected === "people" ? "name" : "inquirer"); // Default field for each
          }}
        >
          <option value="people">Contacts</option>
          <option value="propertiies">Properties</option>
        </select>

        {/* Show field selection ONLY for "propertiies" */}
        {searchType === "propertiies" && (
          <select
            className="form-select"
            value={searchField}
            onChange={(e) =>
              setSearchField(e.target.value as "inquirer" | "address" | "post_code")
            }
          >
            <option value="inquirer">Landlord</option>
            <option value="address">Address or Post Code</option>
          </select>
        )}

        {/* Search input field */}
        <input
          type="text"
          className="form-control"
          placeholder="Enter search text"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setHasSearched(false);
            if (value.trim() === "") {
              setResults([]);
            }
          }}
        />

        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

       {/*<form onSubmit={handleSearch} className="d-flex gap-2 align-items-center mb-3">
        Select table: people or properties 
        <select
          className="form-select"
          value={searchType}
          onChange={(e) => {
            const selected = e.target.value as "people" | "propertiies";
            setSearchType(selected);
            setSearchField(selected === "people" ? "name" : "inquirer"); // Reset default field
          }}
        >
          <option value="people">Contacts</option>
          <option value="propertiies">Properties</option>
        </select>

        {/* Select field based on type 
        {searchType === "people" ? (
          <select
            className="form-select"
            value={searchField}       
            onChange={(e) => setSearchField(e.target.value as "name")}
          >
            <option value="name">Name</option>
          </select>
        ) : (
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as "inquirer" | "address" | "post_code" )}
          >
            <option value="inquirer">Landlord</option>
            <option value="address">Address or Post Code</option>
          </select>
        )}

        <input
          type="text"
          className="form-control"
          placeholder="Enter search text"
          value={query}
          onChange={(e) => {

            const value = e.target.value;
            setQuery(value);
            setHasSearched(false);
            if (value.trim() === "") {
              setResults([]);
            }
          }}
        />

        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>*/}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {hasSearched && !loading && results.length === 0 && query.trim() !== "" && !error && (
         <p>No results found for "{query}".</p>
       )}

        


      <div>
        <h5>Results:</h5>
            <ul>
                {results.map((item) => (
                    <li key={item.id}>
                    {searchField === "name" && `${item.name ?? ""} ${item.family ?? ""}`}
                    {searchField === "inquirer" && item.inquirer}
                    {searchField === "address" && (
                        item.address || item.post_code || "No address or post code"
                    )}
                    </li>
                ))}
            </ul>

            
      </div>
    </div>
    
  );
};

export default SearchComponent;
