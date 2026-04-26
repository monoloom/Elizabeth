const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let isAnimating = false;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

const mouse = {
    x: undefined,
    y: undefined,
    lastX: undefined,
    lastY: undefined
};

function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        animate();
    }
}

// Throttled mouse movement to save CPU
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Only add a particle if the mouse moved a certain distance (e.g. 15px)
    const dx = mouse.x - (mouse.lastX || mouse.x);
    const dy = mouse.y - (mouse.lastY || mouse.y);
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 15 || mouse.lastX === undefined) {
        // Cap total particles to 40 for optimal performance
        if (particles.length < 40) {
            particles.push(new Particle(mouse.x, mouse.y));
            startAnimation();
        }
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
    }
});

window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        
        if (particles.length < 40) {
            particles.push(new Particle(mouse.x, mouse.y));
            startAnimation();
        }
    }
});

// CTA Explosion Effect
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
        const rect = ctaButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 40; i++) {
            particles.push(new ExplosionParticle(centerX, centerY));
        }
        startAnimation();
    });
}

class ExplosionParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1.5; 
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3 + 1;
        this.speedX = Math.cos(angle) * velocity;
        this.speedY = Math.sin(angle) * velocity;
        this.alpha = 1.0;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01; // Fades out slowly
    }
    
    draw() {
        ctx.fillStyle = `rgba(157, 80, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x + (Math.random() * 10 - 5);
        this.y = y + (Math.random() * 10 - 5);
        this.size = Math.random() * 2 + 1; // Smaller dots
        this.speedX = (Math.random() - 0.5) * 0.2; // Very slow
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.alpha = 0.5; // Start with half opacity
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.005; // Fade out very gradually
    }
    
    draw() {
        ctx.fillStyle = `rgba(157, 80, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    let activeParticles = false;
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove particles when faded out
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        } else {
            activeParticles = true;
        }
    }
    
    // Only continue the animation loop if there are active particles
    if (activeParticles) {
        requestAnimationFrame(animate);
    } else {
        isAnimating = false;
        ctx.clearRect(0, 0, width, height); // Final clean up
    }
}

// Chart Animation Observer
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-bars');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsChart = document.querySelector('.skills-chart');
if (skillsChart) {
    observer.observe(skillsChart);
}

// Typing Effect
const typingWords = ["Spaces", "Galas", "Festivals", "Runways", "Events"];
let typingWordIndex = 0;
let typingCharIndex = 0;
let isTypingDeleting = false;
const typingText = document.getElementById("typing-text");

function typeEffect() {
    if (!typingText) return;
    
    const currentWord = typingWords[typingWordIndex];
    
    if (isTypingDeleting) {
        typingText.textContent = currentWord.substring(0, typingCharIndex - 1);
        typingCharIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, typingCharIndex + 1);
        typingCharIndex++;
    }
    
    // Slow, deliberate typing speed
    let typeSpeed = isTypingDeleting ? 60 : 200; 
    
    if (!isTypingDeleting && typingCharIndex === currentWord.length) {
        typeSpeed = 2500; // Pause at end of word
        isTypingDeleting = true;
    } else if (isTypingDeleting && typingCharIndex === 0) {
        isTypingDeleting = false;
        typingWordIndex = (typingWordIndex + 1) % typingWords.length;
        typeSpeed = 800; // Pause before typing next word
    }
    
    setTimeout(typeEffect, typeSpeed);
}

if (typingText) {
    setTimeout(typeEffect, 1500);
}
