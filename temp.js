const frameData = boundingBoxes["0"];
Object.keys(frameData.bounding_box).forEach((key) => {
  let [x1, y1, x2, y2] = frameData.bounding_box["0"];
  x1 *= 2;
  y1 *= 2;
  x2 *= 2;
  y2 *= 2;
  const width = x2 - x1;
  const height = y2 - y1;

  ctx.strokeStyle = "rgba(59, 255, 5, 0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x1, y1, width, height);
});


const frameData1 = boundingBoxes["0"].bounding_box[currentFrame.toString()];
   if (Array.isArray(frameData) && frameData.length === 4) {
     let [x1, y1, x2, y2] = frameData;
     const width = x2 - x1;
     const height = y2 - y1;

     ctx.strokeStyle = "rgba(59, 255, 5, 0.6)";
     ctx.lineWidth = 2;
     ctx.strokeRect(x1, y1, width, height);

     console.log(
       `Frame ${currentFrame}, Bounding Box: [${x1}, ${y1}, ${x2}, ${y2}]`
     );
}   
   

const frameData2 = boundingBoxes["0"].bounding_box[currentFrame];
console.log("Frame Data:", frameData);
if (frameData) {
frameData.forEach((key) => {
    const bbox = frameData["0"];

    if (Array.isArray(bbox) && bbox.length === 4) {
    let [x1, y1, x2, y2] = bbox;

    // Scaling (adjust if necessary)
    x1 *= 2;
    y1 *= 2;
    x2 *= 2;
    y2 *= 2;

    ctx.strokeStyle = "rgba(59, 255, 5, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    console.log(
        `Frame: ${currentFrame} | Bounding Box ${key}: [${x1}, ${y1}, ${x2}, ${y2}]`
    );
    } else {
    console.error(
        `Invalid bounding box data for frame: ${currentFrame}, key: ${key}`
    );
    }
});
} 