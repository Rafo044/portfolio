// Blog functionality - Load and display blog posts from markdown files

// Blog posts configuration
const blogPosts = [
    { file: 'getting-started-with-data-engineering.md', slug: 'getting-started-with-data-engineering' },
    { file: 'building-etl-pipelines.md', slug: 'building-etl-pipelines' },
    { file: 'learning-sql-tips.md', slug: 'learning-sql-tips' }
];

// Extract title from markdown content (first # heading)
function extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled Post';
}

// Extract excerpt from markdown (first paragraph after title)
function extractExcerpt(markdown, maxLength = 150) {
    // Remove title
    const withoutTitle = markdown.replace(/^#\s+.+$/m, '').trim();
    // Get first paragraph
    const firstPara = withoutTitle.split('\n\n')[0];
    // Remove markdown formatting
    const plain = firstPara.replace(/[#*_`]/g, '');
    // Truncate
    return plain.length > maxLength ? plain.substring(0, maxLength) + '...' : plain;
}

// Create blog card HTML
function createBlogCard(post, markdown) {
    const title = extractTitle(markdown);
    const excerpt = extractExcerpt(markdown);
    
    return `
        <a href="blog-post.html?post=${post.slug}" class="blog-card">
            <h3 class="blog-title">${title}</h3>
            <p class="blog-excerpt">${excerpt}</p>
        </a>
    `;
}

// Load all blog posts
async function loadBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    
    try {
        const posts = await Promise.all(
            blogPosts.map(async (post) => {
                try {
                    const response = await fetch(`blog/${post.file}`);
                    if (!response.ok) throw new Error('Post not found');
                    const markdown = await response.text();
                    return { post, markdown };
                } catch (error) {
                    console.error(`Error loading ${post.file}:`, error);
                    return null;
                }
            })
        );
        
        const validPosts = posts.filter(p => p !== null);
        
        if (validPosts.length === 0) {
            grid.innerHTML = '<div class="loading">No blog posts found. Add markdown files to the /blog folder.</div>';
            return;
        }
        
        grid.innerHTML = validPosts
            .map(({ post, markdown }) => createBlogCard(post, markdown))
            .join('');
            
    } catch (error) {
        console.error('Error loading blog posts:', error);
        grid.innerHTML = '<div class="loading">Error loading blog posts.</div>';
    }
}

// Process images in blog content
function processImages(html) {
    // Wrap images in figure tags for better styling
    return html.replace(/<img([^>]+)>/g, (match, attrs) => {
        return `<figure class="blog-image"><img${attrs} loading="lazy"></figure>`;
    });
}

// Process external links to create rich previews
function processLinks(html) {
    // Add target="_blank" and styling to external links
    return html.replace(/<a href="(https?:\/\/[^"]+)"([^>]*)>([^<]+)<\/a>/g, (match, url, attrs, text) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="rich-link"${attrs}>
            <span class="rich-link-icon">🔗</span>
            <span class="rich-link-text">${text}</span>
            <span class="rich-link-arrow">→</span>
        </a>`;
    });
}

// Load single blog post
async function loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    if (!postSlug) {
        window.location.href = 'blog.html';
        return;
    }
    
    const post = blogPosts.find(p => p.slug === postSlug);
    if (!post) {
        document.getElementById('blogContent').innerHTML = '<p>Blog post not found.</p>';
        return;
    }
    
    try {
        const response = await fetch(`blog/${post.file}`);
        if (!response.ok) throw new Error('Post not found');
        const markdown = await response.text();
        
        // Convert markdown to HTML using marked.js
        let html = marked.parse(markdown);
        
        // Process images and links
        html = processImages(html);
        html = processLinks(html);
        
        // Extract title for page title
        const title = extractTitle(markdown);
        document.title = `${title} - Rafael Alikhanli`;
        
        // Display content
        document.getElementById('blogContent').innerHTML = html;
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('blogContent').innerHTML = '<p>Error loading blog post.</p>';
    }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogGrid')) {
        loadBlogPosts();
    } else if (document.getElementById('blogContent')) {
        loadBlogPost();
    }
});
