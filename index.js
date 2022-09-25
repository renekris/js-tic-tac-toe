const Player = (playerName, playerBoardPiece, isAi = false) => {
    let playerScore = null;

    const getPlayerName = () => playerName;

    const setPlayerScore = (value) => playerScore = value;
    const getPlayerScore = () => playerScore;

    const getPlayerBoardPiece = () => playerBoardPiece;

    const getIsAi = () => isAi;

    return {
        getPlayerName,
        setPlayerScore,
        getPlayerScore,
        getPlayerBoardPiece,
        getIsAi,
    }
}

// todo/ideas
// make the menu a modal

const gameBoard = (() => {
    let isGameFinished = false;
    let hasAi = false;
    let currentTurn = null;
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let _players = [];

    //Private
    function _addPlayer(playerName, playerBoardPiece, isAi) {
        if (_players.length >= 2) return;
        _players.push(Player(playerName, playerBoardPiece, isAi));
    }

    function _checkLine(startPos, stepsPos, distance = board.length) {
        let pieceArray = [];
        for (let i = startPos; i < startPos + distance; i += stepsPos) {
            const element = board[i];
            if (element !== null) {
                pieceArray.push(element);
            }
        }
        if (pieceArray.length >= 3) {
            if (pieceArray.every(val => val === pieceArray[0])) {
                console.log('WIN!')
                return true;
            } else {
                return false;
            }
        }
    }

    //Public
    function createPlayers(firstPlayer, secondPlayer = 'AI') {
        _addPlayer(firstPlayer, 'X'); //first player
        hasAi ? _addPlayer('Ai', 'C', true) : _addPlayer(secondPlayer, 'C');

        currentTurn = _players[0]; //X or P1 goes first

        console.log(`Player 1: ${_players[0].getPlayerName()}`);
        console.log(`Player 2: ${_players[1].getPlayerName()}`);
    }

    function resetBoardData() {
        isGameFinished = false;
        hasAi = false;
        currentTurn = null;
        board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        _players = [];
    }

    function changeBoardValue(index, value) {
        board[index] = value;
    }

    function switchCurrentTurn() {
        const playerOne = _players[0];
        const playerTwo = _players[1];
        currentTurn.getPlayerBoardPiece() === playerOne.getPlayerBoardPiece()
            ? currentTurn = playerTwo
            : currentTurn = playerOne;
    }

    function checkWinState() {
        const currentPiece = currentTurn.getPlayerBoardPiece();

        // array for debugging
        // 0 1 2
        // 3 4 5
        // 6 7 8
        if (
            (currentPiece === board[0] && currentPiece === board[1] && currentPiece === board[2]) ||
            (currentPiece === board[3] && currentPiece === board[4] && currentPiece === board[5]) ||
            (currentPiece === board[6] && currentPiece === board[7] && currentPiece === board[8]) ||
            (currentPiece === board[0] && currentPiece === board[3] && currentPiece === board[6]) ||
            (currentPiece === board[1] && currentPiece === board[4] && currentPiece === board[7]) ||
            (currentPiece === board[2] && currentPiece === board[5] && currentPiece === board[8]) ||
            (currentPiece === board[0] && currentPiece === board[4] && currentPiece === board[8]) ||
            (currentPiece === board[2] && currentPiece === board[4] && currentPiece === board[6])
        ) {
            console.clear();
            console.log(`${currentTurn.getPlayerName()} is the winner!`)
            isGameFinished = true;
            return true;
        } else
            return false;
    }


    function aiChoice() {
        //picking at random / overwriting user
        changeBoardValue(Math.floor(Math.random() * board.length), 'C');
    }

    function minimax(node, depth, isMaximizingPlayer) {
        if (depth === 0) {
            return node;
        }
        if (isMaximizingPlayer) {
            let maxEval = Number.NEGATIVE_INFINITY;
            node.forEach(child => {
                maxEval = Math.max(maxEval, minimax(child, depth - 1, false));
                console.log(`bottom- child: ${child} | depth: ${depth} | maxEval: ${maxEval}`)
            })
            return maxEval;
        } else {
            let minEval = Number.POSITIVE_INFINITY;
            node.forEach(child => {
                minEval = Math.min(minEval, minimax(child, depth - 1, true))
                console.log(`bottom- child: ${child} | depth: ${depth} | minEval: ${minEval}`)
            })
            return minEval;
        }
    }


    return {
        getCurrentTurn: () => { return currentTurn },
        getBoard: () => { return board },
        getIsGameFinished: () => { return isGameFinished },
        isAiEnabled: () => { return hasAi },
        setHasAi: (value) => { hasAi = value },
        createPlayers,
        resetBoardData,
        changeBoardValue,
        switchCurrentTurn,
        checkWinState,
        aiChoice,
        minimax,
    }
})();

const displayController = (() => {

    //DOM Cache
    const elGameBoard = document.getElementById('game-board');
    const elMenuForm = document.getElementById('menu-form');
    const elCpuToggle = document.getElementById('with-ai');
    const elCurrentTurn = document.getElementById('current-turn');

    //Bind Events
    elMenuForm.addEventListener('submit', _menuFormSubmit);
    elCpuToggle.addEventListener('change', _checkToggle);

    //Private
    function _checkToggle(e) {
        e.target.checked ? e.target.form[1].disabled = true : e.target.form[1].disabled = false;
    }

    function _displayCurrentTurn() {
        elCurrentTurn.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = `${gameBoard.getCurrentTurn().getPlayerName()}'s turn`;
        elCurrentTurn.append(p);
    }

    function _clickUpdateValue(e) {
        const targetIndex = e.target.parentElement.dataset.index;
        const currentPiece = gameBoard.getCurrentTurn().getPlayerBoardPiece();
        if (!Number.isInteger(gameBoard.getBoard()[targetIndex]) || gameBoard.getIsGameFinished())
            return; //avoid overwriting cells & check finished

        //user
        _makeTurn(targetIndex, currentPiece);

        //ai
        if (gameBoard.isAiEnabled()) {
            _makeTurn(targetIndex, currentPiece);
        }
    }

    function _makeTurn(targetIndex, currentPiece) {
        gameBoard.getCurrentTurn().getIsAi() ? gameBoard.aiChoice() : gameBoard.changeBoardValue(targetIndex, currentPiece);

        _drawBoard();
        if (gameBoard.checkWinState()) {
            _displayPlayerWin();
            return
        }
        gameBoard.switchCurrentTurn();
        _displayCurrentTurn();
    }

    function _displayPlayerWin() {
        elCurrentTurn.textContent = `Winner of this game is: ${gameBoard.getCurrentTurn().getPlayerName()}!`;
    }

    function _menuFormSubmit(e) {
        const playerOneName = e.target[0].value;
        const playerTwoName = e.target[1].value;
        const cpuToggle = e.target[2].checked;

        if (playerOneName !== '' && cpuToggle) {
            //with AI
            _resetDisplayBoardAll(); //has to be inside so it wouldn't trigger during else condition
            gameBoard.setHasAi(true);
            gameBoard.createPlayers(playerOneName);
        } else if (playerOneName !== '' && playerTwoName !== '' && !cpuToggle) {
            //without AI / PvP
            _resetDisplayBoardAll();
            gameBoard.createPlayers(playerOneName, playerTwoName);
        } else {
            console.log('%cPlease enter required data', 'color:red')
            return
        }


        e.target.classList.add('hidden'); //turn to modal
        _displayCurrentTurn();
    }

    function _drawBoard() {
        elGameBoard.innerHTML = '';
        let index = 0;
        gameBoard.getBoard().forEach(value => {
            const elMainDiv = document.createElement('div');
            const elImageDiv = document.createElement('div');
            elImageDiv.addEventListener('pointerup', _clickUpdateValue);
            if (value === 'X') {
                elMainDiv.classList.add('X');
            } else if (value === 'C') {
                elMainDiv.classList.add('C');
            }
            elMainDiv.dataset.index = index++;
            elMainDiv.append(elImageDiv);
            elGameBoard.append(elMainDiv);
        })
    }

    function _resetDisplayBoardAll() {
        gameBoard.resetBoardData();
        _drawBoard();
    }

    //Public


    return {
    }
})();

const scoreBoard = (() => {

})();
