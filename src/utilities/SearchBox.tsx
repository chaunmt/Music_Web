import React from "react";
import "./SearchBox.css"
import YoutubeUtils from "./YoutubeUtils";
import { HiSearch } from "react-icons/hi";

export const SearchBox = () => {

  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = async () => { 
    // await basically unwrap the promise
    // but it needs to be in async function
    setSearchResult(await YoutubeUtils.getDetails(searchInput));
  }

  React.useEffect(() => {
    console.log(searchInput);
    console.log(searchResult);
  }, [searchInput, searchResult]);

  return (
    <div className="search-box">
      {/* Search Bar */}
      <div className="search-bar"> 
        <input
          type="text" placeholder="Search here"
          onChange={handleChange} value={searchInput}
        />
        <button
          onClick={handleSubmit}> <HiSearch/> </button>
      </div>
      {/* Search Result */}
      { searchResult == null ? (null) : (searchResult == 0 ? (
        <h1> No result found </h1>
      ) : (
        <div className="search-result-container">
        <h1> Result: </h1>
        </div>
      ))}
    </div>  
  );
}


