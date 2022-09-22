const Player = (playerName, playerBoardPiece) => {
    let playerScore = null;
    const getPlayerName = () => playerName;

    const setPlayerScore = (value) => playerScore = value;
    const getPlayerScore = () => playerScore;

    const getPlayerBoardPiece = () => playerBoardPiece;

    return {
        getPlayerName,
        setPlayerScore,
        getPlayerScore,
        getPlayerBoardPiece,
    }
}

// todo/ideas
// make the menu a modal

const gameBoard = (() => {
    let currentTurn = null;
    let board = [];
    let _players = [];

    function _addPlayer(playerName, playerBoardPiece) {
        if (_players.length >= 2) return;
        _players.push(Player(playerName, playerBoardPiece.toUpperCase()));
    }

    function createPlayers(firstPlayer, secondPlayer = 'AI') {
        _addPlayer(firstPlayer, 'cross');
        _addPlayer(secondPlayer, 'circle');
        currentTurn = _players[0].getPlayerName(); //cross goes first

        console.log(`Player 1: ${_players[0].getPlayerName()}`);
        console.log(`Player 2: ${_players[1].getPlayerName()}`);
    }

    function resetBoardAll() {
        currentTurn = null;
        board = [];
        _players = [];

        while (board.length < 9) {
            board.push(null);
        }
    }

    function changeBoardValue(index, value) {
        board[index] = value;
    }


    return {
        createPlayers,
        resetBoardAll,
        changeBoardValue,
        getCurrentTurn: () => { return currentTurn },
        getBoard: () => { return board },
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

    //Init
    // function init() {
    //     gameBoard.createBoard();
    //     displayBoard();
    // }

    //Private
    function _checkToggle(e) {
        e.target.checked ? e.target.form[1].disabled = true : e.target.form[1].disabled = false;
    }

    function _displayTurn() {
        elCurrentTurn.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = `${gameBoard.getCurrentTurn()}'s turn`;
        elCurrentTurn.append(p);
    }

    function _clickUpdateValue(e) {
        const targetIndex = e.target.parentElement.dataset.index;
        gameBoard.changeBoardValue(targetIndex, 'cross');

        displayBoard();
    }

    function _menuFormSubmit(e) {
        if (e.target[0].value !== '' && e.target[1].value === '' && e.target[2].checked) {
            //with AI
            resetDisplayBoardAll(); //has to be inside so it wouldn't trigger during else condition
            gameBoard.createPlayers(e.target[0].value);
        } else if (e.target[0].value !== '' && e.target[1].value !== '' && !e.target[2].checked) {
            //without AI / PvP
            resetDisplayBoardAll();
            gameBoard.createPlayers(e.target[0].value, e.target[1].value);
        } else {
            console.log('%cPlease enter required data', 'color:red')
            return
        }


        e.target.classList.add('hidden'); //turn to modal
        _displayTurn();
    }

    function _drawBoard() {
        let index = 0;
        gameBoard.getBoard().forEach(value => {
            const elMainDiv = document.createElement('div');
            const elImageDiv = document.createElement('div');
            elImageDiv.addEventListener('pointerup', _clickUpdateValue)
            if (value === 'cross') {
                elMainDiv.classList.add('cross');
            } else if (value === 'circle') {
                elMainDiv.classList.add('circle');
            }
            elMainDiv.dataset.index = index++;
            elMainDiv.append(elImageDiv)
            elGameBoard.append(elMainDiv);
        })
    }

    //Public
    function displayBoard() {
        elGameBoard.innerHTML = '';
        _drawBoard();
    }


    function resetDisplayBoardAll() {
        gameBoard.resetBoardAll();
        displayBoard();
    }

    return {
    }
})();

const scoreBoard = (() => {

})();
