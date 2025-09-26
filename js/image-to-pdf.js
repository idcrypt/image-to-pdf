// Gunakan module import
import { jsPDF } from './jspdf.es.min.js';

const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInput = document.getElementById("photoInput");
const photoList = document.getElementById("photoList");
const downloadPDFBtn = document.getElementById("downloadPDFBtn");
const pdfSizeSelect = document.getElementById("pdfSize");

let images = [];

// tombol tambah foto
addPhotoBtn.addEventListener("click", () => {
  photoInput.click();
});

// ketika foto dipilih
photoInput.addEventListener("change", (event) => {
  const files = event.target.files;
  if (!files.length) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.push(e.target.result);
      renderPhotoList();
    };
    reader.readAsDataURL(file);
  });
});

// render daftar foto
function renderPhotoList() {
  photoList.innerHTML = "";
  images.forEach((src, index) => {
    const div = document.createElement("div");
    div.classList.add("photo-item");

    const img = document.createElement("img");
    img.src = src;

    const btn = document.createElement("button");
    btn.textContent = "x";
    btn.classList.add("remove-btn");
    btn.addEventListener("click", () => {
      images.splice(index, 1);
      renderPhotoList();
    });

    div.appendChild(img);
    div.appendChild(btn);
    photoList.appendChild(div);
  });
}

// download PDF
downloadPDFBtn.addEventListener("click", () => {
  if (images.length === 0) {
    alert("Tambahkan foto terlebih dahulu!");
    return;
  }

  const size = pdfSizeSelect.value;
  let pdf;

  if (size === "A4") {
    pdf = new jsPDF("p", "mm", "a4");
  } else {
    pdf = new jsPDF("p", "mm", [330, 210]); // F4 ukuran
  }

  images.forEach((src, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(src, "JPEG", 10, 10, 190, 277); // scaling agar pas di A4
  });

  pdf.save("images.pdf");
});
