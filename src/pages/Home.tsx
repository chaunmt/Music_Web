import { MusicPlayer } from "../routes"
import { SearchBox } from "../utilities/SearchBox"
import "./Home.css"

export const Home = () => { // Export Home as the declared function
  return (
    <div>
			<MusicPlayer />
      <SearchBox />
    </div>
  )
}