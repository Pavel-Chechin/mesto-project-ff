//Обработка закрытия попапа по нажатию Esc
function handleEscapeKey (evt) {
    if (evt.key === 'Escape') {
        closePopup(document.querySelector('.popup_is-opened'));
    }
}

//Функция открытия попапа
export function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKey);
}

//Функция закрытия попапа
export function closePopup(popupElement) {
  popupElement.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKey);
}

//Обработка закрытия попапа
export function handlePopupClose (evt) {
    if (evt.target === evt.currentTarget) {
        closePopup(evt.currentTarget);
    }

    if (evt.target.closest('.popup__close')) {
        return closePopup(evt.target.closest('.popup'));
    }
}