import React from "react";
import "./TrackBox.css";
import "./TrackList";
import { HiSearch } from "react-icons/hi";

export const TrackBox = () => {
  return (
    <div className="track-box">
      <input className="search-bar"
        type="text" placeholder="Search here" />
      <button> <HiSearch/> </button>
      <div className="list">
      
      </div>
    </div>
  );
}