// Healthcare Workflow Optimization Platform JavaScript

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize filter buttons
    initializeFilters();
    
    // Initialize notifications
    initializeNotifications();
    
    // Initialize sample data
    initializeSampleData();
    
    // Initialize real-time updates simulation
    initializeRealTimeUpdates();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            const pageId = this.getAttribute('data-page') + '-page';
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.classList.add('fade-in');
                
                // Update page title
                pageTitle.textContent = this.querySelector('span').textContent;
            }
        });
    });
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Apply filter (this is a simulation - in real app would filter data)
            console.log(`Filtering by: ${filterValue}`);
            
            // Show loading state
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                hideLoading();
                showNotification('Filter applied successfully', 'success');
            }, 1000);
        });
    });
}

// Notification system
function initializeNotifications() {
    // This simulates real-time notifications
    const notifications = [
        { type: 'info', message: 'New patient admitted to Room 204', time: '2 minutes ago' },
        { type: 'warning', message: 'Equipment maintenance due in Treatment Room 3', time: '5 minutes ago' },
        { type: 'success', message: 'Patient discharge completed successfully', time: '8 minutes ago' }
    ];
    
    // Show notifications periodically
    let notificationIndex = 0;
    setInterval(() => {
        if (notificationIndex < notifications.length) {
            const notification = notifications[notificationIndex];
            showNotification(notification.message, notification.type);
            notificationIndex++;
        }
    }, 30000); // Show every 30 seconds
}

// Sample data initialization
function initializeSampleData() {
    // This would normally fetch from an API
    const sampleData = {
        stats: {
            activeWorkflows: 24,
            pendingTasks: 156,
            staffOnDuty: 42,
            patientQueue: 18
        },
        workflows: [
            { id: 1, name: 'Patient Admission', status: 'active', steps: 5, avgTime: '2 hours' },
            { id: 2, name: 'Discharge Process', status: 'review', steps: 8, avgTime: '1.5 hours' },
            { id: 3, name: 'Emergency Response', status: 'active', steps: 3, avgTime: '15 min' }
        ],
        tasks: [
            { id: 1, title: 'Patient medication review - Room 305', assignee: 'Nurse Thompson', priority: 'high', status: 'pending' },
            { id: 2, title: 'Equipment maintenance check', assignee: 'Tech Martinez', priority: 'medium', status: 'in-progress' },
            { id: 3, title: 'Patient discharge documentation', assignee: 'Admin Wilson', priority: 'low', status: 'completed' }
        ]
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('healthcareData', JSON.stringify(sampleData));
}

// Real-time updates simulation
function initializeRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        updateDashboardStats();
        updatePatientFlow();
    }, 10000); // Update every 10 seconds
}

// Modal functionality
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Modal triggers
function showCreateWorkflowModal() {
    showModal('createWorkflowModal');
}

function showCreateTaskModal() {
    showModal('createTaskModal');
}

function showCreateScheduleModal() {
    showModal('createScheduleModal');
}

// Create functions
function createWorkflow() {
    const form = document.getElementById('workflowForm');
    const formData = new FormData(form);
    
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        closeModal('createWorkflowModal');
        showNotification('Workflow created successfully', 'success');
        
        // In real app, would refresh workflow list
        console.log('Workflow created:', Object.fromEntries(formData));
    }, 1500);
}

function createTask() {
    const form = document.getElementById('taskForm');
    const formData = new FormData(form);
    
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        closeModal('createTaskModal');
        showNotification('Task created successfully', 'success');
        
        // In real app, would refresh task list
        console.log('Task created:', Object.fromEntries(formData));
    }, 1500);
}

function createSchedule() {
    const form = document.getElementById('scheduleForm');
    const formData = new FormData(form);
    
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        closeModal('createScheduleModal');
        showNotification('Schedule added successfully', 'success');
        
        // In real app, would refresh schedule
        console.log('Schedule created:', Object.fromEntries(formData));
    }, 1500);
}

// Utility functions
function showLoading() {
    // Create loading overlay
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 2rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 1rem;">
                <div class="loading"></div>
                <span>Processing...</span>
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : type === 'error' ? 'x-circle' : 'info'}" style="width: 1.25rem; height: 1.25rem;"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                <i data-lucide="x" style="width: 1rem; height: 1rem;"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Re-initialize icons for the notification
    lucide.createIcons();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Dashboard updates
function updateDashboardStats() {
    const stats = {
        activeWorkflows: Math.floor(Math.random() * 10) + 20,
        pendingTasks: Math.floor(Math.random() * 50) + 130,
        staffOnDuty: Math.floor(Math.random() * 10) + 35,
        patientQueue: Math.floor(Math.random() * 15) + 10
    };
    
    // Update stats display (this is a simulation)
    console.log('Dashboard stats updated:', stats);
}

function updatePatientFlow() {
    const flowData = {
        registration: { patients: Math.floor(Math.random() * 5) + 5, waitTime: Math.floor(Math.random() * 10) + 3 },
        triage: { patients: Math.floor(Math.random() * 8) + 8, waitTime: Math.floor(Math.random() * 20) + 10 },
        treatment: { patients: Math.floor(Math.random() * 10) + 15, waitTime: Math.floor(Math.random() * 30) + 30 }
    };
    
    // Update patient flow display (this is a simulation)
    console.log('Patient flow updated:', flowData);
}

// WebSocket simulation for real-time updates
function initializeWebSocket() {
    // This simulates WebSocket connection
    const mockWebSocket = {
        send: function(message) {
            console.log('WebSocket send:', message);
        },
        onmessage: function(event) {
            console.log('WebSocket received:', event.data);
        },
        onopen: function() {
            console.log('WebSocket connected');
            showNotification('Connected to real-time updates', 'success');
        },
        onclose: function() {
            console.log('WebSocket disconnected');
            showNotification('Disconnected from real-time updates', 'warning');
        }
    };
    
    // Simulate connection
    setTimeout(() => {
        mockWebSocket.onopen();
    }, 1000);
    
    // Simulate periodic messages
    setInterval(() => {
        const messages = [
            'New patient registered',
            'Task completed',
            'Staff shift change',
            'Equipment status update'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        mockWebSocket.onmessage({ data: randomMessage });
    }, 15000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
    
    // Ctrl+N for new workflow
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showCreateWorkflowModal();
    }
    
    // Ctrl+T for new task
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        showCreateTaskModal();
    }
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // This would search through workflows, tasks, etc.
            console.log('Searching for:', searchTerm);
            
            // Simulate search results
            if (searchTerm.length > 2) {
                showNotification(`Found ${Math.floor(Math.random() * 10) + 1} results for "${searchTerm}"`, 'info');
            }
        });
    }
}

// Export/Import functionality
function exportData() {
    const data = localStorage.getItem('healthcareData');
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'healthcare-data.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Data exported successfully', 'success');
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                localStorage.setItem('healthcareData', JSON.stringify(data));
                showNotification('Data imported successfully', 'success');
                // Refresh the page to show imported data
                location.reload();
            } catch (error) {
                showNotification('Error importing data', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Print functionality
function printPage() {
    window.print();
}

// Theme toggle (if implemented)
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
    
    showNotification(`Switched to ${isDark ? 'light' : 'dark'} theme`, 'info');
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
        console.log('Navigation timing:', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Accessibility improvements
function initializeAccessibility() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSearch();
    initializeAccessibility();
    initializePerformanceMonitoring();
    initializeWebSocket();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to Healthcare Workflow Optimization Platform', 'info');
    }, 2000);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(0.5rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .dark-theme {
        background-color: #1f2937;
        color: #f9fafb;
    }
    
    .dark-theme .card,
    .dark-theme .modal-content {
        background-color: #374151;
    }
    
    .dark-theme .nav-link {
        color: #d1d5db;
    }
    
    .dark-theme .nav-link:hover {
        background-color: #4b5563;
        color: #f9fafb;
    }
`;
document.head.appendChild(style);