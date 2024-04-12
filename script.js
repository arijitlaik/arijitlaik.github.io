const THEME_SWITCH_ID = 'theme-switch';
const NIGHT_START_HOUR = 18;
const NIGHT_END_HOUR = 6;

const isNightTime = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours < NIGHT_END_HOUR || hours >= NIGHT_START_HOUR;
}

const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const isNight = prefersDarkMode || isNightTime();
document.body.classList.toggle('night-theme', isNight);

document.addEventListener('DOMContentLoaded', async () => {
    const NIGHT_START_HOUR = 18;
    const NIGHT_END_HOUR = 6;
    const THEME_SWITCH_ID = 'theme-switch';
    const PUBLICATIONS_FILE = 'publications.bib_doi.bib';
    const PUBLICATION_LIST_ID = 'publication-list';

    const toggleNightMode = (isNight) => {
        const themeSwitch = document.getElementById(THEME_SWITCH_ID);
        const lightIcon = themeSwitch.querySelector('.light-icon');
        const darkIcon = themeSwitch.querySelector('.dark-icon');

        if (isNight) {
            document.body.classList.add('night-theme');
        } else {
            document.body.classList.remove('night-theme');
        }

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
            const typeMatch = entry.match(/@([^{\s]*)/);
            const fields = entry.match(/\s*([^=\s]*)\s*=\s*{([^}]*)}/g);
            const entryObj = {
                type: typeMatch ? typeMatch[1] : '',
            };
            if (fields) {
                fields.forEach(field => {
                    const [key, value] = field.split('=').map(item => item.trim().replace(/^{(.*)}$/, '$1'));
                    entryObj[key] = value;
                });
            }
            return entryObj;
        });
    }

    const displayPublications = (publications) => {
        const publicationList = document.getElementById(PUBLICATION_LIST_ID);
        if (!publicationList) {
            console.error('Publication list element not found.');
            return;
        }

        let htmlString = '';
        publications.forEach(publication => {
            htmlString += `<div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
                <div class="mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title ">
                        ${publication.title ? `<span>${publication.title}</span>` : ''}
                    </div>
                    <div class="mdl-card__supporting-text mdl-card--expand">
                        ${publication.author ? `<p><span>${highlightAuthor(publication.author)}</span></p>` : ''}
                        ${publication.year ? `<p><span>${publication.year}</span></p>` : ''}
                        ${publication.journal || publication.booktitle ? `<span>${publication.journal || publication.booktitle},</span>` : ''}
                        ${publication.volume ? `<span>${publication.volume},</span>` : ''}
                        ${publication.pages ? `<span>${publication.pages}.</span>` : ''}
                        ${publication.abstract ? `<p class="abstract"><span>${publication.abstract}</span></p>` : ''}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <a class="mdl-button mdl-js-button mdl-js-ripple-effect" href="https://doi.org/${publication.doi || ''}" target="_blank">
                            <i class="fas fa-external-link-alt"></i> DOI
                        </a>
                    </div>
                </div>
            </div>`;

            function highlightAuthor(author) {
                const highlightedWords = ['Laik', 'Arijit', 'Laik, A'];
                let highlightedAuthor = author;
                highlightedWords.forEach(word => {
                    highlightedAuthor = highlightedAuthor.replace(new RegExp(word, 'gi'), `<strong class="highlight">${word}</strong>`);
                });
                return highlightedAuthor;
            }
        });
        publicationList.insertAdjacentHTML('beforeend', htmlString);
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


