import React        from "react";
import ReactPlayer  from "react-player";
import "./TrackController.css";

import YT from "./YoutubeUtils";
import err from "../errors";

import { icons } from "../resources";

export const TrackController = () => {
  const [searchInput, setSearchInput]       = React.useState("");
  const [searchResult, setSearchResult]     = React.useState<any>([]);
  const [trackList, setTrackList]           = React.useState<any>([]);
  const [oldTrackList, setOldTrackList]     = React.useState<any>([]);
  const [curSearchPage, setCurSearchPage]   = React.useState(1);
  const [playing, setPlaying]               = React.useState(false);    
  const [progress, setProgress]             = React.useState(0);      
  const [volume, setVolume]                 = React.useState(1);   
  const [loop, setLoop]                     = React.useState(false);   
  const [prevVolume, setPrevVolume]         = React.useState(1);      
  const [curTrack, setCurTrack]             = React.useState(0); 	
  const playerRef                           = React.useRef<ReactPlayer>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearchSubmit = async () => { //async wraps up the return result
    setSearchResult(await YT.getDetails(searchInput, ""));
  }
  const handleResultDisplay = (results: any | null) => {
    return results?.items?.map(  // YoutubeUtils return data.items[] ==> "...items..."
      (track: any, index: number) => {
        if (!track || track.snippet.title == "Deleted video") return null;
        const link = YT.getTrackLink(track);
        if (link == "") return null;
        return (
          <div key={index} className="search-result-list-item">
            <div className="search-result-list-item-info">
              <img src={YT.getIMGLink(track)} />
              <a href={link}> {track.snippet.title} - {track.snippet.channelTitle} </a>
            </div>
            <button
              className="search-result-list-item-add"
              onClick={() => addTrack(track, trackList.length + 1)}>
              < icons.MdOutlineAdd />
            </button>
            {track.id.kind=="youtube#playlist"?
              (<button
                className="search-result-list-item-show-tracks"
                onClick={async() => handleResultDisplay(await YT.getDetails(link, ""))}>
                < icons.AiFillCaretDown />
              </button>)
              :
              (null)
            }
          </div>
        );
      }
    )
  }
  const handleNextSearchPage = async () => {
    if (searchInput == "" || searchResult.nextPageToken == null) return null;
    setCurSearchPage(curSearchPage + 1);
    setSearchResult(await YT.getDetails(searchInput, searchResult.nextPageToken));
  }
  const handlePrevSearchPage = async () => {
    if (searchInput == "" || searchResult.prevPageToken == null) return null;
    setCurSearchPage(curSearchPage - 1);
    setSearchResult(await YT.getDetails(searchInput, searchResult.prevPageToken));
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
        const link = YT.getTrackLink(track);
        return (
          <div key={index} className="track-list-item">
            <div className="track-list-item-info">
              <img src={YT.getIMGLink(track)} />
              {index == curTrack ? (< icons.HiMusicNote />) : (null)}
              { } {index + 1} {" . "}
              <a href={link}> {track.snippet.title} - {track.snippet.channelTitle} </a> 
            </div> 
            <button 
              className="track-list-item-remove"
              onClick={() => removeTrack(index)}>
                < icons.MdOutlineRemove />
            </button>
          </div>
        );
      }
    )
  }
  const handleCurrentTrackDisplay = () => {
    if (!trackList || trackList.length <= 0) return null;
    const track = trackList[curTrack];
    const link = YT.getTrackLink(track);
    console.log(track);
    return (
      <div>
        {/* <div className="left-box-img">
          <img src={YT.getIMGLink(track)} />
        </div> */}
        <div className="left-box-info">
          <a 
            href={link}>
            {track.snippet.title} - {track.snippet.channelTitle}
          </a>
        </div>
      </div>
    )
  }
  const handleCancel = () => {
    setPlaying(false);
    setProgress(0);
    setTrackList([]);
    setOldTrackList([]);
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
  const handleLoop = () => {
    setLoop(!loop);
  }

  const getDuration = () => {
    const duration = playerRef.current?.getDuration;
    return duration;
  }

  // console.log(searchResult);
  // console.log(oldTrackList);

  return (
    <div className="global">
      <div className="search-box">
        <div className="search-bar">
          <input
            type="text"
            placeholder="search here"
            onChange={handleChange}
            value={searchInput}>
          </input>

          <button
            onClick={handleSearchSubmit}>
            < icons.HiSearch />
          </button>
        </div>

        <div className="search-result-list">
          {handleResultDisplay(searchResult)}
        </div>

        <div className="page-navigator">
          <button 
            className="prev"
            onClick={handlePrevSearchPage}>
            < icons.FaArrowLeft />
            </button>
          {curSearchPage}          
          <button
            className="next"
            onClick={handleNextSearchPage}>
            < icons.FaArrowRight />
          </button>
        </div>

      </div>

      <div className="track-box">

        <div className="track-list">
          {handleTrackListDisplay(trackList)}
        </div>

      </div>

      <div className="bottom-container">
        <div className="left-box">
          { handleCurrentTrackDisplay() }
        </div>

        <div className="middle-box">
          <button className="backward-button" onClick={handleBackward}>
            < icons.ImBackward2 />
          </button>
          <button className="play-pause-button" onClick={handlePlayPause}>
            {playing ? < icons.HiPause /> : < icons.HiPlay />}
          </button>
          <button className="forward-button" onClick={handleForward}>
            < icons.ImForward3 />
          </button>
        </div>
        
        <input
          className="progress-slider"
          type="range" min={0} max={1} step="any"
          value={progress}
          onChange={handleProgressChange}
          style={{ "--progress": progress } as React.CSSProperties}
        />

        <div className="right-box">
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
      </div>
      <div className="video-box">
        {setTimeout(() => { // Delay the function in other for ReactPlayer to keep up with Youtube API
          console.log('Song is comming in 1 second');
          }, 1000)
        }
        <ReactPlayer 
          ref={playerRef}
          url={YT.getTrackLink(trackList[curTrack])}
          onError={err.BlockedTrack}
          volume={volume}
          playing={playing}
          loop={loop}
          onProgress={handleProgress}
          onEnded={() => removeTrack(curTrack)}
        />
      </div>
    </div>
  );
}