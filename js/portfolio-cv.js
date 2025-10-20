// Portfolio CV page - Load project names

const projectsConfig = [
    { file: 'interactive-portfolio.md', slug: 'interactive-portfolio' },
    { file: 'task-manager-app.md', slug: 'task-manager-app' },
    { file: 'analytics-dashboard.md', slug: 'analytics-dashboard' },
    { file: 'etl-pipeline.md', slug: 'etl-pipeline' },
    { file: 'data-warehouse.md', slug: 'data-warehouse' },
    { file: 'real-time-streaming.md', slug: 'real-time-streaming' }
];

// Extract title from markdown
function extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled Project';
}

// Create CV project item
function createCVProjectItem(title) {
    return `
        <div class="cv-project-item">
            <span class="cv-project-bullet">•</span>
            <span class="cv-project-name">${title}</span>
        </div>
    `;
}

// Load project names for CV
async function loadCVProjects() {
    const container = document.getElementById('cvProjectsList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading projects...</div>';
    
    try {
        const projects = await Promise.all(
            projectsConfig.map(async (config) => {
                try {
                    const response = await fetch(`projects/${config.file}`);
                    if (!response.ok) throw new Error('Project not found');
                    const markdown = await response.text();
                    return extractTitle(markdown);
                } catch (error) {
                    console.error(`Error loading ${config.file}:`, error);
                    return null;
                }
            })
        );
        
        const validProjects = projects.filter(p => p !== null);
        
        if (validProjects.length === 0) {
            container.innerHTML = '<p class="cv-text">No projects available.</p>';
            return;
        }
        
        container.innerHTML = validProjects.map(title => createCVProjectItem(title)).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p class="cv-text">Error loading projects.</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadCVProjects);
