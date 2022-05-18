const contactForm = document.querySelector(".contact-form");
const formToaster = document.querySelector(".formToast");
function formSubmissionHandler(event) {
  event.preventDefault();

  const formElement = event.target,
    { action, method } = formElement,
    body = new FormData(formElement);
  console.log(body);
  fetch(action, {
    method,
    body,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response.status);
      // Determine if the submission is not valid
      if (isFormSubmissionError(response)) {
        // Handle the case when there are validation errors
      }
      // Handle the happy path
    })
    .catch((error) => {
      // Handle the case when there's a problem with the request
    });
}

async function formHandler(event) {
  event.preventDefault();
  try {
    const formElement = event.target,
      { action, method } = formElement,
      body = new FormData(formElement);
    const response = await fetch(action, {
      method,
      body,
    });
    const responseJson = await response.json();
    const status = responseJson.status;
    console.log(responseJson);
    formToaster.innerHTML = "";
    if (status === "validation_failed") {
      if (formToaster.classList.contains("success")) {
        formToaster.classList.remove("success");
      }
      formToaster.classList.add("error");
      formToaster.innerHTML = responseJson.message;
      console.log(formToaster);
    } else if (status === "mail_sent") {
      if (formToaster.classList.contains("error")) {
        formToaster.classList.remove("error");
      }
      formToaster.classList.add("success");
      formToaster.innerHTML = responseJson.message;
    }
  } catch {}
}

contactForm.onsubmit = formHandler;
