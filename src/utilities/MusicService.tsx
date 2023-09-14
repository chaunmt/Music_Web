import React from "react";
import ReactPlayer from "react-player";

import "./MusicService.css";
import YTUtils from "./YoutubeUtils";

import { icons } from "../resources";

export const MusicService = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<any>([]);
  const [trackList, setTrackList] = React.useState<any>([]);
  const [curSearchPage, setCurSearchPage] = React.useState(1);

  const [playing, setPlaying] = React.useState(false);    // Play and Pause
  const [progress, setProgress] = React.useState(0);      // Progress Slider
  const [volume, setVolume] = React.useState(1);          // Volume Control
  const [prevVolume, setPrevVolume] = React.useState(1); 
  const [curTrack, setCurTrack] = React.useState(0);  	
  const playerRef = React.useRef<ReactPlayer>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearchSubmit = async () => { //async wraps up the return result
    setSearchResult(await YTUtils.getDetails(searchInput, ""));
  }
  const handleResultDisplay = (results: any | null) => {
    return results?.items?.map(  // YoutubeUtils return data.items[] ==> "...items..."
      (track: any, index: number) => {
        if (!track || track.snippet.title == "Deleted video") return null;
        const link = YTUtils.getYTLink(track);
        if (link == "https://www.youtube.com/watch?v=undefined" || link=="") 
          return null;
        return (
          <div key={index} className="search-result-list-item">
            <img src={YTUtils.getIMGLink(track)} />
            <a href={link}> {track.snippet.title} </a>
            {track.snippet.channelTitle}
            <button onClick={() => addTrack(track, trackList.length + 1)}>
              add
            </button>
            {track.id.kind=="youtube#playlist"?
              (<button
                onClick={async() => displayPlaylist(await YTUtils.getDetails(link, ""))}>
                show tracks</button>)
              :
              (null)
            }
          </div>
        );
      }
    )
  }
  const displayPlaylist = (results: any | null) => {
    return results?.items?.map(  
      (track: any, index: number) => {
        if (!track || track.snippet.title == "Deleted video") return null;
        const link = YTUtils.getYTLink(track);
        console.log(link);
        if (link == "https://www.youtube.com/watch?v=undefined") return null;
        return (
          <div key={index}>
            <p>aaaa</p>
          </div>
        );
      }
    )
  }
  const handleNextSearchPage = async () => {
    if (searchInput == "" || searchResult.nextPageToken == null) return null;
    setCurSearchPage(curSearchPage + 1);
    setSearchResult(await YTUtils.getDetails(searchInput, searchResult.nextPageToken));
  }
  const handlePrevSearchPage = async () => {
    if (searchInput == "" || searchResult.prevPageToken == null) return null;
    setCurSearchPage(curSearchPage - 1);
    setSearchResult(await YTUtils.getDetails(searchInput, searchResult.prevPageToken));
  }
  const addTrack = (track: any, index: number) => {
    if (index < 0 || index > trackList.length + 1) return null;
    if (trackList.length == 0 || index > trackList.length) setTrackList([...trackList, track]);
    else
      setTrackList([
        ...trackList.slice(0, index),
        ...[track],
        ...trackList.slice(index, trackList.length + 1)
      ]);
    if (index <= curTrack) setCurTrack(curTrack + 1);
  }
  const removeTrack = (index: any) => {
    if (trackList.length == 0) return null;
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
        const link = YTUtils.getYTLink(track);
        return (
          <div key={index} className="track-list-item">
            <img src={YTUtils.getIMGLink(track)} />
            {index == curTrack ? (< icons.HiMusicNote />) : (null)}
            { } {index + 1} {" . "}
            <a href={link}> {track.snippet.title} </a>
            {track.snippet.channelTitle}
            <button onClick={() => removeTrack(index)}> remove </button>
            <button onClick={() => addTrack(track, index + 1)}>
              loop
            </button>
          </div>
        );
      }
    )
  }

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
  
  // console.log(searchResult);
  // console.log(trackList);

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
          < icons.HiSearch />
        </button>

        <div className="search-result-list">
          {handleResultDisplay(searchResult)}
        </div>

        <div className="search-page-navigator">
          <button onClick={handlePrevSearchPage}>prev</button>
          { curSearchPage }          
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
          {playing ? < icons.HiPause /> : < icons.HiPlay />}
        </button>

        <button className="forward-button" onClick={handleForward}>
          < icons.ImForward3 />
        </button>
        <button className="backward-button" onClick={handleBackward}>
          < icons.ImBackward2 />
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
            {volume > 0.66 ? (< icons.ImVolumeHigh />)
              : volume > 0.33 ? (< icons.ImVolumeMedium />)
                : volume > 0.001 ? (< icons.ImVolumeLow />)
                  : volume > 0 ? (< icons.ImVolumeMute />)
                    : (< icons.ImVolumeMute2 />)}
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
            url={YTUtils.getYTLink(trackList[curTrack])}
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