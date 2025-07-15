// Architecture Zoom Manager
class ArchitectureZoom {
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
        console.log('Architecture Zoom initialized');
        this.setupZoomableImages();
        this.setupFullscreenModal();
        this.setupKeyboardShortcuts();
    }

    setupZoomableImages() {
        document.querySelectorAll('.zoomable-image').forEach(img => {
            const imageId = img.id;
            this.zoomLevels[imageId] = 1;
            this.panPositions[imageId] = { x: 0, y: 0 };
            this.isDragging[imageId] = false;

            // Add mouse wheel zoom
            img.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 'in' : 'out';
                this.zoomImage(imageId, delta);
            });

            // Add pan functionality for zoomed images
            this.setupPanFunctionality(img, imageId);
        });
    }

    setupPanFunctionality(img, imageId) {
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
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeFullscreen();
                }
            });

            // Close on background click
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

        // Reset pan position if zooming out to 1x or less
        if (newZoom <= 1) {
            this.panPositions[imageId] = { x: 0, y: 0 };
        }

        this.updateImageTransform(imageId);
        this.updateZoomIndicator(imageId);

        // Update cursor
        const img = document.getElementById(imageId);
        if (img) {
            img.classList.toggle('zoomed', newZoom > 1);
            img.style.cursor = newZoom > 1 ? 'grab' : 'zoom-in';
        }

        console.log(`Zoomed ${imageId} to ${newZoom}x`);
    }

    resetZoom(imageId) {
        this.zoomLevels[imageId] = 1;
        this.panPositions[imageId] = { x: 0, y: 0 };
        this.updateImageTransform(imageId);
        this.updateZoomIndicator(imageId);

        // Update cursor
        const img = document.getElementById(imageId);
        if (img) {
            img.classList.remove('zoomed');
            img.style.cursor = 'zoom-in';
        }

        console.log(`Reset zoom for ${imageId}`);
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
            // Set image source and title
            fullscreenImg.src = img.src;
            fullscreenImg.alt = img.alt;
            title.textContent = img.alt || 'Architecture Diagram';

            // Store current image reference
            this.currentFullscreenImage = imageId;

            // Reset fullscreen zoom
            this.fullscreenZoom = 1;
            this.fullscreenPan = { x: 0, y: 0 };
            this.updateFullscreenTransform();

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Setup pan for fullscreen
            this.setupFullscreenPan();

            console.log(`Opened ${imageId} in fullscreen`);
        }
    }

    setupFullscreenPan() {
        const fullscreenImg = document.getElementById('fullscreenImage');
        if (!fullscreenImg) return;

        let isDragging = false;
        let lastPoint = { x: 0, y: 0 };

        fullscreenImg.addEventListener('mousedown', (e) => {
            if (this.fullscreenZoom > 1) {
                isDragging = true;
                lastPoint = { x: e.clientX, y: e.clientY };
                fullscreenImg.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && this.fullscreenZoom > 1) {
                const deltaX = e.clientX - lastPoint.x;
                const deltaY = e.clientY - lastPoint.y;

                this.fullscreenPan.x += deltaX;
                this.fullscreenPan.y += deltaY;

                this.updateFullscreenTransform();

                lastPoint = { x: e.clientX, y: e.clientY };
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                fullscreenImg.style.cursor = this.fullscreenZoom > 1 ? 'grab' : 'zoom-in';
            }
        });

        // Mouse wheel zoom in fullscreen
        fullscreenImg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 'in' : 'out';
            this.zoomFullscreenImage(delta);
        });
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

        // Reset pan position if zooming out to 1x or less
        if (this.fullscreenZoom <= 1) {
            this.fullscreenPan = { x: 0, y: 0 };
        }

        this.updateFullscreenTransform();
        this.updateFullscreenZoomIndicator();

        // Update cursor
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
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentFullscreenImage = null;
            console.log('Closed fullscreen');
        }
    }
}

// Global functions for HTML onclick handlers
function zoomImage(imageId, direction) {
    if (window.architectureZoom) {
        window.architectureZoom.zoomImage(imageId, direction);
    }
}

function resetZoom(imageId) {
    if (window.architectureZoom) {
        window.architectureZoom.resetZoom(imageId);
    }
}

function toggleFullscreen(imageId) {
    if (window.architectureZoom) {
        window.architectureZoom.toggleFullscreen(imageId);
    }
}

function zoomFullscreenImage(direction) {
    if (window.architectureZoom) {
        window.architectureZoom.zoomFullscreenImage(direction);
    }
}

function resetFullscreenZoom() {
    if (window.architectureZoom) {
        window.architectureZoom.resetFullscreenZoom();
    }
}

function closeFullscreen() {
    if (window.architectureZoom) {
        window.architectureZoom.closeFullscreen();
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing Architecture Zoom...');
    window.architectureZoom = new ArchitectureZoom();
});

// Also try immediate initialization
if (document.readyState === 'complete') {
    console.log('Document already loaded, initializing Architecture Zoom immediately...');
    window.architectureZoom = new ArchitectureZoom();
}