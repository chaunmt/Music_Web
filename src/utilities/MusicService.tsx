import React from "react";
import "./MusicService.css";
import YoutubeUtils from "./YoutubeUtils";
import { HiSearch } from "react-icons/hi";

export const MusicService = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([null]);
  const [trackList, setTrackList] = React.useState<any>([]);

  // Search Events
  const findLink = (item: any) => {
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
    return link;
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearchSubmit = async () => { //async wraps up the return result
    setSearchResult(await YoutubeUtils.getDetails(searchInput));
  }
  const handleResultDisplay = (results: any | null) => {
    if (!results) return null;
    return results.items?.map(  // YoutubeUtils return data.items[] ==> "...items..."
      (track: any, index: number) => {
        const url = findLink(track);
        return (
          <div key={index}>
            {index + 1}
            <img src={track.snippet.thumbnails.default.url} />
            <a href={url}> {track.snippet.title} </a>
            {track.snippet.channelTitle}
            <button onClick={() => addTrack(track)}> add </button>
          </div>
        );
      }
    )
  }
  const addTrack = (track: any) => {
    setTrackList([...trackList, track]);
  }
  const removeTrack = (track: any, index: any) => {
    setTrackList([
      ...trackList.slice(0, index),
      ...trackList.slice(index + 1, trackList.length)
    ]);
  }
  const handleTrackListDisplay = (tracks: any | null) => {
    if (!tracks) return null;
    return tracks?.map( // trackList is just a normal array
      (track: any, index: number) => {
        const url = findLink(track);
        return (
          <div key={index}>
            {index + 1}
            <img src={track.snippet.thumbnails.default.url} />
            <a href={url}> {track.snippet.title} </a>
            {track.snippet.channelTitle}
            <button onClick={() => removeTrack(track, index)}> remove </button>
          </div>
        );
      }
    )
  }
  return (
    <div>
      <div className="search-box">
        <input
          className="search-bar"
          type="text"
          placeholder="search here"
          onChange={handleChange}
          value={searchInput}>
        </input>
        <button 
          className="search-submit"
          onClick={handleSearchSubmit}>
          <HiSearch />
        </button>
        <div className="search-result">
          {handleResultDisplay(searchResult)}
        </div>
      </div>
      <div className="track-box">
        <div className="track-list">
          {handleTrackListDisplay(trackList)}
        </div>
      </div>
    </div>
  );
}