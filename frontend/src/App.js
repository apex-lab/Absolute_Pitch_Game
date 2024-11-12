import React, { useEffect } from "react"; 
import {Switch, Route, Link} from "react-router-dom"
import initGame from "./phaserGame/js/game";


function App() {
  useEffect(() => { 
    const game = initGame()
    return () => { 
      game.destroy(true)
    };
  }, []); 

  return (
    <div className="Absolute_Pitch_Training">
      <div id ="phaser-game"/>
    </div>
  );
}

export default App;