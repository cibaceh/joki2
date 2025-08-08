// JokiTugaskuOfficial - Main JavaScript File
// Core functionality and site interactions

// Loading screen
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple form validation
    if (!name || !email || !subject || !message) {
        alert('Mohon lengkapi semua field yang diperlukan!');
        return;
    }
    
    // Create WhatsApp message
    const whatsappMessage = `Halo JokiTugaskuOfficial! 
    
Saya ingin konsultasi tentang layanan Anda:

*Nama:* ${name}
*Email:* ${email} 
*Subjek:* ${subject}
*Detail:* ${message}

Mohon info lebih lanjut tentang harga dan timeline pengerjaan. Terima kasih!`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/6281234567890?text=${encodedMessage}`;
    
    // Show success message
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
    submitBtn.style.background = '#10b981';
    
    // Redirect to WhatsApp after delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Reset form and button
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 1500);
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and other elements
document.querySelectorAll('.service-card, .stat-item, .about-text, .contact-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = counter.getAttribute('data-target') || counter.innerText.replace(/[^0-9]/g, '');
            const count = +counter.innerText.replace(/[^0-9]/g, '');
            
            if (!counter.getAttribute('data-target')) {
                counter.setAttribute('data-target', target);
            }
            
            const inc = target / speed;

            if (count < target) {
                if (counter.innerText.includes('%')) {
                    counter.innerText = Math.ceil(count + inc) + '%';
                } else if (counter.innerText.includes('+')) {
                    counter.innerText = Math.ceil(count + inc) + '+';
                } else if (counter.innerText.includes('/')) {
                    counter.innerText = Math.ceil(count + inc) + '/7';
                } else {
                    counter.innerText = Math.ceil(count + inc) + '%';
                }
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = counter.getAttribute('data-original') || counter.innerText;
            }
        };

        // Store original text
        if (!counter.getAttribute('data-original')) {
            counter.setAttribute('data-original', counter.innerText);
        }

        updateCount();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
        }
    });
}, { threshold: 0.5 });

aboutObserver.observe(aboutSection);

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add floating animation to service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && scrolled < hero.offsetHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Start typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    const originalText = heroTitle.innerText;
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 30);
    }, 1500);
});

// Utility functions
const utils = {
    // Format currency to Indonesian Rupiah
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Format phone number
    formatPhone: (phone) => {
        let cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.startsWith('8')) {
            cleaned = '62' + cleaned;
        } else if (cleaned.startsWith('08')) {
            cleaned = '62' + cleaned.substring(1);
        }
        
        return cleaned;
    },

    // Validate email format
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Show notification (toast)
    showNotification: (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else if (type === 'warning') {
            notification.style.background = '#f59e0b';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// Make utils globally available
window.utils = utils;

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical images
    const criticalImages = [
        // Add any critical image URLs here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Initialize lazy loading for images (if any)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Error handling for missing elements
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}

// Add CSS animations keyframes programmatically if needed
const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .lazy {
            filter: blur(5px);
            transition: filter 0.3s;
        }
    `;
    document.head.appendChild(style);
};

// Initialize additional styles
addAnimationStyles();

// Console welcome message
console.log('%c🎓 JokiTugaskuOfficial', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cWebsite berhasil dimuat! Siap membantu tugas akademik Anda.', 'color: #64748b; font-size: 14px;');

// Debug mode (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugMode = true;
    console.log('%c🔧 Debug Mode Aktif', 'color: #f59e0b; font-size: 12px;');
}