const apiKey = ''; 

function searchBooks() {
    var query = document.getElementById('search-bar').value;
    var url = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(query) + '&key=' + apiKey;

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            if (data.items) {
                displayBooks(data.items);
            } else {
                displayBooks([]);
            }
        })
        .catch(function(error) {
            console.log('Error:', error);
            document.getElementById('book-list').innerHTML = '<p>Error fetching data</p>';
        });
}

function displayBooks(books) {
    var bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(function(book) {
        var bookDiv = document.createElement('div');
        bookDiv.className = 'slide';
        bookDiv.innerHTML = `
            <h3>${book.volumeInfo.title}</h3>
            <p><strong>Author:</strong> ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
            <p><strong>Published:</strong> ${book.volumeInfo.publishedDate || 'N/A'}</p>
            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}" />
            <p><button onclick="showBookDetails('${book.id}')">Read more</button></p>
        `;
        bookList.appendChild(bookDiv);
    });

    currentSlideIndex = 0;
    showSlides();
}

function showBookDetails(bookId) {
    var url = 'https://www.googleapis.com/books/v1/volumes/' + bookId + '?key=' + apiKey;

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            var modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>${data.volumeInfo.title}</h2>
                <p><strong>Author:</strong> ${data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'Unknown'}</p>
                <p><strong>Published:</strong> ${data.volumeInfo.publishedDate || 'N/A'}</p>
                <img src="${data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'}" alt="${data.volumeInfo.title}" />
                <p><strong>Description:</strong> ${data.volumeInfo.description || 'No description available.'}</p>
            `;
            document.getElementById('book-modal').style.display = 'block';
        })
        .catch(function(error) {
            console.error('Error fetching book details:', error);
        });
}

function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
}

var currentSlideIndex = 0;

function moveSlide(step) {
    currentSlideIndex += step;
    showSlides();
}

function showSlides() {
    var slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    }
    if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }

    var offset = -currentSlideIndex * (slides[0].offsetWidth + 20);
    document.querySelector('.slides').style.transform = 'translateX(' + offset + 'px)';
}
