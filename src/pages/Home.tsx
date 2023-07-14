import { MusicPlayer } from "../routes"
import { SearchBar } from "../utilities/SearchBar"
import "./Home.css"

export const Home = () => { // Export Home as the declared function
  return (
    <div>
			<MusicPlayer />
      <SearchBar />
    </div>
  )
}