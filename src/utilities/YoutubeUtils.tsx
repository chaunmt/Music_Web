import axios from "axios";
import { YOUTUBE_API_KEY } from "../API_KEY";

// Search by keywords (include url)
export async function getTrackDetails(value: string) {
  const { data } = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: 'snippet',
      "q": value,
      maxResults: 1,
      key: YOUTUBE_API_KEY,
    },
  });

  // Extract the relevant details
  const video = data.items[0];
  const title = video.snippet.title;
  const artist = video.snippet.channelTitle;
  //const duration = video.fileDetails.durationMs;
  //const url = video.id;

  //return { title, artist, duration, url };
  return title;
}