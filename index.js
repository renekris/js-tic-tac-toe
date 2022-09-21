const createPlayer = (playerName) => {
    let playerScore = null;
    const getPlayerName = () => playerName;
    const setPlayerScore = (score) => playerScore = score;
    const getPlayerScore = () => playerScore;

    return {
        getPlayerName,
        setPlayerScore,
        getPlayerScore,
    }
}

const gameBoard = (() => {
    let board = ['X', 'X', 'O', 'O', 'X', 'O', 'X', 'O', 'X'];
    let _players = [];

    function addPlayer(playerName) {
        if (_players.length <= 2) {
            _players.push(createPlayer(playerName));
        }
    }

    function createBoard() {
        while (board.length <= 9) {
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
        addPlayer,
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


    function displayBoard() {
        gameBoard.board.forEach(element => {
            const p = document.createElement('p');
            p.addEventListener('pointerdown', updateValue)
            p.textContent = element;
            elGameBoard.append(p);
        })
    }

    function updateValue(e) {
        console.log(e.target);
    }

    return {
        displayBoard,
    }
})();

const scoreBoard = (() => {

})();


//temp
// gameBoard.addPlayer('Renekris');
// gameBoard._players[0].getPlayerName;

displayController.displayBoard();
