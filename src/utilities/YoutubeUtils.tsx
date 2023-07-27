import axios from "axios";
import { YOUTUBE_API_KEY } from "../API_KEY";

const YoutubeUtils = {
  getTrackDetails,
}

async function getTrackDetails(value: string) {
  const { data } = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet, id",
      "q": value,
      maxResults: 1,
      key: YOUTUBE_API_KEY,
    },
  });
  const video = data.items[0];
  const title = String(video.snippet.title);
  const channel = String(video.snippet.channelTitle);
  const url = String("https://www.youtube.com/watch?v=" + video.id.videoId);
  return { title, channel, url };
}

export default YoutubeUtils;
