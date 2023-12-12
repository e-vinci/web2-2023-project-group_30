

const GameOver = `
<div id="gameOverScreen" style="position: absolute; width: 1200px; height: 700px;" class="hidden">
    <h2 class="gameOverText" id="GameOver">Game Over</h2>
    <h5 id="gameover-points" class="gameOverText">Points : </h5>
        <span id="pointsDisplay" class="gameOverText"></span>
    <h5 id="gameover-stars" class="gameOverText">Etoiles gagnées :</h5>
        <span id="starsDisplay" class="gameOverText"></span>
    <button id="gameOverRestart" data-uri="/game">Recommencer</button>
    <button id="gameOverExit">Quitter</button>
</div>
`

export default GameOver;