
// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => preloader.classList.add('hidden'), 800);
});

// WebGL Background for Header Particles
const headerScene = new THREE.Scene();
const headerCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const headerRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('header-particles'), alpha: true });
headerRenderer.setSize(window.innerWidth, 100);
headerCamera.position.z = 5;

const headerGeometry = new THREE.BufferGeometry();
const headerVertices = [];
for (let i = 0; i < 2000; i++) {
    headerVertices.push(THREE.MathUtils.randFloatSpread(200)); // x
    headerVertices.push(THREE.MathUtils.randFloatSpread(50));  // y (limited to header height)
    headerVertices.push(THREE.MathUtils.randFloatSpread(200)); // z
}
headerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(headerVertices, 3));
const headerMaterial = new THREE.PointsMaterial({ color: 0xff004f, size: 2, transparent: true, opacity: 0.6 });
const headerParticles = new THREE.Points(headerGeometry, headerMaterial);
headerScene.add(headerParticles);

function animateHeaderParticles() {
    requestAnimationFrame(animateHeaderParticles);
    headerParticles.rotation.y += 0.001;
    headerRenderer.render(headerScene, headerCamera);
}
animateHeaderParticles();

window.addEventListener('resize', () => {
    headerCamera.aspect = window.innerWidth / window.innerHeight;
    headerCamera.updateProjectionMatrix();
    headerRenderer.setSize(window.innerWidth, 100);
});

// WebGL Background for Hero
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 8000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(250)); // x
    vertices.push(THREE.MathUtils.randFloatSpread(250)); // y
    vertices.push(THREE.MathUtils.randFloatSpread(250)); // z
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0xff004f, size: 0.6, transparent: true, opacity: 0.7 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.002;
    particles.rotation.x += 0.001;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hero Parallax with GSAP
const heroContent = document.querySelector('.hero-content');
gsap.to(heroContent, {
    y: () => window.scrollY * 0.5,
    ease: 'power1.out',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Cosmic Cursor Glow
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX - 10}px`;
    cursorGlow.style.top = `${e.clientY - 10}px`;
});

document.addEventListener('mousedown', () => {
    gsap.to(cursorGlow, { scale: 1.5, opacity: 0.8, duration: 0.2 });
});
document.addEventListener('mouseup', () => {
    gsap.to(cursorGlow, { scale: 1, opacity: 0.5, duration: 0.2 });
});

// Movie Data
const movies = [
    { title: "The Dark Nebula", poster: "https://via.placeholder.com/280x420?text=Dark+Nebula", rating: 9.2, trailer: "https://www.youtube.com/embed/EXeTwQWrcwY", genre: "Sci-Fi" },
    { title: "Dream Forge", poster: "https://via.placeholder.com/280x420?text=Dream+Forge", rating: 8.9, trailer: "https://www.youtube.com/embed/YoHD9XEInc0", genre: "Fantasy" },
    { title: "Pulp Velocity", poster: "https://via.placeholder.com/280x420?text=Pulp+Velocity", rating: 9.1, trailer: "https://www.youtube.com/embed/s7EdQ4FqbhY", genre: "Action" },
    { title: "Code Matrix", poster: "https://via.placeholder.com/280x420?text=Code+Matrix", rating: 8.8, trailer: "https://www.youtube.com/embed/vKQi3bBA1y8", genre: "Thriller" }
];

// Populate Movies with Infinite Scroll and 3D Tilt
let loadedMovies = 0;
const moviesPerLoad = 4;

function populateMovies(loadMore = false) {
    const movieGrid = document.querySelector('.movie-grid');
    if (!loadMore) {
        movieGrid.innerHTML = '';
        loadedMovies = 0;
    }
    const selectedGenre = document.getElementById('genre-filter').value;
    const filteredMovies = selectedGenre === 'all' ? movies : movies.filter(movie => movie.genre === selectedGenre);
    const moviesToLoad = filteredMovies.slice(loadedMovies, loadedMovies + moviesPerLoad);
    let delay = 0;
    moviesToLoad.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-aos', 'zoom-out');
        card.setAttribute('data-aos-delay', delay);
        delay += 200;
        card.innerHTML = `
                    <div class="front">
                        <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    </div>
                    <div class="back">
                        <h3>${movie.title}</h3>
                        <p>Rating: ${movie.rating}/10</p>
                        <p>Genre: ${movie.genre}</p>
                        <button class="watch-now" data-trailer="${movie.trailer}">Launch Trailer</button>
                    </div>
                `;
        movieGrid.appendChild(card);

        // Add 3D Tilt Effect with GSAP
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'elastic.out' });
        });
    });
    loadedMovies += moviesToLoad.length;
    if (loadedMovies >= filteredMovies.length) {
        window.removeEventListener('scroll', infiniteScroll);
    }
}

populateMovies();
document.getElementById('genre-filter').addEventListener('change', () => populateMovies());

function infiniteScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        populateMovies(true);
    }
}
window.addEventListener('scroll', infiniteScroll);

// Spotlight Carousel with Glitch Effect
const swiper = new Swiper('.swiper-container', {
    loop: true,
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
});

document.querySelectorAll('.spotlight-card img').forEach(img => {
    img.addEventListener('mouseover', () => {
        gsap.to(img, {
            x: () => Math.random() * 10 - 5,
            y: () => Math.random() * 10 - 5,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });
});

// Countdown Timer
function startCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(element => {
        const releaseDate = new Date(element.getAttribute('data-release')).getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = releaseDate - now;
            if (distance < 0) {
                clearInterval(timer);
                element.innerHTML = "Released!";
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });
}
startCountdown();

// Modal Functionality with Quantum Jump
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('watch-now')) {
        const trailerUrl = e.target.getAttribute('data-trailer');
        const modal = document.getElementById('trailer-modal');
        const iframe = modal.querySelector('iframe');
        gsap.to('body', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                iframe.src = trailerUrl;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                gsap.to('body', { opacity: 1, duration: 0.5, ease: 'power2.out' });
            }
        });
    } else if (e.target.classList.contains('close') || e.target.id === 'trailer-modal') {
        const modal = document.getElementById('trailer-modal');
        gsap.to('body', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                modal.style.display = 'none';
                modal.querySelector('iframe').src = '';
                document.body.style.overflow = 'auto';
                gsap.to('body', { opacity: 1, duration: 0.5, ease: 'power2.out' });
            }
        });
    }
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-sun', isLight);
    icon.classList.toggle('fa-moon', !isLight);
    gsap.to('body', { backgroundColor: isLight ? '#e0e0e0' : '#080808', duration: 0.5 });
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
    const icon = themeToggle.querySelector('i');
    icon.classList.add(savedTheme === 'light' ? 'fa-sun' : 'fa-moon');
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 80);

    const backToTop = document.querySelector('.back-to-top');
    const spotlightToggle = document.querySelector('.spotlight-toggle');
    const scrollPos = window.scrollY;
    backToTop.style.display = scrollPos > 400 ? 'block' : 'none';
    spotlightToggle.style.display = scrollPos > document.querySelector('#spotlight').offsetTop ? 'block' : 'none';
});

// Spotlight Toggle
document.querySelector('.spotlight-toggle').addEventListener('click', () => {
    document.querySelector('#spotlight').scrollIntoView({ behavior: 'smooth' });
});

// Feature Card Interaction
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
        const detail = card.querySelector('.feature-detail');
        gsap.to(detail, {
            height: detail.style.display === 'none' ? 'auto' : 0,
            opacity: detail.style.display === 'none' ? 1 : 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onStart: () => { if (detail.style.display === 'none') detail.style.display = 'block'; },
            onComplete: () => { if (detail.style.display === 'block' && detail.style.opacity === '0') detail.style.display = 'none'; }
        });
    });
});

document.querySelectorAll('.demo-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Demo clicked');
    });
});

// Voice Search
const voiceSearchButton = document.querySelector('.voice-search');
// const searchInput = document.querySelector('.search-bar input');
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceSearchButton.addEventListener('click', () => {
        recognition.start();
        gsap.to(voiceSearchButton, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
    };
} else {
    voiceSearchButton.style.display = 'none';
}

// Dynamic Scroll Soundscape
const scrollSound = new Howl({
    src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
    loop: true,
    volume: 0,
    preload: true
});
scrollSound.play();

window.addEventListener('scroll', () => {
    const scrollMax = document.body.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY;
    const volume = Math.min(scrollPos / scrollMax, 0.3);
    scrollSound.volume(volume);
});

// Quantum Jump Navigation
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        gsap.to('body', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                gsap.to('body', { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 });
            }
        });
    });
});

// Initialize AOS
AOS.init({
    duration: 1400,
    easing: 'ease-out-back',
    once: true,
    mirror: false
});

// Preloader remains the same

// OMDB API Integration
const API_KEY = '1ab1ca8e';
let currentSearchTerm = 'action';
let currentPage = 1;
let totalMovies = 0;

async function fetchMovies(searchTerm, page = 1) {
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`
        );
        const data = await response.json();
        return data.Response === 'True'
            ? { movies: data.Search, total: parseInt(data.totalResults) }
            : { movies: [], total: 0 };
    } catch (error) {
        console.error('Error:', error);
        return { movies: [], total: 0 };
    }
}

async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
        );
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function populateMovies(searchTerm = currentSearchTerm, loadMore = false) {
    const movieGrid = document.querySelector('.movie-grid');
    if (!loadMore) {
        movieGrid.innerHTML = '';
        currentPage = 1;
        currentSearchTerm = searchTerm;
    }

    const { movies, total } = await fetchMovies(currentSearchTerm, currentPage);
    totalMovies = total;

    if (!movies.length && !loadMore) {
        movieGrid.innerHTML = '<p class="no-results">No movies found. Try another search!</p>';
        return;
    }

    let delay = 0;
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-aos', 'zoom-out');
        card.setAttribute('data-aos-delay', delay);
        delay += 200;

        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/280x420?text=No+Poster';
        card.innerHTML = `
                    <div class="front">
                        <img src="${poster}" alt="${movie.Title}" loading="lazy">
                    </div>
                    <div class="back">
                        <h3>${movie.Title}</h3>
                        <p>Year: ${movie.Year}</p>
                        <p>Type: ${movie.Type}</p>
                        <button class="watch-now" data-imdbid="${movie.imdbID}">View Details</button>
                    </div>
                `;

        // Add 3D Tilt Effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
            const rotateY = (rect.left + rect.width / 2 - e.clientX) / 20;
            gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.3 });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5 });
        });

        movieGrid.appendChild(card);
    });

    currentPage++;
}

// Search Functionality
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

searchButton.addEventListener('click', () => {
    const term = searchInput.value.trim();
    if (term) populateMovies(term);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        populateMovies(searchInput.value.trim());
    }
});

// Movie Details Modal
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('watch-now')) {
        const imdbID = e.target.dataset.imdbid;
        const movie = await fetchMovieDetails(imdbID);

        const modal = document.getElementById('trailer-modal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
                    <span class="close">×</span>
                    <h2>${movie.Title}</h2>
                    ${movie.Poster !== 'N/A' ?
                `<img src="${movie.Poster}" alt="${movie.Title}" class="modal-poster">` : ''}
                    <div class="modal-details">
                        ${movie.Year ? `<p><strong>Year:</strong> ${movie.Year}</p>` : ''}
                        ${movie.Rated ? `<p><strong>Rated:</strong> ${movie.Rated}</p>` : ''}
                        ${movie.Genre ? `<p><strong>Genre:</strong> ${movie.Genre}</p>` : ''}
                        ${movie.Runtime ? `<p><strong>Runtime:</strong> ${movie.Runtime}</p>` : ''}
                        ${movie.Director ? `<p><strong>Director:</strong> ${movie.Director}</p>` : ''}
                        ${movie.Actors ? `<p><strong>Cast:</strong> ${movie.Actors}</p>` : ''}
                        ${movie.Plot ? `<p><strong>Plot:</strong> ${movie.Plot}</p>` : ''}
                        ${movie.imdbRating ? `<p><strong>IMDb Rating:</strong> ${movie.imdbRating}/10</p>` : ''}
                    </div>
                `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
});

// Initial Load
populateMovies();