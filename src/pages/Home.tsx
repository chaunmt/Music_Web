import { MusicPlayer } from "../routes"
import { SearchBox } from "../utilities/SearchBox"
import { TrackBox } from "../utilities/TrackBox"
import "./Home.css"

export const Home = () => { // Export Home as the declared function
  return (
    <div>
			<MusicPlayer />
      <SearchBox />
      <TrackBox />
    </div>
  )
}