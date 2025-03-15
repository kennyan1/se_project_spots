const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__error",
    errorClass: "modal__error_visible"
  }

const showInputError = (formEl, inputEl, errorMsg) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID); 


    if (errorMsgEl) {  
        errorMsgEl.textContent = errorMsg; 
        errorMsgEl.style.display = "block"; 
        inputEl.classList.add("modal__input_type_error");
    }
};

const hideInputError = (formEl, inputEl) => {
    const errorMsgID = inputEl.id + "-error"; 
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);

    if (errorMsgEl) {
        errorMsgEl.textContent = ""; 
        errorMsgEl.style.display = "none"; 
        inputEl.classList.remove("modal__input_type_error");
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
       return !input.validity.valid; 
    });
}

const toggleButtonState = (inputList, buttonEl, config) => {
    if  (hasInvalidInput(inputList)) {
        disableButton(buttonEl);
        buttonEl.classList.add(config.inactiveButtonClass);
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove(config.inactiveButtonClass);
    }
};

const disableButton = (buttonEl, config) => {
    buttonEl.disabled = true;
}

const checkInputValidity = (formEl, inputEl) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage); 
    } else {
        hideInputError(formEl, inputEl); 
    }
};

const setEventListeners = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);
    
    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formEl, inputElement);
            toggleButtonState(inputList, buttonElement, config); 
        });
    });
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
        setEventListeners(formEl, config); 
    });
};

enableValidation(settings); 