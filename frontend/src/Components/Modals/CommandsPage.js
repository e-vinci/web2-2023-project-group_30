import spaceBtn from '../../assets/commandsSpace.svg';
import upBtn from '../../assets/commandsUp.svg';
import downBtn from '../../assets/commandsDown.svg'

const RulesAndCommands = () => {
   const  htmlCommands = `
   <div class="modal-body">
   <h2>Commandes du Jeu</h2>
   <p>Dans ce jeu, vous contrôlez votre personnage à l'aide des touches directionnelles.</p>
   <div class="container text-center">
      <div class="row">
         <h6 class="col"><img src="${upBtn}" class="rulesAndCommandsIcons" alt="Bouton Haut"></h6>
         <span class="col rulesAndCommandsText"> Monter</span>
      </div>
      <div class="row">
         <h6 class="col"><img src="${downBtn}" class="rulesAndCommandsIcons" alt="Bouton Bas"></h6>
         <span class="col rulesAndCommandsText"> Descendre</span> 
      </div>
      <div class="row">
         <h6 class="col"><img src="${spaceBtn}" class="rulesAndCommandsIcons" alt="Bouton Espace"></h6>
         <span class="col rulesAndCommandsText"> Tirer</span> 
      </div>
   </div>
   <h2>Règles :</h2>
   <ol>
      <li>Collectez les étoiles en déplaçant votre vaisseau vers elles.</li>
      <li>Évitez les astéroïdes pour rester en vie.</li>
      <li>Essayez d'aller aussi loin que possible et de vous hisser jusqu'au <strong>TOP 10</strong>.</li>
   </ol>
</div>
`;
  return htmlCommands;
  };

  export default RulesAndCommands;