document.addEventListener('DOMContentLoaded', async () => {
    const NIGHT_START_HOUR = 18;
    const NIGHT_END_HOUR = 6;
    const THEME_SWITCH_ID = 'theme-switch';
    const PUBLICATIONS_FILE = 'publications.bib';
    const PUBLICATION_LIST_ID = 'publication-list';

    const isNightTime = () => {
        const now = new Date();
        const hours = now.getHours();
        return hours < NIGHT_END_HOUR || hours >= NIGHT_START_HOUR;
    }

    const toggleNightMode = (isNight) => {
        const elementsToToggle = document.querySelectorAll('*');
        const themeSwitch = document.getElementById(THEME_SWITCH_ID);
        const lightIcon = themeSwitch.querySelector('.light-icon');
        const darkIcon = themeSwitch.querySelector('.dark-icon');

        elementsToToggle.forEach(element => {
            isNight ? element.classList.add('night-theme') : element.classList.remove('night-theme');
        });

        themeSwitch.classList.toggle('night-theme', isNight);
        lightIcon.style.display = isNight ? 'none' : '';
        darkIcon.style.display = isNight ? '' : 'none';
    }

    const updateNightMode = () => {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isNight = prefersDarkMode || isNightTime();
        toggleNightMode(isNight);
    }

    const fetchPublications = async () => {
        const response = await fetch(PUBLICATIONS_FILE);
        if (!response.ok) throw new Error('Failed to fetch publications');
        const bibTeX = await response.text();
        const publications = parseBibTeX(bibTeX);
        displayPublications(publications);
    }

    const parseBibTeX = (bibTeX) => {
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

    const displayPublications = (publications) => {
        const publicationList = document.getElementById(PUBLICATION_LIST_ID);
        if (!publicationList) {
            console.error('Publication list element not found.');
            return;
        }

        publicationList.innerHTML = '';
        publications.forEach(publication => {
            const card = document.createElement('div');
            card.classList.add('mdl-cell', 'mdl-cell--4-col');
            card.innerHTML = `
                <div class="mdl-card mdl-shadow--2dp">
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
    function fadeInCards() {
        const cards = document.querySelectorAll('.mdl-card');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });
    
        cards.forEach((card) => {
            observer.observe(card);
        });
    }



    try {
    await fetchPublications();
    updateNightMode();
    fadeInCards();
    animateElements();
} catch (error) {
    console.error('Error during initialization:', error);
}

const themeSwitch = document.getElementById(THEME_SWITCH_ID);
if (themeSwitch) {
    themeSwitch.addEventListener('click', () => toggleNightMode(!themeSwitch.classList.contains('night-theme')));
}

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateNightMode);
}

});