import React from "react";
import ReactPlayer from "react-player";

import "./MusicService.css";
import YoutubeUtils from "./YoutubeUtils";
import { defaultImg } from "../routes";

import { HiSearch, HiPause, HiPlay, HiMusicNote } from "react-icons/hi";
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow,
         ImVolumeMute, ImVolumeMute2, ImForward3, ImBackward2 } from "react-icons/im"

export const MusicService = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<any>([]);
  const [trackList, setTrackList] = React.useState<any>([]);

  // Search Events
  const findLink = (item: any) => {
    if (!item) return "";
    let link = "";
    if (item.kind == "youtube#searchResult") {
      link = "https://www.youtube.com/watch?v=" + item.id.videoId;
    }
    if (item.kind == "youtube#video") {
      link = "https://www.youtube.com/watch?v=" + item.id;
    }
    if (item.kind == "youtube#playlistItem") {
      link = "https://www.youtube.com/watch?v=" + item.snippet.resourceId.videoId;
    }
    return link;
  }
  const findThumbnailsLink = (track: any) => {
    if (track.snippet.thumbnails.high) return track.snippet.thumbnails.high.url;
    else if (track.snippet.thumbnails.maxres) return track.snippet.thumbnails.maxres.url;
    else if (track.snippet.thumbnails.medium) return track.snippet.thumbnails.medium.url;
    else if (track.snippet.thumbnails.standard) return track.snippet.thumbnails.standard.url;
    else if (track.snippet.thumbnails.default) return track.snippet.thumbnails.default.url;
    else return defaultImg;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearchSubmit = async () => { //async wraps up the return result
    setSearchResult(await YoutubeUtils.getDetails(searchInput, ""));
  }
  const handleResultDisplay = (results: any | null) => {
    return results?.items?.map(  // YoutubeUtils return data.items[] ==> "...items..."
      (track: any, index: number) => {
        if (!track || track.snippet.title == "Deleted video") return null;
        const link = findLink(track);
        return (
          <div key={index} className="search-result-list-item">
            <img src={findThumbnailsLink(track)} />
            { } {index + 1} {" . "}
            <a href={link}> {track.snippet.title} </a>
            {track.snippet.channelTitle}
            <button onClick={() => addTrack(track)}> add </button>
          </div>
        );
      }
    )
  }
  const handleNextSearchPage = async () => {
    setSearchResult(await YoutubeUtils.getDetails(searchInput, searchResult.nextPageToken));
  }
  const handlePrevSearchPage = async () => {
    setSearchResult(await YoutubeUtils.getDetails(searchInput, searchResult.PrevPageToken));
  }
  const addTrack = (track: any) => {
    if (trackList) setTrackList([...trackList, track]);
  }
  const removeTrack = (index: any) => {
    if (index < 0 || index > trackList.length) return null;
    setTrackList([
      ...trackList.slice(0, index),
      ...trackList.slice(index + 1, trackList.length)
    ]);
    if (index <= curTrack) setCurTrack(curTrack - 1);
    if (curTrack <= 0) setCurTrack(0);
  }
  const handleTrackListDisplay = (tracks: any | null) => {
    return tracks?.map( // trackList is just a normal array
      (track: any, index: number) => {
        if (!track || track.snippet.title == "Deleted video") return null;
        const link = findLink(track);
        return (
          <div key={index} className="track-list-item">
            <img src={findThumbnailsLink(track)} />
            {index == curTrack ? (< HiMusicNote />) : (null)}
            { } {index + 1} {" . "}
            <a href={link}> {track.snippet.title} </a>
            {track.snippet.channelTitle}
            <button onClick={() => removeTrack(index)}> remove </button>
          </div>
        );
      }
    )
  }

  const [playing, setPlaying] = React.useState(false);    // Play and Pause
  const [progress, setProgress] = React.useState(0);      // Progress Slider
  const [volume, setVolume] = React.useState(1);          // Volume Control
  const [prevVolume, setPrevVolume] = React.useState(1); 
  const [curTrack, setCurTrack] = React.useState(0);  	
  const playerRef = React.useRef<ReactPlayer>(null);

  const handleCancel = () => {
    setPlaying(false);
    setProgress(0);
    setTrackList([]);
  };
  const handlePlayPause = () => {
    setPlaying((prevState) => !prevState);
  }
  const handleForward = () => {
    if (curTrack < trackList.length - 1) setCurTrack(curTrack + 1);
    else console.log("There is no next track");
  }
  const handleBackward = () => {
    if (curTrack > 0) setCurTrack(curTrack - 1);
    else console.log("There is no last track");
  }
  const handleProgress = (state: { played: number }) => {
    setProgress(state.played);
  };
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseFloat(e.target.value));
    if (playerRef.current) // update React Player's progress to match with progress slider
      playerRef.current.seekTo(parseFloat(e.target.value));
  };
  const handleVolumeMute = () => {
    if (volume == 0) {
      setVolume(prevVolume);
    }
    else {
      setPrevVolume(volume);
      setVolume(0);
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  console.log(searchResult);
  console.log(trackList);
  return (
    <div className="global">
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

        <div className="search-result-list">
          {handleResultDisplay(searchResult)}
        </div>

        <div className="search-page-navigator">
          <button onClick={handlePrevSearchPage}>prev</button>
          { "current page" }          
          <button onClick={handleNextSearchPage}>next</button>
        </div>

      </div>

      <div className="track-box">

        <div className="track-list">
          {handleTrackListDisplay(trackList)}
        </div>

      </div>

      <div className="bottom-container">
        <button className="stop-button" onClick={handleCancel}>
          <p>terminate</p>
        </button>

        <button className="play-pause-button" onClick={handlePlayPause}>
          {playing ? <HiPause /> : <HiPlay />}
        </button>

        <button className="forward-button" onClick={handleForward}>
          <ImForward3 />
        </button>
        <button className="backward-button" onClick={handleBackward}>
          <ImBackward2 />
        </button>

        <input
          className="progress-slider"
          type="range" min={0} max={1} step="any"
          value={progress}
          onChange={handleProgressChange}
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
            onChange={handleVolumeChange}
            style={{ "--volume": volume } as React.CSSProperties}
          />

        </div>

        <div className="hidden-box">
          {setTimeout(() => { // Delay the function in other for ReactPlayer to keep up with Youtube API
            console.log('Song is comming in 1 second');
            }, 1000)
          }
          <ReactPlayer 
            ref={playerRef}
            url={findLink(trackList[curTrack])}
            volume={volume}
            playing={playing}
            onProgress={handleProgress}
            onEnded={() => removeTrack(curTrack)}
          />
        </div>
      </div>

    </div>
  );
}