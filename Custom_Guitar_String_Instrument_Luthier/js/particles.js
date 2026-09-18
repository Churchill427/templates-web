/**
 * FRET — Sawdust Particle System (Canvas)
 * Creates gently floating particles for the Home 1 Hero section.
 * Respects prefers-reduced-motion media query.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('sawdust-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Optional: Draw a static pattern or do nothing
    return;
  }

  let width, height;
  let particles = [];
  
  // Responsive sizing
  function resize() {
    // Use the parent element's dimensions (the hero section)
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    initParticles();
  }

  window.addEventListener('resize', () => {
    // Debounce resize
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(resize, 200);
  });

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
      // Initially distribute particles randomly across the entire height
      this.y = Math.random() * height;
    }

    reset() {
      // Sawdust colors (warm ambers, golds, light browns)
      const colors = ['rgba(217, 119, 6, 0.4)', 'rgba(180, 83, 9, 0.3)', 'rgba(247, 243, 234, 0.5)'];
      
      this.x = Math.random() * width;
      // Start slightly below the canvas or at top depending on desired effect
      // Let's have them float slowly upwards/drift like fine dust
      this.y = height + Math.random() * 100; 
      
      // Fine dust size
      this.size = Math.random() * 1.5 + 0.5;
      
      // Slow, drifting movement
      this.speedY = (Math.random() * 0.5 + 0.1) * -1; // Negative to move up
      this.speedX = (Math.random() - 0.5) * 0.5;
      
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      // Slight wibble
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      // Add wibble to X movement
      this.angle += this.angleSpeed;
      this.x += Math.sin(this.angle) * 0.5 + this.speedX;
      this.y += this.speedY;

      // Reset if off screen (top or sides)
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10; // Reset exactly at bottom to flow up again
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    // Adjust density based on screen width
    const density = width < 768 ? 50 : 150;
    for (let i = 0; i < density; i++) {
      particles.push(new Particle());
    }
  }

  // Animation Loop
  let animationFrameId;
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
  }

  // Initialize and start
  resize();
  animate();

  // Pause animation when not in viewport to save performance
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!animationFrameId) animate();
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });
  
  observer.observe(canvas.parentElement);
});
