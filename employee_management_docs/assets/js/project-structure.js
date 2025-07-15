// Project Structure Page Controller
class ProjectStructurePage {
    constructor() {
        this.sections = {
            fileTree: null,
            openApi: null,
            additional: null
        };
        this.init();
    }

    init() {
        this.loadSections();
        this.setupPageFunctionality();
        console.log('Project Structure page initialized');
    }

    loadSections() {
        // Load File Tree Section
        this.loadFileTreeSection();
        
        // OpenAPI section is loaded by api-interactive.js
        // Additional sections loaded here
        this.loadAdditionalSections();
    }

    loadFileTreeSection() {
        const container = document.getElementById('fileTreeSection');
        if (!container) return;

        container.innerHTML = `
            <div class="file-tree-section fade-in-up">
                <div class="file-tree-header">
                    <h2 class="file-tree-title">
                        <i class="fas fa-folder-tree"></i>
                        Interactive File Explorer
                    </h2>
                    <div class="file-tree-controls">
                        <div class="search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" id="fileSearch" class="search-input" placeholder="Search files and folders...">
                        </div>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="code">Code</button>
                            <button class="filter-btn" data-filter="docs">Docs</button>
                            <button class="filter-btn" data-filter="config">Config</button>
                        </div>
                        <div class="tree-actions">
                            <button class="action-btn" id="expandAll" title="Expand All">
                                <i class="fas fa-expand-arrows-alt"></i>
                            </button>
                            <button class="action-btn" id="collapseAll" title="Collapse All">
                                <i class="fas fa-compress-arrows-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="file-tree-container">
                    <div class="tree-view" id="fileTreeContainer">
                        <!-- File tree will be populated by JavaScript -->
                    </div>
                    <div class="file-details" id="fileDetails">
                        <div class="file-details-header">
                            <h3><i class="fas fa-info-circle"></i> File Details</h3>
                        </div>
                        <div class="file-details-content">
                            <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                                Select a file to view details
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadAdditionalSections() {
        const container = document.getElementById('additionalSections');
        if (!container) return;

        container.innerHTML = `
            <!-- Project Statistics Section -->
            <div class="stats-section fade-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-chart-bar"></i>
                        Project Statistics
                    </h2>
                    <p class="section-subtitle">Real-time metrics and project overview</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-file-code"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="45">0</div>
                            <div class="stat-label">Source Files</div>
                            <div class="stat-change positive">+3 this week</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-folder"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="12">0</div>
                            <div class="stat-label">Directories</div>
                            <div class="stat-change neutral">No change</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-code-branch"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="8">0</div>
                            <div class="stat-label">API Endpoints</div>
                            <div class="stat-change positive">+2 this month</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" data-count="95">0</div>
                            <div class="stat-label">Test Coverage %</div>
                            <div class="stat-change positive">+5% this sprint</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Technology Stack Section -->
            <div class="tech-stack-section fade-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-layer-group"></i>
                        Technology Stack
                    </h2>
                    <p class="section-subtitle">Technologies and frameworks used in this project</p>
                </div>
                <div class="tech-categories">
                    <div class="tech-category">
                        <h3><i class="fas fa-cloud"></i> Cloud & Infrastructure</h3>
                        <div class="tech-items">
                            <div class="tech-item">
                                <i class="fab fa-aws"></i>
                                <span>AWS Lambda</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-database"></i>
                                <span>DynamoDB</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-network-wired"></i>
                                <span>API Gateway</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>IAM</span>
                            </div>
                        </div>
                    </div>
                    <div class="tech-category">
                        <h3><i class="fas fa-code"></i> Backend</h3>
                        <div class="tech-items">
                            <div class="tech-item">
                                <i class="fab fa-python"></i>
                                <span>Python 3.9</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-bolt"></i>
                                <span>Boto3</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-key"></i>
                                <span>JWT</span>
                            </div>
                        </div>
                    </div>
                    <div class="tech-category">
                        <h3><i class="fas fa-palette"></i> Frontend</h3>
                        <div class="tech-items">
                            <div class="tech-item">
                                <i class="fab fa-html5"></i>
                                <span>HTML5</span>
                            </div>
                            <div class="tech-item">
                                <i class="fab fa-css3-alt"></i>
                                <span>CSS3</span>
                            </div>
                            <div class="tech-item">
                                <i class="fab fa-js"></i>
                                <span>JavaScript ES6+</span>
                            </div>
                        </div>
                    </div>
                    <div class="tech-category">
                        <h3><i class="fas fa-tools"></i> DevOps & Tools</h3>
                        <div class="tech-items">
                            <div class="tech-item">
                                <i class="fab fa-git-alt"></i>
                                <span>Git</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-cube"></i>
                                <span>CloudFormation</span>
                            </div>
                            <div class="tech-item">
                                <i class="fas fa-vial"></i>
                                <span>Pytest</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions Section -->
            <div class="quick-actions-section fade-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-rocket"></i>
                        Quick Actions
                    </h2>
                    <p class="section-subtitle">Common development tasks and shortcuts</p>
                </div>
                <div class="actions-grid">
                    <div class="action-card" onclick="projectStructure.openInEditor()">
                        <div class="action-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3>Open in Editor</h3>
                        <p>Launch the project in your preferred code editor</p>
                    </div>
                    <div class="action-card" onclick="projectStructure.runTests()">
                        <div class="action-icon">
                            <i class="fas fa-vial"></i>
                        </div>
                        <h3>Run Tests</h3>
                        <p>Execute the full test suite</p>
                    </div>
                    <div class="action-card" onclick="projectStructure.deployProject()">
                        <div class="action-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <h3>Deploy</h3>
                        <p>Deploy to staging environment</p>
                    </div>
                    <div class="action-card" onclick="projectStructure.generateDocs()">
                        <div class="action-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <h3>Generate Docs</h3>
                        <p>Update API documentation</p>
                    </div>
                </div>
            </div>
        `;
    }

    setupPageFunctionality() {
        // Setup scroll animations
        this.setupScrollAnimations();
        
        // Setup section navigation
        this.setupSectionNavigation();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Animate counters
                    const counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.count);
                        uiComponents.animateCountUp(counter, 0, target, 2000);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    setupSectionNavigation() {
        // Add smooth scrolling to section links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-scroll-to]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.dataset.scrollTo);
                if (target) {
                    uiComponents.smoothScrollTo(target);
                }
            }
        });
    }

    // Quick Action Methods
    openInEditor() {
        uiComponents.showNotification('Opening project in default editor...', 'info');
        // In a real implementation, this would integrate with system commands
    }

    runTests() {
        const modal = uiComponents.showModal({
            title: 'Run Test Suite',
            icon: 'vial',
            size: 'medium',
            content: `
                <div class="test-options">
                    <div class="form-group">
                        <label class="form-label">Test Type:</label>
                        <select class="form-select">
                            <option value="all">All Tests</option>
                            <option value="unit">Unit Tests Only</option>
                            <option value="integration">Integration Tests Only</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" checked> Include Coverage Report
                        </label>
                    </div>
                </div>
            `,
            actions: [
                {
                    text: 'Cancel',
                    type: 'secondary',
                    handler: `uiComponents.hideModal('${modal}')`
                },
                {
                    text: 'Run Tests',
                    type: 'primary',
                    handler: `projectStructure.executeTests('${modal}')`
                }
            ]
        });
    }

    executeTests(modalId) {
        uiComponents.hideModal(modalId);
        uiComponents.showNotification('Test suite execution started...', 'info');
        
        // Simulate test execution
        setTimeout(() => {
            uiComponents.showNotification('Tests completed: 45 passed, 0 failed', 'success');
        }, 3000);
    }

    deployProject() {
        uiComponents.showNotification('Deployment initiated to staging environment...', 'info');
        // Implementation would trigger actual deployment
    }

    generateDocs() {
        uiComponents.showNotification('Regenerating API documentation...', 'info');
        // Implementation would regenerate docs
    }
}

// Initialize page when DOM is loaded
let projectStructure;
document.addEventListener('DOMContentLoaded', () => {
    projectStructure = new ProjectStructurePage();
});