import { isLoggedIn, setUserSessionData, logoutuser } from '../../utils/auth';
import Navigate from '../Router/Navigate';
import { reloadHomePage } from '../Pages/HomePage';

const Navbar = () => {
  const navbarWrapper = document.querySelector('#navbarWrapper');

  // Function make the log button dynamic
function logButton() {
  if (isLoggedIn()) {
    return `
    <a class="nav-link text-white fs-4" href="#" id="logout1">Se déconnecter</a>
      <a class="nav-link text-white fs-4" href="#" id="profile" data-uri="/profile">Mon Profil</a>
      `;
  }
  return `
    <a class="nav-link text-white fs-4" href="#" data-uri="/login">Se connecter</a>
    ${register()}
  `;
}

  

  // Function to make the register button dynamic
  function register() {
    return !isLoggedIn() ? `<a class="nav-link text-white fs-4" href="#" data-uri="/register">S'inscrire</a>` : '';
  }

  // Function to logout
  function logout() {
    setUserSessionData(null);
    logoutuser();
    reloadNavbar();
    reloadHomePage();
    
  }

  // Function to reload the navbar
  function reloadNavbar() {
    Navbar();
    attachEventListeners();
  }
  

  // Function to attach event listeners
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

  // Html code for the navbar
  const navbar = `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" data-uri="/">Zero-G Odyssey</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon text-white"></span>
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
