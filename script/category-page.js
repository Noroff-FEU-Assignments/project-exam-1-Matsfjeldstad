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

const categoryUrl = `https://api.frinans.casa/wp-json/wp/v2/categories/${idParam}`;
let postUrl = `https://api.frinans.casa/wp-json/wp/v2/posts?categories=${idParam}`;
async function catgoryFetch() {
  try {
    //fetching on category info
    const response = await fetch(categoryUrl);
    const responseJson = await response.json();
    const pageTitle = document.querySelector("h1");
    pageTitle.innerHTML = `${responseJson.name} posts (${responseJson.count})`;
    // fetching posts using idParam
    const postFetch = await fetch(postUrl);
    const postJson = await postFetch.json();
    const postSection = document.querySelector(".post-inner");
    console.log(postSection);
    // add loading screen when fetching
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
`;
    postSection.innerHTML = "";
    for (let posts of postJson) {
      postSection.innerHTML += `<a href="/news/article.html?id=${
        posts.id
      }" class="post">
      <div class="picture">
        <img src="${posts.x_featured_media_large}" alt="eth-coin" />
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
  } catch {}
}
catgoryFetch();
