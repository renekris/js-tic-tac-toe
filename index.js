const createPlayer = (playerName, playerBoardPiece, isPlayerTurn) => {
    let playerScore = null;
    const getPlayerName = () => playerName;

    const setPlayerScore = (score) => playerScore = score;
    const getPlayerScore = () => playerScore;

    const setPlayerTurn = () => isPlayerTurn = !isPlayerTurn;
    const getPlayerTurn = () => isPlayerTurn;

    const getPlayerBoardPiece = () => playerBoardPiece;

    return {
        getPlayerName,
        setPlayerScore,
        getPlayerScore,
        setPlayerTurn,
        getPlayerTurn,
        getPlayerBoardPiece,
    }
}

const gameBoard = (() => {
    // let board = ['X', 'X', 'O', 'O', 'X', 'O', 'X', 'O', 'X'];
    let board = [];
    let _players = [];

    function _addPlayer(playerName, playerBoardPiece, isPlayerTurn) {
        if (_players.length >= 2) return;
        _players.push(createPlayer(playerName, playerBoardPiece.toUpperCase(), isPlayerTurn));
    }

    function createPlayers() {
        _addPlayer('Renekris', 'cross', true); //cross goes first
        _addPlayer('Computer', 'circle', false);
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
        createBoard,
        resetBoard,
        changeBoardValue,
        board,
        _players, //testing
    }
})();

const displayController = (() => {

    //DOM Cache
    const elGameBoard = document.getElementById('game-board');

    //Bind Events


    function displayTurn() {

    }

    function displayBoard() {
        let index = 0;
        gameBoard.board.forEach(value => {
            const elMainDiv = document.createElement('div');
            const elImageDiv = document.createElement('div');
            elImageDiv.addEventListener('pointerup', updateValue)
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

    function updateValue(e) {
        console.log(e.target.parentElement.dataset.index);
        const targetValue = e.target.parentElement.className;
        const targetIndex = e.target.parentElement.dataset.index;
        gameBoard.changeBoardValue(targetIndex, targetValue);
    }

    function displayClearBoard() {
        elGameBoard.innerHTML = '';
        gameBoard.resetBoard();
    }

    return {
        displayBoard,
        displayClearBoard,
    }
})();

const scoreBoard = (() => {

})();


//temp
gameBoard.createPlayers();

console.log(gameBoard._players[0].getPlayerName());
console.log(gameBoard._players[0].getPlayerBoardPiece());

console.log(gameBoard._players[1].getPlayerName());
console.log(gameBoard._players[1].getPlayerBoardPiece());

gameBoard.createBoard();
displayController.displayBoard();
