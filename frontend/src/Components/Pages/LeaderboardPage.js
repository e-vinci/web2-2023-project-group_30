// import ClearPage from '../../utils/render'
// Function to fetch player data from the API
const fetchPlayers = async () => {
  const response = await fetch(`${process.env.API_BASE_URL}/users/`);
  const players = await response.json();
  return players;
};

const LeaderboardPage = async () => {
  try {
    const players = await fetchPlayers();
  

    players.sort((a, b) => b.score - a.score); // Sort players by points

    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="container">
        <div class="row justify-content-center">
          <div">
            <h1 class="text-center">Classement</h1>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th class="bg-transparent text-white" scope="col" style="font-size:35px">Joueur</th>
                  <th class="bg-transparent text-white" scope="col" style="font-size:35px">Score</th>
                </tr>
              </thead>
              <tbody>
                ${players.slice(0, 10).map((player) => `
                  <tr>
                    <td class="text-white bg-transparent">${player.username}</td>
                    <td class="text-white bg-transparent">${player.score}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching or rendering leaderboard:', error);
    // Handle the error appropriately (e.g., display a message to the user)
  }
};

export default LeaderboardPage;
