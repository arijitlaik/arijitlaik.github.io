document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch and display publications from a .bib file
    function fetchPublications() {
        // Replace 'your-publications.bib' with the path to your .bib file
        fetch('publications.bib')
            .then(response => response.text())
            .then(bibTeX => {
                const publications = parseBibTeX(bibTeX);
                displayPublications(publications);
            })
            .catch(error => console.error('Error fetching publications:', error));
    }

    // Function to parse BibTeX data into an array of objects
    function parseBibTeX(bibTeX) {
        // Implement your own BibTeX parser or use an existing library
        // This is a simplified example, and you may need a more robust solution for complex BibTeX files
        const entries = bibTeX.split('@').filter(entry => entry.trim() !== '');
        return entries.map(entry => {
            // Implement your own BibTeX parsing logic here
            // Extract relevant fields like title, author, year, etc.
            // Example:
            const titleMatch = entry.match(/title\s*=\s*{([^}]*)}/);
            const authorMatch = entry.match(/author\s*=\s*{([^}]*)}/);
            const yearMatch = entry.match(/year\s*=\s*{([^}]*)}/);

            return {
                title: titleMatch ? titleMatch[1] : '',
                author: authorMatch ? authorMatch[1] : '',
                year: yearMatch ? yearMatch[1] : '',
            };
        });
    }

    // Function to display publications in the HTML
    function displayPublications(publications) {
        const publicationList = document.getElementById('publication-list');

        publications.forEach(publication => {
            const card = document.createElement('div');
            card.classList.add('mdl-cell', 'mdl-cell--6-col');
            card.innerHTML = `
                <div class="mdl-card">
                    <div class="mdl-card__title">
                        ${publication.title}
                    </div>
                    <div class="mdl-card__supporting-text">
                        <p>${publication.author}</p>
                        <p class="event-date">${publication.year}</p>
                    </div>
                </div>
            `;

            publicationList.appendChild(card);
        });
    }

    // Fetch publications when the page is loaded
    fetchPublications();
});

document.addEventListener('DOMContentLoaded', function () {
    const observerConfig = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    // Function to handle the intersection observer
    function handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                componentHandler.upgradeElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    // Create an intersection observer
    const observer = new IntersectionObserver(handleIntersection, observerConfig);

    // Select all elements with the class content-section
    const sections = document.querySelectorAll('.content-section');

    // Observe each section
    sections.forEach((section) => {
        const cards = section.querySelectorAll('.mdl-card');
        cards.forEach((card) => {
            observer.observe(card);
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
        link.addEventListener('click', smoothScroll);
    });

    // Function for smooth scrolling
    function smoothScroll(event) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        // Check if the clicked element is a link
        if (targetElement && this.tagName === 'a') {
            event.preventDefault();

            window.scrollTo({
                top: targetElement.offsetTop - 64,
                behavior: 'smooth',
            });
        }
    }

    // Highlight active navigation link on scroll
    const navLinks = document.querySelectorAll('.mdl-navigation__link');

    function highlightNavLink() {
        let currentSection = null;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Throttle the scroll event to improve performance
    const throttleScroll = throttle(highlightNavLink, 200);

    // Listen for scroll events
    window.addEventListener('scroll', throttleScroll);

    // Helper function to throttle function execution
    function throttle(fn, delay) {
        let lastTime = 0;
        return function () {
            const now = new Date().getTime();
            if (now - lastTime >= delay) {
                fn();
                lastTime = now;
            }
        };
    }
});
