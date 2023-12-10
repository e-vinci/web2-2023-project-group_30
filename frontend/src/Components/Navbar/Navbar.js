import { isLoggedIn, setUserSessionData, logoutuser } from '../../utils/auth';
import Navigate from '../Router/Navigate';
import { reloadHomePage } from '../Pages/HomePage';

const Navbar = () => {
  const navbarWrapper = document.querySelector('#navbarWrapper');

  // Fonction pour générer le bouton de connexion/déconnexion
  function logButton() {
    if (isLoggedIn()) {
      return `<a class="nav-link text-white fs-4" href="#" id="logout1">Se déconnecter</a>`;
    }
      return `
        <a class="nav-link text-white fs-4" href="#" data-uri="/login">Se connecter</a>
        ${register()}
      `;
    }
  

  // Fonction pour générer le bouton d'inscription
  function register() {
    return !isLoggedIn() ? `<a class="nav-link text-white fs-4" href="#" data-uri="/register">S'inscrire</a>` : '';
  }

  // Fonction pour gérer la déconnexion
  function logout() {
    setUserSessionData(null);
    logoutuser();
    reloadNavbar();
    reloadHomePage();
    
  }

  // Fonction pour recharger dynamiquement la navbar
  function reloadNavbar() {
    Navbar();
    attachEventListeners();
  }
  

  // Fonction pour attacher les écouteurs d'événements
  function attachEventListeners() {
    document.querySelectorAll('[data-uri]').forEach(link => {
      link.addEventListener('click', (event) => {
        const uri = event.target.getAttribute('data-uri');
        if (uri) Navigate(uri);
      });
    });

    const logoutButton = document.querySelector('#logout1');
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
  }

  // HTML de la navbar
  const navbar = `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" data-uri="/">Zero-G Odyssey</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            ${logButton()}
          </ul>
        </div>
      </div>
    </nav>
  `;

  navbarWrapper.innerHTML = navbar;
  attachEventListeners();
};

export default Navbar;
