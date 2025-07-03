//Темплейт карточки
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

//Функция создания карточки
export function createCard(
  cardData,
  handleDelete,
  handleLike,
  handleImagePopup
) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-number");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.numberLikes;
  cardElement.dataset.cardId = cardData._id;

  if (cardData.isMine) {
    deleteButton.addEventListener("click", () =>
      handleDelete(cardElement, cardData._id)
    );
  } else {
    deleteButton.style.display = "none";
  }

  if (cardData.isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  cardImage.addEventListener("click", () =>
    handleImagePopup(cardData.name, cardData.link)
  );
  likeButton.addEventListener("click", (evt) => handleLike(evt));

  return cardElement;
}
