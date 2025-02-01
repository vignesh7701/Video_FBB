idx = 0
while True:
    ret, frame = cap.read()
    if ret:
        bbox = bboxes[str(idx)]
        bbox = list(map(int, bbox))
        x, y, w, h = bbox[0]*2, bbox[1]*2, bbox[2]*2, bbox[3]*2
        cv.rectangle(frame, (x, y), (w, h), (0, 255, 0), 2)
        output.write(frame)
        idx += 1
    else:
        break