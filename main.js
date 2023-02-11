const canvas = document.querySelector("canvas") ,
toolButton = document.querySelectorAll(".tool"),
colorPicker = document.querySelector("#color-picker"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-image"),
color8tns = document.querySelectorAll(".colors .option"),
ctx = canvas.getContext("2d");



// global variabels width default value
let prevMouseX , prevMouseY, snapshot,
isDrawing = false;
selectedTool = "brush";
brushWidth = 5;
selectedColor = "#000";


const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillstyle back to the selected color, it will be the brush color
}

window.addEventListener("load" , () => {
    // seting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})

const drawRect = (e) => {
    if(!fillColor.checked) {
       return ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
        
    }

    ctx.fillRect (e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX , prevMouseY, radius , 50, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTraingle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY);
    ctx.lineTo(e.offsetX , e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX , e.offsetY);
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawRuler = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX , e.offsetY);
    ctx.stroke();
}
    
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing currentmouseX position as prevMouseX value
    prevMouseY = e.offsetY; //passing current mouseY position as prevMouseY value

    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // its become brush witdj style
    ctx.strokeStyle = selectedColor; // passing selector as storke style
    ctx.fillStyle = selectedColor; // passing as fill style
    // copying canvas data and passingas snapshot value. this avoids deagging the image
    snapshot = ctx.getImageData(0 , 0 , canvas.width , canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot , 0 , 0);
    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX , e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing line with color
    }else if (selectedTool === "rectangle") {
        drawRect(e);
    }else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "ruler") {
        drawRuler(e);
    }
    else {
        drawTraingle(e);
    }
}

toolButton.forEach(btn => {
    btn.addEventListener("click" , () => {
        document.querySelector(".options .active").classList.remove('active');
        btn.classList.add('active')
        selectedTool = btn.id
        console.log(selectedTool)
    })
})

sizeSlider.addEventListener("change" , () => brushWidth = sizeSlider.value);

color8tns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove('selected');
        btn.classList.add('selected')
         selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener("change" , () => {
    //passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click(); 
})

saveImage.addEventListener("click" , () => {
    const link = document.createElement("a"); // create <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvas data as link href value
    link.click(); // clicking link to download image
});

clearCanvas.addEventListener("click" , () => {
    ctx.clearRect(0 , 0 , canvas.width , canvas.height); // clearing whole canvas
    setCanvasBackground();
});

canvas.addEventListener("mousedown" , startDraw);
canvas.addEventListener("mousemove" , drawing);
canvas.addEventListener("mouseup" , () => isDrawing = false);


