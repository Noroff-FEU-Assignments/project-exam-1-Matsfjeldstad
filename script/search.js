// get paramvalue from the url
const param = new URLSearchParams(document.location.search);
const searchParam = param.get("search");
const pageParam = param.get("page");
// pagination based on urlparam

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
  prevButton.href = `/news/search.html?search=${searchParam}&page==${
    pageCount - 1
  }`;
}

let searchApiUrl = `http://projectexam.local/wp-json/wp/v2/posts?page=${pageCount}&search="${searchParam}"/`;
// adding some description about the page dispalying what the user have searched on
const pageDescription = document.querySelector(".page-description");
pageDescription.innerHTML = `Here are some results on ${searchParam.toUpperCase()} `;

// function to get img src from wp string
const getImgSrc = (imgString) => {
  const div = document.createElement("div");
  div.innerHTML = imgString;
  const img = div.querySelector("img");
  if (img !== null) {
    return img.src;
  } else {
    return "/img/btc-green.png";
  }
};

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

const postSection = document.querySelector(".post-inner");

async function searchParamFetch() {
  try {
    postSection.innerHTML = `<a href="" class="post bullish">
  <div class="picture loading"></div>
  <div class="post-info">
    <h4 class="loading">
      some randome title about some crypto stuff.
    </h4>
    <p class="loading">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
      perspiciatis cum corporis id suscipit quibusdam at distinctio
      sit!
    </p>
    <div class="post-author-date-container">
      <div class="post-author loading">By Mats Fjeldstad</div>
      <div class="date loading">written 24hours ago</div>
    </div>
  </div>
</a>
<a href="" class="post bullish">
  <div class="picture loading"></div>
  <div class="post-info">
    <h4 class="loading">
      some randome title about some crypto stuff.
    </h4>
    <p class="loading">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
      perspiciatis cum corporis id suscipit quibusdam at distinctio
      sit!
    </p>
    <div class="post-author-date-container">
      <div class="post-author loading">By Mats Fjeldstad</div>
      <div class="date loading">written 24hours ago</div>
    </div>
  </div>
</a>
<a href="" class="post bullish">
  <div class="picture loading"></div>
  <div class="post-info">
    <h4 class="loading">
      some randome title about some crypto stuff.
    </h4>
    <p class="loading">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
      perspiciatis cum corporis id suscipit quibusdam at distinctio
      sit!
    </p>
    <div class="post-author-date-container">
      <div class="post-author loading">By Mats Fjeldstad</div>
      <div class="date loading">written 24hours ago</div>
    </div>
  </div>
</a>`;
    const response = await fetch(searchApiUrl);
    const searchResults = await response.json();

    // checks number of post in results
    const maxResponse = await fetch(
      `http://projectexam.local/wp-json/wp/v2/posts?per_page=50&search="${searchParam}`,
    );
    const maxResponseJson = await maxResponse.json();
    console.log(Math.ceil(maxResponseJson.length / 10));
    const pageNumbers = document.querySelector(".page-numbers");
    pageNumbers.innerHTML = "";
    const numberOfPages = Math.ceil(maxResponseJson.length / 10);
    if (numberOfPages <= 3) {
      for (let i = 0; i < numberOfPages; i++) {
        console.log(i + 1);
        pageNumbers.innerHTML += `<a href="/news/search.html?search=${searchParam}&page=${
          i + 1
        }"class="page-number">${i + 1}</a>`;
      }
    }
    const pageSingelNumber = pageNumbers.querySelectorAll(".page-number");
    pageSingelNumber.forEach((number) => {
      if (Number(number.innerHTML) === pageCount) {
        number.classList.add("active");
      }
    });
    // checks the length of the response to decide if nextBtn should be active or not
    if (searchResults.length < 10) {
      nextButton.href = "#";
      nextButton.style.display = "none";
    } else {
      nextButton.href = `/news/search.html?search=${searchParam}&page=${
        pageCount + 1
      }`;
    }
    const pageTitle = document.querySelector("h1");
    pageTitle.innerHTML = `Search Results (${maxResponseJson.length})`;

    postSection.innerHTML = ``;
    if (searchResults.length >= 1) {
      for (let result of searchResults) {
        postSection.innerHTML += `<a href="" class="post ${
          result.x_categories
        }">
        <div class="picture">
          <img src="${result.x_featured_media_large}"/>
        </div>
        <div class="post-info">
          <h4>${result.title.rendered}</h4>
          <p>
          ${getArticleSubinfo(result.content.rendered)}
          </p>
          <div class="post-author-date-container">
            <div class="post-author">By ${result.x_author}</div>
            <div class="date">Published ${timeSince(result.date)} ago</div>
          </div>
        </div>
      </a>`;
      }
    }
    if (searchResults.length === 0) {
      postSection.innerHTML = `<div>Sorry, there are no posts that matches your results.. try searching somthing diffrent</div>`;
      document.querySelector(".pagination").remove();
    }
    //
  } catch {}
}
searchParamFetch();
const sortByNewest = document.querySelector(".newsest-sort");
sortByNewest.onclick = function orderBy() {
  searchApiUrl = searchApiUrl + `&${"order=desc&orderby=date"}`;
  console.log(this);
  searchParamFetch();
};

const sortByOldest = document.querySelector(".oldest-sort");

sortByOldest.onclick = function orderBy() {
  searchApiUrl = searchApiUrl + `&${"order=asc&orderby=date"}`;
  console.log(this);
  searchParamFetch();
};
const sortByAz = document.querySelector(".aZ-sort");
sortByAz.onclick = function orderBy() {
  searchApiUrl = searchApiUrl + `&${"order=asc&orderby=title"}`;
  console.log(this);
  searchParamFetch();
};
const sortByZa = document.querySelector(".zA-sort");

sortByZa.onclick = function orderBy() {
  searchApiUrl = searchApiUrl + `&${"order=desc&orderby=title"}`;
  console.log(this);
  searchParamFetch();
};
