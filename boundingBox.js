const video = document.querySelector(".videoContainer");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "absolute";
canvas.style.pointerEvents = "none";

let boundingBoxes = {};

fetch("result.json")
  .then((response) => response.json())
  .then((data) => {
    boundingBoxes = data.bounding_boxes;
    console.log("Bounding boxes loaded:", boundingBoxes);
  })
  .catch((error) => console.error("Error loading result.json:", error));

function syncCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.style.width = video.videoWidth + "px";
  canvas.style.height = video.videoHeight + "px";
  canvas.style.top = video.offsetTop + "px";
  canvas.style.left = video.offsetLeft + "px";
}

syncCanvas();
video.addEventListener("resize", syncCanvas);

function drawRectangles() {
  if (!boundingBoxes) return;

  const frameRate = 29.97;
  const currentTime = video.currentTime;
  const currentFrame = Math.floor(currentTime * frameRate);

  const clampedFrame = Math.min(Math.max(currentFrame, 0), 299);

  console.log(`Time: ${currentTime.toFixed(2)}s | Frame: ${clampedFrame}`);

   const frameData = boundingBoxes["0"].bounding_box[currentFrame.toString()];
   if (frameData) {
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     if (Array.isArray(frameData) && frameData.length === 4) {
       let [x1, y1, x2, y2] = frameData;
        x1 *= 2;
        y1 *= 2;
        x2 *= 2;
        y2 *= 2;
       const width = x2 - x1;
       const height = y2 - y1;

       ctx.strokeStyle = "rgba(59, 255, 5, 0.6)";
       ctx.lineWidth = 2;
       ctx.strokeRect(x1, y1, width, height);

       console.log(
         `Frame ${currentFrame}, Bounding Box: [${x1}, ${y1}, ${x2}, ${y2}]`
       );
     } else {
       console.error(
         `Invalid bounding box data for frame: ${currentFrame}, bbox: ${frameData}`
       );
     }
   } else {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     console.log(`No bounding box data found for frame: ${currentFrame}`);
   }
}

function updateCanvas() {
  drawRectangles();
  if (!video.paused && !video.ended) {
    requestAnimationFrame(updateCanvas);
  }
}

video.addEventListener("play", () => {
  updateCanvas();
});

video.addEventListener("pause", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

video.addEventListener("seeked", () => {
  drawRectangles();
});
