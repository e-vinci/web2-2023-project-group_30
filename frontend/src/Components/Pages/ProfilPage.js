import { getUserSessionData } from '../../utils/auth';

const fetchPlayers = async () => {
  const response = await fetch('/api/users/');
  const players = await response.json();
  return players;
};
const ProfilePage = async () => {
  const main = document.querySelector('main');

  // Récupérer les données de l'utilisateur depuis l'API
  try {
    const players = await fetchPlayers();
    const currentUser = getUserSessionData().username;
    const userData = players.find((player) => player.username === currentUser);
    const { username, birthdate, score } = userData;
    
    // Création de la structure HTML pour le profil
    const profileHTML = `
      <div class="container">
        <div class="row justify-content-center">
          <div class="profile">
            <h1 class="text-center">Profile</h1>
            <h2 class="text-center">Username: ${username}</h2>
            <h3 class="text-center">Date de naissance: ${birthdate}</h3>
            <h3 class="text-center">Score: ${score}</h3>
          </div>
        </div>
      </div>
    `;

    // Définir le contenu HTML de l'élément principal
    main.innerHTML = profileHTML;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l’utilisateur:', error);
  }
};


export default ProfilePage;