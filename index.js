
// game state factory
function Gameboard() {
    const column = 3;
    const row = 3;
    let boardTable = [];

    for (let i = 0; i < row; i++) {
        boardTable[i] = [];
        for (let j = 0; j < column; j++) {
            boardTable[i][j] = "";
        }  
    }

    const getBoard = () => boardTable;

    const dropToken = (row, column, token) => {
        if (boardTable[row][column] === ""){
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

    //print the player turn name
    const turn = document.querySelector(".turn")
    const printNewRound = () => {
        turn.textContent = `It's ${getActivePlayer().name} turn`
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
                if (currentGameBoard[i][j] === "") {
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
 
            return {status : "continue" }
        }else {
            return {status : "invalid"}
        }
    }       
    return{playRound, printNewRound, getActivePlayer, switchPayer}   
}


//display functions factory
function ScreenController (){
    const game = GameController();
    const player1 = document.querySelector("input[id='player1']");
    const player2 = document.querySelector("input[id='player2']");

    //get all board buttons
    const column = 3;
    const row = 3;
    let pageBoardTab = [];
    for (let i = 0; i < row; i++) {
        pageBoardTab[i] = [];
        for (let j = 0; j < column; j++) {
            pageBoardTab[i][j] = document.querySelector(`#btn_${i}${j}`)
        }  
    }

    //logic that end the game
    const stopGame = () => {
        pageBoardTab.forEach(row => {
            row.forEach (button => {
                button.disabled = true
            })
        })
    }

    //get screen bord
    const getPageBoardTab = () => pageBoardTab


    //update screen after drop
    const updateScreen = () => {
        const currentBoard = board.getBoard()
        const currentPageBoard = getPageBoardTab();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                currentPageBoard[i][j].textContent = `${currentBoard[i][j]}` 
            }   
        }       
    }


    //select where i will display win or display message
    const message = document.querySelector(".message");

    //manage the clicks
    pageBoardTab.forEach(row => {
        row.forEach (button => {
            button.addEventListener("click", () => {
                button.disabled = true; 
                let row = Number(button.id[4]);
                let column = Number(button.id[5]);
                const result = game.playRound(row, column);
                if (result.status === "continue") {
                    const activePlayer = game.getActivePlayer();
                    console.log(`${activePlayer.name} drop is token ${activePlayer.token} in to row ${row}, column ${column}`);
                    game.switchPayer();
                    game.printNewRound();
                }else if (result.status === "win"){
                    board.printBoardTable();
                    message.textContent = `${result.winner} win the game`;
                    console.log(`${result.winner} win the game`);
                    stopGame();
                }else if (result.status === "draw" ) {
                    board.printBoardTable();
                    message.textContent = "It's DRAW !";
                    console.log("It's DRAW !");
                    stopGame();
                }
                updateScreen();
                
            }) 
            
        }) 
           
    }) 
    updateScreen();
    game.printNewRound();
}







//lunch instance
const board = Gameboard();
//const game = GameController();
const gameScreen = ScreenController();

//loop for a game start
// while (true) {
//     game.printNewRound();
//     board.printBoardTable();
//     x = prompt("entrez ligne")
//     y = prompt("entrez col")
//     const result = game.playRound(x, y);
//     if (result.status === "continue") {
//         const activePlayer = game.getActivePlayer();
//         console.log(`${activePlayer.name} drop is token ${activePlayer.token} in to row ${x}, column ${y}`);
//     }else if (result.status === "win"){
//         board.printBoardTable();
//         console.log(`${result.winner} win the game`);
//         break;
//     }else if (result.status === "draw" ) {
//         board.printBoardTable();
//         console.log("It's DRAW !");
//         break;
//     }
// } 
      


