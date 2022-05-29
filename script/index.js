const baseApiUrl = "https://api.frinans.casa/wp-json/wp/v2/posts";
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
  const topArticleResponse = await fetch(baseApiUrl + "?categories=12&_embed");
  const topArticleJson = await topArticleResponse.json();
  topArticle.innerHTML = `
<div class="img-container">
  <img src="${topArticleJson[0].x_featured_media_large}" alt="${topArticleJson[0]._embedded["wp:featuredmedia"][0].alt_text}"/>
</div>
<div class = "top-info">
  <div class="product-cat">News</div>
  <h1>${topArticleJson[0].title.rendered}</h1>
</div>`;
  topArticle.href = `/news/article.html?id=${topArticleJson[0].id}`;
  //
})();

(async function asideTopStoriesFetch() {
  //   fetching data based on category, to get just post from the "top stories category"
  const topStoriesResponse = await fetch(baseApiUrl + "?categories=11&_embed");
  const topStoriesJson = await topStoriesResponse.json();
  topStoriesSection.innerHTML = ``;
  for (i = 0; i < 2; i++) {
    topStoriesSection.innerHTML += `<a href="/news/article.html?id=${
      topStoriesJson[i].id
    }" class="blog-card">
    <div class="img-container  ${topStoriesJson[i].x_categories}">
      <img src="${ImgChecker(topStoriesJson[i].x_featured_media_large)}" alt="${
      topStoriesJson[i]._embedded["wp:featuredmedia"][0].alt_text
    }" />
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

const carousel = document.querySelector(".carousel-wrapper");
const currentOptionText1 = document.querySelector(".current-option-text1");
const currentOptionText2 = document.querySelector(".current-option-text2");
const optionPrevious = document.querySelector(".previous-option");
const optionNext = document.querySelector(".next-option");
const carusellImg = document.querySelector(".image");

(async function carusellFetch() {
  let i = 0;
  const newPostResponse = await fetch(baseApiUrl + "?per_page=12&_embed");
  const newPostsJson = await newPostResponse.json();
  currentOptionText1.innerHTML = newPostsJson[i].title.rendered;
  carusellImg.style.backgroundImage = `url('${newPostsJson[i].x_featured_media_original}')`;
  carusellImg.href = `/news/article.html?id=${newPostsJson[i].id}`;
  currentOptionText1.href = carusellImg.href;
  currentOptionText2.innerHTML = `published ${timeSince(
    newPostsJson[i].date,
  )} ago`;

  optionNext.onclick = function () {
    // adds 1 to the itterator
    i = i + 1;
    // usign the remainder operator to create a carousell loop
    i = i % newPostsJson.length;
    // adds animation class
    carousel.classList.add("anim-next");
    // using setTime out ot time the animation with the img change and text change
    setTimeout(() => {
      currentOptionText1.innerHTML = newPostsJson[i].title.rendered;
      currentOptionText1.href = carusellImg.href;
      currentOptionText2.innerHTML = `published ${timeSince(
        newPostsJson[i].date,
      )} ago`;
      carusellImg.style.backgroundImage = `url('${newPostsJson[i].x_featured_media_original}')`;
      carusellImg.href = `/news/article.html?id=${newPostsJson[i].id}`;
    }, 455);
    // removes animation class
    setTimeout(() => {
      carousel.classList.remove("anim-next");
    }, 650);
  };

  optionPrevious.onclick = function () {
    // gets the last post from the array to create a loop
    if (i === 0) {
      i = newPostsJson.length;
    }
    // subtracs 1 from the itterator
    i = i - 1;
    // adds animation class
    carousel.classList.add("anim-prev");
    // using setTime out ot time the animation with the img change and text change
    setTimeout(() => {
      carusellImg.href = `/news/article.html?id=${newPostsJson[i].id}`;
      carusellImg.style.backgroundImage = `url('${newPostsJson[i].x_featured_media_original}')`;
      currentOptionText1.innerHTML = newPostsJson[i].title.rendered;
      currentOptionText2.innerHTML = `published ${timeSince(
        newPostsJson[i].date,
      )} ago`;
    }, 455);
    // removes animation class
    setTimeout(() => {
      carousel.classList.remove("anim-prev");
    }, 650);
  };
})();

(async function bigPostSection() {
  try {
    const response = await fetch(baseApiUrl + "?offset=5&per_page=1&_embed");
    const postResponse = await response.json();
    const biggerPost = document.querySelector(".bigger-post-banner");
    const post = postResponse[0];
    biggerPost.outerHTML = ` <div class="bigger-post-banner ${post.x_categories.replaceAll(
      ",",
      "",
    )}">
    <div class="bigger-post-banner-info">
    <h2>
      ${post.title.rendered}
    </h2>
    <p>
      ${getArticleSubinfo(post.content.rendered)}
    </p>
    <a href="/news/article.html?id=${
      post.id
    }" class="bigger-post-CTA"> Read more</a>
  </div>
  <img src="${post.x_featured_media_large}" alt="${
      post._embedded["wp:featuredmedia"][0].alt_text
    }" />
  </div>`;
  } catch {}
})();

(async function howToCryptoSection() {
  try {
    const howToCrypto = document.querySelector(".how-to-crypto-section");
    const response = await fetch(
      baseApiUrl + "?categories=13&per_page=4&_embed",
    );
    const postResponse = await response.json();
    console.log(postResponse);
    const htcPostSection = howToCrypto.querySelector(".post-section");
    htcPostSection.innerHTML = "";
    for (let post of postResponse) {
      console.log(post._embedded["wp:featuredmedia"][0].alt_text);
      htcPostSection.innerHTML += `<a href="/news/article.html?id=${
        post.id
      }" class="blog-card">
      <div class="img-container bear">
        <img src="${ImgChecker(post.x_featured_media_large)}" alt="
        ${post._embedded["wp:featuredmedia"][0].alt_text}" />
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
