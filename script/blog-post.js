const param = new URLSearchParams(document.location.search);
const idParam = param.get("id");

const apiURL = `https://api.frinans.casa/wp-json/wp/v2/posts/${idParam}?_embed`;
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

// function that deletes the first <p> of the article
function getAllSection(articleString) {
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
    // remove loading

    const response = await fetch(apiURL);
    const responseJson = await response.json();
    console.log(responseJson);
    // changeing the h1 of the artile based on wordpress post
    const title = document.querySelector("h1");
    title.innerHTML = responseJson.title.rendered;
    document.title = responseJson.title.rendered;
    // changeing the subinfo of the artile based on wordpress post
    const subInfo = document.querySelector(".sub-info");
    subInfo.innerHTML = getArticleSubinfo(responseJson.content.rendered);

    // getArticleSubinfo
    // changee the publishing date using the timeSince() function
    const publishingDate = document.querySelector(".publishing-date");
    publishingDate.innerHTML = `Published ${timeSince(responseJson.date)} ago`;
    // changing the img based on featured img

    const mainImg = document.querySelector("img");
    mainImg.src = responseJson.x_featured_media_original;
    mainImg.alt = responseJson._embedded["wp:featuredmedia"][0].alt_text;

    // render html for the article section using the Word Press Api
    const article = document.querySelector("article");
    article.innerHTML = deleteTopSection(responseJson.content.rendered);
    //

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    const modal = document.querySelector(".img-modal");
    const imgs = document.querySelectorAll("img");
    const modalImg = document.querySelector(".modal-content");
    const captionText = document.getElementById("caption");

    // loops on all imgs in the article and adds event listener
    imgs.forEach((img) => {
      console.log(img);
      img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
      };
    });
    // close modal when clicking close Btn

    modal.addEventListener("click", function (event) {
      // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
      const isOutside = !event.target.closest(".modual-content-container");
      if (isOutside) {
        closeModal();
      }
    });

    function closeModal() {
      modal.style.display = "none";
    }
    const loading = document.querySelectorAll(".loading");
    console.log(loading);
    loading.forEach((element) => {
      element.classList.remove("loading");
    });
  } catch {}
}
spesificPageFetch();

var modal = document.getElementById("myModal");
