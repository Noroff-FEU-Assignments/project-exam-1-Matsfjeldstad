const baseApiUrl = "//projectexam.local/wp-json/wp/v2/posts";
const highlightedNewsContainer = document.querySelector(
  ".highlighted-news-container",
);
7;
const topArticle = highlightedNewsContainer.querySelector(".big-section");
const topStoriesSection = highlightedNewsContainer.querySelector(
  ".top-stories-section",
);

(async function topStoryFetch() {
  //   fetching data based on category, to get just post from the "top stories category"
  const topArticleResponse = await fetch(baseApiUrl + "?categories=12");
  const topArticleJson = await topArticleResponse.json();
  const mediaUrl =
    "http://projectexam.local/wp-json/wp/v2/media?parent=" +
    topArticleJson[0].id;

  const topArticleMedia = await fetch(mediaUrl);
  const topArticleMediaJson = await topArticleMedia.json();
  console.log(mediaUrl);
  const artcleImg = topArticleMediaJson[0].media_details.sizes.full.source_url;

  topArticle.innerHTML = `<div>
  <div class="product-cat">News</div>
  <h1>${topArticleJson[0].title.rendered}</h1>
</div>
<div class="img-container">
  <img src="${artcleImg}" alt="" />
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

  async function catChecker(postId) {
    const response = await fetch(
      `http://projectexam.local/wp-json/wp/v2/categories?post=${postId}`,
    );
    const responseJson = await response.json();
    for (let category of responseJson) {
      try {
        if (category.name === "bullish") {
          return category.name;
        }
        if (category.name === "bearish") {
          return category.name;
        } else {
          return "regular";
        }
      } catch {}
    }

    for (i = 0; i < 2; i++) {
      console.log(catChecker(topStoriesJson[i].id));
      topStoriesSection.innerHTML += `<a href="/news/article.html?id=${
        topStoriesJson[i].id
      }" class="blog-card">
    <div class="img-container  ${catChecker(topStoriesJson[i].id)}">
      <img src="${getImgSrc(topStoriesJson[i].content.rendered)}" alt="" />
    </div>
    <div class="info-section">
      <div class="card-title">
        ${topStoriesJson[i].title.rendered}
      </div>
      <div class="card-info">
        <div class="author">By Mats Fjeldstad</div>
        <div class="date-written">24 hours ago</div>
      </div>
    </div>
  </a>`;
    }
  }
  //
})();
