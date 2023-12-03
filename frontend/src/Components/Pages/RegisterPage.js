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
                          <label for="age" class="form-label">Age:</label>
                          <input type="text" class="form-control" id="age" name="age" required>
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
};



const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const age = document.getElementById('age').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        if (password !== confirm) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            
            const response = await fetch('/api/auths/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, age}),  
            });

            if (response.ok) {
                
                window.location.href = '/';
            } else {
                
                console.error('Erreur d\'inscription');
                alert('Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
}

export default RegisterPage;
