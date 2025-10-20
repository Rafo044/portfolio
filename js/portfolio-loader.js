// Portfolio/CV Loader - Loads content from markdown file

// Parse markdown sections
function parseMarkdownCV(markdown) {
    const cv = {
        profile: '',
        education: [],
        experience: [],
        skills: {
            programming: [],
            dataEngineering: [],
            databases: [],
            tools: []
        },
        certificates: []
    };
    
    // Split by ## headers
    const sections = markdown.split(/^## /m).filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        
        if (title === 'Profile') {
            cv.profile = content;
        } else if (title === 'Education') {
            cv.education = parseEducationSection(content);
        } else if (title === 'Work Experience') {
            cv.experience = parseExperienceSection(content);
        } else if (title === 'Technical Skills') {
            cv.skills = parseSkillsSection(content);
        } else if (title === 'Certificates & Achievements') {
            cv.certificates = parseCertificatesSection(content);
        }
    });
    
    return cv;
}

function parseEducationSection(content) {
    const items = [];
    const sections = content.split(/^### /m).filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const meta = lines[1] ? lines[1].replace(/\*\*/g, '').split('|').map(s => s.trim()) : [];
        const description = lines.slice(2).join('\n').trim();
        
        items.push({
            title,
            institution: meta[0] || '',
            date: meta[1] || '',
            description
        });
    });
    
    return items;
}

function parseExperienceSection(content) {
    const items = [];
    const sections = content.split(/^### /m).filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const meta = lines[1] ? lines[1].replace(/\*\*/g, '').split('|').map(s => s.trim()) : [];
        
        // Extract bullet points
        const responsibilities = [];
        lines.forEach(line => {
            if (line.trim().startsWith('-')) {
                responsibilities.push(line.trim().substring(1).trim());
            }
        });
        
        items.push({
            title,
            company: meta[0] || '',
            date: meta[1] || '',
            responsibilities
        });
    });
    
    return items;
}

function parseSkillsSection(content) {
    const skills = {
        programming: [],
        dataEngineering: [],
        databases: [],
        tools: []
    };
    
    const sections = content.split(/^### /m).filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const items = [];
        
        lines.forEach(line => {
            if (line.trim().startsWith('-')) {
                items.push(line.trim().substring(1).trim());
            }
        });
        
        if (title.includes('Programming')) {
            skills.programming = items;
        } else if (title.includes('Data Engineering')) {
            skills.dataEngineering = items;
        } else if (title.includes('Databases')) {
            skills.databases = items;
        } else if (title.includes('Tools')) {
            skills.tools = items;
        }
    });
    
    return skills;
}

function parseCertificatesSection(content) {
    const certificates = [];
    const sections = content.split(/^### /m).filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const titleLine = lines[0].trim();
        
        // Parse markdown link format: [Title](URL)
        const linkMatch = titleLine.match(/\[(.+?)\]\((.+?)\)/);
        let title = titleLine;
        let url = null;
        
        if (linkMatch) {
            title = linkMatch[1];
            url = linkMatch[2];
        }
        
        const institution = lines[1] && lines[1].includes('|') ? lines[1].split('|')[0].trim() : '';
        const date = lines[1] && lines[1].includes('|') ? lines[1].split('|')[1].trim() : lines[1] ? lines[1].trim() : '';
        
        certificates.push({
            title,
            institution,
            date,
            url
        });
    });
    
    return certificates;
}

// Render CV sections
function renderProfile(profile) {
    return `<p class="cv-text">${profile}</p>`;
}

function renderEducation(items) {
    return items.map(item => `
        <div class="cv-item">
            <div class="cv-item-header">
                <h3 class="cv-item-title">${item.title}</h3>
                <span class="cv-item-date">${item.date}</span>
            </div>
            <p class="cv-item-subtitle">${item.institution}</p>
            <p class="cv-item-description">${item.description}</p>
        </div>
    `).join('');
}

function renderExperience(items) {
    return items.map(item => `
        <div class="cv-item">
            <div class="cv-item-header">
                <h3 class="cv-item-title">${item.title}</h3>
                <span class="cv-item-date">${item.date}</span>
            </div>
            <p class="cv-item-subtitle">${item.company}</p>
            <ul class="cv-list">
                ${item.responsibilities.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderSkills(skills) {
    return `
        <div class="skill-category">
            <h3 class="skill-category-title" data-i18n="cv_skills_programming">Programming Languages</h3>
            <div class="skill-tags">
                ${skills.programming.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
        </div>
        <div class="skill-category">
            <h3 class="skill-category-title" data-i18n="cv_skills_data_eng">Data Engineering</h3>
            <div class="skill-tags">
                ${skills.dataEngineering.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
        </div>
        <div class="skill-category">
            <h3 class="skill-category-title" data-i18n="cv_skills_databases">Databases</h3>
            <div class="skill-tags">
                ${skills.databases.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
        </div>
        <div class="skill-category">
            <h3 class="skill-category-title" data-i18n="cv_skills_tools">Tools & Technologies</h3>
            <div class="skill-tags">
                ${skills.tools.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
        </div>
    `;
}

function renderCertificates(certificates) {
    return certificates.map(cert => `
        <div class="cv-item">
            <h3 class="cv-item-title">
                ${cert.url ? `<a href="${cert.url}" target="_blank" rel="noopener noreferrer">${cert.title}</a>` : cert.title}
            </h3>
            ${cert.institution ? `<p class="cv-item-subtitle">${cert.institution}</p>` : ''}
            <p class="cv-item-date">${cert.date}</p>
        </div>
    `).join('');
}

// Load and render CV
async function loadPortfolioCV() {
    try {
        const response = await fetch('portfolio/cv.md');
        if (!response.ok) throw new Error('CV file not found');
        
        const markdown = await response.text();
        const cv = parseMarkdownCV(markdown);
        
        // Render sections
        const profileSection = document.querySelector('#cvProfile');
        const educationSection = document.querySelector('#cvEducation');
        const experienceSection = document.querySelector('#cvExperience');
        const skillsSection = document.querySelector('#cvSkills');
        const certificatesSection = document.querySelector('#cvCertificates');
        
        if (profileSection) profileSection.innerHTML = renderProfile(cv.profile);
        if (educationSection) educationSection.innerHTML = renderEducation(cv.education);
        if (experienceSection) experienceSection.innerHTML = renderExperience(cv.experience);
        if (skillsSection) skillsSection.innerHTML = renderSkills(cv.skills);
        if (certificatesSection) certificatesSection.innerHTML = renderCertificates(cv.certificates);
        
        // Re-apply translations after content is loaded
        if (window.langManager) {
            window.langManager.applyLanguage(window.langManager.currentLang);
        }
        
    } catch (error) {
        console.error('Error loading CV:', error);
    }
}

// Load CV on page load
document.addEventListener('DOMContentLoaded', loadPortfolioCV);
