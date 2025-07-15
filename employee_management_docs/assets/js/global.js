/**
 * Global JavaScript for Employee Management System Documentation
 * Handles cross-page functionality, navigation, and shared utilities
 */

// Global configuration
const GLOBAL_CONFIG = {
    version: '1.2.0',
    apiVersion: 'v1',
    environment: 'production',
    baseUrl: 'https://api.employee-management.com',
    documentationUrl: window.location.origin,
    features: {
        darkMode: true,
        analytics: true,
        search: true,
        offline: false
    }
};

// Global utilities
class DocumentationUtils {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.theme = localStorage.getItem('docs-theme') || 'light';
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupSearch();
        this.setupPerformanceMonitoring();
        this.setupAccessibility();
        this.setupProgressiveEnhancement();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = this.theme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Add to navigation
        const nav = document.querySelector('.main-nav .nav-links');
        if (nav) {
            nav.appendChild(themeToggle);
        }

        this.applyTheme();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('docs-theme', this.theme);
        this.applyTheme();
        
        const toggle = document.querySelector('.theme-toggle');
        toggle.innerHTML = this.theme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        if (this.theme === 'dark') {
            document.documentElement.style.setProperty('--bg-primary', '#0f172a');
            document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
            document.documentElement.style.setProperty('--text-primary', '#f1f5f9');
            document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
        } else {
            document.documentElement.style.setProperty('--bg-primary', '#ffffff');
            document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
            document.documentElement.style.setProperty('--text-primary', '#1e293b');
            document.documentElement.style.setProperty('--text-secondary', '#64748b');
        }
    }

    // Enhanced Navigation
    setupNavigation() {
        const currentPage = this.currentPage;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
            
            // Add loading states
            link.addEventListener('click', (e) => {
                if (!href.startsWith('#')) {
                    this.showLoadingState(link);
                }
            });
        });

        // Add breadcrumb navigation
        this.setupBreadcrumbs();
        
        // Setup page transitions
        this.setupPageTransitions();
    }

    setupBreadcrumbs() {
        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumb-nav';
        breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
        
        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = breadcrumbs;
        
        const main = document.querySelector('main') || document.querySelector('.content-wrapper');
        if (main) {
            main.insertBefore(breadcrumbContainer, main.firstChild);
        }
    }

    generateBreadcrumbs() {
        const pageMap = {
            'index': 'Home',
            'architecture': 'Architecture',
            'api-flows': 'API Flows',
            'api-documentation': 'API Documentation',
            'project-structure': 'Project Structure',
            'roadmap': 'Roadmap'
        };

        const currentPageName = pageMap[this.currentPage] || 'Page';
        
        return `
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <a href="index.html">
                        <i class="fas fa-home"></i> Home
                    </a>
                </li>
                <li class="breadcrumb-separator">
                    <i class="fas fa-chevron-right"></i>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                    ${currentPageName}
                </li>
            </ol>
        `;
    }

    setupPageTransitions() {
        // Add page transition effects
        document.body.classList.add('page-transition');
        
        // Fade in effect on page load
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
        });
    }

    showLoadingState(element) {
        element.classList.add('loading');
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.classList.remove('loading');
            element.style.opacity = '1';
        }, 1000);
    }

    // Global Search Functionality
    setupSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'global-search';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="search" 
                       class="search-input" 
                       placeholder="Search documentation..." 
                       aria-label="Search documentation">
                <button class="search-button" aria-label="Search">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div class="search-results" style="display: none;">
                <div class="search-results-content"></div>
            </div>
        `;

        const nav = document.querySelector('.main-nav .nav-container');
        if (nav) {
            nav.appendChild(searchContainer);
        }

        this.setupSearchFunctionality();
    }

    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        const searchContent = document.querySelector('.search-results-content');

        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query, searchContent, searchResults);
            }, 300);
        });

        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.global-search')) {
                searchResults.style.display = 'none';
            }
        });
    }

    performSearch(query, resultsContainer, resultsWrapper) {
        // Search through page content
        const searchableContent = [
            { title: 'Architecture Overview', url: 'architecture.html', keywords: 'aws lambda dynamodb api gateway infrastructure' },
            { title: 'API Flows', url: 'api-flows.html', keywords: 'crud operations employee management rest api' },
            { title: 'API Documentation', url: 'api-documentation.html', keywords: 'openapi swagger endpoints documentation' },
            { title: 'Project Structure', url: 'project-structure.html', keywords: 'code organization files directories structure' },
            { title: 'Development Roadmap', url: 'roadmap.html', keywords: 'future features timeline milestones progress' }
        ];

        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.keywords.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}" class="search-result-link">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-url">${result.url}</div>
                    </a>
                </div>
            `).join('');
            resultsWrapper.style.display = 'block';
        } else {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
            resultsWrapper.style.display = 'block';
        }
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            
            // Report slow pages
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime);
            }
        });

        // Monitor Core Web Vitals
        this.setupWebVitalsMonitoring();
    }

    setupWebVitalsMonitoring() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Skip to main content link
        this.addSkipLink();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA live regions
        this.setupLiveRegions();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Add focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        
        document.body.appendChild(liveRegion);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key functionality
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    handleEscapeKey() {
        // Close any open modals, dropdowns, or overlays
        const searchResults = document.querySelector('.search-results');
        const mobileMenu = document.querySelector('.nav-links.show');
        
        if (searchResults && searchResults.style.display !== 'none') {
            searchResults.style.display = 'none';
        }
        
        if (mobileMenu) {
            toggleMobileMenu();
        }
    }

    // Progressive Enhancement
    setupProgressiveEnhancement() {
        // Add 'js-enabled' class for CSS enhancement
        document.documentElement.classList.add('js-enabled');
        
        // Feature detection
        this.detectFeatures();
        
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Service Worker for offline functionality
        this.setupServiceWorker();
    }

    detectFeatures() {
        const features = {
            webp: this.supportsWebP(),
            intersectionObserver: 'IntersectionObserver' in window,
            customProperties: CSS.supports('color', 'var(--test)'),
            grid: CSS.supports('display', 'grid')
        };

        Object.keys(features).forEach(feature => {
            if (features[feature]) {
                document.documentElement.classList.add(`supports-${feature}`);
            }
        });
    }

    supportsWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator && GLOBAL_CONFIG.features.offline) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }

    // Global event listeners
    setupGlobalEventListeners() {
        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page hidden');
            } else {
                console.log('Page visible');
            }
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.showNetworkStatus('online');
        });

        window.addEventListener('offline', () => {
            this.showNetworkStatus('offline');
        });

        // Resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    showNetworkStatus(status) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = status === 'online' ? 
                'Connection restored' : 'Connection lost. Some features may be unavailable.';
        }
    }

    handleResize() {
        // Handle responsive adjustments
        const width = window.innerWidth;
        document.documentElement.style.setProperty('--viewport-width', width + 'px');
    }
}

// Global mobile menu function (used across all pages)
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggle = document.querySelector('.mobile-menu-toggle i');
    
    if (navLinks && toggle) {
        navLinks.classList.toggle('show');
        toggle.classList.toggle('fa-bars');
        toggle.classList.toggle('fa-times');
        
        // Update ARIA attributes
        const isExpanded = navLinks.classList.contains('show');
        const button = toggle.closest('button');
        if (button) {
            button.setAttribute('aria-expanded', isExpanded);
        }
    }
}

// Initialize global functionality
let docsUtils;
document.addEventListener('DOMContentLoaded', () => {
    docsUtils = new DocumentationUtils();
    console.log('Global documentation utilities initialized');
});

// Export for use in other scripts
window.DocsUtils = DocumentationUtils;
window.toggleMobileMenu = toggleMobileMenu;
window.GLOBAL_CONFIG = GLOBAL_CONFIG;