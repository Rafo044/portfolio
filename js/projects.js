// Projects configuration is now loaded from config.js
// This allows easy URL management in one place

// Extract title from markdown (first # heading)
function extractProjectTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled Project';
}

// Extract cover image from markdown
function extractProjectImage(markdown) {
    const match = markdown.match(/!\[Cover Image\]\((.+?)\)/);
    if (match) {
        // Remove ../ from path since we're loading from root
        let imagePath = match[1].replace('../', '');
        return imagePath;
    }
    return 'assets/images/projects/placeholder.svg';
}

// Extract overview/description
function extractProjectDescription(markdown) {
    // Find the Overview section
    const overviewMatch = markdown.match(/##\s+Overview\s*\n(.+?)(?=\n##|\n$)/s);
    if (overviewMatch) {
        return overviewMatch[1].trim();
    }
    
    // Fallback: get first paragraph after title and image
    const withoutTitle = markdown.replace(/^#\s+.+$/m, '').trim();
    const withoutImage = withoutTitle.replace(/!\[.*?\]\(.*?\)/, '').trim();
    const firstPara = withoutImage.split('\n\n')[0];
    return firstPara || 'No description available.';
}

// Create project card HTML with image - now redirects to external URL
function createProjectCard(project) {
    return `
        <div class="project-card" onclick="window.open('${project.url}', '_blank')">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
            </div>
        </div>
    `;
}

// Load projects from markdown files using config.js
async function loadProjects(featured = null) {
    try {
        // Get project slugs from config
        const projectSlugs = Object.keys(projectConfig);
        const projectsToLoad = projectSlugs.filter(slug => {
            if (featured === null) return true;
            return projectConfig[slug].featured === featured;
        });
        
        const projects = await Promise.all(
            projectsToLoad.map(async (slug) => {
                try {
                    const config = projectConfig[slug];
                    const response = await fetch(`projects/${config.file}`);
                    if (!response.ok) throw new Error('Project not found');
                    const markdown = await response.text();
                    
                    return {
                        slug: slug,
                        title: extractProjectTitle(markdown),
                        description: extractProjectDescription(markdown),
                        image: extractProjectImage(markdown),
                        url: config.url,
                        markdown: markdown
                    };
                } catch (error) {
                    console.error(`Error loading ${config.file}:`, error);
                    return null;
                }
            })
        );
        
        return projects.filter(p => p !== null);
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// Load recent projects (featured ones) on home page - ONLY LAST 3
async function loadRecentProjects() {
    const grid = document.getElementById('recentProjectsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">Loading projects...</div>';
    
    const projects = await loadProjects(true);
    
    if (projects.length === 0) {
        grid.innerHTML = '<div class="loading">No projects found.</div>';
        return;
    }
    
    // Show only the last 3 projects on home page
    const recentProjects = projects.slice(-3);
    
    grid.innerHTML = recentProjects.map(project => createProjectCard(project)).join('');
}

// Load all projects
async function loadAllProjects() {
    const grid = document.getElementById('projectsGrid') || document.getElementById('portfolioGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">Loading projects...</div>';
    
    const projects = await loadProjects();
    
    if (projects.length === 0) {
        grid.innerHTML = '<div class="loading">No projects found.</div>';
        return;
    }
    
    grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recentProjectsGrid')) {
        loadRecentProjects();
    } else if (document.getElementById('projectsGrid') || document.getElementById('portfolioGrid')) {
        loadAllProjects();
    }
});
