const CommandsPage = () => {
   const  htmlCommands = `
   <div class="modal-body">
      <h1>Commandes du Jeu</h1>
      <p>
          Dans ce jeu, vous contrôlez votre personnage à l'aide des touches directionnelles.
      </p>
      <p>
          <strong>Monter :</strong> Appuyez sur la touche <span class="key">↑</span> pour déplacer votre personnage vers le haut.
      </p>
      <p>
          <strong>Descendre :</strong> Appuyez sur la touche <span class="key">↓</span> pour déplacer votre personnage vers le bas.
      </p>
      <p>
          Utilisez ces touches pour naviguer à travers le monde du jeu et accomplir vos objectifs !
      </p>
      <h2>Règles :</h2>
      <ol>
          <li>Collectez des objets en déplaçant votre personnage vers eux.</li>
          <li>Évitez les obstacles pour maintenir la santé de votre personnage.</li>
          <li>Essayez d'aller le plus loin possible et faites votre chemin vers le <strong>TOP 10</strong>.</li>
      </ol>
      <p>
          Suivez ces règles pour progresser dans le jeu et atteindre la victoire !
      </p>
   </div>
`;
  return htmlCommands;
  };

  export default CommandsPage;