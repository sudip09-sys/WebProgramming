const API_URL = "https://official-joke-api.appspot.com/random_joke";
const STORAGE_KEY = "sudip-week6-favourite-jokes";

const loadButton = document.querySelector("#loadJoke");
const saveButton = document.querySelector("#saveFavourite");
const setupElement = document.querySelector("#setup");
const punchlineElement = document.querySelector("#punchline");
const messageElement = document.querySelector("#message");
const loadingElement = document.querySelector("#loading");
const jokeContent = document.querySelector(".joke-content");
const favouriteList = document.querySelector("#favouriteList");
const favouriteCount = document.querySelector("#favouriteCount");
const emptyFavourites = document.querySelector("#emptyFavourites");
const clearButton = document.querySelector("#clearFavourites");

let currentJoke = null;
let favourites = readFavourites();

function readFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Could not read saved favourites:", error);
    return [];
  }
}

function writeFavourites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    return true;
  } catch (error) {
    messageElement.textContent = "Your browser couldn't save this favourite. Check your storage settings.";
    return false;
  }
}

function setLoading(isLoading) {
  loadingElement.hidden = !isLoading;
  jokeContent.setAttribute("aria-busy", String(isLoading));
  loadButton.disabled = isLoading;
  loadButton.innerHTML = isLoading
    ? '<span class="spinner" aria-hidden="true"></span> Loading…'
    : '<span aria-hidden="true">↻</span> Load Joke';
}

async function loadJoke() {
  setLoading(true);
  messageElement.textContent = "";
  saveButton.disabled = true;

  try {
    const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`The joke service returned status ${response.status}.`);
    }

    const joke = await response.json();
    if (!joke || typeof joke.setup !== "string" || typeof joke.punchline !== "string") {
      throw new Error("The response didn't contain a complete joke.");
    }

    currentJoke = {
      id: joke.id ?? `${Date.now()}`,
      type: joke.type || "random",
      setup: joke.setup,
      punchline: joke.punchline
    };

    setupElement.textContent = currentJoke.setup;
    punchlineElement.textContent = currentJoke.punchline;
    saveButton.disabled = false;
    saveButton.innerHTML = '<span aria-hidden="true">♡</span> Save Favourite';
    updateSaveButton();
  } catch (error) {
    console.error("Unable to load a joke:", error);
    setupElement.textContent = "Oops! The joke escaped.";
    punchlineElement.textContent = "Please check your internet connection and try again.";
    messageElement.textContent = "We couldn't load a joke right now. Please try again in a moment.";
    currentJoke = null;
    saveButton.disabled = true;
  } finally {
    setLoading(false);
  }
}

function updateSaveButton() {
  if (!currentJoke) return;
  const alreadySaved = favourites.some((joke) =>
    String(joke.id) === String(currentJoke.id) &&
    joke.setup === currentJoke.setup &&
    joke.punchline === currentJoke.punchline
  );
  saveButton.disabled = alreadySaved;
  saveButton.innerHTML = alreadySaved
    ? '<span aria-hidden="true">✓</span> Saved to Favourites'
    : '<span aria-hidden="true">♡</span> Save Favourite';
}

function saveFavourite() {
  if (!currentJoke) return;
  const exists = favourites.some((joke) =>
    String(joke.id) === String(currentJoke.id) &&
    joke.setup === currentJoke.setup &&
    joke.punchline === currentJoke.punchline
  );
  if (exists) {
    updateSaveButton();
    return;
  }

  favourites.unshift(currentJoke);
  if (writeFavourites()) {
    renderFavourites();
    updateSaveButton();
    messageElement.textContent = "Saved! You can find it in your favourites below.";
  } else {
    favourites.shift();
  }
}

function removeFavourite(index) {
  const previous = favourites;
  favourites = favourites.filter((_, itemIndex) => itemIndex !== index);
  if (writeFavourites()) {
    renderFavourites();
    updateSaveButton();
  } else {
    favourites = previous;
  }
}

function renderFavourites() {
  favouriteList.replaceChildren();
  favouriteCount.textContent = String(favourites.length);
  emptyFavourites.hidden = favourites.length > 0;
  clearButton.hidden = favourites.length === 0;

  favourites.forEach((joke, index) => {
    const item = document.createElement("li");
    item.className = "favourite-item";

    const text = document.createElement("div");
    const setup = document.createElement("h3");
    setup.textContent = joke.setup;
    const punchline = document.createElement("p");
    punchline.textContent = joke.punchline;
    text.append(setup, punchline);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove favourite joke: ${joke.setup}`);
    remove.addEventListener("click", () => removeFavourite(index));

    item.append(text, remove);
    favouriteList.append(item);
  });
}

loadButton.addEventListener("click", loadJoke);
saveButton.addEventListener("click", saveFavourite);
clearButton.addEventListener("click", () => {
  if (!favourites.length) return;
  const previous = favourites;
  favourites = [];
  if (writeFavourites()) {
    renderFavourites();
    updateSaveButton();
  } else {
    favourites = previous;
  }
});

renderFavourites();
loadJoke();
