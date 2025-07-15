// Interactive API Documentation and Testing Module
class ApiInteractive {
    constructor() {
        this.apiBaseUrl = 'https://api.employee-management.example.com';
        this.currentEndpoint = null;
        this.requestHistory = [];
        this.init();
    }

    init() {
        this.setupApiDocumentation();
        this.setupEventListeners();
        console.log('API Interactive module initialized');
    }

    setupApiDocumentation() {
        const container = document.getElementById('openApiSection');
        if (!container) return;

        container.innerHTML = this.generateOpenApiDocumentation();
        this.attachApiEventListeners();
    }

    generateOpenApiDocumentation() {
        return `
            <div class="openapi-section fade-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-book-open"></i>
                        Interactive OpenAPI 3.0 Documentation
                    </h2>
                    <p class="section-subtitle">Execute real API requests with interactive testing interface</p>
                </div>

                <div class="api-overview">
                    <div class="api-info-card">
                        <div class="api-info-header">
                            <h3><i class="fas fa-server"></i> API Information</h3>
                        </div>
                        <div class="api-info-content">
                            <div class="info-row">
                                <span class="info-label">Base URL:</span>
                                <span class="info-value">${this.apiBaseUrl}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Version:</span>
                                <span class="info-value">1.0.0</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Authentication:</span>
                                <span class="info-value">JWT Bearer Token</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="api-endpoints">
                    ${this.generateEndpoints()}
                </div>

                <div class="api-schemas">
                    <h3><i class="fas fa-code"></i> Data Schemas</h3>
                    ${this.generateSchemas()}
                </div>
            </div>
        `;
    }

    generateEndpoints() {
        const endpoints = [
            {
                method: 'POST',
                path: '/employees',
                summary: 'Create new employee',
                description: 'Creates a new employee record in the system',
                requestBody: {
                    required: true,
                    schema: 'Employee'
                },
                responses: {
                    201: 'Employee created successfully',
                    400: 'Invalid input data',
                    401: 'Unauthorized'
                }
            },
            {
                method: 'GET',
                path: '/employees/{id}',
                summary: 'Get employee by ID',
                description: 'Retrieves employee information by employee ID',
                parameters: [
                    { name: 'id', type: 'string', required: true, description: 'Employee ID' }
                ],
                responses: {
                    200: 'Employee details retrieved',
                    404: 'Employee not found',
                    401: 'Unauthorized'
                }
            },
            {
                method: 'PUT',
                path: '/employees/{id}',
                summary: 'Update employee',
                description: 'Updates an existing employee record',
                parameters: [
                    { name: 'id', type: 'string', required: true, description: 'Employee ID' }
                ],
                requestBody: {
                    required: true,
                    schema: 'Employee'
                },
                responses: {
                    200: 'Employee updated successfully',
                    404: 'Employee not found',
                    400: 'Invalid input data'
                }
            },
            {
                method: 'DELETE',
                path: '/employees/{id}',
                summary: 'Delete employee',
                description: 'Removes an employee from the system',
                parameters: [
                    { name: 'id', type: 'string', required: true, description: 'Employee ID' }
                ],
                responses: {
                    204: 'Employee deleted successfully',
                    404: 'Employee not found',
                    401: 'Unauthorized'
                }
            },
            {
                method: 'GET',
                path: '/employees',
                summary: 'List all employees',
                description: 'Retrieves a paginated list of all employees',
                parameters: [
                    { name: 'page', type: 'integer', required: false, description: 'Page number' },
                    { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
                    { name: 'department', type: 'string', required: false, description: 'Filter by department' }
                ],
                responses: {
                    200: 'List of employees retrieved',
                    401: 'Unauthorized'
                }
            }
        ];

        return endpoints.map(endpoint => this.generateEndpointHtml(endpoint)).join('');
    }

    generateEndpointHtml(endpoint) {
        const endpointId = `endpoint-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[^a-zA-Z0-9]/g, '-')}`;
        
        return `
            <div class="api-endpoint" data-endpoint-id="${endpointId}">
                <div class="api-endpoint-header" onclick="apiInteractive.toggleEndpoint('${endpointId}')">
                    <span class="http-method ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
                    <span class="api-path">${endpoint.path}</span>
                    <span class="api-description">${endpoint.summary}</span>
                    <i class="fas fa-chevron-down expand-icon"></i>
                </div>
                <div class="api-endpoint-content" id="${endpointId}-content">
                    <div class="api-endpoint-body">
                        <p class="endpoint-description">${endpoint.description}</p>
                        
                        ${endpoint.parameters ? this.generateParametersTable(endpoint.parameters) : ''}
                        ${endpoint.requestBody ? this.generateRequestBodySection(endpoint.requestBody) : ''}
                        
                        <div class="api-testing-interface">
                            <div class="api-request-panel">
                                <div class="panel-header">
                                    <h4 class="panel-title">
                                        <i class="fas fa-paper-plane"></i> Try It Out
                                    </h4>
                                </div>
                                ${this.generateRequestForm(endpoint)}
                            </div>
                            <div class="api-response-panel">
                                <div class="panel-header">
                                    <h4 class="panel-title">
                                        <i class="fas fa-code"></i> Response
                                    </h4>
                                </div>
                                <div class="response-placeholder">
                                    <p>Click "Execute" to see the response</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="response-examples">
                            <h4><i class="fas fa-list"></i> Response Examples</h4>
                            ${this.generateResponseExamples(endpoint.responses)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateParametersTable(parameters) {
        return `
            <div class="parameters-section">
                <h4><i class="fas fa-sliders-h"></i> Parameters</h4>
                <table class="param-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${parameters.map(param => `
                            <tr>
                                <td class="param-name">${param.name}</td>
                                <td><span class="param-type">${param.type}</span></td>
                                <td class="${param.required ? 'param-required' : ''}">${param.required ? 'Yes' : 'No'}</td>
                                <td>${param.description}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateRequestBodySection(requestBody) {
        return `
            <div class="request-body-section">
                <h4><i class="fas fa-file-code"></i> Request Body</h4>
                <p>Content-Type: application/json</p>
                <p>Required: ${requestBody.required ? 'Yes' : 'No'}</p>
                <p>Schema: <code>${requestBody.schema}</code></p>
            </div>
        `;
    }

    generateRequestForm(endpoint) {
        return `
            <form class="api-request-form" id="form-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[^a-zA-Z0-9]/g, '-')}">
                <div class="form-group">
                    <label class="form-label">Base URL</label>
                    <input type="text" class="form-input" name="baseUrl" value="${this.apiBaseUrl}" readonly>
                </div>
                
                ${endpoint.parameters ? endpoint.parameters.map(param => `
                    <div class="form-group">
                        <label class="form-label">${param.name} ${param.required ? '*' : ''}</label>
                        <input type="text" class="form-input" name="param-${param.name}" 
                               placeholder="${param.description}" ${param.required ? 'required' : ''}>
                    </div>
                `).join('') : ''}
                
                ${endpoint.requestBody ? `
                    <div class="form-group">
                        <label class="form-label">Request Body (JSON) *</label>
                        <textarea class="form-textarea" name="requestBody" rows="8" 
                                  placeholder='${this.getExampleRequestBody(endpoint.requestBody.schema)}'></textarea>
                    </div>
                ` : ''}
                
                <div class="form-group">
                    <label class="form-label">Authorization (Optional)</label>
                    <input type="text" class="form-input" name="authorization" 
                           placeholder="Bearer your-jwt-token">
                </div>
                
                <button type="submit" class="try-it-btn">
                    <i class="fas fa-play"></i> Execute Request
                </button>
            </form>
        `;
    }

    generateResponseExamples(responses) {
        return Object.entries(responses).map(([code, description]) => `
            <div class="response-example">
                <div class="response-status ${parseInt(code) < 400 ? 'success' : 'error'}">${code}</div>
                <p>${description}</p>
                <div class="code-block">
                    <div class="code-block-header">
                        <span class="code-language">JSON</span>
                        <button class="copy-code-btn" onclick="apiInteractive.copyExample(this)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre>${this.getExampleResponse(code)}</pre>
                </div>
            </div>
        `).join('');
    }

    generateSchemas() {
        const schemas = {
            Employee: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Unique employee identifier' },
                    firstName: { type: 'string', description: 'Employee first name' },
                    lastName: { type: 'string', description: 'Employee last name' },
                    email: { type: 'string', description: 'Employee email address' },
                    department: { type: 'string', description: 'Employee department' },
                    position: { type: 'string', description: 'Employee position' },
                    salary: { type: 'number', description: 'Employee salary' },
                    hireDate: { type: 'string', description: 'Date of hire (ISO 8601)' }
                },
                required: ['firstName', 'lastName', 'email', 'department', 'position']
            }
        };

        return Object.entries(schemas).map(([name, schema]) => `
            <div class="schema-viewer">
                <h4><i class="fas fa-cube"></i> ${name}</h4>
                <p><strong>Type:</strong> ${schema.type}</p>
                <div class="schema-properties">
                    ${Object.entries(schema.properties).map(([propName, prop]) => `
                        <div class="schema-property">
                            <span class="schema-name">${propName}</span>
                            <span class="schema-type">${prop.type}</span>
                            <span class="schema-description">${prop.description}</span>
                            ${schema.required && schema.required.includes(propName) ? 
                                '<span class="param-required">Required</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    toggleEndpoint(endpointId) {
        const header = document.querySelector(`[data-endpoint-id="${endpointId}"] .api-endpoint-header`);
        const content = document.getElementById(`${endpointId}-content`);
        const icon = header.querySelector('.expand-icon');

        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            header.classList.remove('expanded');
            icon.style.transform = 'rotate(0deg)';
        } else {
            content.classList.add('expanded');
            header.classList.add('expanded');
            icon.style.transform = 'rotate(180deg)';
        }
    }

    attachApiEventListeners() {
        // Handle form submissions
        document.querySelectorAll('.api-request-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.executeRequest(form);
            });
        });
    }

    async executeRequest(form) {
        const formData = new FormData(form);
        const endpoint = this.buildEndpointFromForm(form, formData);
        const responsePanel = form.closest('.api-testing-interface').querySelector('.api-response-panel');
        
        // Show loading
        const spinner = uiComponents.showLoadingSpinner(responsePanel, 'Executing request...');
        
        try {
            const response = await this.makeApiRequest(endpoint);
            this.displayResponse(responsePanel, response);
            uiComponents.showNotification('Request executed successfully', 'success');
        } catch (error) {
            this.displayError(responsePanel, error);
            uiComponents.showNotification('Request failed: ' + error.message, 'error');
        } finally {
            uiComponents.hideLoadingSpinner(responsePanel);
        }
    }

    buildEndpointFromForm(form, formData) {
        // Build the complete endpoint configuration from form data
        const baseUrl = formData.get('baseUrl');
        let path = form.id.includes('employees') ? '/employees' : '/';
        
        // Add path parameters
        const pathParams = [];
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('param-') && value) {
                pathParams.push(value);
            }
        }
        
        if (pathParams.length > 0) {
            path += '/' + pathParams.join('/');
        }

        const method = form.id.includes('post') ? 'POST' : 
                      form.id.includes('put') ? 'PUT' :
                      form.id.includes('delete') ? 'DELETE' : 'GET';

        return {
            url: baseUrl + path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(formData.get('authorization') && {
                    'Authorization': formData.get('authorization')
                })
            },
            body: formData.get('requestBody') || null
        };
    }

    async makeApiRequest(config) {
        // Simulate API request (replace with actual API call)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) { // 80% success rate for demo
                    resolve({
                        status: config.method === 'POST' ? 201 : 
                               config.method === 'DELETE' ? 204 : 200,
                        data: this.getMockResponse(config.method),
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Response-Time': '45ms'
                        }
                    });
                } else {
                    reject(new Error('Network error or invalid request'));
                }
            }, 1000 + Math.random() * 2000); // 1-3 second delay
        });
    }

    displayResponse(panel, response) {
        panel.innerHTML = `
            <div class="panel-header">
                <h4 class="panel-title">
                    <i class="fas fa-code"></i> Response
                </h4>
            </div>
            <div class="response-content">
                <div class="response-status ${response.status < 400 ? 'success' : 'error'}">
                    ${response.status} ${this.getStatusText(response.status)}
                </div>
                <details class="response-headers">
                    <summary>Response Headers</summary>
                    <div class="code-block">
                        <pre>${JSON.stringify(response.headers, null, 2)}</pre>
                    </div>
                </details>
                <div class="response-body">
                    <h5>Response Body</h5>
                    <div class="code-block">
                        <div class="code-block-header">
                            <span class="code-language">JSON</span>
                            <button class="copy-code-btn" onclick="apiInteractive.copyResponse(this)">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <pre>${JSON.stringify(response.data, null, 2)}</pre>
                    </div>
                </div>
            </div>
        `;
    }

    displayError(panel, error) {
        panel.innerHTML = `
            <div class="panel-header">
                <h4 class="panel-title">
                    <i class="fas fa-exclamation-triangle"></i> Error
                </h4>
            </div>
            <div class="response-content">
                <div class="response-status error">Error</div>
                <div class="error-message">
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }

    getExampleRequestBody(schema) {
        const examples = {
            Employee: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                department: "Engineering",
                position: "Software Developer",
                salary: 75000,
                hireDate: "2024-01-15T00:00:00Z"
            }, null, 2)
        };
        return examples[schema] || '{}';
    }

    getExampleResponse(statusCode) {
        const examples = {
            200: JSON.stringify({
                id: "emp_123456",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                department: "Engineering",
                position: "Software Developer",
                salary: 75000,
                hireDate: "2024-01-15T00:00:00Z",
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T10:30:00Z"
            }, null, 2),
            201: JSON.stringify({
                id: "emp_123456",
                message: "Employee created successfully"
            }, null, 2),
            400: JSON.stringify({
                error: "Bad Request",
                message: "Invalid input data",
                details: ["Email is required", "Department is invalid"]
            }, null, 2),
            404: JSON.stringify({
                error: "Not Found",
                message: "Employee not found"
            }, null, 2)
        };
        return examples[statusCode] || '{}';
    }

    getMockResponse(method) {
        switch (method) {
            case 'GET':
                return {
                    id: "emp_123456",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    department: "Engineering",
                    position: "Software Developer",
                    salary: 75000,
                    hireDate: "2024-01-15T00:00:00Z"
                };
            case 'POST':
                return {
                    id: "emp_" + Math.random().toString(36).substr(2, 9),
                    message: "Employee created successfully"
                };
            case 'PUT':
                return {
                    message: "Employee updated successfully"
                };
            case 'DELETE':
                return null;
            default:
                return {};
        }
    }

    getStatusText(status) {
        const statusTexts = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            400: 'Bad Request',
            401: 'Unauthorized',
            404: 'Not Found',
            500: 'Internal Server Error'
        };
        return statusTexts[status] || 'Unknown';
    }

    copyExample(button) {
        const codeBlock = button.closest('.code-block').querySelector('pre');
        uiComponents.copyToClipboard(codeBlock.textContent, 'Example copied to clipboard!');
    }

    copyResponse(button) {
        const codeBlock = button.closest('.code-block').querySelector('pre');
        uiComponents.copyToClipboard(codeBlock.textContent, 'Response copied to clipboard!');
    }
}

// Initialize API Interactive when DOM is loaded
let apiInteractive;
document.addEventListener('DOMContentLoaded', () => {
    apiInteractive = new ApiInteractive();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiInteractive;
}