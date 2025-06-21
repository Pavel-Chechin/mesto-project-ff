//Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

//Функция создания карточки
export function createCard(cardData, handleDelete, handleLike, handleImagePopup) {
  const cardElement = cardTemplate.cloneNode(true); //
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener('click', () => handleImagePopup(cardData.name, cardData.link));
  deleteButton.addEventListener('click', handleDelete);
  likeButton.addEventListener('click', handleLike);

  return cardElement;
}

//Функция удаления карточки
export function deleteCard(evt) {
    evt.target.closest('.card').remove();
}

//Функция лайка карточки
export function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}