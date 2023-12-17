const TermsOfServicePage = () => {
    const main = document.querySelector('main');

    main.innerHTML = `
        <div class="container terms-page">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <h1 class="text-center">Termes et Conditions d'Utilisation</h1>
                    <div class="terms-content">
                        <h2>Conditions d'Utilisation et Politique de Confidentialité</h2>
                        <p>Bienvenue dans [Nom du Jeu]! Avant de commencer à jouer, nous avons besoin de quelques informations et de ton consentement pour les utiliser conformément à la législation sur la protection des données.</p>
                        
                        <h3>1. Collecte de Données Personnelles</h3>
                        <p>Pour créer ton compte, nous te demandons de fournir un pseudo, une date de naissance, et de créer un mot de passe. Ton mot de passe sera sécurisé et hashé dans nos bases de données. Le pseudo sera utilisé uniquement pour afficher ton classement dans le jeu.</p>
                        
                        <h3>2. Consentement</h3>
                        <p>En cochant cette case, tu donnes ton consentement explicite pour que nous collections et utilisions tes données personnelles comme décrit ci-dessus. Ce consentement est volontaire et tu peux le retirer à tout moment.</p>
                        
                        <h3>3. Utilisation des Données</h3>
                        <p>Tes données seront utilisées uniquement aux fins suivantes :</p>
                        <ul>
                            <li>Création et gestion de ton compte de jeu.</li>
                            <li>Affichage de ton pseudo dans le classement global du jeu.</li>
                        </ul>
                        
                        <h3>4. Partage des Données</h3>
                        <p>Nous ne partagerons pas tes données personnelles avec des tiers, sauf si requis par la loi.</p>
                        
                        <h3>5. Droit de Retrait et de Modification</h3>
                        <p>Tu as le droit de retirer ton consentement à tout moment. Tu peux également demander à accéder à tes données personnelles, les rectifier ou les supprimer. Pour exercer ces droits, contacte-nous à kevish.gawri@student.vinci.be.</p>
                        
                        <h3>6. Sécurité des Données</h3>
                        <p>Nous nous engageons à protéger la sécurité de tes données personnelles. Nous utilisons des mesures de sécurité techniques et organisationnelles appropriées pour empêcher l'accès non autorisé, la divulgation, la modification ou la destruction non autorisée de tes données.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default TermsOfServicePage;
