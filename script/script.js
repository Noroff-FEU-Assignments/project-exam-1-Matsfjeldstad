const hamburgerMenu = document.querySelector(".hamburger");
const header = document.querySelector("header");
const headerLogo = document.querySelector("header .logo");
const topSection = document.querySelector(".top-section");
const bottomSection = document.querySelector(".bottom-section");
const main = document.querySelector("main");
const topTenCryptoSection = document.querySelector(".top-ten-crypto");

hamburgerMenu.onclick = function openMenu(event) {
  hamburgerMenu.querySelector(".hamburger-line").classList.toggle("active");
  headerLogo.classList.toggle("active");
  bottomSection.classList.toggle("active");
  topSection.classList.toggle("active");
  header.classList.toggle("active");
  main.classList.toggle("active");
  topTenCryptoSection.classList.toggle("active");
};

const searchInput = document.querySelector(".search-text");
const searchBtn = document.querySelector(".search-btn");

searchInput.onkeyup = function getSearchValue(event) {
  if (this.value.trim().length > 0) {
    searchBtn.href = `/news/search.html?search=${this.value
      .toLowerCase()
      .trim()}`;
  } else {
    searchBtn.href = `#`;
  }
  console.log(searchBtn.href);
};
