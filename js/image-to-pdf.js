// Pakai jsPDF dari global yang sudah di-assign
const jsPDF = window.jsPDF;

const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoList = document.getElementById("photoList");
const downloadPDFBtn = document.getElementById("downloadPDFBtn");
const pdfSizeSelect = document.getElementById("pdfSize");
const cropModal = document.getElementById("cropModal");
const cropImage = document.getElementById("cropImage");
const applyCropBtn = document.getElementById("applyCropBtn");
const cancelCropBtn = document.getElementById("cancelCropBtn");

let photos = [];
let cropper;

// Buka input kamera/gallery
addPhotoBtn.addEventListener("click", () => {
  photoInput.click();
});

// Load foto dari input
photoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    openCropper(e.target.result);
  };
  reader.readAsDataURL(file);
});

// Tampilkan cropper modal
function openCropper(src) {
  cropImage.src = src;
  cropModal.style.display = "flex";

  if (cropper) {
    cropper.destroy();
  }
  cropper = new Cropper(cropImage, {
    aspectRatio: NaN,
    viewMode: 1,
  });
}

// Apply crop
applyCropBtn.addEventListener("click", () => {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas();
  const croppedImage = canvas.toDataURL("image/jpeg");
  photos.push(croppedImage);
  renderPhotos();
  cropper.destroy();
  cropper = null;
  cropModal.style.display = "none";
});

// Cancel crop
cancelCropBtn.addEventListener("click", () => {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  cropModal.style.display = "none";
});

// Render preview foto
function renderPhotos() {
  photoList.innerHTML = "";
  photos.forEach((src, index) => {
    const div = document.createElement("div");
    div.classList.add("photo-item");

    const img = document.createElement("img");
    img.src = src;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      photos.splice(index, 1);
      renderPhotos();
    });

    div.appendChild(img);
    div.appendChild(removeBtn);
    photoList.appendChild(div);
  });
}

// Download PDF
downloadPDFBtn.addEventListener("click", () => {
  if (photos.length === 0) {
    alert("Tambahkan foto terlebih dahulu!");
    return;
  }

  const size = pdfSizeSelect.value;
  let pdf;

  if (size === "A4") {
    pdf = new jsPDF("p", "mm", "a4");
  } else {
    pdf = new jsPDF("p", "mm", [330, 210]); // F4
  }

  photos.forEach((src, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(src, "JPEG", 10, 10, 190, 277);
  });

  pdf.save("document.pdf");
});
