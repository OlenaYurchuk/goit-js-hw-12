import { KEY } from "./js/pixabay-api";
import { galleryEl, createCardsList } from "./js/render-functions";

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const searchFormEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-field');
const loadMoreBtn = document.querySelector('.more-photos');
const loaderEl = document.querySelector('.loader');

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
            loaderEl.classList.remove('hidden');
            loadMoreBtn.classList.remove('hidden');
            loaderEl.classList.add('hidden');
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

function clearAll() {
    galleryEl.innerHTML = '';
    loadMoreBtn.classList.add('hidden');
}