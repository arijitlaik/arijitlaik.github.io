function navigateTo(sectionId) {
    // Scroll to the specified section
    document.querySelector(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}
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

    // Fetch publications when the page is loaded
    fetchPublications();

    function animateElements() {
        // Example: animate the profile image
        anime({
            targets: '.profile-image',
            translateY: [-20, 0], // Move the image up by 20px and then back down to its original position
            opacity: [0, 1], // Fade in the image
            easing: 'easeInOutQuad', // Easing function for smoother animation
            duration: 800, // Animation duration in milliseconds
            delay: 300, // Delay before starting the animation
        });

        // Add more animations for other elements as needed
    }

    function fadeInCards() {
        const cards = document.querySelectorAll('.mdl-card');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate only if the card is in the viewport
                    anime({
                        targets: entry.target,
                        translateY: [20, 0],
                        opacity: [0, 1],
                        easing: 'easeInOutQuad',
                        duration: 800, // Decreased duration for a smoother effect
                        delay: anime.stagger(150), // Stagger the animations for each card
                    });

                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        });

        // Observe each card
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    function complexAnimations() {
        const cards = document.querySelectorAll('.mdl-card');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate only if the card is in the viewport
                    anime({
                        targets: entry.target,
                        translateY: [-20, 0],
                        scale: [1, 1],
                        rotate: [0, 0],
                        opacity: [0, 1],
                        // backgroundColor: ['#FFF', '#F5F5F5'], // Slightly change background color
                        easing: 'easeInOutQuad',
                        duration: 800, // Decreased duration for a smoother effect
                        delay: anime.stagger(150), // Stagger the animations for each card
                    });

                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        });

        // Observe each card
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    fadeInCards();
    complexAnimations();
    animateElements();
});

