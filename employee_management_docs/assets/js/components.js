// Reusable UI Components Module
class UIComponents {
    constructor() {
        this.notifications = [];
        this.modals = [];
        this.init();
    }

    init() {
        this.setupGlobalComponents();
        this.setupEventListeners();
        console.log('UI Components initialized');
    }

    setupGlobalComponents() {
        this.createNotificationContainer();
        this.createModalContainer();
        this.setupScrollToTop();
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            }
        });
    }

    // Notification System
    createNotificationContainer() {
        if (document.getElementById('notificationContainer')) return;

        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', duration = 5000, actions = []) {
        const id = `notification-${Date.now()}`;
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
                </div>
                <div class="notification-message">
                    <div class="notification-title">${this.getNotificationTitle(type)}</div>
                    <div class="notification-text">${message}</div>
                </div>
                ${actions.length > 0 ? `
                    <div class="notification-actions">
                        ${actions.map(action => `
                            <button class="notification-btn ${action.type || 'secondary'}" 
                                    onclick="${action.handler}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
                <button class="notification-close" onclick="uiComponents.hideNotification('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;

        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide
        if (duration > 0) {
            const progressBar = notification.querySelector('.notification-progress-bar');
            progressBar.style.animationDuration = `${duration}ms`;
            
            setTimeout(() => this.hideNotification(id), duration);
        }

        this.notifications.push({ id, element: notification, type });
        return id;
    }

    hideNotification(id) {
        const notification = document.getElementById(id);
        if (!notification) return;

        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
            this.notifications = this.notifications.filter(n => n.id !== id);
        }, 300);
    }

    hideAllNotifications() {
        this.notifications.forEach(({ id }) => this.hideNotification(id));
    }

    getNotificationTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }

    // Modal System
    createModalContainer() {
        if (document.getElementById('modalContainer')) return;

        const container = document.createElement('div');
        container.id = 'modalContainer';
        container.className = 'modal-container';
        document.body.appendChild(container);
    }

    showModal(config) {
        const id = `modal-${Date.now()}`;
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `modal ${config.size || 'medium'}`;
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="uiComponents.hideModal('${id}')"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">
                        ${config.icon ? `<i class="fas fa-${config.icon}"></i>` : ''}
                        ${config.title}
                    </h3>
                    <button class="modal-close" onclick="uiComponents.hideModal('${id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${config.content}
                </div>
                ${config.actions ? `
                    <div class="modal-footer">
                        ${config.actions.map(action => `
                            <button class="btn ${action.type || 'secondary'}" 
                                    onclick="${action.handler}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        const container = document.getElementById('modalContainer');
        container.appendChild(modal);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 100);
        
        this.modals.push({ id, element: modal, config });
        return id;
    }

    hideModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.add('hide');
        setTimeout(() => {
            modal.remove();
            this.modals = this.modals.filter(m => m.id !== id);
            
            // Restore body scroll if no modals
            if (this.modals.length === 0) {
                document.body.style.overflow = '';
            }
        }, 300);
    }

    closeAllModals() {
        this.modals.forEach(({ id }) => this.hideModal(id));
    }

    // Loading Spinner Component
    showLoadingSpinner(target, text = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'loading-overlay';
        spinner.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner-large"></div>
                <div class="loading-text">${text}</div>
            </div>
        `;

        if (typeof target === 'string') {
            target = document.getElementById(target) || document.querySelector(target);
        }

        target.style.position = 'relative';
        target.appendChild(spinner);

        setTimeout(() => spinner.classList.add('show'), 100);
        return spinner;
    }

    hideLoadingSpinner(target) {
        if (typeof target === 'string') {
            target = document.getElementById(target) || document.querySelector(target);
        }

        const spinner = target.querySelector('.loading-overlay');
        if (spinner) {
            spinner.classList.add('hide');
            setTimeout(() => spinner.remove(), 300);
        }
    }

    // Tooltip Component
    createTooltip(element, content, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.innerHTML = content;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);

        element.addEventListener('mouseenter', () => {
            tooltip.classList.add('show');
        });

        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });

        return tooltip;
    }

    // Copy to Clipboard
    copyToClipboard(text, successMessage = 'Copied to clipboard!') {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification(successMessage, 'success', 2000);
            }).catch(() => {
                this.fallbackCopyToClipboard(text, successMessage);
            });
        } else {
            this.fallbackCopyToClipboard(text, successMessage);
        }
    }

    fallbackCopyToClipboard(text, successMessage) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification(successMessage, 'success', 2000);
        } catch (err) {
            this.showNotification('Failed to copy to clipboard', 'error', 3000);
        }
        
        document.body.removeChild(textArea);
    }

    // Smooth Scrolling
    smoothScrollTo(target, duration = 800) {
        const targetPosition = target.offsetTop - 100; // Account for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation.bind(this));
        }

        requestAnimationFrame(animation.bind(this));
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Scroll to Top Button
    setupScrollToTop() {
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.title = 'Scroll to top';
        
        button.addEventListener('click', () => {
            this.smoothScrollTo(document.body);
        });

        document.body.appendChild(button);

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        });
    }

    // Form Validation
    validateForm(formElement, rules) {
        let isValid = true;
        const errors = {};

        Object.keys(rules).forEach(fieldName => {
            const field = formElement.querySelector(`[name="${fieldName}"]`);
            const rule = rules[fieldName];
            const value = field ? field.value.trim() : '';

            // Clear previous errors
            this.clearFieldError(field);

            // Required validation
            if (rule.required && !value) {
                errors[fieldName] = rule.requiredMessage || 'This field is required';
                isValid = false;
            }

            // Pattern validation
            if (value && rule.pattern && !rule.pattern.test(value)) {
                errors[fieldName] = rule.patternMessage || 'Invalid format';
                isValid = false;
            }

            // Custom validation
            if (value && rule.custom && !rule.custom(value)) {
                errors[fieldName] = rule.customMessage || 'Invalid value';
                isValid = false;
            }

            // Show error if exists
            if (errors[fieldName]) {
                this.showFieldError(field, errors[fieldName]);
            }
        });

        return { isValid, errors };
    }

    showFieldError(field, message) {
        if (!field) return;

        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        if (!field) return;

        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Animation Utilities
    animateCountUp(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current >= end) {
                element.textContent = end;
                clearInterval(timer);
            }
        }, 16);
    }

    // Intersection Observer for animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Count up animations
                    const countElements = entry.target.querySelectorAll('[data-count]');
                    countElements.forEach(el => {
                        const endValue = parseInt(el.dataset.count);
                        this.animateCountUp(el, 0, endValue);
                    });
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Local Storage Helpers
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
            return false;
        }
    }

    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return defaultValue;
        }
    }

    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
            return false;
        }
    }
}

// Initialize UI Components
let uiComponents;
document.addEventListener('DOMContentLoaded', () => {
    uiComponents = new UIComponents();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
}