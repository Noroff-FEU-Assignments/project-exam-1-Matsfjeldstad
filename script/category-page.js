const param = new URLSearchParams(document.location.search);
const idParam = param.get("id");

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
let pageCount = 1;
const loadMoreBtn = document.querySelector(".load-more-btn");

const baseApiUrl = `https://api.frinans.casa/wp-json/wp/v2/posts?_embed`;
let postUrl = `${baseApiUrl}&categories=${idParam}`;

const categoryUrl = `https://api.frinans.casa/wp-json/wp/v2/categories/${idParam}`;
const postSection = document.querySelector(".post-inner");
async function catgoryFetch() {
  try {
    //fetching on category info
    const response = await fetch(categoryUrl);
    const responseJson = await response.json();
    const pageTitle = document.querySelector("h1");
    pageTitle.innerHTML = `${responseJson.name} posts (${responseJson.count})`;
    document.title = `${responseJson.name} posts`;
    // fetching posts using idParam
    const postFetch = await fetch(postUrl);
    const postJson = await postFetch.json();

    if (postJson.length < 10) {
      loadMoreBtn.disabled = true;
    } else {
      loadMoreBtn.disabled = false;
    }
    // add loading screen when fetching
    postSection.innerHTML = "";
    for (let posts of postJson) {
      postSection.innerHTML += `<a href="/news/article.html?id=${
        posts.id
      }" class="post">
      <div class="picture">
        <img src="${posts.x_featured_media_large}" alt="${
        posts._embedded["wp:featuredmedia"][0].alt_text
      }"/>
      </div>
      <div class="post-info">
        <h4>${posts.title.rendered}</h4>
        <p>
          ${getArticleSubinfo(posts.content.rendered)}
        </p>
        <div class="post-author-date-container">
          <div class="post-author">By ${posts.x_author}</div>
          <div class="date">Published ${timeSince(posts.date)} ago</div>
        </div>
      </div>
    </a>`;
    }
  } catch (e) {
    console.log(e);
  }
}
catgoryFetch();

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
  postUrl = `${baseApiUrl}&categories=${idParam}&${"order=desc&orderby=date"}`;
  postSection.innerHTML = loadingpost;
  catgoryFetch();
};

const sortByOldest = document.querySelector(".oldest-sort");
sortByOldest.onclick = function orderBy() {
  pageCount = 1;
  postUrl = `${baseApiUrl}&categories=${idParam}&${"order=asc&orderby=date"}`;
  postSection.innerHTML = loadingpost;
  catgoryFetch();
};

const sortByAz = document.querySelector(".aZ-sort");
sortByAz.onclick = function orderBy() {
  pageCount = 1;
  postUrl = `${baseApiUrl}&categories=${idParam}&${"order=asc&orderby=title"}`;
  postSection.innerHTML = loadingpost;
  catgoryFetch();
};

const sortByZa = document.querySelector(".zA-sort");

sortByZa.onclick = function orderBy() {
  pageCount = 1;
  postUrl = `${baseApiUrl}&categories=${idParam}&${"order=desc&orderby=title"}`;
  postSection.innerHTML = loadingpost;
  catgoryFetch();
};

loadMoreBtn.onclick = function () {
  pageCount = pageCount + 1;
  let page = `${searchApiUrl.includes("?") ? "&" : "?"}page=${pageCount}`;
  postUrl = `${postUrl}${page}`;
  loadMore();
};

async function loadMore() {
  try {
    const response = await fetch(postUrl);
    const responseJson = await response.json();
    if (responseJson.length < 10) {
      loadMoreBtn.disabled = true;
    }
    for (let cards of responseJson) {
      postSection.innerHTML += `<a href="/news/article.html?id=${
        cards.id
      }" class="post ${cards.x_categories}">
            <div class="picture">
              <img alt='${cards._embedded["wp:featuredmedia"][0].alt_text}'
              src="${cards.x_featured_media_large}" 
              />
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
    const alt = document.querySelectorAll("img").alt;
    console.log(alt);
  } catch {}
}
