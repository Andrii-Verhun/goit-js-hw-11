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
    })
      .catch((error) => {
        console.log(error);
    });
    
});


















