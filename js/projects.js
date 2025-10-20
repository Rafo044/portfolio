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
        return overviewMatch[1].trim().substring(0, 200) + '...';
    }
    
    // Find "About" section
    const aboutMatch = markdown.match(/##\s+.*?About.*?\n(.+?)(?=\n##|\n$)/si);
    if (aboutMatch) {
        let desc = aboutMatch[1].trim();
        // Remove extra whitespace and newlines
        desc = desc.replace(/\s+/g, ' ').trim();
        return desc.substring(0, 200) + (desc.length > 200 ? '...' : '');
    }
    
    // Find "Introduction" section
    const introMatch = markdown.match(/##\s+.*?Introduction.*?\n(.+?)(?=\n##|\n$)/si);
    if (introMatch) {
        let desc = introMatch[1].trim();
        desc = desc.replace(/\s+/g, ' ').trim();
        return desc.substring(0, 200) + (desc.length > 200 ? '...' : '');
    }
    
    // Fallback: get first meaningful paragraph after title and image
    let content = markdown.replace(/^#\s+.+$/m, '').trim();
    content = content.replace(/!\[.*?\]\(.*?\)/g, '').trim();
    
    // Skip empty lines and get first paragraph
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
    if (paragraphs.length > 0) {
        let desc = paragraphs[0].replace(/\s+/g, ' ').trim();
        // Remove markdown formatting
        desc = desc.replace(/[*_#`]/g, '');
        return desc.substring(0, 200) + (desc.length > 200 ? '...' : '');
    }
    
    return 'Data engineering project - Click to view details on GitHub';
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
                    
                    // Use config values if available, otherwise fetch from markdown
                    let title = slug.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    let description = config.description || 'Data engineering project - Click to view details on GitHub';
                    let image = config.image || '../assets/images/projects/default-project.jpg';
                    
                    // If markdown file exists, try to get title from it
                    try {
                        const response = await fetch(`projects/${config.file}`);
                        if (response.ok) {
                            const markdown = await response.text();
                            title = extractProjectTitle(markdown);
                        }
                    } catch (e) {
                        console.log(`Using config title for ${slug}`);
                    }
                    
                    return {
                        slug: slug,
                        title: title,
                        description: description,
                        image: image,
                        url: config.url
                    };
                } catch (error) {
                    console.error(`Error loading ${slug}:`, error);
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
