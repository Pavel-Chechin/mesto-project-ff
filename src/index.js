import './pages/index.css';
import { createCard, deleteCard, likeCard } from './components/card';
import { openPopup, closePopup, handlePopupClose } from './components/modal';
import { initialCards } from './components/cards';

//DOM узлы
const placesList = document.querySelector('.places__list');
const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup.querySelector('.popup__form');
const inputCardName = newCardForm.querySelector('.popup__input_type_card-name');
const inputCardLink = newCardForm.querySelector('.popup__input_type_url');
const addCardButton = document.querySelector('.profile__add-button');

const popupImageElement = document.querySelector('.popup_type_image');
const popupImageCaption = document.querySelector('.popup__caption');
const popupImage = document.querySelector('.popup__image');

const profileEditButton = document.querySelector('.profile__edit-button');
const profilePopupEdit = document.querySelector('.popup_type_edit');
const profileFormElement = document.querySelector('.popup__form');
const profileNameInput = document.querySelector('.popup__input_type_name');
const profileDescriptionInput = document.querySelector('.popup__input_type_description');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

//сабмит формы редвктирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  
  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;

  closePopup(profilePopupEdit);
}

//открытие формы редактирования профиля
function handleProfileFormOpen() {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  openPopup(profilePopupEdit);
}

//открытие попапа изображения
function handleImagePopupOpen(cardName, cardLink) {
  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupImageCaption.textContent = cardName;

  openPopup(popupImageElement);
}

//Обработка формы добавления новой карточки
newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: inputCardName.value,
    link: inputCardLink.value,
  };
  const newCard = createCard(newCardData, deleteCard, likeCard, handleImagePopupOpen);

  placesList.prepend(newCard);
  newCardForm.reset();
  closePopup(newCardPopup);
});

//Открытие попапа для создания новой карточки
addCardButton.addEventListener('click', () => {
  openPopup(newCardPopup);
});

//обработка формы редактирования профиля
profileFormElement.addEventListener('submit', handleProfileFormSubmit); 

//открытие формы редактирования профиля
profileEditButton.addEventListener('click', handleProfileFormOpen);

//обработка закрытия попапов
popupImageElement.addEventListener('click', handlePopupClose);

profilePopupEdit.addEventListener('click', handlePopupClose);

newCardPopup.addEventListener('click', handlePopupClose);

//вывод карточек на страницу
initialCards.forEach((cardData) => {
  placesList.append(
    createCard(
      cardData,
      deleteCard,
      likeCard,
      handleImagePopupOpen
    )
  )
});
