import React from "react";
import ReactPlayer from "react-player";

import "./MusicService.css";
import YoutubeUtils from "./YoutubeUtils";

import { HiSearch } from "react-icons/hi";
import { HiPause, HiPlay } from "react-icons/hi"
import {
  ImVolumeHigh, ImVolumeMedium, ImVolumeLow,
  ImVolumeMute, ImVolumeMute2
} from "react-icons/im"

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

  const [playing, setPlaying] = React.useState(false);    // Play and Pause
  const [progress, setProgress] = React.useState(0);      // Progress Slider
  const [volume, setVolume] = React.useState(1);        	// Volume Control

  const handleStop = () => {
    setPlaying(false);
    setProgress(0);
  };
  const handlePlayPause = () => {
    setPlaying((prevState) => !prevState);
  }
  const handleVolumeMute = () => {
    volume == 0 ? setVolume(0.001) : setVolume(0);
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseFloat(e.target.value));
    // if (playerRef.current) {
    // 	playerRef.current.seekTo(parseFloat(e.target.value));
    // }
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

      <div className="bottom-container">
        <button className="stop-button" onClick={handleStop}>
          <p>kill dj ape</p>
        </button>

        <button className="play-pause-button" onClick={handlePlayPause}>
          {playing ? <HiPause /> : <HiPlay />}
        </button>

        <button className="next-button">
          {/* handle next song */}
        </button>
        <button className="back-button">
          {/* handle last song */}
        </button>

        <input
          className="time-slider"
          type="range" min={0} max={1} step="any"
          value={progress}
          onChange={handleProgress}
          style={{ "--progress": progress } as React.CSSProperties}
        />

        <div className="volume-container">
          <button className="volume-button" onClick={() => handleVolumeMute()}>
            {volume > 0.66 ? (<ImVolumeHigh />)
              : volume > 0.33 ? (<ImVolumeMedium />)
                : volume > 0.001 ? (<ImVolumeLow />)
                  : volume > 0 ? (<ImVolumeMute />)
                    : (<ImVolumeMute2 />)}
          </button>

          <input
            className="volume-slider"
            type="range" min={0} max={1} step="any"
            value={volume}
            onChange={handleVolume}
            style={{ "--volume": volume } as React.CSSProperties}
          />

        </div>

        <div>
          <ReactPlayer 
            url={trackList[0]}
            playing={playing}
            volume={volume}
          />
        </div>
      </div>

    </div>
  );
}