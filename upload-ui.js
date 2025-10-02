/**
 * Updates the image numbers in the UI based on the current DOM order
 * and re-sorts the uploadedImages array to match.
 */
function updateImageOrder() {
  const container = document.getElementById("uploadedImagesContainer");
  const children = Array.from(container.children);

  // Re-order the logical array based on the DOM order.
  uploadedImages = children.map((child) =>
    uploadedImages.find((img) => img.id == child.getAttribute("data-id"))
  );

  // Update the displayed image numbers.
  children.forEach((child, index) => {
    const numberElem = child.querySelector(".uploaded-image-number");
    if (numberElem) {
      numberElem.innerText = `#${index + 1}`;
    }
  });
}

/**
 * Toggles the display state of action buttons for a specific image.
 * @param {HTMLElement} imgElem - The uploaded image element.
 */
function toggleActionButtons(imgElem) {
  // Hide all action buttons first
  document.querySelectorAll(".image-actions").forEach((div) => {
    div.style.display = "none";
  });
  const wrapper = imgElem.closest(".uploaded-image");
  const actionsDiv = wrapper.querySelector(".image-actions");
  
  // Toggle the display of the clicked image's actions
  actionsDiv.style.display =
    actionsDiv.style.display === "flex" ? "none" : "flex";
}

// Hide action buttons if click is outside an uploaded image.
document.addEventListener("click", function (e) {
  if (!e.target.closest(".uploaded-image")) {
    document.querySelectorAll(".image-actions").forEach((el) => {
      el.style.display = "none";
    });
  }
});


/**
 * Handles file uploads, reads files, and displays images in the UI.
 * @param {Event} event - The file input change event.
 */
function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  const uploadedImagesContainer = document.getElementById("uploadedImagesContainer");
  const uploadContainer = document.getElementById("uploadContainer");
  const addImageBtnContainer = document.getElementById("addImageBtnContainer");
  const descriptionContainer = document.querySelector(".description-container");

  // Hide the upload container and description container,
  // then show uploaded images container and Add More button.
  uploadContainer.style.display = "none";
  descriptionContainer.style.display = "none";
  uploadedImagesContainer.style.display = "flex";
  addImageBtnContainer.style.display = "flex";

  const fileReadPromises = files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve({ file, dataURL: e.target.result, index });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  Promise.all(fileReadPromises).then((results) => {
    results.sort((a, b) => a.index - b.index);
    results.forEach((result) => {
      imageNumber++; // Unique ID for each image.
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("uploaded-image");
      imageWrapper.setAttribute("data-id", imageNumber);

      const imageNumberElem = document.createElement("div");
      imageNumberElem.classList.add("uploaded-image-number");
      imageNumberElem.innerText = `#${imageNumber}`;

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const imgElem = document.createElement("img");
      imgElem.src = result.dataURL;
      imgElem.setAttribute("data-rotation", "0");

      imgElem.onload = function () {
        const compStyle = window.getComputedStyle(imgElem);
        imgElem.dataset.origWidth = compStyle.width;
        imgElem.dataset.origHeight = compStyle.height;
        imageContainer.style.width = compStyle.width;
        imageContainer.style.height = compStyle.height;
      };

      imgElem.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleActionButtons(imgElem);
      });

      imageContainer.appendChild(imgElem);

      const nameElem = document.createElement("div");
      nameElem.classList.add("uploaded-image-name");
      nameElem.innerText = result.file.name;

      imageWrapper.appendChild(imageNumberElem);
      imageWrapper.appendChild(imageContainer);
      imageWrapper.appendChild(nameElem);

      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("image-actions");

      // Action buttons setup (relies on globally defined functions)
      const previewBtn = document.createElement("button");
      previewBtn.classList.add("action-btn");
      previewBtn.innerHTML =
        '<i class="fa fa-eye"></i><span class="btn-label">Preview</span>';
      previewBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        previewImage(imgElem);
      });

      const editBtn = document.createElement("button");
      editBtn.classList.add("action-btn");
      editBtn.innerHTML =
        '<i class="fa fa-pencil"></i><span class="btn-label">Edit</span>';
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        editImage(result.dataURL);
      });

      const rotateBtn = document.createElement("button");
      rotateBtn.classList.add("action-btn");
      rotateBtn.innerHTML =
        '<i class="fa fa-rotate-right"></i><span class="btn-label">Rotate</span>';
      rotateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        rotateImage(imgElem);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("action-btn");
      deleteBtn.innerHTML =
        '<i class="fa fa-trash"></i><span class="btn-label">Delete</span>';
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteImage(imageWrapper.getAttribute("data-id"));
      });

      actionsDiv.appendChild(previewBtn);
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(rotateBtn);
      actionsDiv.appendChild(deleteBtn);
      imageWrapper.appendChild(actionsDiv);

      uploadedImagesContainer.appendChild(imageWrapper);
      uploadedImages.push({
        id: imageNumber,
        src: result.dataURL,
        element: imageWrapper,
      });
    });
    document.getElementById("convertBtn").style.display = "block";
    updateImageOrder(); // Call update to correctly number the new images
  });
}

// Initialization code for SortableJS, which depends on updateImageOrder
document.addEventListener("DOMContentLoaded", function () {
  const uploadedImagesContainer = document.getElementById("uploadedImagesContainer");
  
  // Sortable is expected to be loaded via script tag in index.html
  if (typeof Sortable !== 'undefined') {
    Sortable.create(uploadedImagesContainer, {
      animation: 150,
      onEnd: updateImageOrder,
    });
  }
});
