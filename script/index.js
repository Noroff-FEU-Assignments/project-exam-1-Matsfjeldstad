const baseApiUrl = "//projectexam.local/wp-json/wp/v2/posts";
const highlightedNewsContainer = document.querySelector(
  ".highlighted-news-container",
);
7;
const topArticle = highlightedNewsContainer.querySelector(".big-section");
const topStoriesSection = highlightedNewsContainer.querySelector(
  ".top-stories-section",
);

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

// checks if imgUrl is undefined or not.
function ImgChecker(imgUrl) {
  if (imgUrl !== undefined) {
    return imgUrl;
  } else {
    return "/img/btc-green.png";
  }
}
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

(async function topStoryFetch() {
  //   fetching data based on category, to get just post from the "top stories category"
  const topArticleResponse = await fetch(baseApiUrl + "?categories=12");
  const topArticleJson = await topArticleResponse.json();

  topArticle.innerHTML = `<div>
  <div class="product-cat">News</div>
  <h1>${topArticleJson[0].title.rendered}</h1>
</div>
<div class="img-container">
  <img src="${topArticleJson[0].x_featured_media_large}" alt="" />
</div>`;
  topArticle.href = `/news/article.html?id=${topArticleJson[0].id}`;
  //
})();

(async function asideTopStoriesFetch() {
  //   fetching data based on category, to get just post from the "top stories category"
  const topStoriesResponse = await fetch(baseApiUrl + "?categories=11");
  const topStoriesJson = await topStoriesResponse.json();
  topStoriesSection.innerHTML = ``;

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

  for (i = 0; i < 2; i++) {
    topStoriesSection.innerHTML += `<a href="/news/article.html?id=${
      topStoriesJson[i].id
    }" class="blog-card">
    <div class="img-container  ${topStoriesJson[i].x_categories}">
      <img src="${ImgChecker(
        topStoriesJson[i].x_featured_media_large,
      )}" alt="" />
    </div>
    <div class="info-section">
      <div class="card-title">
        ${topStoriesJson[i].title.rendered}
      </div>
      <div class="card-info">
        <div class="author">By ${topStoriesJson[i].x_author}</div>
        <div class="date-written">Written ${timeSince(
          topStoriesJson[i].date,
        )} ago</div>
      </div>
    </div>
  </a>`;
  }

  //
})();

(async function newsCarousellFetch() {
  try {
    const newPostResponse = await fetch(baseApiUrl + "?per_page=12");
    const newPostsJson = await newPostResponse.json();

    // selceting the container for the carousel
    const newsCarusel = document.querySelector(".news-carusel");
    newsCarusel.innerHTML = "";
    // looping on the fetched api array
    for (let post of newPostsJson) {
      newsCarusel.innerHTML += `<a href="/news/article.html?id=${
        post.id
      }" class="blog-card" style ="background-image: url(${ImgChecker(
        post.x_featured_media_large,
      )});">
        <div class="card-title">
          ${post.title.rendered}
        </div>
        <div class="card-info">
        <div class="date-written">Written ${timeSince(post.date)} ago</div>
      </div>
      </div>
    </a>`;
    }
  } catch {}
})();

(async function bigPostSection() {
  try {
    const biggerPost = document.querySelector(".bigger-post-banner");
    const response = await fetch(baseApiUrl + "?offset=5&per_page=1");
    const postResponse = await response.json();
    const post = postResponse[0];

    //change title of card
    const cardTitle = biggerPost.querySelector("h2");
    cardTitle.innerHTML = post.title.rendered;

    // change info paragraph of card
    const cardSubInfo = biggerPost.querySelector("p");
    cardSubInfo.innerHTML = getArticleSubinfo(post.content.rendered);

    //change the img of the card
    const cardImg = biggerPost.querySelector("img");
    cardImg.src = ImgChecker(post.x_featured_media_large);

    // give card category class
    biggerPost.classList.add(post.x_categories);
  } catch {}
})();

(async function howToCryptoSection() {
  try {
    const howToCrypto = document.querySelector(".how-to-crypto-section");
    const response = await fetch(baseApiUrl + "?categories=13&per_page=4");
    const postResponse = await response.json();
    console.log(postResponse);
    const htcPostSection = howToCrypto.querySelector(".post-section");
    htcPostSection.innerHTML = "";
    for (let post of postResponse) {
      htcPostSection.innerHTML += `<a href="/news/article.html?id=${
        post.id
      }" class="blog-card">
      <div class="img-container bear">
        <img src="${ImgChecker(post.x_featured_media_large)}" alt="" />
      </div>
      <div class="info-section">
        <div class="card-title">
          ${post.title.rendered}
        </div>
        <div class="card-info">
          <div class="author">By Mats Fjeldstad</div>
          <div class="date-written">${timeSince(post.date)}</div>
        </div>
      </div>
    </a>`;
    }
  } catch {}
})();