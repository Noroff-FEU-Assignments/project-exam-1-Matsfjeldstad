const param = new URLSearchParams(document.location.search);
const searchParam = param.get("search");
let searchApiUrl = `http://projectexam.local/wp-json/wp/v2/posts?search="${searchParam}"/`;
console.log(searchApiUrl);
// adding some description about the page dispalying what the user have searched on
const pageDescription = document.querySelector(".page-description");
pageDescription.innerHTML = `Here are some results on ${searchParam.toUpperCase()} `;
const pageTitle = document.querySelector("h1");

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

async function searchParamFetch() {
  try {
    const response = await fetch(searchApiUrl);
    const searchResults = await response.json();
    console.log(searchResults);
    pageTitle.innerHTML = `Search Results (${searchResults.length})`;
    const postSection = document.querySelector(".post-inner");
    postSection.innerHTML = ``;
    if (searchResults.length >= 1) {
      for (let result of searchResults) {
        console.log(result);
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
    }

    //
  } catch {}
}
searchParamFetch();
