import "./index.css";
import { enableValidation, settings, disableButton, resetValidation } from "../scripts/validation.js";
import avatarPic from "../images/avatar.jpg";
import pencilIcon from "../images/pencil.svg";
import plusIcon from "../images/plus.svg";
import spotsLogo from "../images/logo.svg";
import lightPencil from "../images/light-pencil.svg";
import { data } from "autoprefixer";
import Api from "../utils/Api.js";

let currentUserId = "";

const avatarImage = document.getElementById("avatar");
avatarImage.src = avatarPic;

const pencil = document.getElementById("pencil");
pencil.src = pencilIcon;

const plus = document.getElementById("plus");
plus.src = plusIcon;

const logo = document.getElementById("logo");
logo.src = spotsLogo;

const whitePencil = document.getElementById("lightPencil");
whitePencil.src = lightPencil;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "79c4cffd-c619-4234-a93c-751210ad82be",
    "Content-Type": "application/json"
  }
});

api.getAppInfo().then(([userData, cards]) => {
    avatarImage.src = userData.avatar; 
    profileName.textContent = userData.name; 
    profileDescription.textContent = userData.about;
    currentUserId = userData._id; 

    cards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.prepend(cardElement);
    });
}).catch(err => {
    console.error("Failed to load cards:", err);
});

// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form Elements
const editModal = document.querySelector("#edit-modal");
const editFormModal = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

// Card Form Elements
const cardModal = document.querySelector("#modal-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar Form Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Preview Modal Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn_type_preview");

// Card Related Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Delete Modal Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteConfirmBtn = deleteModal.querySelector(".modal__delete-btn");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

function getCardElement(data) {
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);

    const cardNameEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtn = cardElement.querySelector(".card__like-btn");
    const cardDeleteBtn = cardElement.querySelector(".card__trash-btn");

    cardNameEl.textContent = data.name;
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;

    cardElement.dataset.cardId = data._id;
    cardElement.likes = data.likes || [];

    updateLikeButtonState(cardLikeBtn, cardElement.likes);

    cardLikeBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    handleLike(cardElement, cardLikeBtn);
});

    cardDeleteBtn.addEventListener("click", () => {
        deleteModal.dataset.cardId = data._id;
        deleteModal.cardElement = cardElement;
        openModal(deleteModal);
    });

    cardImageEl.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImageEl.src = data.link;
        previewModalImageEl.alt = data.name;
        previewModalCaptionEl.textContent = data.name;
    });

    return cardElement;
}

function updateLikeButtonState(likeButton, likesArray) {
    const isLiked = likesArray && likesArray.some(like => like._id === currentUserId);
    if (isLiked) {
        likeButton.classList.add("card__like-btn_liked");
    } else {
        likeButton.classList.remove("card__like-btn_liked");
    }
    likeButton.dataset.likes = JSON.stringify(likesArray || []);
}

function handleLike(cardElement, likeButton) {

    if (likeButton.disabled) {
        console.log('Like button already processing - ignoring click');
        return;
    }

    const cardId = cardElement.dataset.cardId;
    const isLiked = likeButton.classList.contains("card__like-btn_liked");
    
    likeButton.disabled = true;
    
     api.changeLikeStatus(cardId, isLiked)
        .then((updatedCard) => {
            cardElement.likes = updatedCard.likes;
            updateLikeButtonState(likeButton, updatedCard.likes);
        })
        .catch(err => {
            console.error("Error updating like status:", err);
            likeButton.classList.add('card__like-btn_error');
            setTimeout(() => {
                likeButton.classList.remove('card__like-btn_error');
            }, 500);
        })
        .finally(() => {
            likeButton.disabled = false;
        });
}

function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscKey);
    modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscKey);
    modal.removeEventListener("click", handleOverlayClick);
}

function handleEscKey(evt) {
    if (evt.key === "Escape") {
        const openedModal = document.querySelector(".modal_opened");
        if (openedModal) {
            closeModal(openedModal);
        }
    }
}

function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  toggleButtonLoading(evt.submitter, true);
  
  api.editUserInfo({
    name: editModalNameInput.value, 
    about: editModalDescriptionInput.value
  })
  .then((userData) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closeModal(editModal);
  })
  .catch(err => {
    console.error("Error updating profile:", err);
  })
  .finally(() => {
    toggleButtonLoading(evt.submitter, false);
  });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  toggleButtonLoading(evt.submitter, true);
  
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  
  api.addNewCard(inputValues)
    .then((newCard) => {
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      toggleButtonLoading(evt.submitter, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  toggleButtonLoading(evt.submitter, true);
  
  api.editAvatarInfo({ avatar: avatarInput.value })
    .then((userData) => {
      avatarImage.src = userData.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      toggleButtonLoading(evt.submitter, false);
    });
}

function handleDeleteConfirm(evt) {
  evt.preventDefault();
  toggleButtonLoading(evt.target, true, 'Deleting...');
  
  const cardId = deleteModal.dataset.cardId;
  const cardElement = deleteModal.cardElement;

  api.deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      closeModal(deleteModal);
    })
    .catch(err => {
      console.error("Error deleting card:", err);
    })
    .finally(() => {
      toggleButtonLoading(evt.target, false);
    });
}

function toggleButtonLoading(button, isLoading, loadingText = 'Saving...') {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText;
    button.disabled = false;
  }
}

// Event Listeners
profileEditButton.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
    resetValidation(editFormModal, settings);
    openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
    closeModal(editModal);
});

cardModalCloseBtn.addEventListener("click", () => {
    closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
});

cardModalBtn.addEventListener("click", () => {
    cardForm.reset(); 
    disableButton(cardSubmitBtn, settings); 
    openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => { 
    avatarInput.value = avatarImage.src;
    resetValidation(avatarForm, settings);
    disableButton(avatarSubmitBtn, settings);
    openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
    closeModal(avatarModal);
});

deleteConfirmBtn.addEventListener("click", handleDeleteConfirm);
deleteCancelBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalCloseBtn.addEventListener("click", () => {closeModal(deleteModal);
});

editFormModal.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

enableValidation(settings);