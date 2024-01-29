document.addEventListener('DOMContentLoaded', async () => {

    // Utility function to check if it's currently night based on time
    function isNightTime() {
        const now = new Date();
        const hours = now.getHours();
        return hours < 6 || hours >= 18; // Assume night time if it's before 6 AM or after 6 PM
    }

    // Function to toggle night mode
    function toggleNightMode(isNight) {
        const elementsToToggle = document.querySelectorAll('*');

        // Toggle 'night-theme' class on all elements based on the current mode
        elementsToToggle.forEach(function (element) {
            if (isNight) {
                element.classList.add('night-theme');
            } else {
                element.classList.remove('night-theme');
            }
        });

        // Update the state of the theme switch checkbox
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            themeSwitch.checked = isNight;
        }
    }

    // Function to update night mode based on system preference and time
    function updateNightMode() {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isNight = prefersDarkMode || isNightTime();
        toggleNightMode(isNight);
    }

    // Event listener for the theme switch checkbox
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function () {
            toggleNightMode(themeSwitch.checked);
        });
    }

    // Listen for changes in system theme preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateNightMode);
    }

    // Function to fetch and display publications from a .bib file
    async function fetchPublications() {
        try {
            const response = await fetch('publications.bib');
            if (!response.ok) {
                throw new Error('Failed to fetch publications');
            }
            const bibTeX = await response.text();
            const publications = parseBibTeX(bibTeX);
            displayPublications(publications);
        } catch (error) {
            console.error('Error fetching publications:', error);
            throw error;
        }
    }

    // Function to parse BibTeX data into an array of objects
    function parseBibTeX(bibTeX) {
        const entries = bibTeX.split('@').filter(entry => entry.trim() !== '');
        return entries.map(entry => {
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

        if (!publicationList) {
            console.error('Publication list element not found.');
            return;
        }

        // Clear existing content in the publicationList
        publicationList.innerHTML = '';

        publications.forEach(publication => {
            const card = document.createElement('div');
            card.classList.add('mdl-cell', 'mdl-cell--12-col');
            card.innerHTML = `
                <div class="mdl-card">
                    <div class="mdl-card__title ">
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

    // Function to animate elements
    function animateElements() {
        anime({
            targets: '.profile-image',
            translateY: [-20, 0],
            opacity: [0, 1],
            easing: 'easeInOutQuad',
            duration: 800,
            delay: 300,
        });

        // Add more animations for other elements as needed
    }

    // Function to fade in cards
    function fadeInCards() {
        const cards = document.querySelectorAll('.mdl-card');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateY: [20, 0],
                        opacity: [0, 1],
                        easing: 'easeInOutQuad',
                        duration: 800,
                        delay: anime.stagger(150),
                    });

                    observer.unobserve(entry.target);
                }
            });
        });

        cards.forEach(card => {
            observer.observe(card);
        });
    }

    // Function for complex animations
    function complexAnimations() {
        const cards = document.querySelectorAll('.mdl-card');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateY: [-20, 0],
                        scale: [1, 1],
                        rotate: [0, 0],
                        opacity: [0, 1],
                        easing: 'easeInOutQuad',
                        duration: 800,
                        delay: anime.stagger(150),
                    });

                    observer.unobserve(entry.target);
                }
            });
        });

        cards.forEach(card => {
            observer.observe(card);
        });
    }

    // Fetch publications when the page is loaded and then proceed with other functions
    try {
        await fetchPublications();
        fadeInCards();
        complexAnimations();
        animateElements();
        updateNightMode();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
