// Ambil jsPDF dari global UMD
const { jsPDF } = window.jspdf;

const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoList = document.getElementById("photoList");
const downloadPDFBtn = document.getElementById("downloadPDFBtn");
const pdfSizeSelect = document.getElementById("pdfSize");

const cropModal = document.getElementById("cropModal");

// --- buat container modal crop ---
const cropContent = document.createElement("div");
cropContent.classList.add("crop-content");

let cropImage = document.createElement("img");
cropImage.classList.add("crop-image");

const applyBtn = document.createElement("button");
applyBtn.textContent = "Apply";
applyBtn.classList.add("btn-apply");

const cancelBtn = document.createElement("button");
cancelBtn.textContent = "Cancel";
cancelBtn.classList.add("btn-cancel");

// masukkan ke modal
cropContent.appendChild(cropImage);
cropContent.appendChild(applyBtn);
cropContent.appendChild(cancelBtn);
cropModal.appendChild(cropContent);

let photos = [];
let cropper = null;

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
    if (!e.target.result) return;
    openCropper(e.target.result); // buka modal cropper
  };
  reader.readAsDataURL(file);
});

// Fungsi buka cropper modal
function openCropper(imgSrc) {
  cropModal.style.display = "flex"; // tampilkan modal
  cropImage.src = imgSrc;

  if (cropper) cropper.destroy();
  cropper = new Cropper(cropImage, {
    viewMode: 1,
    autoCropArea: 1,
    responsive: true,
    background: false,
  });
}

// Apply crop
applyBtn.addEventListener("click", () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas();
  photos.push(canvas.toDataURL("image/jpeg"));
  renderPhotos();

  cropper.destroy();
  cropper = null;
  cropModal.style.display = "none";
});

// Cancel crop
cancelBtn.addEventListener("click", () => {
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
