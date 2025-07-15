// Global file tree instance
let fileTree;

// File Tree Data Structure
const FILE_STRUCTURE = {
    name: 'employee_management_system',
    type: 'folder',
    icon: 'fas fa-folder',
    children: [
        {
            name: 'src',
            type: 'folder',
            icon: 'fas fa-folder',
            children: [
                {
                    name: 'handlers',
                    type: 'folder',
                    icon: 'fas fa-folder',
                    children: [
                        {
                            name: 'employee_handler.py',
                            type: 'file',
                            category: 'code',
                            icon: 'fab fa-python',
                            size: '3.2 KB',
                            modified: '2024-01-15',
                            description: 'Main employee operations handler',
                            lines: 125,
                            language: 'Python'
                        },
                        {
                            name: 'auth_handler.py',
                            type: 'file',
                            category: 'code',
                            icon: 'fab fa-python',
                            size: '2.1 KB',
                            modified: '2024-01-10',
                            description: 'Authentication and authorization handler',
                            lines: 85,
                            language: 'Python'
                        },
                        {
                            name: '__init__.py',
                            type: 'file',
                            category: 'code',
                            icon: 'fab fa-python',
                            size: '0.1 KB',
                            modified: '2024-01-05',
                            description: 'Package initialization file',
                            lines: 3,
                            language: 'Python'
                        }
                    ]
                },
                {
                    name: 'models',
                    type: 'folder',
                    icon: 'fas fa-folder',
                    children: [
                        {
                            name: 'employee.py',
                            type: 'file',
                            category: 'code',
                            icon: 'fab fa-python',
                            size: '2.8 KB',
                            modified: '2024-01-12',
                            description: 'Employee data model and validation',
                            lines: 95,
                            language: 'Python'
                        },
                        {
                            name: 'base.py',
                            type: 'file',
                            category: 'code',
                            icon: 'fab fa-python',
                            size: '1.5 KB',
                            modified: '2024-01-08',
                            description: 'Base model class with common functionality',
                            lines: 65,
                            language: 'Python'
                        }
                    ]
                }
            ]
        },
        {
            name: 'tests',
            type: 'folder',
            icon: 'fas fa-folder',
            children: [
                {
                    name: 'test_employee_handler.py',
                    type: 'file',
                    category: 'code',
                    icon: 'fas fa-vial',
                    size: '5.2 KB',
                    modified: '2024-01-15',
                    description: 'Unit tests for employee handler',
                    lines: 180,
                    language: 'Python'
                }
            ]
        },
        {
            name: 'README.md',
            type: 'file',
            category: 'docs',
            icon: 'fab fa-markdown',
            size: '3.2 KB',
            modified: '2024-01-15',
            description: 'Project overview and setup instructions',
            lines: 95,
            language: 'Markdown'
        },
        {
            name: 'requirements.txt',
            type: 'file',
            category: 'config',
            icon: 'fas fa-list',
            size: '0.5 KB',
            modified: '2024-01-10',
            description: 'Python package dependencies',
            lines: 15,
            language: 'Text'
        }
    ]
};

// File Tree Class
class FileTree {
    constructor() {
        this.fileStructure = FILE_STRUCTURE;
        this.expandedFolders = new Set(['employee_management_system']); // Root expanded by default
        this.selectedFile = null;
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        console.log('FileTree initializing...');
        this.init();
    }

    init() {
        console.log('FileTree init started');
        this.setupEventListeners();
        this.renderFileTree();
        console.log('FileTree initialized successfully');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('fileSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderFileTree();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderFileTree();
            });
        });

        // Expand/Collapse buttons
        const expandAllBtn = document.getElementById('expandAll');
        const collapseAllBtn = document.getElementById('collapseAll');

        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', () => this.expandAll());
        }

        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', () => this.collapseAll());
        }
    }

    renderFileTree() {
        const container = document.getElementById('fileTreeContainer');
        if (!container) {
            console.error('File tree container not found!');
            return;
        }

        console.log('Rendering file tree...');
        container.innerHTML = this.renderNode(this.fileStructure, 0, '');
        console.log('File tree rendered');
    }

    renderNode(node, level, path) {
        if (!node) return '';

        const currentPath = path ? `${path}/${node.name}` : node.name;
        const isExpanded = this.expandedFolders.has(currentPath);
        const isSelected = this.selectedFile === currentPath;

        let html = '';

        if (node.type === 'folder') {
            html += `
                <div class="tree-item folder ${isExpanded ? 'expanded' : ''}" style="margin-left: ${level * 20}px;">
                    <div class="tree-item-content" onclick="fileTree.toggleFolder('${currentPath}')">
                        <i class="fas fa-chevron-right tree-icon ${isExpanded ? 'expanded' : ''}"></i>
                        <i class="${node.icon} file-icon"></i>
                        <span class="file-name">${node.name}</span>
                        ${node.children ? `<span class="folder-count">(${node.children.length})</span>` : ''}
                    </div>
                    <div class="tree-children ${isExpanded ? 'expanded' : ''}">
                        ${isExpanded && node.children ? 
                            node.children.map(child => this.renderNode(child, level + 1, currentPath)).join('') : 
                            ''
                        }
                    </div>
                </div>
            `;
        } else {
            // Apply filters
            if (this.shouldShowFile(node)) {
                html += `
                    <div class="tree-item file ${isSelected ? 'selected' : ''}" 
                         style="margin-left: ${level * 20}px;"
                         onclick="fileTree.selectFile('${currentPath}', ${JSON.stringify(node).replace(/"/g, '&quot;')})">
                        <div class="tree-item-content">
                            <i class="${node.icon} file-icon"></i>
                            <span class="file-name">${node.name}</span>
                            <span class="file-size">${node.size}</span>
                        </div>
                    </div>
                `;
            }
        }

        return html;
    }

    shouldShowFile(node) {
        // Apply search filter
        if (this.searchQuery) {
            const matchesName = node.name.toLowerCase().includes(this.searchQuery);
            const matchesDescription = node.description?.toLowerCase().includes(this.searchQuery);
            if (!matchesName && !matchesDescription) {
                return false;
            }
        }

        // Apply category filter
        if (this.currentFilter !== 'all' && node.category !== this.currentFilter) {
            return false;
        }

        return true;
    }

    toggleFolder(folderPath) {
        console.log('Toggling folder:', folderPath);
        
        if (this.expandedFolders.has(folderPath)) {
            this.expandedFolders.delete(folderPath);
        } else {
            this.expandedFolders.add(folderPath);
        }
        
        this.renderFileTree();
    }

    selectFile(filePath, fileData) {
        console.log('Selecting file:', filePath, fileData);
        
        // Remove previous selection
        document.querySelectorAll('.tree-item.file').forEach(item => {
            item.classList.remove('selected');
        });

        // Add selection to current file
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('selected');
        }
        
        this.selectedFile = filePath;
        this.showFileDetails(fileData);
    }

    showFileDetails(fileData) {
        const detailsContainer = document.getElementById('fileDetails');
        if (!detailsContainer) {
            console.error('File details container not found!');
            return;
        }

        console.log('Showing file details for:', fileData.name);

        detailsContainer.innerHTML = `
            <div class="file-details-header">
                <h3>
                    <i class="${fileData.icon}"></i>
                    ${fileData.name}
                </h3>
                <div class="file-actions">
                    <button class="action-btn" onclick="fileTree.copyPath('${fileData.name}')" title="Copy file path">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn" onclick="fileTree.showInfo('${fileData.name}')" title="Show info">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>
            <div class="file-details-content">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> File Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Size:</span>
                            <span class="detail-value">${fileData.size}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Modified:</span>
                            <span class="detail-value">${fileData.modified}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Language:</span>
                            <span class="detail-value">${fileData.language}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Lines:</span>
                            <span class="detail-value">${fileData.lines}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value category-${fileData.category}">${fileData.category}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-file-alt"></i> Description</h4>
                    <p class="file-description">${fileData.description}</p>
                </div>
                
                ${this.getFilePreview(fileData)}
            </div>
        `;
    }

    getFilePreview(fileData) {
        const previews = {
            'employee_handler.py': `import json
from src.models.employee import Employee
from src.services.dynamodb_service import DynamoDBService
from src.utils.response_helper import ResponseHelper

def lambda_handler(event, context):
    """Main Lambda handler for employee operations"""
    try:
        http_method = event['httpMethod']
        
        if http_method == 'POST':
            return create_employee(event, context)
        elif http_method == 'GET':
            return get_employee(event, context)
        else:
            return response_helper.error("Method not allowed", 405)
            
    except Exception as e:
        return response_helper.error("Internal server error", 500)

def create_employee(event, context):
    """Create a new employee record"""
    try:
        body = json.loads(event['body'])
        employee = Employee(**body)
        employee.validate()
        
        result = dynamodb_service.create_item(employee.to_dict())
        return response_helper.success(result, 201)
    except Exception as e:
        return response_helper.error(str(e), 400)`,

            'employee.py': `import uuid
from datetime import datetime
from typing import Optional, Dict, Any

class Employee:
    """Employee data model with validation"""
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('id', str(uuid.uuid4()))
        self.first_name = kwargs.get('firstName')
        self.last_name = kwargs.get('lastName')
        self.email = kwargs.get('email')
        self.department = kwargs.get('department')
        self.position = kwargs.get('position')
        self.salary = kwargs.get('salary')
        self.hire_date = kwargs.get('hireDate')
        
    def validate(self) -> bool:
        """Validate employee data"""
        errors = []
        
        if not self.first_name:
            errors.append("First name is required")
        if not self.email or '@' not in self.email:
            errors.append("Valid email is required")
        
        if errors:
            raise ValueError(f"Validation errors: {', '.join(errors)}")
        return True
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert employee object to dictionary"""
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'department': self.department
        }`,

            'README.md': `# Employee Management System

A modern, serverless employee management system.

## Features

- **CRUD Operations**: Create, read, update, and delete employees
- **JWT Authentication**: Secure API access  
- **Input Validation**: Comprehensive data validation
- **Infrastructure as Code**: Automated deployment

## Quick Start

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/

# Deploy to AWS
sam deploy --guided
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /employees | Create employee |
| GET | /employees/{id} | Get employee |
| PUT | /employees/{id} | Update employee |
| DELETE | /employees/{id} | Delete employee |`,

            'requirements.txt': `boto3==1.26.137
pytest==7.3.1
pytest-cov==4.1.0
requests==2.31.0
PyJWT==2.7.0
pydantic==1.10.8
python-dotenv==1.0.0`
        };

        const preview = previews[fileData.name];
        if (!preview) {
            return `
                <div class="detail-section">
                    <h4><i class="fas fa-eye"></i> Preview</h4>
                    <div class="no-preview">
                        <p><i class="fas fa-info-circle"></i> No preview available for this file.</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="detail-section">
                <h4><i class="fas fa-eye"></i> Code Preview</h4>
                <div class="code-preview">
                    <div class="code-header">
                        <span class="code-language">${fileData.language}</span>
                        <button class="copy-btn" onclick="fileTree.copyPreview(this)" title="Copy code">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <pre><code>${preview}</code></pre>
                </div>
            </div>
        `;
    }

    copyPath(fileName) {
        const path = `employee_management_system/${fileName}`;
        navigator.clipboard.writeText(path).then(() => {
            this.showNotification('Path copied to clipboard!', 'success');
        });
    }

    copyPreview(button) {
        const codeBlock = button.closest('.code-preview').querySelector('code');
        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        });
    }

    showInfo(fileName) {
        this.showNotification(`Showing info for ${fileName}`, 'info');
    }

    expandAll() {
        const addAllFolders = (node, path = '') => {
            const currentPath = path ? `${path}/${node.name}` : node.name;
            if (node.type === 'folder') {
                this.expandedFolders.add(currentPath);
                if (node.children) {
                    node.children.forEach(child => addAllFolders(child, currentPath));
                }
            }
        };

        addAllFolders(this.fileStructure);
        this.renderFileTree();
        this.showNotification('All folders expanded', 'info');
    }

    collapseAll() {
        this.expandedFolders.clear();
        this.expandedFolders.add('employee_management_system'); // Keep root expanded
        this.renderFileTree();
        this.showNotification('All folders collapsed', 'info');
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
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.borderLeftColor = '#22c55e';
            notification.style.borderLeftWidth = '4px';
        }
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing FileTree...');
    
    // Wait a bit to ensure all elements are ready
    setTimeout(() => {
        if (document.getElementById('fileTreeContainer')) {
            fileTree = new FileTree();
            console.log('FileTree instance created');
        } else {
            console.error('fileTreeContainer not found in DOM');
        }
    }, 100);
});

// Also try immediate initialization
if (document.readyState === 'complete') {
    console.log('Document already loaded, initializing FileTree immediately...');
    if (document.getElementById('fileTreeContainer')) {
        fileTree = new FileTree();
    }
}