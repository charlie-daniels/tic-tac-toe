const gameBoard = (function () {
  let _board = [];
  let _isFinished = false;
  const newBoard = () => _board = new Array(9).fill('');
  const printBoard = () => console.table(_board); // temp
  const isTileEmpty = (index) => {
    if (_board[index] === '') return true;
    return false;
  }
  const setTile = (tile, player) => {
    _board[tile] = player;
  }
  return {
    newBoard,
    printBoard, // temp
    isTileEmpty,
    setTile
  }
})();
const displayController = (function () {
  let currentPlayer = 'X';
  let nextPlayerMove;
  const _switchPlayer = () => {
    if (currentPlayer === 1) return 2;
    return 1;
  }
  const _playRound = () => {
    if (gameBoard.isTileEmpty(nextPlayerMove)) gameBoard.setTile(nextPlayerMove, currentPlayer);
    else return null;
    gameBoard.printBoard();
    currentPlayer = _switchPlayer();
  }

  const setNextMove = (move) => nextPlayerMove = move;
  const newGame = (player1, player2) => {
    player1.reset();
    player2.reset();
    gameBoard.newBoard();
    gameBoard.printBoard();
    _playRound();
  }
  return {
    setNextMove,
    newGame
  }
})();
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
gameBoard.printBoard();
