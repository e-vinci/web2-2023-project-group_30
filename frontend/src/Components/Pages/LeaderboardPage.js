// import ClearPage from '../../utils/render'
// Function to fetch player data from the API

const players = [
  { name: 'Player1', points: 100 },
  { name: 'Player2', points: 95 },
  { name: 'Player3', points: 90 },
  { name: 'Player4', points: 85 },
  { name: 'Player5', points: 80 },
  { name: 'Player6', points: 75 },
  { name: 'Player7', points: 70 },
  { name: 'Player8', points: 65 },
  { name: 'Player9', points: 60 },
  { name: 'Player10', points: 55 },
  { name: 'Player 11', points: 70 },
];
const currentUser = "Player1"; // replace this with the actual current user's name
// Function to update the leaderboard with new player data
const LeaderboardPage = () => {
  players.sort((a, b) => b.points - a.points); // Sort players by points

  const main = document.querySelector('main');
  main.innerHTML = `
        <div class="container">
            <div class="row justify-content-center">
                <div">
                    <h1 class="text-center">Classement</h1>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="bg-transparent text-white" scope="col" style="font-size:30px">Joueur</th>
                                <th class="bg-transparent text-white" scope="col" style="font-size:30px">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${players.slice(0, 10).map((player) => `
                        <tr>
                            <td class="text-white bg-transparent" style="${ player.name === currentUser ? 'font-weight: bold;' : ''}">${player.name}</td>
                            <td class="text-white bg-transparent" style="${ player.name === currentUser ? 'font-weight: bold;' : '' }">${player.points}</td>
                        </tr>
                    `,
                          )
                          .join('')}
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

export default LeaderboardPage;
