import { search } from './js/searchFunction';

const URL = 'https://pixabay.com/api/';
const API_KEY = '34119717-c2cb4bf5c1e24db7e8481730d';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const {
        elements: { searchQuery }
    } = evt.currentTarget;

    search(URL, searchQuery.value, API_KEY) .then((response) => {
        console.log(response);
        renderGallery(response.data.hits);
    })
      .catch((error) => {
        console.log(error);
    });
    
});

const renderGallery = (images = []) => {
    const galleryElements = images.reduce((acc, { webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return acc + `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div></div>`;
}, "")
    gallery.innerHTML = galleryElements;
};
















