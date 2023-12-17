// Function to fetch player data from the API
const fetchPlayers = async () => {
  const response = await fetch(`${process.env.API_BASE_URL}/users/`);
  const players = await response.json();
  return players;
};

const LeaderboardPage = async () => {
  try {
    const players = await fetchPlayers();
    players.sort((a, b) => b.bestscore - a.bestscore);

    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-lg-8 border-flash-green">
            <h1 id="title" class="">Classement</h1>
            <table class="table table-hover" style="background-color: transparent;">
              <thead>
                <tr>
                  <th class="text-white bg-transparent" scope="col">#</th>
                  <th class="text-white bg-transparent" scope="col">Joueur</th>
                  <th class="text-white bg-transparent" scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                ${players.slice(0, 10).map((player, index) => `
                  <tr>
                    <td class="text-white bg-transparent">${index + 1}</td>
                    <td class="text-white bg-transparent">${player.username}</td>
                    <td class="text-white bg-transparent">${player.bestscore}</td>
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
  }
};

export default LeaderboardPage;





