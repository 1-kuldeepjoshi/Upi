/**
 * Increments the zoom level of the previewed image.
 */
function zoomIn() {
  if (currentZoomLevel < 3) {
    currentZoomLevel += 0.2;
    document.getElementById("previewModalImage").style.transform = "scale(" + currentZoomLevel + ")";
  }
  // Show zoom out button once zoomed in
  if (currentZoomLevel > 1) {
    document.getElementById("modalZoomOut").style.display = "block";
  }
}

/**
 * Decrements the zoom level of the previewed image.
 */
function zoomOut() {
  if (currentZoomLevel > 1) {
    currentZoomLevel -= 0.2;
    if (currentZoomLevel < 1) currentZoomLevel = 1;
    document.getElementById("previewModalImage").style.transform = "scale(" + currentZoomLevel + ")";
  }
  // Hide zoom out button when back to base scale
  if (currentZoomLevel === 1) {
    document.getElementById("modalZoomOut").style.display = "none";
  }
}

// Event listeners for zoom buttons
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("modalZoomIn").addEventListener("click", zoomIn);
    document.getElementById("modalZoomOut").addEventListener("click", zoomOut);
});
