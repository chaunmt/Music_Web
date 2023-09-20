// api_key
import dotenv from "dotenv";
dotenv.config();
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// images
export const defaultImg = "https://i.ytimg.com/vi/default.jpg";

import { HiSearch, HiPause, HiPlay, HiMusicNote, HiOutlineDotsHorizontal } from "react-icons/hi";
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow, ImVolumeMute, ImVolumeMute2, ImForward3, ImBackward2 } from "react-icons/im"
import { AiFillCaretDown } from "react-icons/ai"
import { MdOutlineAdd, MdOutlineRemove } from "react-icons/md"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"
export const icons = { HiSearch, HiPause, HiPlay, HiMusicNote, HiOutlineDotsHorizontal,
                       ImVolumeHigh, ImVolumeMedium, ImVolumeLow,
                       ImVolumeMute, ImVolumeMute2,
                       ImForward3, ImBackward2,
                       AiFillCaretDown,
                       MdOutlineAdd, MdOutlineRemove,
                       FaArrowRight, FaArrowLeft};
