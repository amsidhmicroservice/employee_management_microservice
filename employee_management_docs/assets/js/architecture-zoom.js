// Simple Image Zoom Manager - Only for Images/Diagrams
class ImageZoomManager {
    constructor() {
        this.zoomLevels = {};
        this.panPositions = {};
        this.isDragging = {};
        this.lastPanPoint = {};
        this.fullscreenZoom = 1;
        this.fullscreenPan = { x: 0, y: 0 };
        this.currentFullscreenImage = null;

        this.init();
    }

    init() {
        console.log('Image Zoom Manager initialized');
        this.setupZoomableImages();
        this.setupFullscreenModal();
        this.setupKeyboardShortcuts();
    }

    setupZoomableImages() {
        // Only target actual image elements with zoomable-image class
        document.querySelectorAll('.zoomable-image').forEach(img => {
            const imageId = img.id;
            this.zoomLevels[imageId] = 1;
            this.panPositions[imageId] = { x: 0, y: 0 };
            this.isDragging[imageId] = false;

            // Mouse wheel zoom
            img.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 'in' : 'out';
                this.zoomImage(imageId, delta);
            });

            // Pan functionality
            this.setupImagePan(img, imageId);
        });
    }

    setupImagePan(img, imageId) {
        img.addEventListener('mousedown', (e) => {
            if (this.zoomLevels[imageId] > 1) {
                this.isDragging[imageId] = true;
                this.lastPanPoint[imageId] = { x: e.clientX, y: e.clientY };
                img.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging[imageId] && this.zoomLevels[imageId] > 1) {
                const deltaX = e.clientX - this.lastPanPoint[imageId].x;
                const deltaY = e.clientY - this.lastPanPoint[imageId].y;

                this.panPositions[imageId].x += deltaX;
                this.panPositions[imageId].y += deltaY;

                this.updateImageTransform(imageId);
                this.lastPanPoint[imageId] = { x: e.clientX, y: e.clientY };
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging[imageId]) {
                this.isDragging[imageId] = false;
                img.style.cursor = this.zoomLevels[imageId] > 1 ? 'grab' : 'zoom-in';
            }
        });
    }

    setupFullscreenModal() {
        const modal = document.getElementById('fullscreenModal');
        if (modal) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeFullscreen();
                }
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeFullscreen();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('fullscreenModal');
            if (modal && modal.classList.contains('active')) {
                switch (e.key) {
                    case '+':
                    case '=':
                        e.preventDefault();
                        this.zoomFullscreenImage('in');
                        break;
                    case '-':
                        e.preventDefault();
                        this.zoomFullscreenImage('out');
                        break;
                    case '0':
                        e.preventDefault();
                        this.resetFullscreenZoom();
                        break;
                }
            }
        });
    }

    zoomImage(imageId, direction) {
        const minZoom = 0.5;
        const maxZoom = 3;
        const zoomStep = 0.25;

        let newZoom = this.zoomLevels[imageId];

        if (direction === 'in') {
            newZoom = Math.min(maxZoom, newZoom + zoomStep);
        } else if (direction === 'out') {
            newZoom = Math.max(minZoom, newZoom - zoomStep);
        }

        this.zoomLevels[imageId] = newZoom;

        if (newZoom <= 1) {
            this.panPositions[imageId] = { x: 0, y: 0 };
        }

        this.updateImageTransform(imageId);
        this.updateZoomIndicator(imageId);

        const img = document.getElementById(imageId);
        if (img) {
            img.classList.toggle('zoomed', newZoom > 1);
            img.style.cursor = newZoom > 1 ? 'grab' : 'zoom-in';
        }
    }

    resetZoom(imageId) {
        this.zoomLevels[imageId] = 1;
        this.panPositions[imageId] = { x: 0, y: 0 };
        this.updateImageTransform(imageId);
        this.updateZoomIndicator(imageId);

        const img = document.getElementById(imageId);
        if (img) {
            img.classList.remove('zoomed');
            img.style.cursor = 'zoom-in';
        }
    }

    updateImageTransform(imageId) {
        const img = document.getElementById(imageId);
        if (img) {
            const zoom = this.zoomLevels[imageId];
            const pan = this.panPositions[imageId];
            img.style.transform = `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`;
        }
    }

    updateZoomIndicator(imageId) {
        const indicator = document.getElementById(`zoom-indicator-${imageId}`);
        if (indicator) {
            const percentage = Math.round(this.zoomLevels[imageId] * 100);
            indicator.textContent = `${percentage}%`;
        }
    }

    toggleFullscreen(imageId) {
        const img = document.getElementById(imageId);
        const modal = document.getElementById('fullscreenModal');
        const fullscreenImg = document.getElementById('fullscreenImage');
        const title = document.getElementById('fullscreenTitle');

        if (img && modal && fullscreenImg && title) {
            fullscreenImg.src = img.src;
            fullscreenImg.alt = img.alt;
            title.textContent = img.alt || 'Architecture Diagram';

            this.currentFullscreenImage = imageId;
            this.fullscreenZoom = 1;
            this.fullscreenPan = { x: 0, y: 0 };
            this.updateFullscreenTransform();

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            this.setupFullscreenPan();
        }
    }

    setupFullscreenPan() {
        const fullscreenImg = document.getElementById('fullscreenImage');
        if (!fullscreenImg) return;

        let isDragging = false;
        let lastPoint = { x: 0, y: 0 };

        const handleMouseDown = (e) => {
            if (this.fullscreenZoom > 1) {
                isDragging = true;
                lastPoint = { x: e.clientX, y: e.clientY };
                fullscreenImg.style.cursor = 'grabbing';
                e.preventDefault();
            }
        };

        const handleMouseMove = (e) => {
            if (isDragging && this.fullscreenZoom > 1) {
                const deltaX = e.clientX - lastPoint.x;
                const deltaY = e.clientY - lastPoint.y;

                this.fullscreenPan.x += deltaX;
                this.fullscreenPan.y += deltaY;

                this.updateFullscreenTransform();
                lastPoint = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                fullscreenImg.style.cursor = this.fullscreenZoom > 1 ? 'grab' : 'zoom-in';
            }
        };

        const handleWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 'in' : 'out';
            this.zoomFullscreenImage(delta);
        };

        // Remove existing listeners
        fullscreenImg.removeEventListener('mousedown', handleMouseDown);
        fullscreenImg.removeEventListener('wheel', handleWheel);

        // Add new listeners
        fullscreenImg.addEventListener('mousedown', handleMouseDown);
        fullscreenImg.addEventListener('wheel', handleWheel);

        // Store references for cleanup
        fullscreenImg._handleMouseMove = handleMouseMove;
        fullscreenImg._handleMouseUp = handleMouseUp;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    zoomFullscreenImage(direction) {
        const minZoom = 0.5;
        const maxZoom = 5;
        const zoomStep = 0.25;

        if (direction === 'in') {
            this.fullscreenZoom = Math.min(maxZoom, this.fullscreenZoom + zoomStep);
        } else if (direction === 'out') {
            this.fullscreenZoom = Math.max(minZoom, this.fullscreenZoom - zoomStep);
        }

        if (this.fullscreenZoom <= 1) {
            this.fullscreenPan = { x: 0, y: 0 };
        }

        this.updateFullscreenTransform();
        this.updateFullscreenZoomIndicator();

        const fullscreenImg = document.getElementById('fullscreenImage');
        if (fullscreenImg) {
            fullscreenImg.style.cursor = this.fullscreenZoom > 1 ? 'grab' : 'zoom-in';
        }
    }

    resetFullscreenZoom() {
        this.fullscreenZoom = 1;
        this.fullscreenPan = { x: 0, y: 0 };
        this.updateFullscreenTransform();
        this.updateFullscreenZoomIndicator();

        const fullscreenImg = document.getElementById('fullscreenImage');
        if (fullscreenImg) {
            fullscreenImg.style.cursor = 'zoom-in';
        }
    }

    updateFullscreenTransform() {
        const fullscreenImg = document.getElementById('fullscreenImage');
        if (fullscreenImg) {
            const zoom = this.fullscreenZoom;
            const pan = this.fullscreenPan;
            fullscreenImg.style.transform = `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`;
        }
    }

    updateFullscreenZoomIndicator() {
        const indicator = document.getElementById('fullscreenZoomIndicator');
        if (indicator) {
            const percentage = Math.round(this.fullscreenZoom * 100);
            indicator.textContent = `${percentage}%`;
        }
    }

    closeFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        const fullscreenImg = document.getElementById('fullscreenImage');

        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentFullscreenImage = null;

            // Clean up event listeners
            if (fullscreenImg && fullscreenImg._handleMouseMove) {
                document.removeEventListener('mousemove', fullscreenImg._handleMouseMove);
                document.removeEventListener('mouseup', fullscreenImg._handleMouseUp);
            }
        }
    }
}

// Global functions for HTML onclick handlers
function zoomImage(imageId, direction) {
    if (window.imageZoomManager) {
        window.imageZoomManager.zoomImage(imageId, direction);
    }
}

function resetZoom(imageId) {
    if (window.imageZoomManager) {
        window.imageZoomManager.resetZoom(imageId);
    }
}

function toggleFullscreen(imageId) {
    if (window.imageZoomManager) {
        window.imageZoomManager.toggleFullscreen(imageId);
    }
}

function zoomFullscreenImage(direction) {
    if (window.imageZoomManager) {
        window.imageZoomManager.zoomFullscreenImage(direction);
    }
}

function resetFullscreenZoom() {
    if (window.imageZoomManager) {
        window.imageZoomManager.resetFullscreenZoom();
    }
}

function closeFullscreen() {
    if (window.imageZoomManager) {
        window.imageZoomManager.closeFullscreen();
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing Image Zoom Manager...');
    window.imageZoomManager = new ImageZoomManager();
});

if (document.readyState === 'complete') {
    console.log('Document already loaded, initializing Image Zoom Manager immediately...');
    window.imageZoomManager = new ImageZoomManager();
}