
// game state factory
const Gameboard = (function() {
    const column = 3;
    const row = 3;
    let boardTable = [];

    //create new board
    const resetBoard = () => {
        for (let i = 0; i < row; i++) {
            boardTable[i] = [];
            for (let j = 0; j < column; j++) {
                boardTable[i][j] = "";
            }  
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
    resetBoard();
    return{getBoard, dropToken, printBoardTable, resetBoard}
})();


const dropBtns = document.querySelectorAll(".dropBtn");
const btnStart = document.querySelector("#start");
const playerInput1 = document.querySelector("input[id='player1']");
const playerInput2 = document.querySelector("input[id='player2']");
 const turn = document.querySelector(".turn");

// const resultMsg = document.querySelector(".resultMsg");


// game play logique that manage turn and end the game
const GameController = (function(){
    const createPlayer = (name, token) => {
    return {name, token}
    }

    let player1 = createPlayer(playerInput1.value || "player1", "X");
    let player2 = createPlayer(playerInput2.value || "player2", "O");

    let currentGameBoard = Gameboard.getBoard();
    //reset the game
    const resetGame = () => {
        Gameboard.resetBoard();
        currentGameBoard = Gameboard.getBoard();
        player1 = createPlayer(playerInput1.value || "player1", "X");
        player2 = createPlayer(playerInput2.value || "player2", "O");
        activePlayer = player1;   
    }
    
    let activePlayer = player1;
    const switchPayer = () => {
        activePlayer = activePlayer === player1? player2 : player1; 
    }

    const getActivePlayer = () => activePlayer;

    //print the player turn name
    const printNewRound = () => {
        turn.textContent = `It's ${getActivePlayer().name} turn...`
    }

    const checkWinner = () => {
        currentGameBoard = Gameboard.getBoard();
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
        const currentGameBoard = Gameboard.getBoard();
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
        const isValid = Gameboard.dropToken(row, column, getActivePlayer().token );
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
    return{playRound, printNewRound, getActivePlayer, switchPayer, createPlayer, resetGame}   
})();


//display functions factory
const ScreenController = (function  (){
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
        dropBtns.forEach(button => {
        button.disabled = true;
        });
    };


    //get screen bord
    const getPageBoardTab = () => pageBoardTab;


    //update screen after drop
    const updateScreen = () => {
        const currentBoard = Gameboard.getBoard();
        const currentPageBoard = getPageBoardTab();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                currentPageBoard[i][j].textContent = `${currentBoard[i][j]}`
                if (currentBoard[i][j] === "X") {
                    currentPageBoard[i][j].classList.add("tokenX");
                }else if (currentBoard[i][j] === "O"){
                    currentPageBoard[i][j].classList.add("tokenO")
                }
            }   
        }       
    }


    const setInactiveGameBtn = () =>{
        dropBtns.forEach(button => {
            button.classList.add("cell_disabled");
            button.classList.remove("cell");
        })
    }

    //manage the clicks
    const initial = function(){
        pageBoardTab.forEach(row => {
            row.forEach (button => {
                button.disabled = true;
                setInactiveGameBtn();
                button.addEventListener("click", () => {
                    button.disabled = true;
                    let row = Number(button.id[4]);
                    let column = Number(button.id[5]);
                    const result = GameController.playRound(row, column);
                    if (result.status === "continue") {
                        GameController.switchPayer();
                        GameController.printNewRound();
                    }else if (result.status === "win"){
                        turn.textContent = `${result.winner} wins!`;
                        turn.classList.add("win");
                        setInactiveGameBtn();
                        stopGame();
                    }else if (result.status === "draw" ) {
                        turn.textContent = "It's DRAW !";
                        turn.classList.add("draw");
                        setInactiveGameBtn();
                        stopGame();
                    }
                    updateScreen();
                    
                }) 
                
            }) 
            
        }) 
        updateScreen();
    };

    const resetCssClass = () => {
        dropBtns.forEach(button => {
            button.classList.remove("tokenX");
            button.classList.remove("tokenO");
            button.classList.remove("cell_disabled");
            button.classList.add("cell");
        });
        
        turn.classList.remove("win");
        turn.classList.remove("draw");
        
    }

    const reset = () => {
        GameController.resetGame();
        dropBtns.forEach(button => {
        button.disabled = false;
        });
        GameController.printNewRound();
        resetCssClass();
        updateScreen();
    }
    return{initial, reset}

    
})();



//lunch instance

ScreenController.initial();

btnStart.addEventListener("click", () => ScreenController.reset() );




      


