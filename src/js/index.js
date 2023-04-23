console.log('그림판');
    
class DrawingBoard {
    MODE = "NONE" //None Brush Eraser
    IsMouseDown = false;
    eraserColor = "#ffffff";
    backgroundColor = "#ffffff";
    constructor() {
        this.assignElement();
        this.initContext();
        this.initCanvasBackground();
        this.addEvent();
    }

    assignElement() {
        this.containerEl = document.getElementById("container");
        this.canvasEl = this.containerEl.querySelector("#canvas");
        this.toolbarEl = this.containerEl.querySelector("#toolbar");
        this.brushEl = this.toolbarEl.querySelector("#brush");
        this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
        this.brushPanelEl = this.containerEl.querySelector('#brushPanel');
        this.brushSliderEl = this.brushPanelEl.querySelector('#brushSize');
        this.brushSizePreviewEl = this.brushPanelEl.querySelector("#brushSizePreview")
        this.eraserEl = this.toolbarEl.querySelector("#eraser");
    }

    initContext() {
        this.context = this.canvasEl.getContext("2d");
    }

    initCanvasBackground() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    addEvent() {
        this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
        this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.brushSliderEl.addEventListener("input", this.onChangeBrushSize.bind(this));
        this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
        this.eraserEl.addEventListener("click", this.onClickEraser.bind(this));
    }

    onClickEraser(event) {
        const IsActive = event.currentTarget.classList.contains("active");
        this.MODE = IsActive ? "NONE" : "ERASER";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        this.brushPanelEl.classList.add("hide");
        this.eraserEl.classList.toggle("active");
        this.brushEl.classList.remove("active");
    }

    onMouseOut() {
        if(this.MODE === "NONE") return;
        this.IsMouseDown = false;
    }

    onChangeColor(event) {
        this.brushSizePreviewEl.style.background = event.target.value;
    }

    onChangeBrushSize(event) {
        this.brushSizePreviewEl.style.width = `${event.target.value}px`;
        this.brushSizePreviewEl.style.height = `${event.target.value}px`;
    }

    onMouseUp(event) {
        if(this.MODE === "NONE") return;
        this.IsMouseDown = false;
    }

    onMouseMove(event) {
        if(!this.IsMouseDown) return ;
        const currentPosition = this.getMousePoistion(event);
        this.context.lineTo(currentPosition.x, currentPosition.y); //라인을 움직여 줘
        this.context.stroke(); //라인을 그려줘
    }

    onMouseDown(event) {
        if(this.MODE === "NONE") return;
        this.IsMouseDown = true;
        const currentPosition = this.getMousePoistion(event);
        this.context.beginPath(); //path를 시작하겠다.
        this.context.moveTo(currentPosition.x, currentPosition.y);
        this.context.lineCap = "round"; //라인 선을 둥글게
        if(this.MODE === "BRUSH") {
            this.context.strokeStyle = this.colorPickerEl.value;
            this.context.lineWidth = this.brushSliderEl.value; //라인 두께
        } else if(this.MODE === "ERASER") {
            this.context.strokeStyle = this.eraserColor;
            this.context.lineWidth = 50
        }
        console.log('onMouseDown');
    }

    getMousePoistion(event) {
        // getBoundingClientRect
        const boundaries = this.canvasEl.getBoundingClientRect();
        return {
            x: event.clientX - boundaries.left,
            y: event.clientY - boundaries.top,
        }
    }

    onClickBrush(event) {
        const IsActive = event.currentTarget.classList.contains("active");
        this.MODE = IsActive ? "NONE" : "BRUSH";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        this.brushPanelEl.classList.toggle("hide");
        this.brushEl.classList.toggle("active");
        this.eraserEl.classList.remove("active");
        console.log('onClickBrush:'+this.canvasEl.style.cursor);
    }
}

new DrawingBoard();