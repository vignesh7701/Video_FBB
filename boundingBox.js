const video = document.querySelector(".videoContainer");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "absolute";
canvas.style.pointerEvents = "none";

let boundingBoxes = {};

fetch("result2.json")
  .then((response) => response.json())
  .then((data) => {
    boundingBoxes = data.bounding_boxes;
    console.log("Bounding boxes loaded:", boundingBoxes);
  })
  .catch((error) => console.error("Error loading result.json:", error));

function syncCanvas() {
  const videoRect = video.getBoundingClientRect();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
 canvas.style.width = videoRect.width + "px";
 canvas.style.height = videoRect.height + "px";
  canvas.style.top = video.offsetTop + "px";
  canvas.style.left = video.offsetLeft + "px";
}

syncCanvas();
console.log("Canvas synced with video:", canvas.width, canvas.height);
console.log("Video:", video.videoWidth, video.videoHeight);
window.addEventListener("resize", syncCanvas);
video.addEventListener("loadeddata", syncCanvas);

function drawRectangles() {
  if (!boundingBoxes) return;

  const frameRate = 29.97;
  const currentTime = video.currentTime;
  const currentFrame = Math.floor(currentTime * frameRate);

  console.log(`Time: ${currentTime.toFixed(2)}s | Frame: ${currentFrame}`);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys(boundingBoxes).forEach((key) => {
    const frameData = boundingBoxes[key].bounding_box[currentFrame.toString()];
    if (frameData) {
       const boxClass = boundingBoxes[key].class;
       const strokeColor =
         boxClass === "fake" ? "rgba(255, 0, 0, 0.6)" : "rgba(59, 255, 5, 0.6)";
      if (Array.isArray(frameData) && frameData.length === 4) {
        let [x1, y1, x2, y2] = frameData;
        x1 *= 2
        y1 *= 2
        x2 *= 2
        y2 *= 2
        const width = x2 - x1;
        const height = y2 - y1;

        ctx.strokeStyle = strokeColor;
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
    }
  });
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
