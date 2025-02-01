// Sample structure of JSON with frame-based points:
// const pointsData = [
//   { frame: 0, points: [{ x: 50, y: 50, size: 20 }] },
//   { frame: 1, points: [{ x: 60, y: 60, size: 20 }] },
// ];

const video = document.getElementById("videoElement");
const canvas = document.getElementById("canvasElement");
const ctx = canvas.getContext("2d");

// Adjust this JSON data to match your points data
const pointsData = [
  { frame: 0, points: [{ x: 50, y: 50, size: 20 }] },
  { frame: 1, points: [{ x: 60, y: 60, size: 20 }] },
  // Add more frames and points as needed
];

// Sync canvas size with video
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

// Draw squares on the canvas based on points
function drawSquaresForFrame(frame) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Find points for the current frame
  const frameData = pointsData.find((data) => data.frame === frame);

  if (frameData) {
    frameData.points.forEach((point) => {
      ctx.fillStyle = "rgba(255, 0, 0, 0.6)"; // Red color with transparency
      ctx.fillRect(point.x, point.y, point.size, point.size);
    });
  }
}

// Function to handle frame updates
function updateCanvas() {
  const currentTime = video.currentTime;
  const currentFrame = Math.floor(currentTime * 30); // Assuming 30 FPS

  drawSquaresForFrame(currentFrame);

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
  const currentFrame = Math.floor(video.currentTime * 30); // Assuming 30 FPS
  drawSquaresForFrame(currentFrame);
});
