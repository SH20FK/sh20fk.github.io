const translations = {
    ru: {
        nav_about: 'Обо мне',
        nav_work: 'Работы',
        nav_contact: 'Контакты',
        nav_hire: 'Нанять меня',
        nav_time: 'Челябинск',
        aria_skip: 'Перейти к основному содержимому',
        aria_lang: 'Переключить язык',
        aria_menu: 'Открыть меню',
        aria_refresh: 'Обновить трек',
        aria_scroll: 'К началу страницы',
        hero_welcome: 'Привет',
        hero_role: 'Python Developer',
        hero_location: 'Челябинск, Россия',
        hero_available: 'Доступен для работы',
        typing_1: 'Чистый код',
        typing_2: 'Веб-разработка',
        typing_3: 'Решаю задачи',
        stats_projects: 'Выполнено проектов',
        stats_technologies: 'Технологии',
        stats_motivation: 'Мотивация',
        about_badge: 'Обо мне',
        about_heading: 'Кто я',
        about_p1: 'Привет! Я Александр, Python-разработчик из Челябинска. Пишу чистый и понятный код.',
        about_p2: 'Постоянно изучаю новые технологии и подходы. Сосредоточен на поддерживаемых решениях реальных задач.',
        about_p3: 'Открыт для предложений, где смогу прокачаться и принести пользу проекту.',
        about_h1: 'Сторонник чистого кода',
        about_h2: 'Быстро учусь',
        about_h3: 'Командный игрок',
        skills_heading: 'Навыки',
        work_badge: 'Портфолио',
        work_heading: 'Избранные работы',
        work_project1_title: 'Сайт NiosCraft',
        work_project1_desc: 'Полный дизайн и разработка сайта игрового сервера: современный UI/UX, анимации, адаптив.',
        work_project2_title: 'Личное портфолио',
        work_project2_desc: 'Интерактивное портфолио с Last.fm и динамическим контентом.',
        work_view: 'Смотреть проект',
        info_music_title: 'Сейчас играет',
        info_quote: '«Код как юмор. Когда надо объяснять — плохо.»',
        info_quote_author: 'Кори Хаус',
        info_setup: 'Моя сборка',
        music_loading: 'Загрузка...',
        music_offline: 'Офлайн',
        music_playing: 'Играет',
        music_paused: 'Пауза',
        music_none: 'Ничего нет',
        form_heading: 'Отправить сообщение',
        form_name: 'Имя',
        form_email: 'Email',
        form_subject: 'Тема',
        form_message: 'Сообщение',
        form_send: 'Отправить',
        form_error_name: 'Введите имя',
        form_error_email: 'Введите корректный email',
        form_error_subject: 'Введите тему',
        form_error_message: 'Сообщение должно быть не короче 10 символов',
        form_sending: 'Отправка...',
        form_success: 'Сообщение отправлено!',
        form_fail: 'Ошибка отправки',
        contact_heading: 'Давайте работать вместе',
        contact_subtitle: 'Всегда открыт к новым проектам и возможностям.',
        footer_text: '© 2026 Alexander Salamatin. Создано кодом и с душой.'
    },
    en: {
        nav_about: 'About',
        nav_work: 'Work',
        nav_contact: 'Contact',
        nav_hire: 'Hire me',
        nav_time: 'Chelyabinsk',
        aria_skip: 'Skip to main content',
        aria_lang: 'Switch language',
        aria_menu: 'Toggle menu',
        aria_refresh: 'Refresh track',
        aria_scroll: 'Scroll to top',
        hero_welcome: 'Welcome',
        hero_role: 'Python Developer',
        hero_location: 'Chelyabinsk, Russia',
        hero_available: 'Available for work',
        typing_1: 'Clean Code',
        typing_2: 'Web Development',
        typing_3: 'Problem Solving',
        stats_projects: 'Projects Completed',
        stats_technologies: 'Technologies',
        stats_motivation: 'Motivation',
        about_badge: 'About Me',
        about_heading: 'Who I Am',
        about_p1: 'Hi! I\'m Alexander, a Python developer from Chelyabinsk passionate about creating clean, efficient code.',
        about_p2: 'I\'m constantly learning new technologies and approaches to software development. My focus is on writing maintainable code that solves real problems.',
        about_p3: 'Currently looking for opportunities to gain practical experience and contribute to interesting projects.',
        about_h1: 'Clean Code Advocate',
        about_h2: 'Fast Learner',
        about_h3: 'Team Player',
        skills_heading: 'Technical Skills',
        work_badge: 'Portfolio',
        work_heading: 'Featured Work',
        work_project1_title: 'NiosCraft Website',
        work_project1_desc: 'Complete design and development of a gaming server website featuring modern UI/UX, custom animations, and responsive design.',
        work_project2_title: 'Personal Portfolio',
        work_project2_desc: 'Interactive portfolio with Last.fm integration and dynamic content.',
        work_view: 'View Project',
        info_music_title: 'Now Playing',
        info_quote: '"Code is like humor. When you have to explain it, it\'s bad."',
        info_quote_author: 'Cory House',
        info_setup: 'My Setup',
        music_loading: 'Loading...',
        music_offline: 'Offline',
        music_playing: 'Playing',
        music_paused: 'Paused',
        music_none: 'Nothing playing',
        form_heading: 'Send Message',
        form_name: 'Name',
        form_email: 'Email',
        form_subject: 'Subject',
        form_message: 'Message',
        form_send: 'Send',
        form_error_name: 'Please enter your name',
        form_error_email: 'Please enter a valid email',
        form_error_subject: 'Please enter a subject',
        form_error_message: 'Message must be at least 10 characters',
        form_sending: 'Sending...',
        form_success: 'Message sent successfully!',
        form_fail: 'Error sending message',
        contact_heading: 'Let\'s Work Together',
        contact_subtitle: 'I\'m always interested in hearing about new projects and opportunities.',
        footer_text: '© 2026 Alexander Salamatin. Crafted with code and passion.'
    }
};

function initTranslations() {
    const lang = localStorage.getItem('lang') || 'ru';
    document.documentElement.setAttribute('lang', lang);
    applyTranslations(lang);
}

function applyTranslations(lang) {
    if (!translations[lang]) return;

    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        if (t[key]) {
            element.setAttribute('aria-label', t[key]);
        }
    });

    if (typeof window.updateTypingWords === 'function') {
        window.updateTypingWords([t.typing_1, t.typing_2, t.typing_3]);
    }

    document.documentElement.setAttribute('lang', lang);
}
