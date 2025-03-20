// Initialize arrays from localStorage or create empty arrays if not exists
let baju = JSON.parse(localStorage.getItem("baju")) || [];
let celana = JSON.parse(localStorage.getItem("celana")) || [];

// Dictionary for translations
const translations = {
  id: {
    title: "Penentu Outfit",
    pickButton: "Tentukan Outfit",
    shirtList: "Daftar Baju",
    pantsList: "Daftar Celana",
    addOutfit: "Tambah Outfit",
    addShirt: "Tambah Baju:",
    addShirtButton: "Tambah Baju",
    addPants: "Tambah Celana:",
    addPantsButton: "Tambah Celana",
    noShirts: "Belum ada baju. Silakan tambahkan gambar baju.",
    noPants: "Belum ada celana. Silakan tambahkan gambar celana.",
    deleteConfirmShirt: "Apakah anda yakin ingin menghapus baju ini?",
    deleteConfirmPants: "Apakah anda yakin ingin menghapus celana ini?",
    shirtAdded: "Gambar baju berhasil ditambahkan!",
    pantsAdded: "Gambar celana berhasil ditambahkan!",
    needBothItems: "Tambahkan setidaknya satu baju dan satu celana!",
    outfitSelected: "Outfit yang dipilih:",
    shirtLabel: "Baju",
    pantsLabel: "Celana",
    clickToDelete: "Klik untuk menghapus",
  },
  en: {
    title: "Outfit Picker",
    pickButton: "Pick an Outfit",
    shirtList: "Shirt Collection",
    pantsList: "Pants Collection",
    addOutfit: "Add Outfit Items",
    addShirt: "Add Shirt:",
    addShirtButton: "Add Shirt",
    addPants: "Add Pants:",
    addPantsButton: "Add Pants",
    noShirts: "No shirts yet. Please add shirt images.",
    noPants: "No pants yet. Please add pants images.",
    deleteConfirmShirt: "Are you sure you want to delete this shirt?",
    deleteConfirmPants: "Are you sure you want to delete these pants?",
    shirtAdded: "Shirt image added successfully!",
    pantsAdded: "Pants image added successfully!",
    needBothItems: "Add at least one shirt and one pair of pants!",
    outfitSelected: "Selected outfit:",
    shirtLabel: "Shirt",
    pantsLabel: "Pants",
    clickToDelete: "Click to delete",
  },
};

// Current language
let currentLanguage = localStorage.getItem("language") || "id";

/**
 * Changes the UI language and updates all text elements
 */
function changeLanguage() {
  const select = document.getElementById("languageSelect");
  currentLanguage = select.value;
  localStorage.setItem("language", currentLanguage);

  // Update flag image
  const flagImg = document.getElementById("selectedFlag");
  flagImg.src = currentLanguage === "id" ? "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/id.svg" : "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/gb.svg";

  // Translate all elements with data-translate attribute
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[currentLanguage][key]) {
      element.innerText = translations[currentLanguage][key];
    }
  });

  // Refresh display of items to update any text
  tampilkanBaju();
  tampilkanCelana();
}

/**
 * Add new shirt(s) to the collection
 * This function reads the selected image files, converts them to base64 strings
 * and stores them in the local storage
 */
function tambahBaju() {
  const input = document.getElementById("uploadBaju");
  if (input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        baju.push(e.target.result);
        localStorage.setItem("baju", JSON.stringify(baju));
      };
      reader.readAsDataURL(file);
    });
    alert(translations[currentLanguage]["shirtAdded"]);
    location.reload();
  }
}

/**
 * Add new pants to the collection
 * Works similarly to tambahBaju, but for pants images
 */
function tambahCelana() {
  const input = document.getElementById("uploadCelana");
  if (input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        celana.push(e.target.result);
        localStorage.setItem("celana", JSON.stringify(celana));
      };
      reader.readAsDataURL(file);
    });
    alert(translations[currentLanguage]["pantsAdded"]);
    location.reload();
  }
}

/**
 * Display all shirts in the collection
 * Creates image elements for each shirt and adds click handlers for deletion
 */
function tampilkanBaju() {
  let container = document.getElementById("bajuList");
  container.innerHTML = "";
  if (baju.length === 0) {
    container.innerHTML = `<p>${translations[currentLanguage]["noShirts"]}</p>`;
    return;
  }
  baju.forEach((img, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.title = translations[currentLanguage]["clickToDelete"];
    imgElement.onclick = () => hapusBaju(index);
    container.appendChild(imgElement);
  });
}

/**
 * Display all pants in the collection
 * Creates image elements for each pants and adds click handlers for deletion
 */
function tampilkanCelana() {
  let container = document.getElementById("celanaList");
  container.innerHTML = "";
  if (celana.length === 0) {
    container.innerHTML = `<p>${translations[currentLanguage]["noPants"]}</p>`;
    return;
  }
  celana.forEach((img, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.title = translations[currentLanguage]["clickToDelete"];
    imgElement.onclick = () => hapusCelana(index);
    container.appendChild(imgElement);
  });
}

/**
 * Remove a shirt from the collection by index
 * @param {number} index - The index of the shirt to remove
 */
function hapusBaju(index) {
  if (confirm(translations[currentLanguage]["deleteConfirmShirt"])) {
    baju.splice(index, 1);
    localStorage.setItem("baju", JSON.stringify(baju));
    tampilkanBaju();
  }
}

/**
 * Remove pants from the collection by index
 * @param {number} index - The index of the pants to remove
 */
function hapusCelana(index) {
  if (confirm(translations[currentLanguage]["deleteConfirmPants"])) {
    celana.splice(index, 1);
    localStorage.setItem("celana", JSON.stringify(celana));
    tampilkanCelana();
  }
}

/**
 * Randomly select an outfit from available clothes
 * Picks one random shirt and one random pants to create an outfit
 */
function tentukanOutfit() {
  let hasil = document.getElementById("hasil");
  let outfitImages = document.getElementById("outfitImages");
  // Check if there are enough items to create an outfit
  if (baju.length === 0 || celana.length === 0) {
    hasil.innerText = translations[currentLanguage]["needBothItems"];
    hasil.style.color = "#e74c3c";
    outfitImages.innerHTML = "";
    return;
  }

  // Select random items
  let randomBaju = baju[Math.floor(Math.random() * baju.length)];
  let randomCelana = celana[Math.floor(Math.random() * celana.length)];

  // Display the result
  hasil.innerText = translations[currentLanguage]["outfitSelected"];
  hasil.style.color = "#2ecc71";

  outfitImages.innerHTML = `
    <div>
      <h4>${translations[currentLanguage]["shirtLabel"]}</h4>
      <img src="${randomBaju}">
    </div>
    <div>
      <h4>${translations[currentLanguage]["pantsLabel"]}</h4>
      <img src="${randomCelana}">
    </div>
  `;
}

// Initialize the page by displaying existing clothes and setting language
document.addEventListener("DOMContentLoaded", function () {
  // Set the language selector to match stored preference
  document.getElementById("languageSelect").value = currentLanguage;
  // Update all translations
  changeLanguage();
  // Display clothes
  tampilkanBaju();
  tampilkanCelana();
});
