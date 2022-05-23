// function to get first 100 charahters from wp string
const getArticleSubinfo = (infoString) => {
  const div = document.createElement("div");
  div.innerHTML = infoString;
  const p = div.querySelector("p");
  if (p !== null) {
    if (p.innerHTML.length >= 100) {
      return `${p.innerHTML.substring(0, 100)}...`;
    } else {
      return p.innerHTML;
    }
  }
};

// function to tell the time since an article was posted
function timeSince(date) {
  const totime = new Date(date);
  const seconds = Math.floor((new Date() - totime) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

// pagnination
const param = new URLSearchParams(document.location.search);
const pageParam = param.get("page");

let pageCount = 0;

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
let allNewsUrl = `http://projectexam.local/wp-json/wp/v2/posts?page=${pageCount}`;
const maxLengthApiUrl =
  "http://projectexam.local/wp-json/wp/v2/posts?per_page=100";
// fetch based on pagination

const sortByNewest = document.querySelector(".newsest-sort");
sortByNewest.onclick = function orderBy() {
  allNewsUrl = allNewsUrl + `&${"order=desc&orderby=date"}`;
  console.log(this);
  newPostfetch();
};

const sortByOldest = document.querySelector(".oldest-sort");

sortByOldest.onclick = function orderBy() {
  allNewsUrl = allNewsUrl + `&${"order=asc&orderby=date"}`;
  console.log(this);
  newPostfetch();
};
const sortByAz = document.querySelector(".aZ-sort");
sortByAz.onclick = function orderBy() {
  allNewsUrl = allNewsUrl + `&${"order=asc&orderby=title"}`;
  console.log(this);
  newPostfetch();
};
const sortByZa = document.querySelector(".zA-sort");

sortByZa.onclick = function orderBy() {
  allNewsUrl = allNewsUrl + `&${"order=desc&orderby=title"}`;
  console.log(this);
  newPostfetch();
};

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
    const postSection = document.querySelector(".post-inner");
    const checkNumberOfpages = await fetch(maxLengthApiUrl);
    const pageNumbersResposone = await checkNumberOfpages.json();
    const pageNumbers = document.querySelector(".page-numbers");
    pageNumbers.innerHTML = "";
    const numberOfPages = Math.ceil(pageNumbersResposone.length / 10);
    if (numberOfPages <= 3) {
      for (let i = 0; i < numberOfPages; i++) {
        console.log(i + 1);
        pageNumbers.innerHTML += `<a href="/news/index.html?page=${
          i + 1
        }" class="page-number">${i + 1}</a>`;
      }

      const pageSingelNumber = pageNumbers.querySelectorAll(".page-number");
      pageSingelNumber.forEach((number) => {
        if (Number(number.innerHTML) === pageCount) {
          number.classList.add("active");
        }
      });

      // loops on the api response to display the cards
      postSection.innerHTML = "";
      for (let cards of responseJson) {
        postSection.innerHTML += `<a href="/news/article.html?id=${
          cards.id
        }" class="post ${cards.x_categories}">
        <div class="picture">
          <img src="${cards.x_featured_media_large}"/>
        </div>
        <div class="post-info">
          <h4>${cards.title.rendered}</h4>
          <p>
          ${getArticleSubinfo(cards.content.rendered)}
          </p>
          <div class="post-author-date-container">
            <div class="post-author">By ${cards.x_author}</div>
            <div class="date">Published ${timeSince(cards.date)} ago</div>
          </div>
        </div>
      </a>`;
      }
    }
  } catch (error) {
    console.log(error);
    console.log("fitte");
  }
}
newPostfetch();
