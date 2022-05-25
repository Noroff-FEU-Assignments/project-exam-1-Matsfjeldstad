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
  // if enter is pressed search is exectued
  if (event.keyCode === 13) {
    searchBtn.click();
  }
};

searchBtn.onclick = function searchClick() {
  if (!this.parentElement.classList.contains("search-open")) {
    this.parentElement.classList.add("search-open");
  } else {
    if (searchInput.value.trim().length > 0) {
      console.log(searchInput.value);
      this.href = `/news/search.html?search=${searchInput.value
        .toLowerCase()
        .trim()}`;
    }
  }
};

// top 10 crypto section, using nomics api to collect the data
const proxyUrl = "https://noroffcors.herokuapp.com/";
const cryptoAPIUrl =
  "https://api.nomics.com/v1/currencies/ticker?key=633b5251cda11c9b9112ec739226f763f09a13ab&per-page=10";
async function fetchCryptoApi() {
  try {
    const response = await fetch(proxyUrl + cryptoAPIUrl);
    const responseJson = await response.json();
    let changeStyle = "";
    topTenCryptoSection.innerHTML = "";
    for (let crypto of responseJson) {
      let coinPrice = Number(crypto.price);
      // Formating numbers to have a spesific amout of numbers or decimals.
      // prices over 100 have 2 decimal,
      // prices between one and 100 have 3.
      // and number under 1 will show atleast 4 segnificant numbers:
      function precise(number) {
        return number.toPrecision(4);
      }

      if (coinPrice < 1) {
        coinPrice = precise(coinPrice);
      } else if (coinPrice >= 1 && coinPrice < 100) {
        coinPrice = coinPrice.toFixed(3);
      } else if (coinPrice >= 100) {
        coinPrice = coinPrice.toFixed(2);
      }

      //   change styling to 24hour-change based on
      // if the number is negative or positive
      let coin1dChange = crypto["1d"].price_change_pct * 100;

      if (coin1dChange < 0) {
        changeStyle = "negative";
      } else {
        changeStyle = "positive";
      }

      //   change the innerhtml of the topTenCrypto
      topTenCryptoSection.innerHTML += `<div class="singel-crypto">
         <div class="crypto-ticker">${crypto.id}</div>
        <div class="crypto-price">$${coinPrice}</div>
         <div class="crypto-24h-change ${changeStyle}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"/></svg>${coin1dChange.toFixed(
        2,
      )}%</div>
        </div>`;
    }
  } catch (e) {
    console.log(e);
  }
}
fetchCryptoApi();
