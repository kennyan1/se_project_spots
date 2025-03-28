const initialCards = [
    {name: "Val Thorens", 
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
    {name: "Restaurant terrace", 
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
    {name: "An outdoor cafe", 
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
    {name: "A very long bridge, over the forest and through the trees", 
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
    {name: "Tunnel with morning light", 
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
    {name: "Mountain house", 
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
];

//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//Form Elements
const editModal = document.querySelector("#edit-modal");
const editFormModal = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

//Card Form Elements
const cardModal = document.querySelector("#modal-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//select the modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn_type_preview");

//Card Related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);

    const cardNameEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtn = cardElement.querySelector(".card__like-btn");
    const cardDeleteBtn = cardElement.querySelector(".card__trash-btn");

    cardNameEl.textContent = data.name;
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;

    cardLikeBtn.addEventListener("click", () => {
        cardLikeBtn.classList.toggle("card__like-btn_liked");
    });

    
    cardDeleteBtn.addEventListener("click", () => {
        cardElement.remove(); 
    });

    cardImageEl.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImageEl.src = data.link;
        previewModalImageEl.alt = data.name;
        previewModalCaptionEl.textContent = data.name;
    });
    

    return cardElement;
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
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editModal);
};

function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    closeModal(cardModal);
    cardForm.reset();
    disableButton(cardSubmitBtn, settings);
    
};

profileEditButton.addEventListener("click", ()=> {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
    resetValidation(editFormModal, settings);
    openModal(editModal);
});
editModalCloseBtn.addEventListener("click", () => {
    closeModal(editModal);
});

cardModalBtn.addEventListener("click", ()=> {
    openModal(cardModal);
});
cardModalCloseBtn.addEventListener("click", () => {
    closeModal(cardModal);
});
previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
});

editFormModal.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.prepend(cardElement);
});