import Phaser from 'phaser';
// eslint-disable-next-line no-unused-vars, import/no-duplicates
import {Modal} from 'bootstrap'
import GameScene from '../Game/GameScene';
import CommandsPage from '../Modals/CommandsPage';
import PauseMenu from '../Modals/PauseMenu';
import GameOver from '../Modals/GameOver';
import Navigate from '../Router/Navigate';
import { getUserSessionData, isLoggedIn } from '../../utils/auth';

// import { clearPage } from '../../utils/render';
// import CommandsPage from "./CommandsPage";
// eslint-disable-next-line import/order, import/no-duplicates

let game;

const GamePage = async () => {
  const phaserGame = `
<div id="gamePageDiv" >
  <div class="modal fade" id="rulesAndCommandsDiv">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <form class="" id="formSeeRulesAgain">
        <div class="modal-body text-center">
          ${CommandsPage()}
            <input type="checkbox" id="check">
            <label for="check" id="label">Ne plus montrer ce message</label>
        </div>
        <div class="modal-footer bg-transparent">
          <input type="submit" data-bs-dismiss="modal" id="closeRulesButton" for="formSeeRulesAgain" value="Fermer">
        </div>
        </form>
      </div>
    </div>
  </div>  
  <div id="gameDiv" class="d-flex justify-content-center my-3">
    <button type="button"  id="gamePauseButton" class="" data-bs-toggle="modal" data-bs-target="#pauseModal"> || </button>
    ${PauseMenu}
    ${GameOver}
  </div>
</div>
`;

  const main = document.querySelector('main');
  main.innerHTML = phaserGame;

  const mainWidth = window.innerWidth;
  const pauseButton = document.getElementById('gamePauseButton');
  let pauseButtonPosition = ((mainWidth - 1200) / 2);
  if (pauseButtonPosition < 0) pauseButtonPosition = 0;
  pauseButton.style.right = `${pauseButtonPosition + 5}px`;

  // Set the skin to the current one

  let scene = new GameScene();

  if (isLoggedIn()){
    const username = getUserSessionData()?.username;

    // eslint-disable-next-line no-inner-declarations
    async function getCurrentSkin(){
      const response = await fetch(`${process.env.API_BASE_URL}/users/current-skin/${username}`);
      let skin;
      if (!response.ok) {
        alert("Erreur: votre skin sera par défaut")
        skin = 0;
        return skin;
      }
      skin = await response.json();
      return skin;
    }
  
    const skinID = await getCurrentSkin();

    scene = new GameScene(skinID);
  }

  window.addEventListener('popstate', () => {
    game.destroy();
  })

  const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: [scene],
    //  parent DOM element into which the canvas created by the renderer will be injected.
    parent: 'gameDiv',
  };
  
  if (game) game.destroy(true);
  game = new Phaser.Game(config);
  game.pause();
  // there could be issues when a game was quit (events no longer working)
  // therefore destroy any started game prior to recreate it

  let isGamePausable = false;

  const closeRulesButton = document.getElementById('closeRulesButton');
  closeRulesButton.addEventListener('click', () => {
    game.resume();
    isGamePausable = true;
  })

  // Responsive gameover screen 
  const gameOverScreen = document.getElementById('gameOverScreen');
  if (mainWidth < 1200){
    const heightToSet = (mainWidth/1200)*700;
    gameOverScreen.style.width = `${mainWidth}px`
    gameOverScreen.style.height = `${heightToSet}px`;
  }

  function pauseGame(){
    isGamePausable = false;
    game.pause();
    game.sound.context.suspend();
  }
  

  // Onclick of the restart button
  const restartButton = document.getElementById("restartButton");
  const confToRestartDiv = document.getElementById("confToRestartDiv");
  
  restartButton.addEventListener('click', () => {
    restartButton.style.display = 'none';
    confToRestartDiv.style.display = 'block';
  });

  const restartReturnButton = document.getElementById('confRestartReturnButton');
    
  restartReturnButton.addEventListener('click', () => {
    restartButton.style.display = 'inherit';
    confToRestartDiv.style.display = 'none';
  });

  // Onclick of the exit button
  const exitButton = document.getElementById("exitButton");
  const confToExitDiv = document.getElementById("confToExitDiv");

  exitButton.addEventListener('click', () => {
    exitButton.style.display = 'none';
    confToExitDiv.style.display = 'block';
  });

  const exitReturnButton = document.getElementById("confExitReturnButton");

  exitReturnButton.addEventListener('click', () => {
    exitButton.style.display = 'inherit';
    confToExitDiv.style.display = 'none';
  });

  // Form submission

  const form = document.getElementById('formSeeRulesAgain');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkbox = document.getElementById('check');
    const valueCheckbox = checkbox.checked;
    localStorage.setItem('disableRules', valueCheckbox);
  })

  // Pause the game upon click of pause button

  pauseButton.addEventListener('click', () => {
    if (isGamePausable) pauseGame();
  })

  // Resume, upon click of reprendre, and closing of modal

  const continueButton = document.getElementById("continueButton");
  const closeMenuButton = document.getElementById("pauseMenuCloseButton");

  continueButton.addEventListener('click', () => {
      game.resume();
      isGamePausable = true;
  });

  closeMenuButton.addEventListener('click', () => {
    game.resume();
    isGamePausable = true;
  });

  // eslint-disable-next-line no-unused-vars

  const pauseModal = new Modal(document.getElementById('pauseModal'), {
    keyboard: false,
    backdrop: false
  });

  // eslint-disable-next-line no-unused-vars
  const rulesAndCommandsDiv = new Modal(document.getElementById('rulesAndCommandsDiv'), {
    keyboard: false, 
    backdrop: false
  });

  // Show commands 
  const commandsButton = document.getElementById('commandsButton');
  commandsButton.addEventListener('click', () => {
    const check = document.getElementById('check');
    const label = document.getElementById('label');
    check.style.display = 'none'
    label.style.display = 'none'
  });

  // Game over
  document.getElementById('gameOverRestart')?.addEventListener('click', () => {
    Navigate('/game');
})

document.getElementById('gameOverExit')?.addEventListener('click', () => {
  Navigate('/');
})
  
  document.addEventListener('keyup', (e) => {
    // eslint-disable-next-line no-underscore-dangle
    if(e.key === 'Escape' && rulesAndCommandsDiv._isShown === false && !pauseModal._isShown) {
      pauseModal.show();
      pauseGame();
    }
  })
  if (localStorage.getItem('disableRules') === 'true'){
    game.resume();
    isGamePausable = true;
  } else {
    rulesAndCommandsDiv.show();
  }
  document.querySelector('*').style.overflowY = "scroll";
};

export default GamePage;
