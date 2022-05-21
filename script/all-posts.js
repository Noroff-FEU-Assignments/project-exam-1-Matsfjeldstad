// pagnination
let pageCount = 0;

const param = new URLSearchParams(document.location.search);
const pageParam = param.get("page");

if (pageParam === null || pageParam <= 1) {
  pageCount = 1;
} else {
  pageCount = Number(pageParam);
}

const prevButton = document.querySelector(".prev-pagination");
const nextButton = document.querySelector(".next-pagination");

console.log(pageCount);
if (pageCount <= 1) {
  prevButton.href = "";
  prevButton.style.display = "none";
} else {
  prevButton.href = `/news/index.html?page=${pageCount - 1}`;
}
const allNewsUrl = `http://projectexam.local/wp-json/wp/v2/posts?page=${pageCount}`;

// fetch based on pagination
async function newPostfetch() {
  try {
    const response = await fetch(allNewsUrl);
    const responseJson = await response.json();
    if (responseJson.length < 10) {
      nextButton.href = "#";
      nextButton.style.display = "none";
    } else {
      nextButton.href = `/news/index.html?page=${pageCount + 1}`;
    }
  } catch {}
}
newPostfetch();

const maxLengthApiUrl =
  "http://projectexam.local/wp-json/wp/v2/posts?per_page=100/";
const pageNumbers = document.querySelector(".page-numbers");
pageNumbers.innerHTML = "";

(async function checkPostArrayLength() {
  try {
    console.log(maxLengthApiUrl);
    const response = await fetch(maxLengthApiUrl);
    const responseJson = await response.json();
    console.log(responseJson);
  } catch {
    console.log("fitte");
  }
})();
