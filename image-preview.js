/**
 * Displays the selected image in a modal for previewing.
 * @param {HTMLElement} imgElem - The uploaded image element to preview.
 */
function previewImage(imgElem) {
  const modal = document.getElementById("previewModal");
  const modalImg = document.getElementById("previewModalImage");
  
  // Set the image source and reset scale.
  modalImg.src = imgElem.src;
  currentZoomLevel = 1;
  modalImg.style.transform = "scale(1)";
  
  // Hide zoom out button at base scale
  document.getElementById("modalZoomOut").style.display = "none";
  modal.style.display = "flex";
}

// Event listeners for modal closing and editing
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("modalClose").addEventListener("click", closePreviewModal);
    document.getElementById("modalEdit").addEventListener("click", function () {
      // editImage is defined in edit-function.js
      editImage(document.getElementById("previewModalImage").src);
    });
});
