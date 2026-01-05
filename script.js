/* ================= CONFIG ================= */
const API_KEY = "90c3a84b";

/* ================= DOM ================= */
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesGrid = document.getElementById("moviesGrid");
const themeToggle = document.getElementById("themeToggle");
const toggleIcon = themeToggle.querySelector(".toggle-icon");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

/* ================= STATE ================= */
let activeDetails = null;

/* ================= EVENTS ================= */
searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMovies();
});

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

/* ================= SEARCH ================= */
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  moviesGrid.innerHTML = "";
  removeDetails();

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(
        query
      )}&apikey=${API_KEY}`
    );
    const data = await res.json();

    if (data.Response === "True") {
      data.Search.forEach(renderMovie);

      setTimeout(() => {
        moviesGrid.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } else {
      moviesGrid.innerHTML = `<p>No results found.</p>`;
    }
  } catch (err) {
    console.error(err);
  }
}

/* ================= MOVIE CARD ================= */
function renderMovie(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  card.innerHTML = `
    <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}">
    <h3>${movie.Title}</h3>
  `;

  card.addEventListener("click", () => {
    showDetails(movie.imdbID, card);
  });

  moviesGrid.appendChild(card);
}

/* ================= FULL DETAILS ================= */
async function showDetails(id, card) {
  removeDetails();

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`
    );
    const m = await res.json();

    const details = document.createElement("div");
    details.className = "movie-details glow-red";

    details.innerHTML = `
      <img src="${m.Poster}">
      <div>
        <h2>${m.Title} (${m.Year})</h2>
        <p><strong>Genre:</strong> ${m.Genre}</p>
        <p><strong>Director:</strong> ${m.Director}</p>
        <p><strong>Cast:</strong> ${m.Actors}</p>
        <p><strong>IMDB:</strong> ⭐ ${m.imdbRating}</p>
        <p>${m.Plot}</p>
      </div>
    `;

    card.after(details);
    activeDetails = details;

    setTimeout(() => {
      details.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  } catch (err) {
    console.error(err);
  }
}

/* ================= HELPERS ================= */
function removeDetails() {
  if (activeDetails) {
    activeDetails.remove();
    activeDetails = null;
  }
}

/* ================= DARK MODE ================= */

const themeToggleDesktop = document.getElementById("themeToggle");
const themeToggleMobile = document.getElementById("themeToggleMobile");

function applyTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", isDark);
  updateIcons(isDark);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateIcons(isDark);
}

function updateIcons(isDark) {
  document.querySelectorAll(".theme-toggle i").forEach((icon) => {
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  });
}

themeToggleDesktop?.addEventListener("click", toggleTheme);
themeToggleMobile?.addEventListener("click", toggleTheme);

applyTheme();

/* ================= CURSOR GLOW TRACKING ================= */
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});
