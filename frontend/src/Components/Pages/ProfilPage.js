const ProfilePage = async () => {
  const main = document.querySelector('main');

  // Récupérer les données de l'utilisateur depuis l'API
  try {
    const response = await fetch('api/profil/:username'); // Remplacez par l'URL de votre API
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();

    // Données du profil
    const { username, birthdate, score } = userData;
    const age = calculateAge(birthdate);

    // Création de la structure HTML pour le profil
    const profileHTML = `
      <div class="container">
        <div class="row justify-content-center">
          <div class="profile">
            <h1 class="text-center">Profile</h1>
            <h2 class="text-center">Username: ${username}</h2>
            <h3 class="text-center">Age: ${age}</h3>
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

function calculateAge(birthDate) {
  const parts = birthDate.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const today = new Date();
  const birth = new Date(year, month, day);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }

  return age;
}

export default ProfilePage;