/**
 * Rotates the image element visually and updates its container dimensions.
 * @param {HTMLElement} imgElem - The image element to rotate.
 */
function rotateImage(imgElem) {
  let currentRotation = parseInt(
    imgElem.getAttribute("data-rotation") || "0",
    10
  );
  currentRotation = (currentRotation + 90) % 360;
  imgElem.style.transform = "rotate(" + currentRotation + "deg)";
  imgElem.setAttribute("data-rotation", currentRotation);
  const imageContainer = imgElem.parentElement;

  // Retrieve original dimensions from data attributes set on load.
  // These dimensions are used to swap container width/height after rotation.
  const origWidth = parseFloat(imgElem.dataset.origWidth);
  const origHeight = parseFloat(imgElem.dataset.origHeight);

  if (currentRotation === 90 || currentRotation === 270) {
    // Swap width and height for 90/270 degree rotation
    imageContainer.style.width = origHeight + "px";
    imageContainer.style.height = origWidth + "px";
  } else {
    // Use original dimensions for 0/180 degree rotation
    imageContainer.style.width = origWidth + "px";
    imageContainer.style.height = origHeight + "px";
  }
}
