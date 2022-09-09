const gameBoard = (function () {
  let _board = [];
  let _isFinished = false;
  const reset = () => _board = new Array(9).fill('');
  const isTileEmpty = (index) => {
    if (_board[index] === '') return true;
    return false;
  }
  const setTile = (tile, player) => {
    _board[tile] = player;
  }
  return {
    reset,
    isTileEmpty,
    setTile
  }
})();
const displayController = (function (doc) {
  let currentPlayer = 'X';

  const _switchPlayer = (currentPlayer) => {
    if (currentPlayer === 'X') return 'O';
    return 'X';
  }
  const _updateBoard = (move, player) => {
    const tile = doc.querySelector(`#board>[data-index='${move}']`);
    tile.textContent = player;
  }

  const playRound = (nextPlayerMove) => {
    if (gameBoard.isTileEmpty(nextPlayerMove)) gameBoard.setTile(nextPlayerMove, currentPlayer);
    else return null; // Maybe add retry variable here?
    _updateBoard(nextPlayerMove, currentPlayer);
    console.log(currentPlayer);
    currentPlayer = _switchPlayer(currentPlayer);
  }
  const assignTiles = () => {
    const tiles = doc.querySelectorAll(`#board .tile`);
    tiles.forEach(t => {
      t.addEventListener('click', (e) => playRound(e.target.getAttribute('data-index')));
    });
  }
  const newGame = (player1, player2) => {
    player1.reset();
    player2.reset();
    gameBoard.reset();
    assignTiles();
  }
  return {
    newGame,
    playRound
  }
})(document);
const Player = () => {
  let _score = 0;
  let _totalScore = 0;
  const getScore = () => _score;
  const getTotalScore = () => _totalScore;
  const win = () => _score++;
  const reset = () => {
    _score = 0;
  }
  return {
    getScore,
    getTotalScore,
    win,
    reset
  };
} 
const Computer = () => {
  const logic = () => {
    // ai code
  }
  const protoPlayer = Player();
  return Object.assign({}, protoPlayer, logic)
}



let player1 = Player(); let player2 = Player();
displayController.newGame(player1, player2);
