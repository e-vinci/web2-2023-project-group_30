const PauseMenu =  
    `
<div class="modal fade" id="pauseModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" id="pauseMenuModal">

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

                <button class="row menuButtons" type="button" id="commandsButton" data-bs-target="#rulesAndCommandsDiv" data-bs-toggle="modal">Commandes et règles</button>
                    
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
    `

export default PauseMenu;