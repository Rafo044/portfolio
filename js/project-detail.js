// Project detail page functionality

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

// Load single project
async function loadProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectSlug = urlParams.get('project');
    
    if (!projectSlug) {
        window.location.href = 'projects.html';
        return;
    }
    
    const project = projectsConfig.find(p => p.slug === projectSlug);
    if (!project) {
        document.getElementById('projectContent').innerHTML = '<p>Project not found.</p>';
        return;
    }
    
    try {
        const response = await fetch(`projects/${project.file}`);
        if (!response.ok) throw new Error('Project not found');
        const markdown = await response.text();
        
        // Convert markdown to HTML
        const html = marked.parse(markdown);
        
        // Extract title for page title
        const title = extractTitle(markdown);
        document.title = `${title} - Rafael Alikhanli`;
        
        // Display content
        document.getElementById('projectContent').innerHTML = html;
        
    } catch (error) {
        console.error('Error loading project:', error);
        document.getElementById('projectContent').innerHTML = '<p>Error loading project.</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProject);
