import React from "react"

import { MusicPlayer } from "../routes"
import "./Home.css"

export const Home: React.FC = () => { // Export Home as the declared function
  return (
    <div>
			<MusicPlayer />
    </div>
  )
}