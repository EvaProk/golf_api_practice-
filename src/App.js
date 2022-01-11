import './App.css';
import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [state, setState] = useState({
    data: [],
    loading: true,
    players: [],
  });


  const headers = {
    'Authorization': process.env.REACT_APP_API_KEY
  }

  useEffect(() => {
    Promise.all([
      axios.get('https://leaderboard-techtest.herokuapp.com//api/1/events/1000/leaderboard/', { headers }),
      axios.get('https://leaderboard-techtest.herokuapp.com//api/1/players/', { headers })
    ]).then((all) => {
      setState(prev => ({ ...prev, data: all[0].data.data, players: all[1].data.data, loading: false }));

    })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }, []);

  if (state.loading) {
    return <div></div>;
  } else {

      for(const player of state.data){
        for (const item of state.players) {
          if(player.player_id === item.id){
            player["first_name"] = item.first_name;
            player["last_name"] = item.last_name;
          }
        }
      }

    const players = state.data

    players.sort((playerA, playerB) => {
      let score = playerA.score - playerB.score;
      let thru = playerA.thru - playerB.thru;

      if (score !== 0) {
        return playerA.score - playerB.score;
      } else if (thru !== 0) {
        return playerB.thru - playerA.thru;
      }else{
        return playerA.last_name.localeCompare(playerB.last_name);
      }
    })

    let position = 0;
    let prevPosition = 0;
    let positionStr = "";
    
    const leaderboardTable = players.map(function (player, index) {
      prevPosition ++ 
      console.log(position)
      if (index < players.length - 1 && players[index].score === players[index + 1].score) { // Check next player score is equal to current player
        if (index > 0 && players[index].score !== players[index - 1].score) {
         position++;
        }
         positionStr = "T" + position;
      } else if (index > 0 && players[index].score === players[index - 1].score) { // Check previous player score is equal to current player 
        positionStr = "T" + position;
        position = prevPosition;
      } else {
        position++;
        positionStr = prevPosition;
      }

      return (
        <tr>
          <td>{positionStr}</td>
          <td>{player.first_name + " " + player.last_name}</td>
          <td>{player.total}</td>
          <td>{player.score}</td>
          <td>{player.thru}</td>
        </tr>
      );
    });
    return (
      <div className="App">
        <h1> Leaderboard table </h1>
        <table>
          <thead>
            <tr>
              <td>Pos</td>
              <td>Player</td>
              <td>Tot</td>
              <td>Score</td>
              <td>Thru</td>
            </tr>
          </thead>
          {leaderboardTable}
        </table>
      </div>
    );
  }
}
export default App;