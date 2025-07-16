
// game state factory
function Gameboard() {
    const column = 3;
    const row = 3;
    boardTable = [];

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
        console.log(`${getActivePlayer().name} drop is token ${getActivePlayer().token} in to row ${row}, column ${column}`);
        board.dropToken(row, column, getActivePlayer().token );
       
    }
    return{playRound, checkWinner, switchPayer, printNewRound, checkDraw}   
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
    game.playRound(x, y)
    const winner = game.checkWinner();
    const isDraw = game.checkDraw();
    if (winner){
        board.printBoardTable();
        console.log(`${winner} win the game`);
        break;
    } else if (isDraw) {
        board.printBoardTable();
        console.log("It's DRAW !");
        break;
    }
    
    
    game.switchPayer();
      
}

