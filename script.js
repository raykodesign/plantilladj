// =========================================
// --- 1. LOADING SCREEN & BOOT SEQUENCE ---
// =========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const percentDisplay = document.getElementById('load-percent');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if(progress > 100) progress = 100;
        percentDisplay.innerText = progress + '%';
        
        if(progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    mainContent.style.opacity = '1';
                    document.body.style.overflow = 'auto'; // Reactivar scroll
                    // Iniciar efectos post-carga
                    initParticles();
                    animate();
                    hackerEffect(document.getElementById('dj-name-target'));
                }, 800);
            }, 500);
        }
    }, 100); // Velocidad de carga simulada
});

// =========================================
// --- 2. HACKER DECODE TEXT EFFECT ---
// =========================================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$";

function hackerEffect(element) {
    let iterations = 0;
    const targetText = element.dataset.value;
    
    const interval = setInterval(() => {
        element.innerText = targetText
            .split("")
            .map((letter, index) => {
                if(index < iterations) {
                    return targetText[index];
                }
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");
        
        if(iterations >= targetText.length) {
            clearInterval(interval);
        }
        iterations += 1 / 3; // Velocidad de decodificación
    }, 30);
}

// =========================================
// --- 3. NAVIGATION LOGIC ---
// =========================================
function showSection(id, btn) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

// =========================================
// --- 4. CUSTOM AUDIO PLAYER LOGIC ---
// =========================================
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const audio = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;

// Datos de ejemplo (Reemplaza 'url' con tus archivos mp3 reales)
// Nota: Uso enlaces vacíos para el demo. Si pones enlaces reales, funcionará el audio.
const tracks = [
    { title: "Neon Genesis (Intro)", artist: "DJ NEXUS", url: "" },
    { title: "Cyberpunk Bassline", artist: "DJ NEXUS ft. V0ID", url: "" },
    { title: "Midnight Protocol", artist: "DJ NEXUS Underground", url: "" }
];

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].url;
    document.getElementById('track-title').innerText = tracks[index].title;
    document.getElementById('track-artist').innerText = tracks[index].artist;
    
    // Actualizar lista mini
    document.querySelectorAll('.track-item').forEach((item, idx) => {
       item.classList.toggle('active', idx === index);
    });

    if(isPlaying) { audio.play(); }
    updateProgress();
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.innerText = 'play_arrow';
    } else {
        // audio.play(); // Comentado para evitar errores si no hay URLs reales
        console.log("Play simulado (añade URLs reales en JS)");
        playIcon.innerText = 'pause';
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
}

function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent || 0}%`;
    
    document.getElementById('curr-time').innerText = formatTime(currentTime || 0);
    document.getElementById('total-time').innerText = formatTime(duration || 0);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Event Listeners del Reproductor
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack);
document.getElementById('progress-container').addEventListener('click', setProgress);

// Cargar primera pista al inicio
loadTrack(0);


// =========================================
// --- 5. BACKGROUND EFFECTS (Particles & 3D Tilt) ---
// =========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; 
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist/1000})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
// Nota: initParticles y animate se llaman ahora después del loading screen

document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card.active');
    if(cards.length > 0) {
        cards.forEach(card => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });
    }
});