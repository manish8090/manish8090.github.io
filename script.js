
let DATA = {};

fetch("resources/data.json")
  .then(res => res.json())
  .then(data => {
    DATA = data;

    // ✅ ONLY CALL HERE
    renderProfile();
    renderLinks();
    renderWebsites(); // important
    renderPhrases();
    initRoles();
    initQuote();
  })
  .catch(err => console.error("JSON load error:", err));



const popup = document.getElementById("sitePopup");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup-btn")) {
    const url = e.target.dataset.url;

    popup.classList.remove("show");

    document.getElementById("loader").classList.add("show");

    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }
});



document.querySelector(".popup-close").onclick = () => {
  popup.classList.remove("show");
};


// 🖱️ Click outside to close
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.remove("show");
  }
});





function renderWebsites() {
  const container = document.getElementById("siteList");
  if (!container || !DATA.websites) return;

  container.innerHTML = DATA.websites.map(site => `
    <button class="popup-btn" data-url="${site.url}">
      ${site.name}
    </button>
  `).join("");
}





function renderLinks() {
  const container = document.getElementById("linksGrid");
  if (!container) return;

  if (!DATA.settings.showLinks) {
    container.parentElement.style.display = "none";
    return;
  }

  container.innerHTML = DATA.links.map(link => `
    <a href="${link.url}" class="item link ${link.class || ""}">
      <ion-icon name="${link.icon}"></ion-icon>
      <span>${link.name}</span>
    </a>
  `).join("");

  // ✅ Attach loader AFTER elements exist
  // 🔗 Loader transition 
  const loader = document.getElementById("loader");

  container.querySelectorAll(".link").forEach(link => {
    link.addEventListener("click", function(e) {
     
     // 🧠 HANDLE WEBSITE POPUP FIRST
    if (this.classList.contains("website")) {
      e.preventDefault();
      document.getElementById("sitePopup").classList.add("show");
      return;
    }
     
      e.preventDefault();

      const url = this.getAttribute("href");

     // show loader safely
      if (loader) loader.classList.add("show");

    // delay navigation (smooth feel)
      setTimeout(() => {
        window.location.href = url;
      }, 600);
    });
  });

  // ⚡ Optional: smooth page load fade
    window.addEventListener("load", () => {
  document.body.style.opacity = "1";
  });  
  
}









function renderProfile() {
  const avatar = document.getElementById("avatar");
  const name = document.getElementById("name");
  const location = document.getElementById("location");

  if (avatar) avatar.src = DATA.profile.avatar;
  if (name) name.innerText = DATA.profile.name;
  if (location) location.innerText = DATA.profile.location;
  
  if (avatar) {
  avatar.style.opacity = 0;
  avatar.src = DATA.profile.avatar;

  avatar.onload = () => {
    avatar.style.transition = "0.5s ease";
    avatar.style.opacity = 1;
  };
}
}





function renderPhrases() {
  const container = document.getElementById("phraseGrid");
  if (!container) return;

  if (!DATA.settings.showThoughts) {
    container.parentElement.style.display = "none";
    return;
  }

  container.innerHTML = DATA.thoughts.map(text => `
    <div class="phrase-card">${text}</div>
  `).join("");
}





// 🌿 Quotes system
function initQuote() {
  const quoteSection = document.querySelector(".quote");

  if (!DATA.settings.showQuote && quoteSection) {
    quoteSection.style.display = "none";
    return;
  }

  const quoteEl = document.getElementById("quote");
  if (quoteEl) {
    quoteEl.innerText =
      DATA.quotes[Math.floor(Math.random() * DATA.quotes.length)];
  }
}









// 🔄 MULTI SPIN SYSTEM (CLEAN + REUSABLE)

function createSpinner(elementId, items, delay = 3000) {
  let i = 0;
  const el = document.getElementById(elementId);

  if (!el) return;

  function change() {
    el.style.opacity = 0;

    setTimeout(() => {
      el.innerText = items[i];
      el.style.opacity = 1;

      i = (i + 1) % items.length;
    }, 300);
  }

  change();
  setInterval(change, delay);
}



// 🔥 Highlight-based alternating roles (NO DELETE)

// 🔄 ROLES SYSTEM (CLEAN + JSON DRIVEN + CONTROLLED)

function initRoles() {
  const container = document.querySelector(".status");
  const el1 = document.getElementById("role1");
  const el2 = document.getElementById("role2");

  if (!DATA.settings.showRoles) {
    if (container) container.style.display = "none";
    return;
  }

  if (!el1 || !el2) return;

  let i = 0;
  let j = 0;
  let paused = false;

  function updateRoles() {
    if (paused) return;

    el1.classList.remove("active");
    el2.classList.remove("active");

    setTimeout(() => {
      el1.innerText = DATA.roles.left[i];
      el2.innerText = DATA.roles.right[j];

      if ((i + j) % 2 === 0) {
        el1.classList.add("active");
      } else {
        el2.classList.add("active");
      }

      i = (i + 1) % DATA.roles.left.length;
      j = (j + 1) % DATA.roles.right.length;
    }, 200);
  }

  // pause on hover (desktop)
  container.addEventListener("mouseenter", () => paused = true);
  container.addEventListener("mouseleave", () => paused = false);

  // pause on touch (mobile)
  container.addEventListener("touchstart", () => paused = true);
  container.addEventListener("touchend", () => paused = false);

  updateRoles();
  setInterval(updateRoles, 3000);
}





// 🌗 Theme toggle
const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggleBtn.innerText = "🌙";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    toggleBtn.innerText = "🌙";
  } else {
    localStorage.setItem("theme", "dark");
    toggleBtn.innerText = "☀️";
  }
});




