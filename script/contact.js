const contactForm = document.querySelector(".contact-form");
const formToaster = document.querySelector(".formToast");

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
    console.log(responseJson);
    const status = responseJson.status;

    formToaster.innerHTML = "";
    if (status === "validation_failed") {
      if (formToaster.classList.contains("success")) {
        formToaster.classList.remove("success");
      }
      formToaster.classList.add("error");
      formToaster.innerHTML = responseJson.message;
      const formInputs = event.target.querySelectorAll("input");
      responseJson.invalid_fields.forEach((error) => {
        let errorId = error.error_id.split("-ve-").pop();
        formInputs.forEach((input) => {
          if (input.name === errorId) {
            input.classList.add("error");
            const inputContainer = input.parentElement;
            input.parentElement.querySelector(".error-info-field").innerHTML =
              error.message;
          }
        });
      });
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
