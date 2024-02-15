export const galleryEl = document.querySelector('.gallery');

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

    return markup;
};

export { createCardsList };
