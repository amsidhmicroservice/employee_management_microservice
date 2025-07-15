// Global API Documentation Manager
class APIDocumentation {
    constructor() {
        this.baseUrl = 'https://api.employee-management.dev';
        this.authToken = '';
        this.authType = 'bearer';
        this.environment = 'development';
        this.requestHistory = JSON.parse(localStorage.getItem('apiRequestHistory')) || [];
        this.expandedEndpoints = new Set();

        this.init();
    }

    init() {
        console.log('API Documentation initialized');
        this.setupEventListeners();
        this.loadConfiguration();
        this.renderHistory();
        this.setupJSONEditors();
    }

    setupEventListeners() {
        // Configuration panel events
        document.getElementById('baseUrlInput')?.addEventListener('input', (e) => {
            this.baseUrl = e.target.value;
            this.saveConfiguration();
        });

        document.getElementById('authTokenInput')?.addEventListener('input', (e) => {
            this.authToken = e.target.value;
            this.saveConfiguration();
        });

        document.getElementById('authTypeSelect')?.addEventListener('change', (e) => {
            this.authType = e.target.value;
            this.saveConfiguration();
        });

        document.getElementById('environmentSelect')?.addEventListener('change', (e) => {
            this.environment = e.target.value;
            this.updateEnvironmentURL();
        });

        // Test auth button
        document.getElementById('testAuthBtn')?.addEventListener('click', () => {
            this.testAuthentication();
        });

        // Import/Export configuration
        document.getElementById('importConfigBtn')?.addEventListener('click', () => {
            this.importConfiguration();
        });

        document.getElementById('exportConfigBtn')?.addEventListener('click', () => {
            this.exportConfiguration();
        });

        // Filter buttons
        document.querySelectorAll('.filter-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterEndpoints(e.target.dataset.method);
            });
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target);
            }
        });

        // JSON editor events
        this.setupJSONEditorEvents();
    }

    setupJSONEditors() {
        // Setup character counting and JSON validation for all editors
        document.querySelectorAll('.json-editor').forEach(editor => {
            this.setupJSONEditor(editor);
        });
    }

    setupJSONEditor(editor) {
        const editorId = editor.id;
        const endpointId = editorId.replace('body-', '');

        editor.addEventListener('input', () => {
            this.updateCharacterCount(editorId);
            this.validateJSON(endpointId);
        });

        // Initial setup
        this.updateCharacterCount(editorId);
        this.validateJSON(endpointId);
    }

    setupJSONEditorEvents() {
        // Parameter input events for URL building
        document.querySelectorAll('[id^="param-id-"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const endpointId = e.target.id.replace('param-id-', '');
                this.updateURLWithParams(endpointId);
            });
        });

        // Query parameter events
        document.querySelectorAll('[id^="param-page-"], [id^="param-limit-"], [id^="param-department-"]').forEach(input => {
            input.addEventListener('input', () => {
                this.updateQueryParams('list-employees');
            });
        });
    }

    updateCharacterCount(editorId) {
        const editor = document.getElementById(editorId);
        const footer = editor?.closest('.body-editor')?.querySelector('.editor-footer');
        const charCount = footer?.querySelector('.char-count');

        if (editor && charCount) {
            charCount.textContent = `${editor.value.length} characters`;
        }
    }

    validateJSON(endpointId) {
        const editor = document.getElementById(`body-${endpointId}`);
        const footer = editor?.closest('.body-editor')?.querySelector('.editor-footer');
        const jsonStatus = footer?.querySelector('.json-status');

        if (!editor || !jsonStatus) return;

        try {
            if (editor.value.trim() === '') {
                jsonStatus.textContent = 'Empty';
                jsonStatus.className = 'json-status valid';
                return;
            }

            JSON.parse(editor.value);
            jsonStatus.textContent = 'Valid JSON';
            jsonStatus.className = 'json-status valid';
        } catch (error) {
            jsonStatus.textContent = 'Invalid JSON';
            jsonStatus.className = 'json-status invalid';
        }
    }

    updateURLWithParams(endpointId) {
        const paramInput = document.getElementById(`param-id-${endpointId}`);
        const urlInput = document.getElementById(`url-${endpointId}`);

        if (paramInput && urlInput) {
            const baseURL = urlInput.value.split('/').slice(0, -1).join('/');
            const paramValue = paramInput.value.trim();
            urlInput.value = paramValue ? `${baseURL}/${paramValue}` : `${baseURL}/`;
        }
    }

    updateQueryParams(endpointId) {
        const params = {
            page: document.getElementById('param-page-list-employees')?.value,
            limit: document.getElementById('param-limit-list-employees')?.value,
            department: document.getElementById('param-department-list-employees')?.value
        };

        const queryString = Object.entries(params)
            .filter(([key, value]) => value && value.trim() !== '')
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const urlInput = document.querySelector('#content-list-employees .url-input');
        if (urlInput) {
            const baseUrl = '/employees';
            urlInput.value = queryString ? `${baseUrl}?${queryString}` : baseUrl;
        }
    }

    loadConfiguration() {
        const config = JSON.parse(localStorage.getItem('apiDocConfig')) || {};

        if (config.baseUrl) {
            this.baseUrl = config.baseUrl;
            const input = document.getElementById('baseUrlInput');
            if (input) input.value = this.baseUrl;
        }

        if (config.authToken) {
            this.authToken = config.authToken;
            const input = document.getElementById('authTokenInput');
            if (input) input.value = this.authToken;
        }

        if (config.authType) {
            this.authType = config.authType;
            const select = document.getElementById('authTypeSelect');
            if (select) select.value = this.authType;
        }
    }

    saveConfiguration() {
        const config = {
            baseUrl: this.baseUrl,
            authToken: this.authToken,
            authType: this.authType,
            environment: this.environment
        };
        localStorage.setItem('apiDocConfig', JSON.stringify(config));
    }

    updateEnvironmentURL() {
        const envUrls = {
            development: 'https://api-dev.employee-management.dev',
            staging: 'https://api-staging.employee-management.dev',
            production: 'https://api.employee-management.dev'
        };

        this.baseUrl = envUrls[this.environment] || envUrls.development;
        const input = document.getElementById('baseUrlInput');
        if (input) input.value = this.baseUrl;
        this.saveConfiguration();
    }

    async testAuthentication() {
        const btn = document.getElementById('testAuthBtn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        btn.disabled = true;

        try {
            const headers = this.buildHeaders();
            const response = await fetch(`${this.baseUrl}/auth/validate`, {
                method: 'POST',
                headers: headers
            });

            if (response.ok) {
                this.showNotification('Authentication successful!', 'success');
                btn.innerHTML = '<i class="fas fa-check"></i> Valid';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.showNotification('Authentication failed: ' + error.message, 'error');
            btn.innerHTML = '<i class="fas fa-times"></i> Failed';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }
    }

    importConfiguration() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const config = JSON.parse(e.target.result);
                        this.baseUrl = config.baseUrl || this.baseUrl;
                        this.authToken = config.authToken || this.authToken;
                        this.authType = config.authType || this.authType;
                        this.environment = config.environment || this.environment;

                        this.loadConfiguration();
                        this.saveConfiguration();
                        this.showNotification('Configuration imported successfully!', 'success');
                    } catch (error) {
                        this.showNotification('Invalid configuration file', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    exportConfiguration() {
        const config = {
            baseUrl: this.baseUrl,
            authToken: this.authToken,
            authType: this.authType,
            environment: this.environment,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Configuration exported successfully!', 'success');
    }

    filterEndpoints(method) {
        // Update filter buttons
        document.querySelectorAll('.filter-tag').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        // Show/hide endpoints
        document.querySelectorAll('.api-endpoint').forEach(endpoint => {
            if (method === 'all' || endpoint.dataset.method === method) {
                endpoint.style.display = 'block';
            } else {
                endpoint.style.display = 'none';
            }
        });
    }

    switchTab(tabBtn) {
        const endpointContent = tabBtn.closest('.endpoint-content');
        const tabName = tabBtn.dataset.tab;

        // Update tab buttons
        endpointContent.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabBtn.classList.add('active');

        // Update tab content
        endpointContent.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = endpointContent.querySelector(`.tab-content.${tabName}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    buildHeaders(additionalHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...additionalHeaders
        };

        if (this.authToken) {
            if (this.authType === 'bearer') {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            } else if (this.authType === 'basic') {
                headers['Authorization'] = `Basic ${btoa(this.authToken)}`;
            } else if (this.authType === 'apikey') {
                headers['X-API-Key'] = this.authToken;
            }
        }

        return headers;
    }

    async executeRequest(endpointId) {
        const startTime = Date.now();
        this.showLoading(true);
        this.updateEndpointStatus(endpointId, 'loading', 'Sending...');

        try {
            const requestConfig = this.buildRequestConfig(endpointId);
            console.log('Executing request:', requestConfig);

            // Since we don't have a real API, simulate the request
            const response = await this.simulateAPIRequest(requestConfig);

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Display response
            this.displayResponse(endpointId, response, responseTime);

            // Update status
            const statusClass = response.status >= 200 && response.status < 300 ? 'success' : 'error';
            this.updateEndpointStatus(endpointId, statusClass, `${response.status}`);

            // Add to history
            this.addToHistory({
                method: requestConfig.method,
                url: requestConfig.url,
                status: response.status,
                time: responseTime,
                timestamp: new Date().toISOString()
            });

            // Show response tab
            const responseTab = document.querySelector(`#content-${endpointId} .tab-btn[data-tab="response"]`);
            if (responseTab) {
                this.switchTab(responseTab);
            }

        } catch (error) {
            console.error('Request failed:', error);
            this.updateEndpointStatus(endpointId, 'error', 'Error');
            this.displayError(endpointId, error.message);
            this.showNotification('Request failed: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    buildRequestConfig(endpointId) {
        const method = this.getEndpointMethod(endpointId);
        const url = this.getEndpointURL(endpointId);
        const headers = this.getEndpointHeaders(endpointId);
        const body = this.getRequestBody(endpointId);

        return {
            method,
            url: `${this.baseUrl}${url}`,
            headers,
            body: ['GET', 'DELETE'].includes(method) ? undefined : body
        };
    }

    getEndpointMethod(endpointId) {
        const endpoint = document.querySelector(`[data-endpoint-id="${endpointId}"]`);
        return endpoint?.dataset.method || 'GET';
    }

    getEndpointURL(endpointId) {
        const urlInput = document.querySelector(`#content-${endpointId} .url-input`);
        return urlInput?.value || '/';
    }

    getEndpointHeaders(endpointId) {
        const headers = this.buildHeaders();

        // Add custom headers from the UI
        const headerRows = document.querySelectorAll(`#headers-${endpointId} .header-row`);
        headerRows.forEach(row => {
            const keyInput = row.querySelector('.header-key');
            const valueInput = row.querySelector('.header-value');

            if (keyInput?.value && valueInput?.value && !keyInput.readOnly) {
                headers[keyInput.value] = valueInput.value;
            }
        });

        return headers;
    }

    getRequestBody(endpointId) {
        const bodyEditor = document.getElementById(`body-${endpointId}`);
        if (!bodyEditor || !bodyEditor.value.trim()) return null;

        try {
            return JSON.parse(bodyEditor.value);
        } catch (error) {
            throw new Error('Invalid JSON in request body');
        }
    }

    async simulateAPIRequest(config) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        // Generate mock responses based on the endpoint
        const url = config.url.replace(config.url.split('/').slice(0, 3).join('/'), '');

        if (config.method === 'POST' && url.includes('/employees')) {
            return {
                status: 201,
                data: {
                    success: true,
                    data: {
                        id: `emp_${Math.random().toString(36).substr(2, 9)}`,
                        message: "Employee created successfully",
                        ...config.body
                    },
                    statusCode: 201
                }
            };
        }

        if (config.method === 'GET' && url.includes('/employees/')) {
            const id = url.split('/employees/')[1];
            return {
                status: 200,
                data: {
                    success: true,
                    data: {
                        id: id || `emp_${Math.random().toString(36).substr(2, 9)}`,
                        firstName: "John",
                        lastName: "Doe",
                        email: "john.doe@company.com",
                        department: "Engineering",
                        position: "Software Developer",
                        salary: 75000,
                        hireDate: "2024-01-15T00:00:00Z",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    statusCode: 200
                }
            };
        }

        if (config.method === 'GET' && url === '/employees') {
            return {
                status: 200,
                data: {
                    success: true,
                    data: {
                        employees: [
                            {
                                id: "emp_abc123",
                                firstName: "John",
                                lastName: "Doe",
                                email: "john.doe@company.com",
                                department: "Engineering",
                                position: "Software Developer"
                            },
                            {
                                id: "emp_def456",
                                firstName: "Jane",
                                lastName: "Smith",
                                email: "jane.smith@company.com",
                                department: "Marketing",
                                position: "Marketing Manager"
                            }
                        ],
                        pagination: {
                            page: 1,
                            limit: 10,
                            total: 25,
                            totalPages: 3
                        }
                    },
                    statusCode: 200
                }
            };
        }

        if (config.method === 'PUT' && url.includes('/employees/')) {
            return {
                status: 200,
                data: {
                    success: true,
                    data: {
                        id: url.split('/employees/')[1],
                        message: "Employee updated successfully"
                    },
                    statusCode: 200
                }
            };
        }

        if (config.method === 'DELETE' && url.includes('/employees/')) {
            return {
                status: 204,
                data: null
            };
        }

        // Default response
        return {
            status: 200,
            data: {
                success: true,
                message: "Request executed successfully",
                statusCode: 200
            }
        };
    }

    displayResponse(endpointId, response, responseTime) {
        const container = document.getElementById(`response-${endpointId}`);
        if (!container) return;

        const statusClass = response.status >= 200 && response.status < 300 ? 'success' : 'error';

        container.innerHTML = `
            <div class="response-viewer">
                <div class="response-header">
                    <div class="response-status">
                        <span class="status-code ${statusClass}">${response.status}</span>
                        <span>${this.getStatusText(response.status)}</span>
                    </div>
                    <div class="response-time">${responseTime}ms</div>
                </div>
                <div class="response-body">
                    <pre><code>${JSON.stringify(response.data, null, 2)}</code></pre>
                </div>
            </div>
        `;
    }

    displayError(endpointId, errorMessage) {
        const container = document.getElementById(`response-${endpointId}`);
        if (!container) return;

        container.innerHTML = `
            <div class="response-viewer">
                <div class="response-header">
                    <div class="response-status">
                        <span class="status-code error">ERROR</span>
                        <span>Request Failed</span>
                    </div>
                </div>
                <div class="response-body">
                    <pre><code>${errorMessage}</code></pre>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusTexts = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error'
        };
        return statusTexts[status] || 'Unknown';
    }

    updateEndpointStatus(endpointId, statusClass, text) {
        const statusElement = document.getElementById(`status-${endpointId}`);
        if (statusElement) {
            statusElement.className = `endpoint-status ${statusClass}`;
            statusElement.textContent = text;
        }
    }

    addToHistory(request) {
        this.requestHistory.unshift(request);

        // Keep only last 20 requests
        this.requestHistory = this.requestHistory.slice(0, 20);

        localStorage.setItem('apiRequestHistory', JSON.stringify(this.requestHistory));
        this.renderHistory();
    }

    renderHistory() {
        const container = document.getElementById('requestHistory');
        if (!container) return;

        if (this.requestHistory.length === 0) {
            container.innerHTML = `
                <div class="history-placeholder">
                    <i class="fas fa-clock"></i>
                    <p>No requests made yet. Execute an API call to see history.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.requestHistory.map(request => `
            <div class="history-item" onclick="apiDoc.replayRequest('${JSON.stringify(request).replace(/"/g, '&quot;')}')">
                <span class="history-method ${request.method.toLowerCase()}">${request.method}</span>
                <span class="history-url">${request.url}</span>
                <span class="history-status ${request.status >= 200 && request.status < 300 ? 'success' : 'error'}">${request.status}</span>
                <span class="history-time">${this.formatTime(request.timestamp)}</span>
            </div>
        `).join('');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    clearHistory() {
        this.requestHistory = [];
        localStorage.removeItem('apiRequestHistory');
        this.renderHistory();
        this.showNotification('Request history cleared', 'info');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;

        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };

        notification.style.borderLeftColor = colors[type];
        notification.style.borderLeftWidth = '4px';

        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${icons[type]}" style="color: ${colors[type]}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Global functions called from HTML
function toggleEndpoint(endpointId) {
    const header = document.querySelector(`[data-endpoint-id="${endpointId}"] .endpoint-header`);
    const content = document.getElementById(`content-${endpointId}`);
    const icon = header?.querySelector('.expand-icon');

    if (header && content && icon) {
        const isExpanded = content.classList.contains('expanded');

        if (isExpanded) {
            content.classList.remove('expanded');
            header.classList.remove('expanded');
            apiDoc.expandedEndpoints.delete(endpointId);
        } else {
            content.classList.add('expanded');
            header.classList.add('expanded');
            apiDoc.expandedEndpoints.add(endpointId);
        }
    }
}

function executeRequest(endpointId) {
    if (apiDoc) {
        apiDoc.executeRequest(endpointId);
    }
}

function addHeader(endpointId) {
    const container = document.getElementById(`headers-${endpointId}`);
    if (!container) return;

    const newRow = document.createElement('div');
    newRow.className = 'header-row';
    newRow.innerHTML = `
        <input type="text" class="header-key" placeholder="Header name">
        <input type="text" class="header-value" placeholder="Header value">
        <button class="remove-header" onclick="removeHeader(this)"><i class="fas fa-times"></i></button>
    `;

    // Insert before the add row
    const addRow = container.querySelector('.header-row:last-child');
    container.insertBefore(newRow, addRow);
}

function removeHeader(button) {
    button.closest('.header-row').remove();
}

function formatJSON(endpointId) {
    const editor = document.getElementById(`body-${endpointId}`);
    if (!editor) return;

    try {
        const parsed = JSON.parse(editor.value);
        editor.value = JSON.stringify(parsed, null, 2);
        apiDoc.validateJSON(endpointId);
        apiDoc.showNotification('JSON formatted successfully', 'success');
    } catch (error) {
        apiDoc.showNotification('Invalid JSON - cannot format', 'error');
    }
}

function validateJSON(endpointId) {
    apiDoc.validateJSON(endpointId);
}

function loadExample(endpointId) {
    const examples = {
        'create-employee': {
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice.johnson@company.com",
            department: "Marketing",
            position: "Marketing Specialist",
            salary: 65000,
            hireDate: new Date().toISOString()
        },
        'update-employee': {
            firstName: "Alice",
            lastName: "Johnson-Smith",
            email: "alice.johnson-smith@company.com",
            department: "Marketing",
            position: "Senior Marketing Specialist",
            salary: 72000
        }
    };

    const editor = document.getElementById(`body-${endpointId}`);
    if (editor && examples[endpointId]) {
        editor.value = JSON.stringify(examples[endpointId], null, 2);
        apiDoc.updateCharacterCount(`body-${endpointId}`);
        apiDoc.validateJSON(endpointId);
        apiDoc.showNotification('Example loaded', 'success');
    }
}

function clearHistory() {
    if (apiDoc) {
        apiDoc.clearHistory();
    }
}

// Initialize API Documentation when DOM loads
let apiDoc;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing API Documentation...');
    apiDoc = new APIDocumentation();
});

// Also try immediate initialization
if (document.readyState === 'complete') {
    console.log('Document already loaded, initializing API Documentation immediately...');
    apiDoc = new APIDocumentation();
}