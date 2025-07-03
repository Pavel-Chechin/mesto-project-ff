import "./pages/index.css";
import { createCard } from "./components/card";
import { openPopup, closePopup, handlePopupClose } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import {
  getProfile,
  getCards,
  editProfile,
  postCard,
  unlikeCardApi,
  likeCardApi,
  deleteCard,
  editProfileImage,
} from "./components/api";

//DOM узлы
const placesList = document.querySelector(".places__list");
const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardForm = newCardPopup.querySelector(".popup__form");
const inputCardName = newCardForm.querySelector(".popup__input_type_card-name");
const inputCardLink = newCardForm.querySelector(".popup__input_type_url");
const addCardButton = document.querySelector(".profile__add-button");

const popupImageElement = document.querySelector(".popup_type_image");
const popupImageCaption = document.querySelector(".popup__caption");
const popupImage = document.querySelector(".popup__image");

const profileEditButton = document.querySelector(".profile__edit-button");
const profilePopupEdit = document.querySelector(".popup_type_edit");
const profileFormElement = document.querySelector(".popup__form");
const profileNameInput = document.querySelector(".popup__input_type_name");
const profileDescriptionInput = document.querySelector(
  ".popup__input_type_description"
);
const profileEditSubmit = profileFormElement.querySelector(".popup__button");

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const profileImage = document.querySelector(".profile__image");
const profileImageForm = document.forms["new-avatar"];
const profileImageUrlInput = profileImageForm.elements["avatar-link"];
const popupProfileImage = document.querySelector(".popup_type_edit_avatar");
const profileImageFormSubmit = profileImageForm.querySelector(".popup__button");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type-error",
  errorClass: "popup__error_visible",
};

let userId; //Идентификатор пользователя

const promises = [getCards(), getProfile()];

//сабмит формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const profileData = {
    name: profileNameInput.value,
    about: profileDescriptionInput.value,
  };

  setSubmitButtonState(true, profileEditSubmit);

  editProfile(profileData)
    .then((updatedProfileData) => {
      profileName.textContent = updatedProfileData.name;
      profileDescription.textContent = updatedProfileData.about;
      closePopup(profilePopupEdit);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля: ", err);
    })
    .finally(() => {
      setSubmitButtonState(false, profileEditSubmit);
    });
}

//открытие формы редактирования профиля
function handleProfileFormOpen() {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileFormElement, validationConfig);
  openPopup(profilePopupEdit);
}

//открытие попапа изображения
function handleImagePopupOpen(cardName, cardLink) {
  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupImageCaption.textContent = cardName;

  openPopup(popupImageElement);
}

function handleDeleteCard(cardElement, cardId) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки: ", err);
    });
}

const setSubmitButtonState = (isLoading, buttonElement) => {
  buttonElement.textContent = isLoading ? "Сохранение..." : "Сохранить";
  buttonElement.disabled = isLoading;
};

function handleLike(evt) {
  const likeButton = evt.target;
  const cardElement = likeButton.closest(".card");
  const cardId = cardElement.dataset.cardId;
  const likeCounter = cardElement.querySelector(".card__like-number");
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const apiMethod = isLiked ? unlikeCardApi : likeCardApi;

  likeButton.disabled = true; //блокировка на время запроса

  apiMethod(cardId)
    .then((updatedCard) => {
      likeCounter.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.error("Ошибка при обработке лайка картинки: ", err);
    })
    .finally(() => {
      likeButton.disabled = false;
    });
}

//Обработка формы добавления новой карточки
newCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: inputCardName.value,
    link: inputCardLink.value,
  };

  setSubmitButtonState(true, addCardButton);

  postCard(newCardData)
    .then((cardData) => {
      cardData.isMine = true;
      cardData.isLiked = false;
      cardData.numberLikes = 0;

      const newCard = createCard(
        userId,
        cardData,
        handleDeleteCard,
        handleLike,
        handleImagePopupOpen
      );
      placesList.prepend(newCard);
      closePopup(newCardPopup);
      newCardForm.reset();
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки: ", err);
    })
    .finally(() => {
      setSubmitButtonState(false, addCardButton);
    });
});

profileImageForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  setSubmitButtonState(true, profileImageFormSubmit);
  const profileImageUrl = profileImageUrlInput.value;

  editProfileImage({ avatar: profileImageUrl })
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closePopup(popupProfileImage);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара: ", err);
    })
    .finally(() => {
      setSubmitButtonState(false, profileImageFormSubmit);
    });
});

//открытие попапа для редактирования изображения профиля
profileImage.addEventListener("click", () => {
  profileImageForm.reset();
  clearValidation(profileImageForm, validationConfig);
  openPopup(popupProfileImage);
});

//Открытие попапа для создания новой карточки
addCardButton.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openPopup(newCardPopup);
});

Promise.all(promises)
  .then(([cardsData, userData]) => {
    userId = userData._id; //сохранение id текущего пользователя

    cardsData.forEach((cardData) => {
      cardData.numberLikes = cardData.likes.length;

      const newCard = createCard(
        userId,
        cardData,
        handleDeleteCard,
        handleLike,
        handleImagePopupOpen
      );
      placesList.append(newCard);
    });

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;
  })
  .catch((err) => {
    console.error("Ошибка при загрузке начальных данных: ", err);
  });

//обработка формы редактирования профиля
profileFormElement.addEventListener("submit", handleProfileFormSubmit);

//открытие формы редактирования профиля
profileEditButton.addEventListener("click", handleProfileFormOpen);

//обработка закрытия попапов
popupImageElement.addEventListener("click", handlePopupClose);

profilePopupEdit.addEventListener("click", handlePopupClose);

newCardPopup.addEventListener("click", handlePopupClose);

popupProfileImage.addEventListener("click", handlePopupClose);

enableValidation(validationConfig);
