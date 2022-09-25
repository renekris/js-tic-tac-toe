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
    let originalBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let _players = [];

    //Private
    function _addPlayer(playerName, playerBoardPiece, isAi) {
        if (_players.length >= 2) return;
        _players.push(Player(playerName, playerBoardPiece, isAi));
    }

    //Public
    function createPlayers(firstPlayer, secondPlayer = 'AI') {
        _addPlayer(firstPlayer, 'X'); //first player
        hasAi ? _addPlayer('Ai', 'O', true) : _addPlayer(secondPlayer, 'O');

        currentTurn = _players[0]; //X or P1 goes first

        console.log(`Player 1: ${_players[0].getPlayerName()}`);
        console.log(`Player 2: ${_players[1].getPlayerName()}`);
    }

    function resetBoardData() {
        isGameFinished = false;
        hasAi = false;
        currentTurn = null;
        originalBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        _players = [];
    }

    function changeBoardValue(index, value) {
        originalBoard[index] = value;
    }

    function switchCurrentTurn() {
        const playerOne = _players[0];
        const playerTwo = _players[1];
        currentTurn.getPlayerBoardPiece() === playerOne.getPlayerBoardPiece()
            ? currentTurn = playerTwo
            : currentTurn = playerOne;
    }

    function checkWinState(board, currentPiece = currentTurn.getPlayerBoardPiece()) {

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
            return true;
        } else
            return false;
    }

    function aiChoice() {
        const pieceAi = _players[1].getPlayerBoardPiece();
        const minimaxChoice = minimax(originalBoard, pieceAi);
        changeBoardValue(minimaxChoice.index, 'O');
    }

    function minimax(currentBoard, player) {
        const pieceHuman = _players[0].getPlayerBoardPiece();
        const pieceAi = _players[1].getPlayerBoardPiece();
        let freeSpaces = currentBoard.filter(s => s != 'O' && s != 'X');


        if (checkWinState(currentBoard, pieceHuman)) { //human win
            return { score: -10 }
        }
        else if (checkWinState(currentBoard, pieceAi)) { //ai win
            return { score: 10 }
        }
        else if (freeSpaces.length === 0) { //draw
            return { score: 0 }
        }

        let moves = [];
        for (let i = 0; i < freeSpaces.length; i++) {
            let move = {};
            move.index = currentBoard[freeSpaces[i]];
            currentBoard[freeSpaces[i]] = player;

            if (player == pieceAi) {
                let result = minimax(currentBoard, pieceHuman);
                move.score = result.score;
            }
            else {
                let result = minimax(currentBoard, pieceAi);
                move.score = result.score;
            }

            currentBoard[freeSpaces[i]] = move.index;

            moves.push(move);
        }

        let bestMove;
        if (player === pieceAi) {
            let bestScore = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Number.POSITIVE_INFINITY;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];

        // if (depth === 0) {
        //     return node;
        // }
        // if (isMaximizingPlayer) {
        //     let maxEval = Number.NEGATIVE_INFINITY;
        //     node.forEach(child => {
        //         maxEval = Math.max(maxEval, minimax(child, depth - 1, false));
        //         console.log(`bottom- child: ${child} | depth: ${depth} | maxEval: ${maxEval}`)
        //     })
        //     return maxEval;
        // } else {
        //     let minEval = Number.POSITIVE_INFINITY;
        //     node.forEach(child => {
        //         minEval = Math.min(minEval, minimax(child, depth - 1, true))
        //         console.log(`bottom- child: ${child} | depth: ${depth} | minEval: ${minEval}`)
        //     })
        //     return minEval;
        // }
    }

    return {
        getCurrentTurn: () => { return currentTurn },
        getOriginalBoard: () => { return originalBoard },
        getIsGameFinished: () => { return isGameFinished },
        setIsGameFinished: (value) => { isGameFinished = value },
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
        if (!Number.isInteger(gameBoard.getOriginalBoard()[targetIndex]) || gameBoard.getIsGameFinished())
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
        if (gameBoard.checkWinState(gameBoard.getOriginalBoard())) {
            _displayPlayerWin();
            return
        }
        gameBoard.switchCurrentTurn();
        _displayCurrentTurn();
    }

    function _displayPlayerWin() {
        console.log(`${gameBoard.getCurrentTurn().getPlayerName()} is the winner!`)
        gameBoard.setIsGameFinished(true);
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
        gameBoard.getOriginalBoard().forEach(value => {
            const elMainDiv = document.createElement('div');
            const elImageDiv = document.createElement('div');
            elImageDiv.addEventListener('pointerup', _clickUpdateValue);
            if (value === 'X') {
                elMainDiv.classList.add('X');
            } else if (value === 'O') {
                elMainDiv.classList.add('O');
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
