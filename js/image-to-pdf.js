// Ambil jsPDF dari global UMD
const { jsPDF } = window.jspdf;

const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoList = document.getElementById("photoList");
const downloadPDFBtn = document.getElementById("downloadPDFBtn");
const pdfSizeSelect = document.getElementById("pdfSize");

// Modal cropper
const cropModal = document.getElementById("cropModal");
const cropImage = document.getElementById("cropImage");
const applyCropBtn = document.getElementById("applyCropBtn");
const cancelCropBtn = document.getElementById("cancelCropBtn");

let photos = [];
let cropper = null;

// Buka input kamera/gallery
addPhotoBtn.addEventListener("click", () => {
  photoInput.click();
});

// Saat pilih foto → buka crop modal
photoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    cropImage.src = e.target.result;
    cropModal.style.display = "block";

    // Hapus cropper lama kalau ada
    if (cropper) cropper.destroy();
    cropper = new Cropper(cropImage, {
      viewMode: 1,
      autoCropArea: 1,
    });
  };
  reader.readAsDataURL(file);

  // Reset input supaya bisa pilih foto sama lagi kalau perlu
  event.target.value = "";
});

// Tombol apply crop
applyCropBtn.addEventListener("click", () => {
  if (cropper) {
    cropper.getCroppedCanvas().toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      photos.push(url);
      renderPhotos();
      cropper.destroy();
      cropModal.style.display = "none";
    }, "image/jpeg");
  }
});

// Tombol cancel crop
cancelCropBtn.addEventListener("click", () => {
  if (cropper) cropper.destroy();
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
    // hitung ukuran otomatis supaya fit halaman
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(src, "JPEG", 0, 0, pageWidth, pageHeight);
  });

  pdf.save("document.pdf");
});
