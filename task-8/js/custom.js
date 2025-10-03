// Custom JavaScript for MINDFUL Blog Theme

document.addEventListener('DOMContentLoaded', function() {
    console.log('MINDFUL Blog Theme loaded successfully!');
    
    // Smooth scrolling for anchor links
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
    
    // FIXED: Remove problematic image loading animations
    // Images will now stay visible consistently
    
    // Subscribe button interaction
    const subscribeBtn = document.querySelector('.subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Simulate subscription process
            const originalText = this.textContent;
            this.textContent = 'Redirecting...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                alert('Thank you for your interest in MINDFUL! Subscription page coming soon.');
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 1000);
        });
    }
    
    // Add intersection observer for fade-in animations (only for text/content)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe post cards for animation (text only)
    document.querySelectorAll('.post-card').forEach(card => {
        const content = card.querySelector('.post-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(content);
        }
    });
    
    // Observe recent posts for animation (text only)
    document.querySelectorAll('.recent-post-content').forEach(content => {
        content.style.opacity = '0';
        content.style.transform = 'translateX(-20px)';
        content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(content);
    });
    
    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or menus
            const openCollapse = document.querySelector('.collapse.show');
            if (openCollapse) {
                const toggle = document.querySelector('[data-bs-target="#' + openCollapse.id + '"]');
                if (toggle) toggle.click();
            }
        }
    });
    
    // Preload images to prevent flickering
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Create a new image object to force loading
            const newImg = new Image();
            newImg.src = img.src;
        });
    }
    
    // Preload images after page load
    window.addEventListener('load', preloadImages);
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize with debounce
window.addEventListener('resize', debounce(function() {
    // Adjust any layout elements if needed
    console.log('Window resized - layout adjusted');
}, 250));
