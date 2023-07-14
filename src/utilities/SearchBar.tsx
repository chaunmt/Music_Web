import React from "react";
import { getTrackDetails } from "./YoutubeUtils";


export const SearchBar = () => {

  const [searchInput, setSearchInput] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = () => {
    const details = getTrackDetails(searchInput);
    console.log(searchInput);
    console.log(details);
  }

  return (
    <div>
      <input
      type="text"
      placeholder="Search here"
      onChange={handleChange}
      value={searchInput}
      />
      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>  
  );
}


