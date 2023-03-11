import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const throttle = require('lodash.throttle');
import { search } from './js/searchFunction';

const URL = 'https://pixabay.com/api/';
const API_KEY = '34119717-c2cb4bf5c1e24db7e8481730d';
let PAGE;
let searchQueryValue;
let largeGallery;

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
const buttonScroll = document.querySelector('.button-scroll');
let buttonScrollStatus = false;

buttonScroll.addEventListener('click', () => {
    buttonScroll.classList.toggle('button-scroll-active');
    buttonLoadMore.classList.add('diplay-none');
    if (!buttonScrollStatus) {
        buttonScrollStatus = true;
    } else {
        buttonScrollStatus = false;
    };
});

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

const smoothScrolling = () => {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

const loadMore = async () => {
    try {
        const response = await search(URL, searchQueryValue, API_KEY, PAGE);
        renderGallery(response.data.hits);
        largeGallery.refresh();
        smoothScrolling();
        if (PAGE * 40 >= response.data.totalHits) {
            buttonLoadMore.classList.add('diplay-none');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            return;
        };
        PAGE += 1;
    } catch (error) {
        console.log(error);
    };
};

searchForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const {
        elements: { searchQuery }
    } = evt.currentTarget;
    if (searchQuery.value.trim() === "") return;
    buttonLoadMore.classList.add('diplay-none');
    gallery.innerHTML = "";
    PAGE = 1;

    try {
        const response = await search(URL, searchQuery.value, API_KEY, PAGE);
        if (response.data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        };
        renderGallery(response.data.hits);
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
        largeGallery = new SimpleLightbox('.gallery a');
        searchQueryValue = searchQuery.value;
        PAGE += 1;
        if (response.data.totalHits > 40 && !buttonScrollStatus) {
            setTimeout(() => {
                buttonLoadMore.classList.remove('diplay-none');
            }, 1000);
        };
    } catch (error) {
        console.log(error);
    }
});

buttonLoadMore.addEventListener('click', loadMore);

document.addEventListener('scroll', throttle((evt) => {
    const { clientHeight, scrollTop, scrollHeight } = evt.target.scrollingElement;
    if (clientHeight + scrollTop >= scrollHeight - clientHeight * 0.15 && buttonScrollStatus) {
        loadMore();
    };
    if (!buttonScrollStatus) {
        buttonLoadMore.classList.remove('diplay-none');
    };
}, 200));
