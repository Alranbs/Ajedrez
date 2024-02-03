let boardContainer = document.getElementById('board-container-id');
const textBox = document.querySelector('.text-box');
let currentPlayer = 'whiteP';
let currentPlayerText = 'White';
let lastMoveSquareId;

const board = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn,pawn, pawn, pawn, pawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn, pawn, pawn, pawn,pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function newGame(){
    let allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => {
        square.remove();
    });

    currentPlayer = 'whiteP';
    currentPlayerText = 'White';
    closeWinScreen();
    clearPiecesTaken();
    createBoard();
    setClickListeners();
    scanBoard();
    textBox.innerHTML = '<h3>Current Player: White</h3>';

}

function createBoard(){
    board.forEach((piece, i) => {
        let square = document.createElement('div');
        square.classList.add('square');
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('drop', dragDrop);
        square.addEventListener('click', removeHighlights);
        square.innerHTML = piece;
        square.firstChild && square.firstChild.setAttribute('draggable', true)
        square.setAttribute('square-id', i);
        console.log(square);
        const row = Math.floor( (63 - i) / 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? 'white' : 'black')
        } else {
            square.classList.add(i % 2 === 0 ? 'black' : 'white')
        }
        if (i <= 15) {
            square.firstChild.firstChild.classList.add('blackP');
            square.firstChild.firstChild.setAttribute('piece-id', i);
        }

        if (i >= 48){
            square.firstChild.firstChild.classList.add('whiteP');
            square.firstChild.firstChild.setAttribute('piece-id', i - 32);
        }
        boardContainer.appendChild(square);

    });
}

createBoard();
setClickListeners();
scanBoard();

let currentPosition = 0;
let pieceId = 0;
let draggedElement = '';
let targetSquareId = 0;
let targetElement = '';
let targetPiece;
let targetPieceColor;

function dragStart(e){
    selectPiece(e);
    currentPosition = e.target.parentNode.getAttribute('square-id');
    pieceId = e.target.firstChild.getAttribute('piece-id')
    draggedElement = e.target;
    console.log('Piece Id')
    console.log(pieceId);
    console.log('Square Id')
    console.log(currentPosition);
    console.log('Dragging');
    console.log(draggedElement);
}

function dragOver(e){
    e.preventDefault();
}

function dragDrop(e){
    e.stopPropagation();
    removeHighlights();
    targetElement = e.target;
    console.log('Lookin here');
    console.log(targetElement);
    const correctPlayer = draggedElement.firstChild.classList.contains(currentPlayer);
    if(correctPlayer){
        if(targetElement.firstChild){
            targetSquareId = Number(e.target.parentNode.getAttribute('square-id'));
            if(checkIFValidMovement(pieceId, targetSquareId)){
                targetElement.parentNode.appendChild(draggedElement);
                targetPiece = targetElement.firstChild;
                console.log('LOOK HERE');
                console.log(targetPiece);
                if(targetPiece.classList.contains('blackP')){
                    document.getElementById('whitePieces').appendChild(targetPiece);
                    console.log(document.getElementById('whitePieces'));
                }
                else{
                    document.getElementById('blackPieces').appendChild(targetPiece);
                    console.log(document.getElementById('blackPieces'));
                }
                if(targetElement.getAttribute('id') === 'king'){
                    if(currentPlayer === 'blackP'){
                        openWinScreen();
                    }
                    else{
                        openWinScreen();
                    }
                }
                else{
                    targetElement.remove();
                    if(checkForPromotion(draggedElement.getAttribute('id'), currentPlayer, targetSquareId)){
    
                    }
                    else{
                        changePlayer();
                        scanBoard();
                    }
                }
            }
            else{
                textBox.innerHTML = 'Invalid move';
                setTimeout(() => textBox.innerHTML = `Current Player:${currentPlayerText}`, 2000);
            }

        }
        else{
            targetSquareId = Number(e.target.getAttribute('square-id'));
            console.log('TARGET SQUARE ID');
            console.log(targetSquareId);
            if(checkIFValidMovement(pieceId, targetSquareId)){
                targetElement.appendChild(draggedElement);
                if(checkForPromotion(draggedElement.getAttribute('id'), currentPlayer, targetSquareId)){
    
                }
                else{
                    changePlayer();
                    scanBoard();
                }
            }
            else{
                textBox.innerHTML = 'Invalid move';
                setTimeout(() => textBox.innerHTML = `Current Player:${currentPlayerText}`, 2000);
            }
        }
        console.log('Target');
        console.log(e.target);
    }
    else{
        textBox.innerHTML = 'Its not your turn';
        setTimeout(() => textBox.innerHTML = `Current Player:${currentPlayerText}`, 2000);
    }

}

function scanBoard(){
    const allSquares = document.querySelectorAll('.square');
    AllMovements.forEach(movements =>{
        movements.length = 0;
    })
    console.log('Separation');
    allSquares.forEach(squareI => {
        if(squareI.firstChild){
            let currentId = squareI.getAttribute('square-id');
            let pieceName = squareI.firstChild.getAttribute('id');
            let pieceId = squareI.firstChild.firstChild.getAttribute('piece-id');
            let currentPieceColor = squareI.firstChild.firstChild.getAttribute('class');
            let currentRow = Math.floor((currentId/8) + 1);
            let remainingRowsAhead = 8 - currentRow;
            let remainingRowsBehind = currentRow - 1;
            let remainingColumnsAhead = ((currentRow * 8) - currentId) - 1;
            let remainingColumnsBehind = 7 - remainingColumnsAhead;
            let columsORRowsRemaining = 0;
            
            switch (pieceName){
                case 'pawn':
                    const initialPositionBlack = [8,9,10,11,12,13,14,15];
                    const initialPositionWhite = [48,49,50,51,52,53,54,55];
                    if(initialPositionBlack.includes(Number(currentId))){
                        //console.log(currentId);
                        for(let i = 1; i < 3; i++){
                            let targetSquareId = Number(currentId) + (8 * i);
                            let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                            if(targetSquare.firstChild){
                                let targetPieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                                //console.log(targetPieceColor);
                                break;
                            }
                            else{
                                AllMovements[pieceId].push(targetSquareId);
                            }

                            //console.log(targetSquare);
                        }

                    }
                    if(currentPieceColor == 'blackP'){
                        let targetSquareId = Number(currentId) + 8;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(!targetSquare.firstChild){
                            AllMovements[pieceId].push(targetSquareId);
                        }

                        let targetSquareIdLeft = Number(currentId) + (8 - 1);
                        let targetSquareIdRight = Number(currentId) + (8 + 1);
                        let targetSquareLeft = document.querySelector(`[square-id="${targetSquareIdLeft}"]`);
                        let targetSquareRight = document.querySelector(`[square-id="${targetSquareIdRight}"]`);

                        if(targetSquareLeft.firstChild){
                            let targetPieceLeftColor = targetSquareLeft.firstChild.firstChild.getAttribute('class');
                            if(targetPieceLeftColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdLeft);
                                //console.log(targetSquareLeft);
                            }
                        }
                        if(targetSquareRight.firstChild){
                            let targetPieceRightColor = targetSquareRight.firstChild.firstChild.getAttribute('class');
                            if(targetPieceRightColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdRight);
                                //console.log(targetSquareRight);
                            }
                        }
                    }
                    if(initialPositionWhite.includes(Number(currentId))){
                        //console.log(currentId);
                        for(let i = 1; i < 3; i++){
                            let targetSquareId = Number(currentId) - (8 * i);
                            let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                            if(targetSquare.firstChild){
                                let targetPieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                                //console.log(targetPieceColor);
                                break;
                            }
                            else{
                                AllMovements[pieceId].push(targetSquareId);
                            }
                           // console.log(targetSquare);
                            }
                    }

                    if(currentPieceColor == 'whiteP'){
                        let targetSquareId = Number(currentId) - 8;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(!targetSquare.firstChild){
                                AllMovements[pieceId].push(targetSquareId);
                        }

                        let targetSquareIdLeft = Number(currentId) - (8 - 1);
                        let targetSquareIdRight = Number(currentId) - (8 + 1);
                        let targetSquareLeft = document.querySelector(`[square-id="${targetSquareIdLeft}"]`);
                        let targetSquareRight = document.querySelector(`[square-id="${targetSquareIdRight}"]`);


                        if(targetSquareLeft.firstChild){
                            let targetPieceLeftColor = targetSquareLeft.firstChild.firstChild.getAttribute('class');
                            if(targetPieceLeftColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdLeft);
                                //console.log(targetSquareLeft);
                            }
                        }
                        if(targetSquareRight.firstChild){
                            let targetPieceRightColor = targetSquareRight.firstChild.firstChild.getAttribute('class');
                            if(targetPieceRightColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdRight);
                                //console.log(targetSquareRight);
                            }
                        }
                    }
                    break;
                case 'knight':
                    let targetSquareDownLeftId = Number(currentId) + ((8 * 2) - 1);
                    if(targetSquareDownLeftId < 64 && targetSquareDownLeftId > 0 && remainingRowsAhead >= 2 && remainingColumnsBehind >= 1){
                        let targetSquareDownLeft = document.querySelector(`[square-id="${targetSquareDownLeftId}"]`);
                        if(targetSquareDownLeft.firstChild){
                            let targetSquareDownLeftPieceColor = targetSquareDownLeft.firstChild.firstChild.getAttribute('class');
                            if(targetSquareDownLeftPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareDownLeftId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareDownLeftId);
                        }
                    }

                    let targetSquareDownRightId = Number(currentId) + ((8 * 2) + 1);
                    if(targetSquareDownRightId < 64 && targetSquareDownRightId > 0 && remainingRowsAhead >= 2 && remainingColumnsAhead >= 1){
                        let targetSquareDownRight = document.querySelector(`[square-id="${targetSquareDownRightId}"]`);
                        if(targetSquareDownRight.firstChild){
                            let targetSquareDownRightPieceColor = targetSquareDownRight.firstChild.firstChild.getAttribute('class');
                            if(targetSquareDownRightPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareDownRightId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareDownRightId);
                        }
                    }

                    let targetSquareUpLeftId = Number(currentId) - (8 * 2) - 1;
                    if(targetSquareUpLeftId < 64 && targetSquareUpLeftId >= 0 && remainingRowsBehind >= 2 && remainingColumnsBehind >= 1 ){
                        let targetSquareUpLeft = document.querySelector(`[square-id="${targetSquareUpLeftId}"]`);
                        if(targetSquareUpLeft.firstChild){
                            let targetSquareUpLeftPieceColor = targetSquareUpLeft.firstChild.firstChild.getAttribute('class');
                            if(targetSquareUpLeftPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareUpLeftId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareUpLeftId);
                        }
 
                    }

                    let targetSquareUpRightId = Number(currentId) - (8 * 2) + 1;
                    if(targetSquareUpRightId < 64 && targetSquareUpRightId >= 0 && remainingRowsBehind >= 2 && remainingColumnsAhead >= 1 ){
                        let targetSquareUpRight = document.querySelector(`[square-id="${targetSquareUpRightId}"]`);
                        if(targetSquareUpRight.firstChild){
                            let targetSquareUpRightPieceColor = targetSquareUpRight.firstChild.firstChild.getAttribute('class');
                            if(targetSquareUpRightPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareUpRightId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareUpRightId);
                        }
                      
                    }

                    let targetSquareLeftUpId = Number(currentId) - 2 - 8;
                    if(targetSquareLeftUpId < 64 && targetSquareLeftUpId >= 0 && remainingRowsBehind >= 1 && remainingColumnsBehind >= 2){
                        let targetSquareLeftUp = document.querySelector(`[square-id="${targetSquareLeftUpId}"]`);
                        if(targetSquareLeftUp.firstChild){
                            let targetSquareLeftUpPieceColor = targetSquareLeftUp.firstChild.firstChild.getAttribute('class');
                            if(targetSquareLeftUpPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareLeftUpId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareLeftUpId);
                        }
                    }

                    let targetSquareLeftDownId = Number(currentId) - 2 + 8;
                    if(targetSquareLeftDownId < 64 && targetSquareLeftDownId >= 0 && remainingRowsAhead >= 1 && remainingColumnsBehind >= 2){
                        let targetSquareLeftDown = document.querySelector(`[square-id="${targetSquareLeftDownId}"]`);
                        if(targetSquareLeftDown.firstChild){
                            let targetSquareLeftDownPieceColor = targetSquareLeftDown.firstChild.firstChild.getAttribute('class');
                            if(targetSquareLeftDownPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareLeftDownId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareLeftDownId);
                        }
                    }


                    let targetSquareRightUpId = Number(currentId) + 2 - 8;
                    if(targetSquareRightUpId < 64 && targetSquareRightUpId >= 0 && remainingRowsBehind >= 1 && remainingColumnsAhead >= 2){
                        let targetSquareRightUp = document.querySelector(`[square-id="${targetSquareRightUpId}"]`);
                        if(targetSquareRightUp.firstChild){
                            let targetSquareRightUpPieceColor = targetSquareRightUp.firstChild.firstChild.getAttribute('class');
                            if(targetSquareRightUpPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareRightUpId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareRightUpId);
                        }
                    }


                    let targetSquareRightDownId = Number(currentId) + 2 + 8;
                    if(targetSquareRightDownId < 64 && targetSquareRightDownId >= 0 && remainingRowsAhead >= 1 && remainingColumnsAhead >= 2){
                        let targetSquareRightDown = document.querySelector(`[square-id="${targetSquareRightDownId}"]`);
                        if(targetSquareRightDown.firstChild){
                            let targetSquareRightDownPieceColor = targetSquareRightDown.firstChild.firstChild.getAttribute('class');
                            if(targetSquareRightDownPieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareRightDownId);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareRightDownId);
                        }
                    }
                    break;
                case 'bishop':
                    //Left Up Movements

                    if(remainingColumnsAhead < remainingRowsBehind){
                        columsORRowsRemaining = remainingColumnsAhead;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsBehind;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) - (8 * i) + i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    //Left Down Movements

                    if(remainingColumnsAhead < remainingRowsAhead){
                        columsORRowsRemaining = remainingColumnsAhead;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsAhead;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) + (8 * i) + i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    
                    //Right Up Movements

                    if(remainingColumnsBehind < remainingRowsBehind){
                        columsORRowsRemaining = remainingColumnsBehind;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsBehind;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) - (8 * i) - i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Right Down Movements

                    if(remainingColumnsBehind < remainingRowsAhead){
                        columsORRowsRemaining = remainingColumnsBehind;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsAhead;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) + (8 * i) - i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    break;
                case 'rook':
                    //Right Movement
                    for(let i = 1; i <= remainingColumnsAhead; i++){
                        let targetSquareId = Number(currentId) + i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Left Movement
                    for(let i = 1; i <= remainingColumnsBehind; i++){
                        let targetSquareId = Number(currentId) - i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Up Movement
                    for(let i = 1; i <= remainingRowsBehind; i++){
                        let targetSquareId = Number(currentId) - (8 * i);
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Down Movement
                    for(let i = 1; i <= remainingRowsAhead; i++){
                        let targetSquareId = Number(currentId) + (8 * i);
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    break;
                case 'queen':
                    //Right Movement
                    for(let i = 1; i <= remainingColumnsAhead; i++){
                        let targetSquareId = Number(currentId) + i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Left Movement
                    for(let i = 1; i <= remainingColumnsBehind; i++){
                        let targetSquareId = Number(currentId) - i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Up Movement
                    for(let i = 1; i <= remainingRowsBehind; i++){
                        let targetSquareId = Number(currentId) - (8 * i);
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Down Movement
                    for(let i = 1; i <= remainingRowsAhead; i++){
                        let targetSquareId = Number(currentId) + (8 * i);
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Left Up Movements

                    if(remainingColumnsAhead < remainingRowsBehind){
                        columsORRowsRemaining = remainingColumnsAhead;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsBehind;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) - (8 * i) + i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    //Left Down Movements

                    if(remainingColumnsAhead < remainingRowsAhead){
                        columsORRowsRemaining = remainingColumnsAhead;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsAhead;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) + (8 * i) + i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    
                    //Right Up Movements

                    if(remainingColumnsBehind < remainingRowsBehind){
                        columsORRowsRemaining = remainingColumnsBehind;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsBehind;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) - (8 * i) - i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }

                    //Right Down Movements

                    if(remainingColumnsBehind < remainingRowsAhead){
                        columsORRowsRemaining = remainingColumnsBehind;
                    }
                    else{
                        columsORRowsRemaining = remainingRowsAhead;
                    }

                    for(let i = 1; i <= columsORRowsRemaining; i++){
                        let targetSquareId = Number(currentId) + (8 * i) - i;
                        let targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
                        if(targetSquare.firstChild){
                            let targetSquarePieceColor = targetSquare.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareId);
                            }
                            break;
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareId);
                        }
                    }
                    break;   
                case 'king':
                    //Right Movement

                    if(remainingColumnsAhead >= 1){
                        let targetSquareIdRight = Number(currentId) + 1;
                        let targetSquareRight = document.querySelector(`[square-id="${targetSquareIdRight}"]`)
                        if(targetSquareRight.firstChild){
                            let targetSquarePieceColor = targetSquareRight.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdRight);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdRight);
                        }
                    }

                    //Left Movement

                    if(remainingColumnsBehind >= 1){
                        let targetSquareIdLeft = Number(currentId) - 1;
                        let targetSquareLeft = document.querySelector(`[square-id="${targetSquareIdLeft}"]`)
                        if(targetSquareLeft.firstChild){
                            let targetSquarePieceColor = targetSquareLeft.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdLeft);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdLeft);
                        }
                    }

                    //Up Movement

                    if(remainingRowsBehind >= 1){
                        let targetSquareIdUp = Number(currentId) - 8;
                        let targetSquareUp = document.querySelector(`[square-id="${targetSquareIdUp}"]`)
                        if(targetSquareUp.firstChild){
                            let targetSquarePieceColor = targetSquareUp.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdUp);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdUp);
                        }
                    }

                    //Down Movement

                    if(remainingRowsAhead >= 1){
                        let targetSquareIdDown = Number(currentId) + 8;
                        let targetSquareDown = document.querySelector(`[square-id="${targetSquareIdDown}"]`)
                        if(targetSquareDown.firstChild){
                            let targetSquarePieceColor = targetSquareDown.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdDown);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdDown);
                        }
                    }

                    //Up Left Movement

                    if(remainingRowsBehind >= 1 && remainingColumnsBehind >= 1){
                        let targetSquareIdUpLeft = Number(currentId) - 8 - 1;
                        let targetSquareUpLeft = document.querySelector(`[square-id="${targetSquareIdUpLeft}"]`)
                        if(targetSquareUpLeft.firstChild){
                            let targetSquarePieceColor = targetSquareUpLeft.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdUpLeft);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdUpLeft);
                        }
                    }
                    
                    //Up Right Movement

                    if(remainingRowsBehind >= 1 && remainingColumnsAhead >= 1){
                        let targetSquareIdUpRight = Number(currentId) - 8 + 1;
                        let targetSquareUpRight = document.querySelector(`[square-id="${targetSquareIdUpRight}"]`)
                        if(targetSquareUpRight.firstChild){
                            let targetSquarePieceColor = targetSquareUpRight.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdUpRight);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdUpRight);
                        }
                    }

                    //Down Left Movement

                    if(remainingRowsAhead >= 1 && remainingColumnsBehind >= 1){
                        let targetSquareIdDownLeft = Number(currentId) + 8 - 1;
                        let targetSquareDownLeft = document.querySelector(`[square-id="${targetSquareIdDownLeft}"]`)
                        if(targetSquareDownLeft.firstChild){
                            let targetSquarePieceColor = targetSquareDownLeft.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdDownLeft);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdDownLeft);
                        }
                    }

                    //Down Right Movement

                    if(remainingRowsAhead >= 1 && remainingColumnsAhead >= 1){
                        let targetSquareIdDownRight = Number(currentId) + 8 + 1;
                        let targetSquareDownRight = document.querySelector(`[square-id="${targetSquareIdDownRight}"]`)
                        if(targetSquareDownRight.firstChild){
                            let targetSquarePieceColor = targetSquareDownRight.firstChild.firstChild.getAttribute('class');
                            if(targetSquarePieceColor != currentPieceColor){
                                AllMovements[pieceId].push(targetSquareIdDownRight);
                            }
                        }
                        else{
                            AllMovements[pieceId].push(targetSquareIdDownRight);
                        }
                    }
                    break;                 
            }
            


        }
    })
    console.log(AllMovements);
}

function setClickListeners(){
    let allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => {
        if(square.firstChild){
            square.firstChild.addEventListener('click', selectPiece);
        }
    });
}

function checkIFValidMovement(pieceId, targetSquareId){

    if(AllMovements[pieceId].includes(targetSquareId)){
        console.log('Im working');
        return true
    }
    return false;
}

function removeHighlights(){
    let allHighlights = document.querySelectorAll('.highlight');
    allHighlights.forEach(element => {
        element.classList.remove('highlight');
    });

}

function selectPiece(e){
    e.stopPropagation();
    removeHighlights();
    let pieceId = e.target.firstChild.getAttribute('piece-id');
    let availableMoves = AllMovements[pieceId];
    availableMoves.forEach(nextSquareId => {
        let highlightedSquare = document.querySelector(`[square-id="${nextSquareId}"]`)
        highlightedSquare.classList.add('highlight');
        console.log('Highlights');
        console.log(highlightedSquare);
    });
    console.log(e.target);
}

function changePlayer(){
    if(currentPlayer === 'whiteP'){
        currentPlayer = 'blackP';
        currentPlayerText = 'Black';
        textBox.innerHTML = '<h3>Current Player: Black</h3>';
    }
    else{
        currentPlayer = 'whiteP';
        currentPlayerText = 'White';
        textBox.innerHTML = '<h3>Current Player: White</h3>';
    }
}

function openPromotionBox(color){
    let modal = document.querySelector('.modal');
    let promotionBox = document.querySelector('.promotion-box')
    promotionBox.style.fill = color;
    console.log('Im modal');
    console.log(modal);
    modal.classList.add('open');
    modal.style.zIndex = '10';
}

function closePromotionBox(){
    let modal = document.querySelector('.modal');
    modal.classList.remove('open');
    modal.style.zIndex = '-10';
}

function openWinScreen(){
    let winScreen = document.querySelector('.win-screen');
    let content = document.querySelector('.win-screen-content');
    winScreen.classList.add('open');
    content.innerHTML = `<h1>${currentPlayerText} winner</h1><button onclick="newGame()">New Game</button>`;
    winScreen.style.zIndex = '10';
}

function closeWinScreen(){
    let winScreen = document.querySelector('.win-screen');
    winScreen.classList.remove('open');
    winScreen.style.zIndex = '-10';
}

function checkForPromotion(piece, color, squareId){

    let promotionBlack = [56, 57, 58 , 59, 60, 61, 62, 63];
    let promotionWhite = [0, 1, 2, 3, 4, 5, 6, 7];
    if(piece === 'pawn'){
        if(currentPlayer === 'whiteP'){
            if(promotionWhite.includes(squareId)){
                openPromotionBox('white');
                lastMoveSquareId = squareId;
                return true;
            }
        }
        else{
            if(promotionBlack.includes(squareId)){
                openPromotionBox('black');
                lastMoveSquareId = squareId;
                return true;
            }
        }
    }
    return false;
}

function promotePawn(option){
    let currentSquare;
    switch(option){
        case 'knight':
            currentSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
            console.log('Summon Knight');
            console.log(currentSquare);
            currentSquare.innerHTML = `<div class="piece" id="knight"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${currentPlayer}" piece-id="${pieceId}"><title>chess-knight</title><path d="M19,22H5V20H19V22M13,2V2C11.75,2 10.58,2.62 9.89,3.66L7,8L9,10L11.06,8.63C11.5,8.32 12.14,8.44 12.45,8.9C12.47,8.93 12.5,8.96 12.5,9V9C12.8,9.59 12.69,10.3 12.22,10.77L7.42,15.57C6.87,16.13 6.87,17.03 7.43,17.58C7.69,17.84 8.05,18 8.42,18H17V6A4,4 0 0,0 13,2Z" /></svg></div>`;
            draggedElement.remove();
            currentSquare.addEventListener('click', selectPiece);
            currentSquare.firstChild.setAttribute('draggable', true);
            closePromotionBox();
            changePlayer();
            scanBoard();
            break;
        case 'bishop':
            currentSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
            console.log('Summon Bishop');
            console.log(currentSquare);
            currentSquare.innerHTML = `<div class="piece" id="bishop"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${currentPlayer}" piece-id="${pieceId}"><title>chess-bishop</title><path d="M19,22H5V20H19V22M17.16,8.26C18.22,9.63 18.86,11.28 19,13C19,15.76 15.87,18 12,18C8.13,18 5,15.76 5,13C5,10.62 7.33,6.39 10.46,5.27C10.16,4.91 10,4.46 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.46 13.84,4.91 13.54,5.27C14.4,5.6 15.18,6.1 15.84,6.74L11.29,11.29L12.71,12.71L17.16,8.26Z" /></svg></div>`;
            draggedElement.remove();
            currentSquare.addEventListener('click', selectPiece);
            currentSquare.firstChild.setAttribute('draggable', true);
            closePromotionBox();
            changePlayer();
            scanBoard();
            break;
        case 'rook':
            currentSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
            console.log('Summon Rook');
            console.log(currentSquare);
            currentSquare.innerHTML = `<div class="piece" id="rook"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${currentPlayer}" piece-id="${pieceId}"><title>chess-rook</title><path d="M5,20H19V22H5V20M17,2V5H15V2H13V5H11V2H9V5H7V2H5V8H7V18H17V8H19V2H17Z" /></svg></div>`;
            draggedElement.remove();
            currentSquare.addEventListener('click', selectPiece);
            currentSquare.firstChild.setAttribute('draggable', true);
            closePromotionBox();
            changePlayer();
            scanBoard();
            break;
        case 'queen':
            currentSquare = document.querySelector(`[square-id="${targetSquareId}"]`);
            console.log('Summon Rook');
            console.log(currentSquare);
            currentSquare.innerHTML = `<div class="piece" id="queen"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${currentPlayer}" piece-id="${pieceId}"><title>chess-queen</title><path d="M18,3A2,2 0 0,1 20,5C20,5.81 19.5,6.5 18.83,6.82L17,13.15V18H7V13.15L5.17,6.82C4.5,6.5 4,5.81 4,5A2,2 0 0,1 6,3A2,2 0 0,1 8,5C8,5.5 7.82,5.95 7.5,6.3L10.3,9.35L10.83,5.62C10.33,5.26 10,4.67 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.67 13.67,5.26 13.17,5.62L13.7,9.35L16.47,6.29C16.18,5.94 16,5.5 16,5A2,2 0 0,1 18,3M5,20H19V22H5V20Z" /></svg></div>`;
            draggedElement.remove();
            currentSquare.addEventListener('click', selectPiece);
            currentSquare.firstChild.setAttribute('draggable', true);
            closePromotionBox();
            changePlayer();
            scanBoard();
            break;
    }

}

function clearPiecesTaken(){
    let whiteSide = document.getElementById('whitePieces');
    let blackSide = document.getElementById('blackPieces');
    whiteSide.innerHTML = '<h1>White</h1>';
    blackSide.innerHTML = '<h1>Black</h1>';
}