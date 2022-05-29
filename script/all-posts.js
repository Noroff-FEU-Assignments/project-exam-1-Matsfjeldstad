// function to get first 100 charahters from first p in wordpress string
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

const loadMoreBtn = document.querySelector(".load-more-btn");

let pageCount = 1;
const baseApiUrl = `https://api.frinans.casa/wp-json/wp/v2/posts?_embed`;
let allNewsUrl = `${baseApiUrl}`;

const postSection = document.querySelector(".post-inner");

async function newPostfetch() {
  try {
    postSection.innerHTML = "";
    const response = await fetch(allNewsUrl);
    const responseJson = await response.json();
    if (responseJson.length < 10) {
      loadMoreBtn.disabled = true;
    } else {
      loadMoreBtn.disabled = false;
    }
    for (let cards of responseJson) {
      console.log(cards._embedded["wp:featuredmedia"][0].alt_text);
      postSection.innerHTML += `<a href="/news/article.html?id=${
        cards.id
      }" class="post ${cards.x_categories}">
            <div class="picture">
              <img src="${cards.x_featured_media_large}" alt="${
        cards._embedded["wp:featuredmedia"][0].alt_text
      }"/>
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
  } catch (error) {
    console.log(error);
    postSection.innerHTML = `<div class="errorHandler"> oh no something wrong happend..
    ${error}
     </div>`;
  }
}
newPostfetch();

loadMoreBtn.onclick = function () {
  pageCount = pageCount + 1;
  let page = `${allNewsUrl.includes("?") ? "&" : "?"}page=${pageCount}`;
  allNewsUrl = `${allNewsUrl}${page}`;
  console.log(allNewsUrl);
  loadMore();
};

async function loadMore() {
  try {
    const response = await fetch(allNewsUrl);
    const responseJson = await response.json();
    if (responseJson.length < 10) {
      loadMoreBtn.disabled = true;
    }
    for (let cards of responseJson) {
      postSection.innerHTML += `<a href="/news/article.html?id=${
        cards.id
      }" class="post ${cards.x_categories}">
      <div class="picture">
      <img src="${cards.x_featured_media_large}" alt="${
        cards._embedded["wp:featuredmedia"][0].alt_text
      }"/>
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
  } catch {}
}

const loadingpost = `<a href="" class="post bullish">
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
`;

const sortByNewest = document.querySelector(".newsest-sort");
sortByNewest.onclick = function orderBy() {
  pageCount = 1;
  allNewsUrl = `${baseApiUrl}&${"order=desc&orderby=date"}`;
  console.log(allNewsUrl);
  newPostfetch();
};

const sortByOldest = document.querySelector(".oldest-sort");
sortByOldest.onclick = function orderBy() {
  pageCount = 1;
  allNewsUrl = `${baseApiUrl}&${"order=asc&orderby=date"}`;
  postSection.innerHTML = "";
  newPostfetch();
};

const sortByAz = document.querySelector(".aZ-sort");
sortByAz.onclick = function orderBy() {
  pageCount = 1;
  allNewsUrl = `${baseApiUrl}&${"order=asc&orderby=title"}`;
  postSection.innerHTML = "";
  newPostfetch();
};

const sortByZa = document.querySelector(".zA-sort");
sortByZa.onclick = function orderBy() {
  postSection.innerHTML = loadingpost;
  pageCount = 1;
  allNewsUrl = `${baseApiUrl}&${"order=desc&orderby=title"}`;
  newPostfetch();
};
