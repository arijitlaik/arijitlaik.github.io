document.addEventListener('DOMContentLoaded', async () => {
    const NIGHT_START_HOUR = 18;
    const NIGHT_END_HOUR = 6;
    const THEME_SWITCH_ID = 'theme-switch';
    const PUBLICATIONS_FILE = 'publications.bib_doi.bib';
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
    
        // Sort publications by year
        publications.sort((a, b) => b.year - a.year);
    
        displayPublications(publications);
    }

    const parseBibTeX = (bibTeX) => {
    const entries = bibTeX.split('@').filter(entry => entry.trim() !== '');
    return entries.map(entry => {
        const titleMatch = entry.match(/(^|\s)title\s*=\s*{([^}]*)}/);
        const authorMatch = entry.match(/author\s*=\s*{([^}]*)}/);
        const yearMatch = entry.match(/year\s*=\s*{([^}]*)}/);
        const doiMatch = entry.match(/doi\s*=\s*{([^}]*)}/);

        return {
            title: titleMatch ? titleMatch[2] : '',
            author: authorMatch ? authorMatch[1] : '',
            year: yearMatch ? yearMatch[1] : '',
            doi: doiMatch ? doiMatch[1] : '',
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
            card.classList.add('mdl-cell', 'mdl-cell--6-col');
            card.innerHTML = `
        <div class="mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title ">
                ${publication.title}
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
                <p>${publication.author}</p>
                <p class="event-date">${publication.year}</p>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a class="mdl-button mdl-js-button mdl-js-ripple-effect" href="https://doi.org/${publication.doi}" target="_blank">
    <i class="fas fa-external-link-alt"></i> DOI
</a>
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