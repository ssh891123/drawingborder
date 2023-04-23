class DrawingBoard {
    MODE = "NONE" //None Brush Eraser
    IsMouseDown = false;
    eraserColor = "#ffffff";
    backgroundColor = "#ffffff";
    IsNavigatorVisible = false; //안 보일때 navigator image가 업데이트 되지 않도록
    undoArray = [];

    containerEl;
    canvasEl;
    toolbarEl;
    brushEl;
    colorPickerEl;
    brushPanelEl;
    brushSliderEl;
    brushSizePreviewEl;
    eraserEl;
    navigatorEl;
    navigatorImageContainerEl;
    navigatorImageEl;
    undoEl;
    clearEl;
    downloadLinkEl;

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
        this.navigatorEl = this.toolbarEl.querySelector("#navigator");
        this.navigatorImageContainerEl = this.containerEl.querySelector('#imgNav');
        this.navigatorImageEl = this.navigatorImageContainerEl.querySelector('#canvasImg');
        this.undoEl = this.toolbarEl.querySelector("#undo");
        this.clearEl = this.toolbarEl.querySelector("#clear");
        this.downloadLinkEl = this.toolbarEl.querySelector("#download");
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
        this.navigatorEl.addEventListener("click", this.onClickNavigator.bind(this));
        this.undoEl.addEventListener("click", this.onClickUndo.bind(this));
        this.clearEl.addEventListener("click", this.onClickClear.bind(this));
        this.downloadLinkEl.addEventListener("click", this.onClickDownload.bind(this));
    }

    onClickDownload() {
        this.downloadLinkEl.href = this.canvasEl.toDataURL("image/jpeg", 1); //1: 원본 가깝게
        this.downloadLinkEl.download = "example.jpeg";
    }

    onClickClear() {
        this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height); //전체를 지움, canvas가 투명해짐
        this.undoArray = [];
        this.updateNavigator();
        this.initCanvasBackground();
    }

    onClickUndo() {
        if (this.undoArray.length === 0) {
            alert("더 이상 실행취소 불가합니다!");
            return;
        }
        let previousDataUrl = this.undoArray.pop();
        let previousImgage = new Image();
        previousImgage.onload = () => {
            this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height); //전체를 지움
            this.context.drawImage(previousImgage, 
                0, 0, this.canvasEl.width, this.canvasEl.height, 
                0, 0, this.canvasEl.width, this.canvasEl.height);
        };
        previousImgage.src = previousDataUrl;
        
    }

    savaState() {
        if(this.undoArray.length > 4) {
            this.undoArray.shift();
            this.undoArray.push(this.canvasEl.toDataURL());
        } else {
            this.undoArray.push(this.canvasEl.toDataURL());
        }
    }

    onClickNavigator(event) {
        this.IsNavigatorVisible = !event.currentTarget.classList.contains("active"); 
        event.currentTarget.classList.toggle("active");
        this.navigatorImageContainerEl.classList.toggle("hide");        
        this.updateNavigator();
    }

    updateNavigator() {
        if (!this.IsNavigatorVisible) return;
        this.navigatorImageEl.src = this.canvasEl.toDataURL();
    }

    onClickEraser(event) {
        const IsActive = event.currentTarget.classList.contains("active");
        this.MODE = IsActive ? "NONE" : "ERASER";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        this.brushPanelEl.classList.add("hide");
        event.currentTarget.classList.toggle("active"); //this.eraserEl
        this.brushEl.classList.remove("active");
    }

    onMouseOut() {
        if(this.MODE === "NONE") return;
        this.IsMouseDown = false;
        this.updateNavigator();
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
        this.updateNavigator();
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
        this.savaState();
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
        event.currentTarget.classList.toggle("active"); //this.brushEl
        this.eraserEl.classList.remove("active");
    }
}

new DrawingBoard();