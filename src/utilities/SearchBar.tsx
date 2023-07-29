import React from "react";
import YoutubeUtils from "./YoutubeUtils";

export const SearchBar = () => {

  const [searchInput, setSearchInput] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = async () => { 
    // await basically unwrap the promise
    // but it needs to be in async function
    const track = await YoutubeUtils.getDetails(searchInput);
    console.log(searchInput);
    console.log(track);
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


