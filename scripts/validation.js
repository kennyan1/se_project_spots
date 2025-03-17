const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible"
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);

    if (errorMsgEl) {
        errorMsgEl.textContent = errorMsg;
        errorMsgEl.classList.add(config.errorClass);
        inputEl.classList.add(config.inputErrorClass);
    }
};

const hideInputError = (formEl, inputEl, config) => {
    const errorMsgID = inputEl.id + "-error";
    const errorMsgEl = formEl.querySelector("#" + errorMsgID);

    if (errorMsgEl) {
        errorMsgEl.textContent = "";
        errorMsgEl.classList.remove(config.errorClass);
        inputEl.classList.remove(config.inputErrorClass);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
        return !input.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonEl, config) => {
    if (hasInvalidInput(inputList)) {
        disableButton(buttonEl, config);
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove(config.inactiveButtonClass);
    }
};

const disableButton = (buttonEl, config) => {
    buttonEl.disabled = true;
    buttonEl.classList.add(config.inactiveButtonClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
    } else {
        hideInputError(formEl, inputEl, config);
    }
};

const setEventListeners = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formEl, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};

const resetValidation = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formEl, inputElement, config);
    });

    toggleButtonState(inputList, buttonElement, config);
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
        setEventListeners(formEl, config);
    });
};

enableValidation(settings);