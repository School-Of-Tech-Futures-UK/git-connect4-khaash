const tag = document.getElementById("header")
const winnerMessage = document.getElementById("winnerMessage")
const firstPlayerName = document.getElementById("firstPlayer")
const secondPlayerName = document.getElementById("secondPlayer")
const inputField = document.getElementById("inputField")
const firstPlayerScore = document.getElementById("firstPlayerScore")
const secondPlayerScore = document.getElementById("secondPlayerScore")
const highScoreBoard = document.getElementById("highScoreBoard")

let turn = 0
let player1 = "red"
let winnerFound = false
let grid = [                                    
    ["white", "white", "white", "white", "white", "white", "white"], //grid[0]
    ["white", "white", "white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white", "white", "white"], // i = 3 , column Number 6
    ["white", "white", "white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white", "white", "white"] //grid[5][6]
]


function handle(e){//semi pure
    if (e.keyCode===13){
        if (firstPlayerName.innerText===""){
            e.preventDefault()
            firstPlayerName.innerText=e.target.value
            firstPlayerScore.innerText="0"
            e.target.value=""
            winnerMessage.innerText="Enter Player 2's Name"
            
    }else if (secondPlayerName.innerText==="" && secondPlayerName.innerText!=firstPlayerName){
        e.preventDefault()
        secondPlayerName.innerText=e.target.value
        secondPlayerScore.innerText="0"
        inputField.style.display="none"
        winnerMessage.style.display="none"
    }
}}


function takeTurn(e) {//semi pure
    if (firstPlayerName.innerText!="" && secondPlayerName.innerText!=""){
        if (winnerFound===false){
            const id = e.target.id
            const colNum = id[8]
            const rowNum = id[3]

            const lowestAvailableRow = getLowestAvailableRowInColumn(colNum, grid)

            if (lowestAvailableRow !== "white") {
                turn++
                if (player1 === "red") {
                    grid[lowestAvailableRow][colNum - 1] = "red"
                    document.getElementById(`row${lowestAvailableRow + 1}-col${colNum}`).style.backgroundColor = 'red';        
                    player1 = "yellow"
                } else {
                    grid[lowestAvailableRow][colNum - 1] = "yellow" // grid[3][6] = "yellow"
                    document.getElementById(`row${lowestAvailableRow + 1}-col${colNum}`).style.backgroundColor = 'yellow';
                    player1 = "red"
                }
            }
            
            checkWinner(lowestAvailableRow, colNum, player1)
            
}}}

//API functions to send and receive data from server
const sendScoreRequest = async (player, turns)=>{//pure
    
    await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify([player, turns])
    })
}

const highScoresJson = async ()=> {//pure
    await fetch('http://localhost:3000/data').then(res=>res.json().then(data=>displayScores(data)))
}

function displayScores(scoresData){//pure
    console.log("data received from back end", scoresData)
    //obj -> array
    let sortedScores = []

    for (player in scoresData){
        sortedScores.push([player, scoresData[player]])
    }
    console.log("Sorted Scores", sortedScores)
    //sort array
    sortedScores.sort(function(a,b){return b[1]-a[1]})
    //display scores on score board
    for (let i=0; i<sortedScores.length; i++){
        const playerNameText = document.getElementById("player"+(i+1))
        const scoreText = document.getElementById("score"+(i+1))
        playerNameText.innerText = `${i+1}. ${sortedScores[i][0]}`
        scoreText.innerText = `${sortedScores[i][1]}`
    }
}

// function displayWinner(result, firstPlayerName, secondPlayerName){
//     winnerFound=true
//     const winningPlayerName = result==="red" ? firstPlayerName.innerText:secondPlayerName.innerText
//     await sendScoreRequest(winningPlayerName, 42-turn)
//     winnerMessage.style.display="initial"
//     highScore = await highScoresJson()
//     result==="red" ? firstPlayerScore.innerText = 42-turn:secondPlayerScore.innerText = 42-turn
//     highScoreBoard.style.display="block"
//     return winnerMessage.innerText = (result==="red" ? firstPlayerName.innerText:secondPlayerName.innerText)+" is the winner!"

// }

async function checkWinner(lowestAvailableRow, colNum, playerColour){
    let colour = (playerColour==="red") ? "yellow" : "red"
    let horizontalResult = checkHorizontal(grid[lowestAvailableRow], lowestAvailableRow, colNum-1)
    let verticalResult = checkVertical(lowestAvailableRow, colNum-1)
    let diagonalResult = checkDiagonal(lowestAvailableRow, colNum-1)
    let highScore

    if (horizontalResult!==false){
        winnerFound=true
        const winningPlayerName = horizontalResult==="red" ? firstPlayerName.innerText:secondPlayerName.innerText
        await sendScoreRequest(winningPlayerName, 42-turn)
        winnerMessage.style.display="initial"
        highScore = await highScoresJson()
        horizontalResult==="red" ? firstPlayerScore.innerText = 42-turn:secondPlayerScore.innerText = 42-turn
        highScoreBoard.style.display="block"
        return winnerMessage.innerText = (horizontalResult==="red" ? firstPlayerName.innerText:secondPlayerName.innerText)+" is the winner!"
    }
    if(verticalResult!==false){
        winnerFound=true
        const winningPlayerName = verticalResult==="red" ? firstPlayerName.innerText:secondPlayerName.innerText
        await sendScoreRequest(winningPlayerName, 42-turn)
        winnerMessage.style.display="initial"
        highScore = await highScoresJson()
        verticalResult==="red" ? firstPlayerScore.innerText = 42-turn:secondPlayerScore.innerText = 42-turn
        highScoreBoard.style.display="block"
        return winnerMessage.innerText = (verticalResult==="red" ? firstPlayerName.innerText:secondPlayerName.innerText)+" is the winner!"
    }
    if(diagonalResult!==false){
        winnerFound=true
        const winningPlayerName = diagonalResult==="red" ? firstPlayerName.innerText:secondPlayerName.innerText
        await sendScoreRequest(winningPlayerName, 42-turn)
        winnerMessage.style.display="initial"
        highScore = await highScoresJson()
        diagonalResult==="red" ? firstPlayerScore.innerText = 42-turn:secondPlayerScore.innerText = 42-turn
        highScoreBoard.style.display="block"
        return winnerMessage.innerText = (diagonalResult==="red" ? firstPlayerName.innerText:secondPlayerName.innerText)+" is the winner!"
    }
}

function getLowestAvailableRowInColumn(columnNumber, myGrid) {
    for (let i = 5; i >= 0; i--) {
        if (myGrid[i][columnNumber - 1] === "white") {
            return i
        }
    }
    return "white";
}

function reset(){
    grid = [                                    
        ["white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white"] 
    ]

    player1 = "red"
    winnerFound = false

    console.log("reset function called")

    updateBoard()

    winnerMessage.innerText="Enter Player 1's Name:"
    winnerMessage.style.display="initial"

    firstPlayerName.innerText=""
    secondPlayerName.innerText=""
    inputField.style.display="initial"
    inputField.value=""
    turn = 0
    firstPlayerScore.innerText = ""
    secondPlayerScore.innerText = ""
    highScoreBoard.style.display="none"
    

}

function updateBoard(){
    for (let i=0; i<6; i++){
        for (let j=0; j<7; j++){
            document.getElementById(`row${i+1}-col${j+1}`).style.backgroundColor = grid[i][j];        
        }
    }
}

function getColourOfCoord(coords){ //coords is an array: [x,y]

    return grid[coords[0]][coords[1]]
}

function checkHorizontal(arr, rowNumber, columnNumber){
    let winningCoords = [[rowNumber, columnNumber]]
    let colour = (player1==="red") ? "yellow" : "red"

    // check all cells to the RIGHT of our current coord
    for (let i=columnNumber+1; i<arr.length; i++){
        if (getColourOfCoord([rowNumber, i])===colour){
            winningCoords.push([rowNumber, i])
        }
        else{
            break
        }
    }
    if (winningCoords.length>=4){
        winnerFound=true
        return colour
    }

    // check all cells to the LEFT of our current coord
    for (let i=columnNumber-1; i>=0; i--){
        if (getColourOfCoord([rowNumber, i])===colour){
            winningCoords.push([rowNumber, i])
        }
            else{
                break
            }
        }

    //if 4 in a row, return winner colour
    if (winningCoords.length>=4){
        winnerFound=true
        return colour
    }else{
        return false
    }

}

function checkVertical(rowNumber, columnNumber){
    let winningCoords = [[rowNumber, columnNumber]]
    let colour = (player1==="red") ? "yellow" : "red"

    // check all cells ABOVE our current coord
    for (let i=rowNumber+1; i<grid.length; i++){
            if (getColourOfCoord([i, columnNumber])===colour){
            winningCoords.push([i, columnNumber])
        }
            else{
                break
            }
        }

    if (winningCoords.length>=4){
        winnerFound=true
        return colour
    }
    //check all cells BELOW our current coord
    for (let i=rowNumber-1; i>=0; i--){
        if (getColourOfCoord([i, columnNumber])===colour){
            winningCoords.push([i, columnNumber])
        }
            else{
                break
            }
        }

    //if 4 in a row, return winner colour
    if (winningCoords.length>=4){
        winnerFound=true
        return colour
    }
    
    return false

}

function checkDiagonal(rowNumber, columnNumber){
    let winningCoords = [[rowNumber, columnNumber]]
    let colour = (player1==="red") ? "yellow" : "red"

    let rowIdx = rowNumber+1
    let colIdx = columnNumber-1
    while(colIdx>=0 && rowIdx<=5){
        if (getColourOfCoord([rowIdx, colIdx])===colour){
            
            winningCoords.push([rowIdx, colIdx])
            
            rowIdx++
            colIdx--}
            else{
                break
            }
    }
    rowIdx = rowNumber-1
    colIdx = columnNumber+1
    while(colIdx<=6 && rowIdx>=0){
        if (getColourOfCoord([rowIdx, colIdx])===colour){
            winningCoords.push([rowIdx, colIdx])
            
            rowIdx--
            colIdx++}
            else{
                break
            }
    }
    //if 4 in a row, return winner colour
    if (winningCoords.length>=4){
        winnerFound=true
        return colour
    }
    winningCoords = [[rowNumber, columnNumber]]
    rowIdx = rowNumber-1
    colIdx = columnNumber-1
    while(colIdx>=0 && rowIdx>=0){
        if (getColourOfCoord([rowIdx, colIdx])===colour){
            winningCoords.push([rowIdx, colIdx])
            
            rowIdx--
            colIdx--}
            else{
                break
            }
    }
    rowIdx = rowNumber+1
    colIdx = columnNumber+1
    while(colIdx<=6 && rowIdx<=5){
        if (getColourOfCoord([rowIdx, colIdx])===colour){
            winningCoords.push([rowIdx, colIdx])
            
            rowIdx++
            colIdx++}
            else{
                break
            }
    }
    //if 4 in a row, return winner colour
    if (winningCoords.length>=4){
        winnerFound=true
        return colour
    }
    else {
        return false
    }

}
