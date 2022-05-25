let i = 0;

const carousel = document.querySelector(".carousel-wrapper");
const currentOptionText1 = document.querySelector(".current-option-text1");
const currentOptionText2 = document.querySelector(".current-option-text2");
const optionPrevious = document.querySelector(".previous-option");
const optionNext = document.querySelector(".next-option");
const carusellImg = document.querySelector(".image");
console.log(optionNext);
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
const baseApiUrl = "https://api.frinans.casa/wp-json/wp/v2/posts";
(async function carusellFetch() {
  const newPostResponse = await fetch(baseApiUrl + "?per_page=12");
  const newPostsJson = await newPostResponse.json();
  currentOptionText1.innerHTML = newPostsJson[i].title.rendered;
  carusellImg.style.backgroundImage = `url('${newPostsJson[i].x_featured_media_original}')`;
  carusellImg.href = `/news/article.html?id=${newPostsJson[i].id}`;
  currentOptionText2.innerHTML = `published ${timeSince(
    newPostsJson[i].date,
  )} ago`;

  optionNext.onclick = function () {
    i = i + 1;
    i = i % newPostsJson.length;
    carousel.classList.add("anim-next");
    setTimeout(() => {
      carusellImg.style.backgroundImage = `url('${newPostsJson[i].x_featured_media_original}')`;
      carusellImg.href = `/news/article.html?id=${newPostsJson[i].id}`;
    }, 455);
    setTimeout(() => {
      currentOptionText1.innerHTML = newPostsJson[i].title.rendered;
      currentOptionText2.innerHTML = `published ${timeSince(
        newPostsJson[i].date,
      )} ago`;
      carousel.classList.remove("anim-next");
    }, 650);
  };

  optionPrevious.onclick = function () {
    if (i === 0) {
      i = newPostsJson.length;
    }
    i = i - 1;
    carusellImg.href = `/news/article.html?id=${newPostsJson[i].id}`;
    carousel.classList.add("anim-prev");

    setTimeout(() => {
      carusellImg.style.backgroundImage = `url('${newPostsJson[i].x_featured_media_original}')`;
    }, 455);
    setTimeout(() => {
      currentOptionText1.innerHTML = newPostsJson[i].title.rendered;
      currentOptionText2.innerHTML = `published ${timeSince(
        newPostsJson[i].date,
      )} ago`;
      carousel.classList.remove("anim-prev");
    }, 650);
  };
})();
