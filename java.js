// Sudip's Web Programming homepage
// Small interactions: mobile menu, dark mode, current year and back-to-top button.

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const themeBtn = document.getElementById("themeBtn");
const backTop = document.getElementById("backTop");
const year = document.getElementById("year");

// Mobile navigation
menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuBtn.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuBtn.textContent = "☰";
    });
});

// Dark mode
const savedTheme = localStorage.getItem("sudip-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const currentTheme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("sudip-theme", currentTheme);
    themeBtn.textContent = currentTheme === "dark" ? "☀ Light" : "◐ Theme";
});

// Current year
year.textContent = new Date().getFullYear();

// Back-to-top button
window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        backTop.classList.add("show");
    } else {
        backTop.classList.remove("show");
    }
});

backTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
