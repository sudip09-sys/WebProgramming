
const API_URL = "https://official-joke-api.appspot.com/random_joke";
const STORAGE_KEY = "randomJokeFavourites";

const $ = (id) => document.getElementById(id);

const loadButton = $("load-joke");
const saveButton = $("save-favourite");
const clearButton = $("clear-favourites");
const saveLabel = $("save-label");
const status = $("status");
const spinner = $("spinner");
const jokeContent = $("joke-content");
const setupElement = $("setup");
const punchlineElement = $("punchline");
const errorElement = $("error-message");
const jokeNumber = $("joke-number");
const favouritesList = $("favourites-list");
const emptyState = $("favourites-empty");
const favouriteCount = $("favourite-count");

let currentJoke = null;
let isLoading = false;
let jokeCount = 0;
let favourites = readFavourites();

function readFavourites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function persistFavourites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    return true;
  } catch (error) {
    console.error("Could not save favourites:", error);
    showError("Your browser couldn't save this collection. Check your storage settings.");
    return false;
  }
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.hidden = false;
}

function hideError() {
  errorElement.textContent = "";
  errorElement.hidden = true;
}

function setLoading(loading) {
  isLoading = loading;
  loadButton.disabled = loading;
  spinner.hidden = !loading;

  loadButton.querySelector(".button-icon").textContent = loading ? "…" : "↻";
  loadButton.querySelector("span:nth-child(2)").textContent =
    loading ? "Finding a good one..." : "Give me another";

  saveButton.disabled = loading || !currentJoke;
}

async function loadJoke() {
  if (isLoading) return;

  hideError();
  currentJoke = null;
  jokeContent.hidden = true;
  saveButton.disabled = true;
  saveLabel.textContent = "Save to collection";
  status.textContent = "Preparing something funny...";
  status.hidden = false;
  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (
      !data ||
      typeof data.setup !== "string" ||
      typeof data.punchline !== "string"
    ) {
      throw new Error("The API returned an unexpected response.");
    }

    currentJoke = {
      id: data.id ?? `${Date.now()}`,
      setup: data.setup,
      punchline: data.punchline
    };

    jokeCount += 1;
    jokeNumber.textContent = `NO. ${String(jokeCount).padStart(3, "0")}`;

    setupElement.textContent = currentJoke.setup;
    punchlineElement.textContent = currentJoke.punchline;

    status.hidden = true;
    jokeContent.hidden = false;
    saveButton.disabled = false;

    const alreadySaved = favourites.some(
      joke => joke.id === currentJoke.id ||
        (joke.setup === currentJoke.setup &&
         joke.punchline === currentJoke.punchline)
    );

    if (alreadySaved) saveLabel.textContent = "Already saved";
  } catch (error) {
    console.error("Joke request failed:", error);
    status.textContent = "Looks like the joke's on us.";
    showError("We couldn't load a joke. Check your internet connection and try again.");
  } finally {
    setLoading(false);
  }
}

function renderFavourites() {
  favouritesList.replaceChildren();

  emptyState.hidden = favourites.length > 0;
  favouriteCount.textContent = favourites.length;
  clearButton.disabled = favourites.length === 0;

  favourites.forEach((joke, index) => {
    const card = document.createElement("article");
    card.className = "favourite-item";

    const top = document.createElement("div");
    top.className = "favourite-item-top";

    const number = document.createElement("span");
    number.className = "favourite-index";
    number.textContent = `KEEPER NO. ${String(index + 1).padStart(2, "0")}`;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove ×";
    remove.setAttribute("aria-label", `Remove favourite ${index + 1}`);

    remove.addEventListener("click", () => {
      const previous = [...favourites];
      favourites.splice(index, 1);

      if (persistFavourites()) {
        renderFavourites();
      } else {
        favourites = previous;
      }
    });

    const setup = document.createElement("p");
    setup.className = "favourite-setup";
    setup.textContent = joke.setup;

    const divider = document.createElement("div");
    divider.className = "favourite-divider";

    const punchline = document.createElement("p");
    punchline.className = "favourite-punchline";
    punchline.textContent = joke.punchline;

    top.append(number, remove);
    card.append(top, setup, divider, punchline);
    favouritesList.appendChild(card);
  });
}

saveButton.addEventListener("click", () => {
  if (!currentJoke || isLoading) return;

  hideError();

  const duplicate = favourites.some(
    joke => joke.id === currentJoke.id ||
      (joke.setup === currentJoke.setup &&
       joke.punchline === currentJoke.punchline)
  );

  if (duplicate) {
    saveLabel.textContent = "Already in collection";
    return;
  }

  favourites.unshift(currentJoke);

  if (persistFavourites()) {
    renderFavourites();
    saveLabel.textContent = "Saved to collection ✓";
  } else {
    favourites.shift();
  }
});

clearButton.addEventListener("click", () => {
  if (favourites.length === 0) return;

  const previous = [...favourites];
  favourites = [];

  if (persistFavourites()) {
    renderFavourites();
  } else {
    favourites = previous;
  }
});

loadButton.addEventListener("click", loadJoke);

$("back-to-top").addEventListener("click", event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderFavourites();
