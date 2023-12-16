import Navigate from "../Router/Navigate";

const RegisterPage = () => {
  const main = document.querySelector('main');

  main.innerHTML = `
      <div class="container">
          <div class="row justify-content-center">
              <div class="col-md-6">
                  <h1 class="text-center">S'inscrire</h1>
                  <form id="registerForm" class="needs-validation" novalidate>
                      <div class="mb-3">
                          <label for="username" class="form-label">Nom d'utilisateur:</label>
                          <input type="text" class="form-control" id="username" name="username" required>
                          <div class="invalid-feedback">Ce champ est requis.</div>
                      </div>
                      <div class="mb-3">
                          <label for="birthdate" class="form-label">Date de naissance:</label>
                          <input type="date" class="form-control" id="birthdate" name="birthdate" required>
                          <div class="invalid-feedback">Ce champ est requis.</div>
                      </div>
                      <div class="mb-3">
                          <label for="password" class="form-label">Mot de passe:</label>
                          <input type="password" class="form-control" id="password" name="password" required>
                          <div class="invalid-feedback">Ce champ est requis.</div>
                      </div>
                      <div class="mb-3">
                          <label for="confirm" class="form-label">Confirmer le mot de passe:</label>
                          <input type="password" class="form-control" id="confirm" name="confirm" required>
                          <div class="invalid-feedback">Ce champ est requis.</div>
                      </div>
                      <button type="submit" class="btn btn-success">S'inscrire</button>
                  </form>
              </div>
          </div>
      </div>
  `;
  
const registerForm = document.getElementById('registerForm');


registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const birthdate = document.getElementById('birthdate').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    // Vérification de la conformité du mot de passe
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        alert('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.');
        return;
    }

    // Vérification de la date de naissance
    const year = birthdate.split('-')[0];
    if (year < 1900 || year > 2023) {
        alert('L\'année de naissance doit être comprise entre 1900 et 2023.');
        return;
    }

    if (password !== confirm) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }

        if (password !== confirm) {
            // eslint-disable-next-line no-alert
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            
            const response = await fetch(`${process.env.API_BASE_URL}/auths/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, birthdate}),  
            });

            if (response.ok) {
                Navigate('/login')
            } else {
                
                console.error('Erreur d\'inscription');
                // eslint-disable-next-line no-alert
                alert('Erreur lors de l\'inscription');
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Erreur:', error);
        }
    });
}

export default RegisterPage;
