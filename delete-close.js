/**
 * Removes an image from the UI and the uploadedImages array, then updates the display order.
 * @param {number} imageId - The unique ID of the image to delete.
 */
function deleteImage(imageId) {
  const index = uploadedImages.findIndex((img) => img.id == imageId);
  if (index !== -1) {
    uploadedImages[index].element.remove();
    uploadedImages.splice(index, 1);
    // updateImageOrder is defined in upload-ui.js
    updateImageOrder();
  }
}

/**
 * Closes the preview modal.
 */
function closePreviewModal() {
  document.getElementById("previewModal").style.display = "none";
}
