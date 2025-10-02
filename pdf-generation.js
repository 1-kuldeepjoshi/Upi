/**
 * Converts uploaded images to a single PDF, applying visual rotations.
 */
async function convertToPdf() {
  // PDFLib and degrees are expected to be globally available from the external script.
  const { PDFDocument, degrees } = PDFLib;
  if (uploadedImages.length === 0) {
    alert("Please upload at least one image!");
    return;
  }

  document.getElementById("loader-overlay").style.display = "flex";

  try {
    const pdfDoc = await PDFDocument.create();

    for (let img of uploadedImages) {
      const response = await fetch(img.src);
      const imgBytes = await response.arrayBuffer();
      const mimeMatch = img.src.match(/^data:(image\/[a-zA-Z]+);base64,/);

      let embeddedImg;
      if (mimeMatch && mimeMatch[1] === "image/png") {
        embeddedImg = await pdfDoc.embedPng(imgBytes);
      } else {
        embeddedImg = await pdfDoc.embedJpg(imgBytes);
      }

      const imgElem = img.element.querySelector("img");
      // Read the rotation applied by rotateImage
      const rotation = parseInt(imgElem.getAttribute("data-rotation") || "0", 10) % 360;

      let page;
      let imgWidth = embeddedImg.width;
      let imgHeight = embeddedImg.height;

      // Adjust page dimensions and drawing based on rotation
      switch (rotation) {
        case 0:
          page = pdfDoc.addPage([imgWidth, imgHeight]);
          page.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
          break;
        case 90: // 90° clockwise
          page = pdfDoc.addPage([imgHeight, imgWidth]);
          page.drawImage(embeddedImg, {
            x: imgHeight,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            rotate: degrees(90),
          });
          break;
        case 180:
          page = pdfDoc.addPage([imgWidth, imgHeight]);
          page.drawImage(embeddedImg, {
            x: imgWidth,
            y: imgHeight,
            width: imgWidth,
            height: imgHeight,
            rotate: degrees(180),
          });
          break;
        case 270: // 270° clockwise
          page = pdfDoc.addPage([imgHeight, imgWidth]);
          page.drawImage(embeddedImg, {
            x: 0,
            y: imgWidth,
            width: imgWidth,
            height: imgHeight,
            rotate: degrees(270),
          });
          break;
        default:
          page = pdfDoc.addPage([imgWidth, imgHeight]);
          page.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
      }
    }

    pdfBytes = await pdfDoc.save();
    document.getElementById("downloadBtn").style.display = "block";
  } catch (error) {
    console.error("PDF conversion failed:", error);
    alert("An error occurred while creating the PDF.");
  } finally {
    document.getElementById("loader-overlay").style.display = "none";
  }
}

/**
 * Triggers the download of the generated PDF file.
 */
function downloadPdf() {
  // download is expected to be globally available from the external script (downloadjs).
  if (pdfBytes) {
    download(pdfBytes, "images.pdf", "application/pdf");
  } else {
    alert("No PDF to download!");
  }
}
