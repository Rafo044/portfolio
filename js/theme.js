// Theme Management
(function() {
    const THEME_KEY = 'portfolio-theme';
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    // Initialize theme from localStorage or default to light
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        html.setAttribute('data-theme', savedTheme);
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    }
    
    // Initialize theme before page renders to avoid flash
    initTheme();
    
    // Add event listener when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
            }
        });
    } else {
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }
})();
