import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { search } from './js/searchFunction';

const URL = 'https://pixabay.com/api/';
const API_KEY = '34119717-c2cb4bf5c1e24db7e8481730d';
let PAGE;
let searchQueryValue;
let largeGallery;

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more')

const renderGallery = (images = []) => {
    const galleryElements = images.reduce((acc, { webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return acc + `<div class="photo-card"><a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes</b><br>${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div></a></div>`;
}, "")
    gallery.insertAdjacentHTML('beforeend', galleryElements);
};

searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const {
        elements: { searchQuery }
    } = evt.currentTarget;
    buttonLoadMore.classList.add('diplay-none');
    gallery.innerHTML = "";
    PAGE = 1;

    search(URL, searchQuery.value, API_KEY, PAGE).then((response) => {
        if (response.data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        };
        PAGE += 1;
        searchQueryValue = searchQuery.value;
        renderGallery(response.data.hits);
        largeGallery = new SimpleLightbox('.gallery a');
        if (response.data.totalHits > 40) {
            setTimeout(() => {
                buttonLoadMore.classList.remove('diplay-none');
            }, 1000);
        };
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    })
      .catch((error) => {
        console.log(error);
    });
});

buttonLoadMore.addEventListener('click', () => {
    search(URL, searchQueryValue, API_KEY, PAGE).then((response) => {
        renderGallery(response.data.hits);
        largeGallery.refresh();
        if (PAGE * 40 >= response.data.totalHits) {
            buttonLoadMore.classList.add('diplay-none');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            return;
        };
        PAGE += 1;
    })
    .catch((error) => {
        console.log(error);
    });
});

















