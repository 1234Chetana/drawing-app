document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");

  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    isDragging = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000",
    shapes = []; // Array to store shapes

  const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
  };

  window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
  });

  const drawRect = (x, y, width, height) => {
    ctx.strokeRect(x, y, width, height);
  };

  const drawCircle = (x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawTriangle = (x1, y1, x2, y2, x3, y3) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
  };

  const drawShape = (shape) => {
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;

    switch (shape.type) {
      case "rect":
        drawRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        drawCircle(shape.x, shape.y, shape.radius);
        break;
      case "triangle":
        drawTriangle(shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
        break;
      default:
        console.error("Invalid shape type");
    }
  };

  const startDraw = (e) => {
    if (isDragging) return;
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const drawing = (e) => {
    if (!isDrawing && !isDragging) return;
    ctx.putImageData(snapshot, 0, 0);

    if (isDrawing) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }

    if (isDragging) {
      const deltaX = e.offsetX - prevMouseX;
      const deltaY = e.offsetY - prevMouseY;

      shapes[shapes.length - 1].x += deltaX;
      shapes[shapes.length - 1].y += deltaY;

      drawShape(shapes[shapes.length - 1]);

      prevMouseX = e.offsetX;
      prevMouseY = e.offsetY;
    }
  };

  const endDraw = () => {
    if (isDrawing) {
      ctx.closePath();
      isDrawing = false;
    }

    if (isDragging) {
      isDragging = false;
    }
  };

  const handleMouseDown = (e) => {
    startDraw(e);
  };

  const handleMouseMove = (e) => {
    drawing(e);
  };

  const handleMouseUp = () => {
    endDraw();
  };

  const handleMouseOut = () => {
    endDraw();
  };

  const handleShapeClick = (index) => {
    return (e) => {
      isDragging = true;
      prevMouseX = e.offsetX;
      prevMouseY = e.offsetY;
      shapes.push({ ...shapes[index] }); // Clone the shape
    };
  };

  const handleClearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
    shapes = [];
  };

  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const toolBtns = document.querySelectorAll(".tool");
  const fillColor = document.querySelector("#fill-color");
  const sizeSlider = document.querySelector("#size-slider");
  const colorBtns = document.querySelectorAll(".colors .option");
  const colorPicker = document.querySelector("#color-picker");
  const clearCanvas = document.querySelector(".clear-canvas");
  const saveImg = document.querySelector(".save-img");

  toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".options .active").classList.remove("active");
      btn.classList.add("active");
      selectedTool = btn.id;
    });
  });

  sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".options .selected").classList.remove("selected");
      btn.classList.add("selected");
      selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
  });

  colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  clearCanvas.addEventListener("click", handleClearCanvas);
  saveImg.addEventListener("click", handleSaveImage);

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseout", handleMouseOut);

  // Additional event listeners for shapes
  const shapeButtons = document.querySelectorAll(".options .tool");
  shapeButtons.forEach((shapeBtn, index) => {
    shapeBtn.addEventListener("click", handleShapeClick(index));
  });
});
