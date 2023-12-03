const leaderboardPage = () => {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h1 class="text-center">Classement</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="bg-success text-white" scope="col">Pseudo</th>
                            <th class="bg-success text-white" scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-white bg-success">Utilisateur1</td>
                            <td class="text-white bg-success">100</td>
                        </tr>
                        <tr>
                            <td class="text-white bg-success">Utilisateur2</td>
                            <td class="text-white bg-success">85</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;
};

export default leaderboardPage;
