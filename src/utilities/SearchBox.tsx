import React from "react";
import "./SearchBox.css"
import YoutubeUtils from "./YoutubeUtils";
import TrackList from "./TrackList";
import { HiSearch } from "react-icons/hi";

export const SearchBox = () => {

  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // await basically unwrap the promise
  // but it needs to be in async function
  const handleSubmit = async () => { 
    setSearchResult(await YoutubeUtils.getDetails(searchInput));
  }

  const handleDisplayResult = (results: string[] | null) => {
    if (!results) return null;
    return results.items.map((item, index) => {
      let link = "";
      if (item.id == "youtube#searchResult") {
        link = "https://www.youtube.com/watch?v=" + item.id.videoId;
      }
      if (item.id == "youtube#video") {
        link = "https://www.youtube.com/watch?v=" + item.id;
      }
      if (item.id == "youtube#playlist") {
        link = "https://www.youtube.com/playlist?list=" + item.id;
      }
      return (
        <div key={index}>
          <img src={item.snippet.thumbnails.default.url} />
          <h2> <a href={link}> {item.snippet.title} </a> </h2>
          <h3> {item.snippet.channelTitle} </h3>
          {/* handleAddTrack */}
          <button onClick={TrackList.addTrack(link)}> add </button>
        </div>
      );
    });
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
        <div className="search-result">
          <h1> Result: </h1>
          {handleDisplayResult(searchResult)}
        </div>
      ))}
    </div>  
  );
}


