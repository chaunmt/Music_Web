import React from "react";
import ReactPlayer from "react-player";

import { HiPause, HiPlay } from "react-icons/hi"
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow,
         ImVolumeMute, ImVolumeMute2} from "react-icons/im"

import "./MusicPlayer.css"

export const MusicPlayer: React.FC = () => {
	const [playing, setPlaying] = React.useState(false);    // Play and Pause
	const [progress, setProgress] = React.useState(0);      // Progress Slider
  const [volume, setVolume] = React.useState(1);        // Volume Control
	const playerRef = React.useRef<ReactPlayer>(null);

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
		if (playerRef.current) {
			playerRef.current.seekTo(parseFloat(e.target.value));
		}
  }
	
  return (
		<div className="container">
			<button className="stop-button" onClick={handleStop}>
				<p>kill dj ape</p>
			</button>

			<button className="play-pause-button" onClick={handlePlayPause}> 
				{ playing ? <HiPause /> : <HiPlay /> }
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
					{ volume > 0.66 ? 	(<ImVolumeHigh />) 
					: volume > 0.33 ? 	(<ImVolumeMedium/>) 
					: volume > 0.001 ? 	(<ImVolumeLow />) 
					: volume > 0 ? 			(<ImVolumeMute />) 
					: 									(<ImVolumeMute2 />) }
				</button>

				<input 
					className="volume-slider"
					type="range" min={0} max={1} step="any"
					value={volume}
					onChange={handleVolume}
					style={{ "--volume": volume } as React.CSSProperties}
				/>

			</div>
		</div>
  )
}
