
// game state factory
function Gameboard() {
    const column = 3;
    const row = 3;
    let boardTable = [];

    for (let i = 0; i < row; i++) {
        boardTable[i] = [];
        for (let j = 0; j < column; j++) {
            boardTable[i][j] = undefined
        }  
    }

    const getBoard = () => boardTable;

    const dropToken = (row, column, token) => {
        if (boardTable[row][column] === undefined){
            boardTable[row][column] = token;
            return true
        } else {
            console.log("Invalid drop!");
            return false   
        }
    }

    const printBoardTable = () => {
        console.table(getBoard())
    }

    return{getBoard, dropToken, printBoardTable}
}


// game play logique that manage turn and end the game
function GameController(){
    const createPlayer = (name, token) => {
    return {name, token}
    }

    const player1 = createPlayer("siaka", "X")
    const player2 = createPlayer("billion", "O")

    let activePlayer = player1;
    const switchPayer = () => {
        activePlayer = activePlayer === player1? player2 : player1; 
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(`It's ${getActivePlayer().name} turn`);
    }

    const checkWinner = () => {
        const currentGameBoard = board.getBoard();
        //check win in row
        for (let i = 0; i < 3; i++) {
            if (currentGameBoard[i][0] 
                && currentGameBoard[i][0] === currentGameBoard[i][1]
                && currentGameBoard[i][0] === currentGameBoard[i][2]){    
                return getActivePlayer().name
            }
        }


        // check win in column
        for (let i = 0; i < 3; i++) {
            if (currentGameBoard[0][i] 
                && currentGameBoard[0][i] === currentGameBoard[1][i]
                && currentGameBoard[0][i] === currentGameBoard[2][i]){    
                return getActivePlayer().name
            }
        }
          
        
        //check win on the diagonal
        if (currentGameBoard[2][0] 
            && currentGameBoard[2][0] === currentGameBoard[1][1]
            && currentGameBoard[2][0] === currentGameBoard[0][2]){    
            return getActivePlayer().name
        }

            //check win on the diagonal
        if (currentGameBoard[0][0] 
            && currentGameBoard[0][0] === currentGameBoard[1][1]
            && currentGameBoard[0][0] === currentGameBoard[2][2]){    
            return getActivePlayer().name
        }
        
        return null
    }



    // check if the board is fill
    const checkDraw = () => {
        const currentGameBoard = board.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++){
                if (currentGameBoard[i][j] === undefined) {
                    return false
                }
            }     
        }
        return true
    }

    // function that start a round
    const playRound = (row, column) => {
        const isValid = board.dropToken(row, column, getActivePlayer().token );
        if (isValid){
            const winner = checkWinner();
            const isDraw = checkDraw();
            if(winner){
                return {status : "win", winner}

            } else if (isDraw) {
                return {status : "draw"}
            }
            switchPayer();
            return {status : "continue" }
        }else {
            return {status : "invalid"}
        }
    }       
    return{playRound, printNewRound, getActivePlayer}   

}

//lunch instance
const board = Gameboard()
const game = GameController();


//loop for a game start
while (true) {
    game.printNewRound();
    board.printBoardTable();
    x = prompt("entrez ligne")
    y = prompt("entrez col")
    const result = game.playRound(x, y);
    if (result.status === "continue") {
        const activePlayer = game.getActivePlayer();
        console.log(`${activePlayer.name} drop is token ${activePlayer.token} in to row ${x}, column ${y}`);
    }else if (result.status === "win"){
        board.printBoardTable();
        console.log(`${result.winner} win the game`);
        break;
    }else if (result.status === "draw" ) {
        board.printBoardTable();
        console.log("It's DRAW !");
        break;
    }
} 
      


