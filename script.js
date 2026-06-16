/**
 * Pratibha Kushwah - Software Engineer Portfolio
 * Interactive Functionality Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initTypewriter();
    initScrollReveal();
    initSkillBars();
    initProjectFilter();
    initGitHubGraph();
    initContactForm();
    initBackToTop();
});

/* ==========================================================================
   STICKY NAVBAR & ACTIVE NAV LINK TRACKING
   ========================================================================== */
function initNavbar() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('.navbar');

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Track active navigation links based on scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for sticky header
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Mobile navigation menu toggle
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
}

/* ==========================================================================
   TYPEWRITER ANIMATION (HERO SECTION)
   ========================================================================== */
function initTypewriter() {
    const words = [
        "Computer Science Student",
        "Java Developer",
        "AI Automation Enthusiast"
    ];
    const textSpan = document.querySelector('.typing-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            textSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            // Add character
            textSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentWord.length) {
            // Word fully typed, pause before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Word fully deleted, move to next
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter loop if element exists
    if (textSpan) {
        setTimeout(type, 1000);
    }
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Unobserve once shown
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   SKILLS DYNAMIC PROGRESS BARS
   ========================================================================== */
function initSkillBars() {
    const fillElements = document.querySelectorAll('.progress-bar-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-width');
                entry.target.style.width = targetWidth;
            }
        });
    }, {
        threshold: 0.5
    });

    fillElements.forEach(fill => skillObserver.observe(fill));
}

/* ==========================================================================
   PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Apply animation out
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/* ==========================================================================
   DYNAMIC GITHUB CONTRIBUTION GRAPH SIMULATION
   ========================================================================== */
function initGitHubGraph() {
    const grid = document.getElementById('githubGrid');
    if (!grid) return;

    // We render 53 weeks * 7 days = 371 cells representing the last year
    const totalCells = 371;
    const today = new Date();
    
    // Generate dates starting from 371 days ago
    const dates = [];
    for (let i = totalCells - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Fill cells
    dates.forEach((date) => {
        const cell = document.createElement('div');
        cell.classList.add('github-cell');
        
        // Generate a pseudo-random activity level with weights for coding patterns
        // - Weekends have lower activity
        // - General streaks of high/low activity
        const day = date.getDay();
        let level = 0;
        
        const randomVal = Math.random();
        if (day === 0 || day === 6) { // Weekend
            if (randomVal > 0.85) level = 2;
            else if (randomVal > 0.7) level = 1;
            else level = 0;
        } else { // Weekdays (Higher coding frequency)
            if (randomVal > 0.9) level = 4;
            else if (randomVal > 0.75) level = 3;
            else if (randomVal > 0.5) level = 2;
            else if (randomVal > 0.25) level = 1;
            else level = 0;
        }

        cell.classList.add(`lvl-${level}`);

        // Set tooltips with formatted date & contributions count
        const count = level === 0 ? 'No' : level * 2 + Math.floor(Math.random() * 2);
        const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        cell.setAttribute('data-tooltip', `${count} contributions on ${formattedDate}`);
        
        grid.appendChild(cell);
    });
}

/* ==========================================================================
   CONTACT FORM INTEGRATION & VALIDATION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = form.querySelector('.btn-submit');
        const submitBtnText = submitBtn.querySelector('span');

        // Reset feedback
        feedback.className = 'form-feedback';
        feedback.textContent = '';

        // Standard validation check
        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            feedback.classList.add('error');
            feedback.textContent = 'Please fill out all fields.';
            return;
        }

        // Email regex verification
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            feedback.classList.add('error');
            feedback.textContent = 'Please enter a valid email address.';
            return;
        }

        // Simulating submission loader state
        submitBtn.disabled = true;
        const originalText = submitBtnText.textContent;
        submitBtnText.textContent = 'Sending message...';

        setTimeout(() => {
            // Success response
            feedback.classList.add('success');
            feedback.textContent = 'Thank you! Your message has been sent successfully.';
            
            // Clear inputs
            form.reset();
            
            // Restore button state
            submitBtn.disabled = false;
            submitBtnText.textContent = originalText;

            // Remove success message after 5 seconds
            setTimeout(() => {
                feedback.classList.remove('success');
                feedback.textContent = '';
            }, 5000);

        }, 1500); // Simulated network delay
    });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
