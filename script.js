const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const modal = document.getElementById("jobModal");
const modalContent = document.getElementById("modalContent");

let jobs = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function fetchJobs() {
  loading.classList.remove("hidden");

  try {
    const res = await fetch("https://remotive.com/api/remote-jobs");
    const data = await res.json();
    jobs = data.jobs.slice(0, 20); // limit to 20 jobs
    renderJobs();
  } catch (error) {
    jobList.innerHTML = "<p class='text-red-500'>Failed to load jobs.</p>";
  }

  loading.classList.add("hidden");
}

function renderJobs() {
  jobList.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchValue)
  );

  filteredJobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "bg-white p-5 rounded-lg shadow";

    card.innerHTML = `
      <h2 class="text-xl font-semibold">${job.title}</h2>
      <p class="text-gray-600">${job.company_name}</p>
      <p class="text-sm text-gray-500">${job.category}</p>

      <div class="flex gap-3 mt-4">
        <button 
          onclick="openModal(${job.id})"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          View Details
        </button>

        <button 
          onclick="toggleFavorite(${job.id})"
          class="px-4 py-2 rounded border ${
            favorites.includes(job.id) ? "favorite" : ""
          }"
        >
          ${favorites.includes(job.id) ? "Saved" : "Save"}
        </button>
      </div>
    `;

    jobList.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
    showToast("Job removed from saved!", "error");
  } else {
    favorites.push(id);
    showToast("Job saved successfully!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderJobs();
}

function openModal(id) {
  const job = jobs.find(job => job.id === id);

  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${job.title}</h2>
    <p class="text-gray-600 mb-2">${job.company_name}</p>
    <p class="text-sm text-gray-500 mb-4">${job.category}</p>
    <div class="text-gray-700 text-sm">${job.description}</div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

/* ======================
   TOAST NOTIFICATION
====================== */

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.className =
    "fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg transition-all duration-300";

  if (type === "success") {
    toast.classList.add("bg-green-500", "text-white");
  } else {
    toast.classList.add("bg-red-500", "text-white");
  }

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

searchInput.addEventListener("input", renderJobs);

fetchJobs();