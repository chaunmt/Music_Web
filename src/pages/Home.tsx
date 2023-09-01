import { MusicPlayer } from "../routes"
import { MusicService } from "../utilities/MusicService"
import "./Home.css"

export const Home = () => { // Export Home as the declared function
  return (
    <div>
			<MusicPlayer />
      <MusicService />
    </div>
  )
}