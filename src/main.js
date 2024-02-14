import { KEY } from "./js/pixabay-api";

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const searchFormEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-field');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.more-photos');
const loaderEl = document.querySelector('.loader');

loaderEl.classList.add('hidden');
loadMoreBtn.classList.add('hidden');

let searchItems = '';
let lightbox = new SimpleLightbox('.gallery a', {});

let currentPage = 1;
let perPage = 15;

axios.defaults.baseURL = 'https://pixabay.com/api/';

searchFormEl.addEventListener('submit', onSearchForm);

function onSearchForm(event) {
    event.preventDefault();
    galleryEl.innerHTML = '';
    searchItems = inputEl.value.trim();

    if (searchItems === '') {
        clearAll();
        return;
    }

    fetchPhotos(searchItems, currentPage)   
    loadMoreBtn.classList.add('hidden');
    searchFormEl.reset();
}

loadMoreBtn.addEventListener('click', onLoadMore);

async function onLoadMore() {
    currentPage += 1;
    await fetchPhotos(searchItems, currentPage);
    
    const totalPages = Math.ceil(100 / perPage);
    if (currentPage > totalPages) {
        loadMoreBtn.classList.add('hidden');
        return iziToast.error({
            position: 'topRight',
            message: 'We are sorry, but you have reached the end of search results'
        });  
    }
}

async function fetchPhotos(searchItems, page) {
    const params = new URLSearchParams({
        per_page: perPage,
        page: currentPage
    });

    try {
        loaderEl.classList.remove('hidden');
        const response = await axios.get(`?key=${KEY}&q=${searchItems}&image_type=photo&orientation=horizontal&safesearch=true&${params}`);
        const data = response.data;
        createCardsList(data.hits);
        lightbox.refresh();
        loaderEl.classList.add('hidden');

        if ((page - 1) * perPage + data.hits.length < data.totalHits) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }

        if (data.hits.length === 0) {
            loaderEl.classList.add('hidden');
            iziToast.error({
                position: 'topRight',
                message: 'Sorry, there are no images matching <br/> your search query. Please try again!'
            });
        }
    }
    catch (error) {
        console.error('Error fetching images:', error);
        loaderEl.classList.add('hidden');
    }
}

function createCardsList(cards) {
    
    const markup = cards.map(card => 
        `<li class="gallery-item">
             <div class="card-top">
            <a class="card-link" href="${card.largeImageURL}">
                <img class="card-image" src="${card.webformatURL}" alt="${card.tags}">
            </a>
        </div>
        <div class="card-bottom">
            <p class="card-likes">Likes <span class="card-value">${card.likes}</span></p>
            <p class="card-views">Views <span class="card-value">${card.views}</span></p>
            <p class="card-comments">Comments <span class="card-value">${card.comments}</span></p>
            <p class="card-downloads">Downloads <span class="card-value">${card.downloads}</span></p>
        </div>
        </li>`
    ).join('');

    galleryEl.insertAdjacentHTML('beforeend', markup);
};

function clearAll() {
    galleryEl.innerHTML = '';
    loadMoreBtn.classList.add('hidden');
}