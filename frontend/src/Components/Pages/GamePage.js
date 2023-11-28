import Phaser from 'phaser';
// eslint-disable-next-line no-unused-vars
import {Modal} from 'bootstrap'
import GameScene from '../Game/GameScene';
// import { clearPage } from '../../utils/render';

let game;

const GamePage = () => {
  const phaserGame = `
<div id="gamePageDiv">
  <div class="modal fade" id="rulesAndCommandsDiv">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header text-center justify-content-center">
          <h3 class="modal-title">Règles</h3>
        </div>

        <div class="modal-body text-center">
          <p> tetstuzafeyuzagdyizae </p>
          <form class="">
            <input type="checkbox">
            <label>Ne plus montrer ce message</label>
          </form>
        </div>
        <div class="modal-footer bg-transparent">
          <button data-bs-dismiss="modal" id="closeRulesButton">Fermer</button>
        </div>
      </div>
    </div>
  </div>  
  <div id="gameDiv" class="d-flex justify-content-center my-3">
    <button type="button"  id="gamePauseButton" class="" data-bs-toggle="modal" data-bs-target="#pauseModal"> || </button>
    
    <div class="modal fade" id="pauseModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" id="pauseMenu">

          <div class="modal-header text-center">
            <h2 class="modal-title w-100">Pause</h2>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" data-bs-dismiss="modal" id="pauseMenuCloseButton">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div id="menu" class="container mx-auto">
              <button class="row menuButtons" data-bs-dismiss="modal" id="continueButton">Reprendre</button>
              <button class="row menuButtons" id="restartButton">Recommencer</button>

              <div id="confToRestartDiv" style="display: none;">
                <span id="confToRestartTitle"> Etes-vous sûr(e) ?</span>
                <div class="row justify-content-around">
                  <button class="col-4 confButtons" data-bs-dismiss="modal" data-uri="/game">Oui</button>
                  <button class="col-4 confButtons" id="confRestartReturnButton">Retour</button>
                </div>
              </div>

              <button class="row menuButtons">Commandes</button>
              <button class="row menuButtons" id="exitButton">Quitter le jeu</button>

              <div id="confToExitDiv" style="display: none;">
                <span id="confToExitTitle"> Etes-vous sûr(e) ?</span>
                <div class="row justify-content-around">
                  <button class="col-4 confButtons" data-bs-dismiss="modal" data-uri="/">Oui</button>
                  <button class="col-4 confButtons" id="confExitReturnButton">Retour</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  const main = document.querySelector('main');
  main.innerHTML = phaserGame;

  const mainWidth = window.innerWidth;
  const pauseButton = document.getElementById('gamePauseButton');
  let pauseButtonPosition = ((mainWidth - 800) / 2);
  if (pauseButtonPosition < 0) pauseButtonPosition = 0;
  pauseButton.style.right = `${pauseButtonPosition + 5}px`;


  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    scene: [GameScene],
    //  parent DOM element into which the canvas created by the renderer will be injected.
    parent: 'gameDiv',
  };
  if (game) game.destroy(true);
  game = new Phaser.Game(config);
  game.pause();

  // there could be issues when a game was quit (events no longer working)
  // therefore destroy any started game prior to recreate it

  const closeRulesButton = document.getElementById('closeRulesButton');
  closeRulesButton.addEventListener('click', () => {
    game.resume();
  })
  


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

  // Pause the game upon click of pause button

  pauseButton.addEventListener('click', () => {
    game.pause();
  })

  // Resume, upon click of reprendre, and closing of modal

  const continueButton = document.getElementById("continueButton");
  const closeMenuButton = document.getElementById("pauseMenuCloseButton");

  continueButton.addEventListener('click', () => {
    game.resume();
  });

  closeMenuButton.addEventListener('click', () => {
    game.resume();
  });

  // eslint-disable-next-line no-unused-vars
  const pauseModal = new Modal(document.getElementById('pauseModal'), {
    keyboard: false,
    backdrop: false
  });

  // eslint-disable-next-line no-unused-vars
  const rulesAndCommandsDiv = new Modal(document.getElementById('rulesAndCommandsDiv'), {
    show: true, 
    keyboard: false
  });

  rulesAndCommandsDiv.show();
  
};

export default GamePage;
