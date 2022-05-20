const param = new URLSearchParams(document.location.search);
const idParam = param.get("id");

const apiURL = `http://projectexam.local/wp-json/wp/v2/posts/${idParam}`;
console.log(apiURL);

// function to get first p from wp string
const getArticleSubinfo = (infoString) => {
  const div = document.createElement("div");
  div.innerHTML = infoString;
  const p = div.querySelector("p");
  if (p !== null) {
    return p.innerHTML;
  }
};

// function that deletes the first <p> of the article
function deleteTopSection(articleString) {
  const div = document.createElement("div");
  div.innerHTML = articleString;
  const p = div.querySelector("p");
  p.remove();
  return div.innerHTML;
}

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

// function to fetch wordpress REST API
async function spesificPageFetch() {
  try {
    const response = await fetch(apiURL);
    const responseJson = await response.json();
    // changeing the h1 of the artile based on wordpress post
    const title = document.querySelector("h1");
    title.innerHTML = responseJson.title.rendered;
    // changeing the subinfo of the artile based on wordpress post
    const subInfo = document.querySelector(".sub-info");
    subInfo.innerHTML = getArticleSubinfo(responseJson.content.rendered);

    // getArticleSubinfo
    // changee the publishing date using the timeSince() function
    const publishingDate = document.querySelector(".publishing-date");
    publishingDate.innerHTML = `Published ${timeSince(responseJson.date)} ago`;
    // changing the img based on the first img in the article
    const mainImg = document.querySelector(".main-picture > img");
    mainImg.src = responseJson.x_featured_media_original;
    // render html for the article section using the Word Press Api
    const article = document.querySelector("article");
    article.innerHTML = deleteTopSection(responseJson.content.rendered);
  } catch {}
}
spesificPageFetch();
