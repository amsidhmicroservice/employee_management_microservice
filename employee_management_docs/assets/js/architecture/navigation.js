// Architecture navigation functionality
class ArchitectureNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollSpy();
        this.setupQuickAccess();
    }

    setupNavigation() {
        // Add active class to current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }

    setupScrollSpy() {
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
    }

    setupQuickAccess() {
        // Add hover effects and analytics for quick access cards
        const accessCards = document.querySelectorAll('.access-card');

        accessCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-6px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });

            card.addEventListener('click', (e) => {
                // Add click analytics here if needed
                console.log(`Navigating to: ${card.href}`);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArchitectureNavigation();
});