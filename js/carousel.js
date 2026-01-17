/**
 * Carousel de Tipos de Calvície - Adriele Terapia Capilar
 * Galeria unificada com imagens reais
 */

// Lista de imagens do carrossel
const carouselImages = [
    {
        src: 'images/calvicie/img1.jpg',
        title: 'Tipos de Calvície - Vista Lateral e Superior',
        description: 'Padrões de calvície masculina mostrando diferentes estágios de perda capilar'
    },
    {
        src: 'images/calvicie/img2.jpg',
        title: 'Escala de Calvície Masculina',
        description: 'Progressão da calvície com vista lateral e superior em diferentes estágios'
    },
    {
        src: 'images/calvicie/img3.jpg',
        title: 'Estágios de Alopecia',
        description: 'Padrão feminino e masculino de perda capilar com numeração dos estágios'
    },
    {
        src: 'images/calvicie/img4.jpg',
        title: 'Alopecia Feminina',
        description: 'Diferentes apresentações de queda capilar em mulheres'
    },
    {
        src: 'images/calvicie/img5.jpg',
        title: 'Escala Ludwig Feminina',
        description: 'Progressão da alopecia feminina do estágio inicial ao avançado'
    },
    {
        src: 'images/calvicie/img6.png',
        title: 'Progressão da Calvície',
        description: 'Vista lateral e superior mostrando a evolução da perda de cabelo'
    },
    {
        src: 'images/calvicie/img7.png',
        title: 'Alopecia - Vista Superior',
        description: 'Diferentes graus de rarefação capilar vistos de cima'
    },
    {
        src: 'images/calvicie/img8.jpg',
        title: 'Ciclo da Calvície',
        description: 'Representação circular da progressão e possibilidade de tratamento'
    }
];

let currentIndex = 0;

// Inicializa o carrossel quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
});

function initCarousel() {
    const container = document.getElementById('carouselContainer');
    if (!container) return;

    // Cria a estrutura do carrossel
    container.innerHTML = `
        <div class="carousel-wrapper">
            <button class="carousel-btn prev" onclick="prevSlide()">❮</button>
            
            <div class="carousel-main">
                <div class="carousel-image-container">
                    <img id="carouselImage" src="${carouselImages[0].src}" alt="${carouselImages[0].title}">
                </div>
                <div class="carousel-info">
                    <h3 id="carouselTitle">${carouselImages[0].title}</h3>
                    <p id="carouselDescription">${carouselImages[0].description}</p>
                </div>
            </div>
            
            <button class="carousel-btn next" onclick="nextSlide()">❯</button>
        </div>
        
        <div class="carousel-indicators">
            ${carouselImages.map((_, i) => `
                <button class="indicator ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>
            `).join('')}
        </div>
        
        <div class="carousel-counter">
            <span id="currentSlide">1</span> / <span id="totalSlides">${carouselImages.length}</span>
        </div>
        
        <div class="carousel-thumbnails">
            ${carouselImages.map((img, i) => `
                <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})">
                    <img src="${img.src}" alt="${img.title}">
                </div>
            `).join('')}
        </div>
    `;

    // Inicia autoplay
    startAutoplay();
}

function updateCarousel() {
    const image = document.getElementById('carouselImage');
    const title = document.getElementById('carouselTitle');
    const description = document.getElementById('carouselDescription');
    const currentSlide = document.getElementById('currentSlide');
    const indicators = document.querySelectorAll('.indicator');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!image) return;

    // Animação de fade
    image.style.opacity = '0';

    setTimeout(() => {
        image.src = carouselImages[currentIndex].src;
        image.alt = carouselImages[currentIndex].title;
        title.textContent = carouselImages[currentIndex].title;
        description.textContent = carouselImages[currentIndex].description;
        currentSlide.textContent = currentIndex + 1;

        // Atualiza indicadores
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });

        // Atualiza thumbnails
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });

        image.style.opacity = '1';
    }, 200);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    updateCarousel();
    resetAutoplay();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
    resetAutoplay();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
}

// Autoplay
let autoplayInterval;

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});
