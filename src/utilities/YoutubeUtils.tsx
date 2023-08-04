import axios from "axios";
import { YOUTUBE_API_KEY } from "../API_KEY";

const YoutubeUtils = {
  getDetails,
}

function getVideoId(value: string) {
  const regex = /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]{11})/;
  const match = value.match(regex);
  return match ? match[1] : null;
}

function getPlaylistId(value: string) {
  const regex = /youtube\.com\/playlist\?list=([^#&?]+)/;
  const match = value.match(regex);
  return match ? match[1] : null;
}

async function getVideoDetails(value: string) {
  const { data } = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
    params: {
      part: "snippet, id, contentDetails",
      id: getVideoId(value),
      maxResults: 1,  
      key: YOUTUBE_API_KEY,
    },
  });
  return data.items[0];
}

async function getPlaylistDetails(value: string) {
  const { data } = await axios.get("https://www.googleapis.com/youtube/v3/playlists", {
    params: {
      part: "snippet, id, contentDetails",
      id: getPlaylistId(value),
      maxResults: 1,
      key: YOUTUBE_API_KEY,
    },
  });
  return data.items[0];
}

async function getSearchDetails(value: string) {
  const { data } = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet, id",
      q: value,
      maxResults: 5,
      key: YOUTUBE_API_KEY,
    },
  });
  return data;
}

async function getDetails(value: string) {
  if (getVideoId(value) != null) return getVideoDetails(value);
  if (getPlaylistId(value) != null) return getPlaylistDetails(value);
  return getSearchDetails(value);
}

export default YoutubeUtils;
