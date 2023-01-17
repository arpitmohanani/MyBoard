

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let penColorElements = document.querySelectorAll(".pen-color");
let penThicknessElement = document.querySelector(".pen-thickness");
let eraserThicknessElement = document.querySelector(".eraser-thickness");
let downloadLogo = document.querySelector(".download");
let redoLogo = document.querySelector(".redo");
let undoLogo = document.querySelector(".undo");


let penColor = "red";
let eraserColor = "white";
let penThicknessValue = penThicknessElement.value;
let eraserThicknessValue = eraserThicknessElement.value;


let undoRedoStack = [];
let track = 0;

let mouseDown = false;

let tool = canvas.getContext("2d");

if (localStorage.getItem("canvas")){
    let img = new Image();
    img.src = localStorage.getItem("canvas");
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}
tool.strokeStyle = penColor;
tool.lineWidth = penThicknessValue;

canvas.addEventListener("mousedown",(e) =>{
    mouseDown = true;
    // beginPath({
    //    x: e.clientX, 
    //    y: e.clientY
    // });
    let data = {
        x: e.clientX, 
        y: e.clientY
    }
    socket.emit("beginPath", data)
})

canvas.addEventListener("mousemove",(e) =>{
    
    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserThicknessValue : penThicknessValue
        }
        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup",(e) =>{
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoStack.push(url);
    track = undoRedoStack.length-1;
    localStorage.setItem("canvas", url);
})


undoLogo.addEventListener("click", (e) => {
    if (track > 0){
        track--;

        let trackObj = {
            trackValue: track,
            undoRedoStack 
        }
        // undoRedoOperation(trackObj);
        socket.emit("redoUndo", trackObj);
    }
})

redoLogo.addEventListener("click", (e) => {
    if (track < undoRedoStack.length-1){
        track++;

        let trackObj = {
            trackValue: track,
            undoRedoStack 
        }
        // undoRedoOperation(trackObj);
        socket.emit("redoUndo", trackObj);
    }
})

function undoRedoOperation(trackObj){
    track = trackObj.trackValue;
    undoRedoStack = trackObj.undoRedoStack;

    let img = new Image();
    img.src = undoRedoStack[track];
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
    // console.log("Logs", strokeObj)
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
    // console.log("Logs2", strokeObj)
}

penColorElements.forEach((colorElement)=>{
    colorElement.addEventListener("click", (e)=>{
        let color = colorElement.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

penThicknessElement.addEventListener("change", (e) =>{
    penThicknessValue = penThicknessElement.value;
    tool.lineWidth = penThicknessValue;
})

eraserThicknessElement.addEventListener("change", (e) =>{
    eraserThicknessValue = eraserThicknessElement.value;
    tool.lineWidth = eraserThicknessValue;
})

eraserLogo.addEventListener("click", (e) => {
    if (eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserThicknessValue;
    }
    else{
        tool.lineWidth = penThicknessValue;
        tool.strokeStyle = penColor;
    }
})

downloadLogo.addEventListener("click", (e) =>{
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "myBoard.jpg";
    a.click();
})


socket.on("beginPath", (data) =>{
    beginPath(data);
})

socket.on("drawStroke", (data) =>{
    drawStroke(data);
})

socket.on("redoUndo", (data) =>{
    undoRedoOperation(data);
})

socket.on("redoUndo", (data) =>{
    undoRedoOperation(data);
})