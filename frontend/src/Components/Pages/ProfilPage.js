import { getUserSessionData } from '../../utils/auth';

const fetchPlayers = async () => {
  const response = await fetch('/api/users/');
  const players = await response.json();
  return players;
};
const ProfilePage = async () => {
  const main = document.querySelector('main');

  try {
    const players = await fetchPlayers();
    const currentUser = getUserSessionData().username;
    const userData = players.find(player => player.username === currentUser);
    const { username, birthdate, bestscore, stars } = userData; // Assurez-vous d'avoir la propriété 'stars' dans vos données utilisateur

    const profileHTML = `
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 profile-container">
            <h1 class="profile-title">Profil</h1>
            <div class="profile-info">
              <h2>Nom d'utilisateur: ${username}</h2>
              <h3>Date de naissance: ${birthdate}</h3>
              <h3>Score: ${bestscore}</h3>
              <h3>Étoiles: ${stars}</h3> 
            </div>
          </div>
        </div>
      </div>
    `;

    main.innerHTML = profileHTML;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l’utilisateur:', error);
  }
};

export default ProfilePage;

