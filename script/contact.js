const contactForm = document.querySelector(".contact-form");
const formToaster = document.querySelector(".formToast");

async function formHandler(event) {
  // prevnts form to submit regulary
  event.preventDefault();
  try {
    // targets the forms action and method and
    const formElement = event.target,
      { action, method } = formElement,
      body = new FormData(formElement);
    console.log(action);
    const response = await fetch(action, {
      method,
      body,
    });
    const responseJson = await response.json();
    console.log(responseJson);
    const status = responseJson.status;

    formToaster.innerHTML = "";
    if (status !== "mail_sent") {
      if (formToaster.classList.contains("success")) {
        formToaster.classList.remove("success");
      }
      formToaster.classList.add("error");
      formToaster.innerHTML = responseJson.message;
    } else if (status === "mail_sent") {
      if (formToaster.classList.contains("error")) {
        formToaster.classList.remove("error");
      }
      formToaster.classList.add("success");
      formToaster.innerHTML = responseJson.message;
    }
    const nameInput = event.target.querySelector("#nameInput");
    const emailInput = event.target.querySelector("#emailInput");
    const subjectInput = event.target.querySelector("#subjectInput");
    const messageArea = event.target.querySelector("#messageArea");
    console.log(emailInput);

    // validating the inputs with length limitations.
    function inputValidation(input, length) {
      if (input.value.length < length) {
        input.classList.add("error");
        input.parentElement.querySelector(
          ".error-info-field",
        ).innerHTML = `this field is to short! riquired length is ${length}`;
        if (input.value.length === 0) {
          input.classList.add("error");
          input.parentElement.querySelector(".error-info-field").innerHTML =
            "this field is requiered";
        }
      } else {
        if (input.classList.contains("error")) {
          input.classList.remove("error");
          input.parentElement.querySelector(".error-info-field").innerHTML = "";
        }
        {
        }
      }
    }

    // validating the email value of the email input with a regular expresion.
    function emailValidation(input) {
      const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!emailRegEx.test(input.value)) {
        if (input.value.length < 1) {
          input.parentElement.querySelector(".error-info-field").innerHTML =
            "this field is requiered";
        } else {
          input.parentElement.querySelector(".error-info-field").innerHTML =
            "please insert a valid email";
        }
        input.classList.add("error");
      } else {
        if (input.classList.contains("error")) {
          input.classList.remove("error");
          input.parentElement.querySelector(".error-info-field").innerHTML = "";
        }
      }
    }
    inputValidation(nameInput, 5);
    inputValidation(subjectInput, 10);
    inputValidation(messageArea, 25);
    emailValidation(emailInput);
  } catch (e) {
    console.log(e);
  }
}

contactForm.onsubmit = formHandler;
