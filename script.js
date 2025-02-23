// Configuration
const CONFIG = {
    OMDB_API_KEY: '1ab1ca8e',
    PARTICLES: {
        HEADER: {
            COUNT: 2000,
            SIZE: 2,
            OPACITY: 0.6,
            COLOR: 0xff004f
        },
        HERO: {
            COUNT: 8000,
            SIZE: 0.6,
            OPACITY: 0.7,
            COLOR: 0xff004f
        }
    }
};

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => preloader.classList.add('hidden'), 800);
});

// WebGL Utilities
const initWebGLScene = (canvasId, particleConfig) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById(canvasId),
        alpha: true 
    });

    renderer.setSize(window.innerWidth, canvasId === 'header-particles' ? 100 : window.innerHeight);
    camera.position.z = 5;

    // Particles setup
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const spread = canvasId === 'header-particles' ? [200, 50, 200] : [250, 250, 250];

    for (let i = 0; i < particleConfig.COUNT; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(spread[0]),
            THREE.MathUtils.randFloatSpread(spread[1]),
            THREE.MathUtils.randFloatSpread(spread[2])
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ 
        color: particleConfig.COLOR,
        size: particleConfig.SIZE,
        transparent: true,
        opacity: particleConfig.OPACITY
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return { scene, camera, renderer, particles };
};

// Initialize WebGL scenes
const headerScene = initWebGLScene('header-particles', CONFIG.PARTICLES.HEADER);
const heroScene = initWebGLScene('webgl-bg', CONFIG.PARTICLES.HERO);

// Animation handlers
const animateScene = (sceneConfig, rotationSpeeds) => {
    const animate = () => {
        requestAnimationFrame(animate);
        sceneConfig.particles.rotation.y += rotationSpeeds.y;
        sceneConfig.particles.rotation.x += rotationSpeeds.x;
        sceneConfig.renderer.render(sceneConfig.scene, sceneConfig.camera);
    };
    animate();
};

// Start animations
animateScene(headerScene, { y: 0.001, x: 0 });
animateScene(heroScene, { y: 0.002, x: 0.001 });

// Responsive handling
const handleResize = () => {
    [headerScene, heroScene].forEach((sceneConfig, index) => {
        sceneConfig.camera.aspect = window.innerWidth / window.innerHeight;
        sceneConfig.camera.updateProjectionMatrix();
        sceneConfig.renderer.setSize(
            window.innerWidth,
            index === 0 ? 100 : window.innerHeight
        );
    });
};

const debouncedResize = debounce(handleResize, 100);
window.addEventListener('resize', debouncedResize);

//spotlight
const apiKey = "1ab1ca8e";
const spotlightWrapper = document.getElementById("spotlightSlides");

const movieTitles = [
    "Interstellar",
    "Guardians of the Galaxy",
    "The Martian",
    "Star Wars: Episode IV - A New Hope",
    "Blade Runner 2049",
];

async function fetchMovieData(title) {
    const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
    const data = await response.json();
    return data.Response === "True" ? {
        title: data.Title,
        poster: data.Poster,
        year: data.Year,
        genre: data.Genre,
    } : null;
}

async function populateSpotlight() {
    spotlightWrapper.innerHTML = "";
    const moviePromises = movieTitles.map(title => fetchMovieData(title));
    const movies = (await Promise.all(moviePromises)).filter(movie => movie !== null);

    movies.forEach(movie => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
            <div class="spotlight-movie">
                <img src="${movie.poster}" alt="${movie.title}" class="modal-poster">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.year} | ${movie.genre}</p>
                </div>
            </div>
        `;
        spotlightWrapper.appendChild(slide);
    });

    initSwiper();
}

function initSwiper() {
    new Swiper(".swiper-container", {
        loop: true,
        speed: 800,
        effect: "cube",
        grabCursor: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
}

document.addEventListener("DOMContentLoaded", populateSpotlight);

// Movie Data Management
class MovieManager {
    constructor() {
        this.loadedMovies = 0;
        this.moviesPerLoad = 4;
        this.currentSearchTerm = 'action';
        this.currentPage = 1;
        this.totalMovies = 0;
    }

    async fetchMovies(searchTerm, page = 1) {
        try {
            const response = await fetch(
                `https://www.omdbapi.com/?apikey=${CONFIG.OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`
            );
            const data = await response.json();
            return data.Response === 'True' ? data : { Search: [], totalResults: 0 };
        } catch (error) {
            console.error('Error fetching movies:', error);
            return { Search: [], totalResults: 0 };
        }
    }

    async populateMovies(loadMore = false) {
        const movieGrid = document.querySelector('.movie-grid');
        
        if (!loadMore) {
            movieGrid.innerHTML = '';
            this.loadedMovies = 0;
            this.currentPage = 1;
        }

        const { Search: movies, totalResults } = await this.fetchMovies(this.currentSearchTerm, this.currentPage);
        this.totalMovies = parseInt(totalResults);

        if (!movies.length && !loadMore) {
            movieGrid.innerHTML = '<p class="no-results">No movies found. Try another search!</p>';
            return;
        }

        movies.forEach(movie => this.createMovieCard(movie));
        this.currentPage++;
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="front">
                <img src="${movie.Poster}" alt="${movie.Title}" loading="lazy">
            </div>
            <div class="back">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <button class="watch-now" data-imdbid="${movie.imdbID}">View Details</button>
            </div>
        `;

        this.addCardInteractions(card);
        document.querySelector('.movie-grid').appendChild(card);
    }

    addCardInteractions(card) {
        card.addEventListener('mousemove', this.handleCardHover);
        card.addEventListener('mouseleave', this.handleCardLeave);
    }

    handleCardHover(e) {
        const rect = this.getBoundingClientRect();
        const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
        const rotateY = (rect.left + rect.width / 2 - e.clientX) / 20;
        gsap.to(this, { rotationX: rotateX, rotationY: rotateY, duration: 0.3 });
    }

    handleCardLeave() {
        gsap.to(this, { rotationX: 0, rotationY: 0, duration: 0.5 });
    }
}

// Initialize movie manager
const movieManager = new MovieManager();
movieManager.populateMovies();

// UI Interactions
class UIHandler {
    constructor() {
        this.initEventListeners();
        this.initTheme();
    }

    initEventListeners() {
        document.addEventListener('click', this.handleModalActions.bind(this));
        window.addEventListener('scroll', this.handleScrollEffects.bind(this));
        document.querySelector('.theme-toggle').addEventListener('click', this.toggleTheme.bind(this));
        document.querySelector('.search-bar button').addEventListener('click', this.handleSearch.bind(this));
        document.querySelector('.search-bar input').addEventListener('keypress', this.handleSearchKeypress.bind(this));
    }

    handleModalActions(e) {
        if (e.target.classList.contains('watch-now')) {
            this.showMovieDetails(e.target.dataset.imdbid);
        } else if (e.target.classList.contains('close') || e.target.id === 'trailer-modal') {
            this.closeModal();
        }
    }

    async showMovieDetails(imdbID) {
        try {
            const response = await fetch(
                `https://www.omdbapi.com/?apikey=${CONFIG.OMDB_API_KEY}&i=${imdbID}`
            );
            const movie = await response.json();
            this.displayModalContent(movie);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    displayModalContent(movie) {
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `
            <span class="close">×</span>
            <h2>${movie.Title}</h2>
            ${movie.Plot ? `<p>${movie.Plot}</p>` : ''}
            <div class="movie-details">
                ${movie.Year ? `<p><strong>Year:</strong> ${movie.Year}</p>` : ''}
                ${movie.Rated ? `<p><strong>Rated:</strong> ${movie.Rated}</p>` : ''}
                ${movie.Runtime ? `<p><strong>Runtime:</strong> ${movie.Runtime}</p>` : ''}
                ${movie.imdbRating ? `<p><strong>IMDb Rating:</strong> ${movie.imdbRating}/10</p>` : ''}
            </div>
        `;
        document.getElementById('trailer-modal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('trailer-modal').style.display = 'none';
    }

    toggleTheme() {
        document.body.classList.toggle('light');
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = document.querySelector('.theme-toggle i');
        icon.classList.toggle('fa-sun', document.body.classList.contains('light'));
        icon.classList.toggle('fa-moon', !document.body.classList.contains('light'));
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.add(savedTheme);
        this.updateThemeIcon();
    }

    handleScrollEffects() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 80);
    }

    handleSearch() {
        const term = document.querySelector('.search-bar input').value.trim();
        if (term) movieManager.populateMovies(term);
    }

    handleSearchKeypress(e) {
        if (e.key === 'Enter') this.handleSearch();
    }
}

// Initialize UI
new UIHandler();

// Utility functions
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// AOS Initialization
AOS.init({
    duration: 1400,
    easing: 'ease-out-back',
    once: true,
    mirror: false
});