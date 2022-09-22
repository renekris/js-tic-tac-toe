const createPlayer = (playerName, playerBoardPiece) => {
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
    // let board = ['X', 'X', 'O', 'O', 'X', 'O', 'X', 'O', 'X'];
    let board = [];
    let _players = [];

    function _addPlayer(playerName, playerBoardPiece) {
        if (_players.length >= 2) return;
        _players.push(createPlayer(playerName, playerBoardPiece.toUpperCase()));
    }

    function createPlayers(firstPlayer, secondPlayer = 'AI') {
        _addPlayer(firstPlayer, 'cross');
        _addPlayer(secondPlayer, 'circle');
        currentTurn = _players[0]; //cross goes first

        console.log(`Player 1: ${_players[0].getPlayerName()}`);
        console.log(`Player 2: ${_players[1].getPlayerName()}`);
        console.log(currentTurn.getPlayerName());
    }

    function deletePlayers() {
        _players = [];
    }

    function createBoard() {
        while (board.length < 9) {
            board.push(null);
        }
    }

    function resetBoard() {
        board = [];
        createBoard();
    }

    function changeBoardValue(index, value) {
        board[board.indexOf(index)] = value;
    }


    return {
        createPlayers,
        deletePlayers,
        createBoard,
        resetBoard,
        changeBoardValue,
        currentTurn,
        board,
        _players, //testing
    }
})();

const displayController = (() => {

    //DOM Cache
    const elGameBoard = document.getElementById('game-board');
    const elMenuForm = document.getElementById('menu-form');
    const elCpuToggle = document.getElementById('with-ai');

    //Bind Events
    elMenuForm.addEventListener('submit', _menuFormSubmit);
    elCpuToggle.addEventListener('change', _checkToggle);

    //Init
    function init() {
        gameBoard.createBoard();
        displayBoard();
    }

    //Private
    function _checkToggle(e) {
        e.target.checked ? e.target.form[1].disabled = true : e.target.form[1].disabled = false;
    }

    function _displayTurn() {

    }

    function _updateValue(e) {
        console.log(e.target.parentElement.dataset.index);
        const targetValue = e.target.parentElement.className;
        const targetIndex = e.target.parentElement.dataset.index;
        gameBoard.changeBoardValue(targetIndex, targetValue);
    }

    function _menuFormSubmit(e) {

        gameBoard.deletePlayers();
        if (e.target[0].value !== '' && e.target[1].value === '' && e.target[2].checked) { //with AI
            gameBoard.createPlayers(e.target[0].value);
        } else if (e.target[0].value !== '' && e.target[1].value !== '' && !e.target[2].checked) { //without AI
            gameBoard.createPlayers(e.target[0].value, e.target[1].value);
        } else {
            console.log('%cPlease enter required data', 'color:red')
            return
        }
        console.dir(e.target);
        e.target.classList.add('hidden');


    }

    //Public
    function displayBoard() {
        let index = 0;
        gameBoard.board.forEach(value => {
            const elMainDiv = document.createElement('div');
            const elImageDiv = document.createElement('div');
            elImageDiv.addEventListener('pointerup', _updateValue)
            // if (value === 'X') {
            // elMainDiv.classList.add('cross');
            // } else if (value === 'O') {
            //     elMainDiv.classList.add('circle');
            // }
            elMainDiv.dataset.index = index++;
            elMainDiv.append(elImageDiv)
            elGameBoard.append(elMainDiv);
        })
    }


    function displayClearBoard() {
        elGameBoard.innerHTML = '';
        gameBoard.resetBoard();
    }

    return {
        init,
        displayBoard,
        displayClearBoard,
    }
})();

const scoreBoard = (() => {

})();


displayController.init();
