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
    let _players = [];

    //DOM Cache


    //Bind Events


    function addPlayer(playerName) {
        if (_players.length <= 2) {
            _players.push(createPlayer(playerName));
        }
    }



    return {
        addPlayer,
        _players, //testing
    }
})();

const displayController = (() => {

})();

const scoreBoard = (() => {

})();


//temp
gameBoard.addPlayer('Renekris');
gameBoard._players[0].getPlayerName;
