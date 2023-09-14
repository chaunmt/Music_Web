import React from "react";
import ReactPlayer from "react-player";

import "./MusicService.css";
import YoutubeUtils from "./YoutubeUtils";
import { defaultImg } from "../routes";

import { HiSearch, HiPause, HiPlay, HiMusicNote } from "react-icons/hi";
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow,
         ImVolumeMute, ImVolumeMute2, ImForward3, ImBackward2 } from "react-icons/im"

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