const video = document.querySelector(".videoContainer");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "absolute";
canvas.style.pointerEvents = "none"; // Make sure the canvas doesn't block video controls

let boundingBoxes = {};

// Load the bounding box data from result.json
fetch("result.json")
  .then((response) => response.json())
  .then((data) => {
    boundingBoxes = data.bounding_boxes;
    updateCanvas();
  })
  .catch((error) => console.error("Error loading result.json:", error));

// Sync canvas size with video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.style.width = video.videoWidth + "px";
  canvas.style.height = video.videoHeight + "px";
  canvas.style.top = video.offsetTop + "px";
  canvas.style.left = video.offsetLeft + "px";

// Draw rectangles on the canvas based on bounding boxes for the current frame
function drawRectangles() {
  if (!boundingBoxes) return;
  const frameRate = 29.97;
  console.log("Available Frames:", Object.keys(boundingBoxes));

  const currentTime = video.currentTime;
  const currentFrame = Math.floor(currentTime * frameRate);

  console.log(`Current Time: ${currentTime}, Current Frame: ${currentFrame}`);

  const frameData = boundingBoxes[currentFrame.toString()];
  if (frameData) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(frameData.bounding_box).forEach((key) => {
      let [x1, y1, x2, y2] = frameData.bounding_box[key];
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
        `Frame: ${currentFrame}, Bounding Box ${key}: [${x1}, ${y1}, ${x2}, ${y2}]`
      );
    });
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

// Event listeners for video playback
video.addEventListener("play", () => {
  updateCanvas();
});

video.addEventListener("pause", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

video.addEventListener("seeked", () => {
  drawRectangles();
});
