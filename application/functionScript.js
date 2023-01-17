let functionContainer = document.querySelector(".functions-container");
let toolsContainer = document.querySelector(".tools-container");
let penCustomizeContainer = document.querySelector(".pen-customize-container");
let eraserCustomizeContainer = document.querySelector(".eraser-size-container");
let penLogo = document.querySelector(".pen");
let eraserLogo = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky-note");
let upload = document.querySelector(".upload");
// let save = document.querySelector(".save");

let penFlag = false;
let eraserFlag = false;
let sizeOptions = true;

functionContainer.addEventListener("click",(e) =>  {
    sizeOptions = !sizeOptions;

    if(sizeOptions){
        let optionLogo = functionContainer.children[0];
        optionLogo.classList.remove("fa-xmark");
        optionLogo.classList.add("fa-bars-staggered");
        toolsContainer.style.display = "flex";

    }
    else{
        let optionLogo = functionContainer.children[0];
        optionLogo.classList.remove("fa-bars-staggered");
        optionLogo.classList.add("fa-xmark");
        toolsContainer.style.display = "none";
        
        penCustomizeContainer.style.display = "none";
        eraserCustomizeContainer.style.display = "none";
    }

})

penLogo.addEventListener("click", (e) =>{
    penFlag = !penFlag;

    if (penFlag){
        penCustomizeContainer.style.display = "block";
    }
    else{
        penCustomizeContainer.style.display = "none";
    }
})

eraserLogo.addEventListener("click", (e) =>{
    eraserFlag = !eraserFlag;

    if (eraserFlag){
        eraserCustomizeContainer.style.display = "flex";
    }
    else{
        eraserCustomizeContainer.style.display = "none";
    }
})

sticky.addEventListener("click",(e) =>{
    let stickyContainer = document.createElement("div")
    stickyContainer.setAttribute("class","sticky-notes-container")
    stickyContainer.innerHTML = `
        <div class="sticky-notes-header-container">
            <div class="minimize-note"></div>
                <div class="remove-note"></div>
            </div>
        <div class="notes-text-container">
            <textarea spellcheck="false"></textarea>
        </div>
    `;

    document.body.appendChild(stickyContainer)

    let minimize_button = stickyContainer.querySelector(".minimize-note");
    let remove_button = stickyContainer.querySelector(".remove-note");

    stickyNoteActions(minimize_button, remove_button, stickyContainer)

    stickyContainer.onmousedown = function(event) {
        dragNDrop(stickyContainer, event);
    };

    stickyContainer.ondragstart = function() {
        return false;
    };
})



upload.addEventListener("click",(e)=>{
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change",(e)=>{
        let selected_file = input.files[0];
        let url = URL.createObjectURL(selected_file);

        let stickyContainer = document.createElement("div")
        stickyContainer.setAttribute("class","sticky-notes-container")
        stickyContainer.innerHTML = `
        <div class="sticky-notes-header-container">
            <div class="minimize-note"></div>
                <div class="remove-note"></div>
            </div>
        <div class="notes-text-container">
            <img src = "${url}"/>
        </div>
        `;

    document.body.appendChild(stickyContainer)

    let minimize_button = stickyContainer.querySelector(".minimize-note");
    let remove_button = stickyContainer.querySelector(".remove-note");

    stickyNoteActions(minimize_button, remove_button, stickyContainer)

    stickyContainer.onmousedown = function(event) {
        dragNDrop(stickyContainer, event);
    };

    stickyContainer.ondragstart = function() {
        return false;
    };

    })

})

function stickyNoteActions(minimize, remove, stickyContainer){
    remove.addEventListener("click",(e) => {
        stickyContainer.remove();
    })

    minimize.addEventListener("click",(e) => {
        let noteContainer = stickyContainer.querySelector(".notes-text-container")
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        if(display == "none"){
            noteContainer.style.display = "block";
        }
        else{
            noteContainer.style.display = "none";
        }
    })
}

function dragNDrop(element, event){
    
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
      
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
      
    moveAt(event.pageX, event.pageY);
      
    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
      
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
      
    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);
      
    // drop the element, remove unneeded handlers
    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };  
}