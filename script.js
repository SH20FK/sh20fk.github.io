document.addEventListener('DOMContentLoaded', () => {

    // --- Код для курсора и скролла ---
    const spotlight = document.getElementById('cursor-spotlight');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        spotlight.style.transform = `translate(${x - 400}px, ${y - 400}px)`;
    });

    const heroSection = document.querySelector('.hero');
    const mainContent = document.getElementById('main-content');
    
    function handleScroll() {
        const scrollPosition = window.scrollY;
        // Появление основного контента
        if (scrollPosition > 10) {
            mainContent.classList.add('visible');
        } else {
            mainContent.classList.remove('visible');
        }
        // Исчезновение Hero
        if (scrollPosition > 10) {
            heroSection.classList.add('fade-out');
        } else {
            heroSection.classList.remove('fade-out');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Проверка состояния при загрузке страницы


    // --- ЛОГИКА МУЗЫКАЛЬНОГО ПЛЕЕРА ---
    const songs = [
        { title: 'Эпилог', artist: 'mzlff', audioSrc: 'audio/song1.mp3', coverSrc: 'images/cover1.jpg' },
        { title: 'Свободное падение', artist: 'mzlff', audioSrc: 'audio/song2.mp3', coverSrc: 'images/cover2.jpg' },
        { title: 'Цветочек маленький', artist: 'mzlff', audioSrc: 'audio/song3.mp3', coverSrc: 'images/cover3.jpg' },
        { title: 'Слово Мера 2', artist: 'Слава КПСС', audioSrc: 'audio/song4.mp3', coverSrc: 'images/cover4.jpg' },
    ];
    
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const albumArtImg = document.getElementById('album-art-img');
    const albumArt = document.querySelector('.album-art');
    const songTitleDisplay = document.getElementById('song-title-display');
    const songArtistDisplay = document.getElementById('song-artist-display');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeOnIcon = volumeBtn.querySelector('.volume-on');
    const volumeOffIcon = volumeBtn.querySelector('.volume-off');

    let currentSongIndex = 0;
    let isPlaying = false;
    let lastVolume = 1;

    function loadSong(song) {
        songTitleDisplay.textContent = song.title;
        songArtistDisplay.textContent = song.artist;
        audio.src = song.audioSrc;
        albumArtImg.src = song.coverSrc;
        audio.addEventListener('loadedmetadata', () => {
             displayTime(durationEl, audio.duration);
        });
    }

    function playSong() {
        isPlaying = true;
        playPauseBtn.classList.add('pause');
        albumArt.classList.add('playing');
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playPauseBtn.classList.remove('pause');
        albumArt.classList.remove('playing');
        audio.pause();
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            displayTime(currentTimeEl, audio.currentTime);
        }
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        if (audio.duration) {
            audio.currentTime = (clickX / width) * audio.duration;
        }
    }

    function displayTime(element, time) {
        if (isNaN(time)) time = 0;
        const minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        element.textContent = `${minutes}:${seconds}`;
    }

    function updateVolume() {
        const volume = parseFloat(volumeSlider.value);
        audio.volume = volume;

        volumeOnIcon.style.display = volume === 0 ? 'none' : 'block';
        volumeOffIcon.style.display = volume === 0 ? 'block' : 'none';
    }

    function toggleMute() {
        if (audio.volume > 0) {
            lastVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
        } else {
            audio.volume = lastVolume;
            volumeSlider.value = lastVolume;
        }
        updateVolume();
    }

    playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextSong); 
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', updateVolume);
    volumeBtn.addEventListener('click', toggleMute);

    loadSong(songs[currentSongIndex]);


    // --- ЛОГИКА ЗАГРУЗКИ ДАННЫХ ДЛЯ КАРТОЧКИ LAST.FM ---
    const refreshBtn = document.getElementById('lastfm-refresh-btn');

    async function fetchNowPlaying() {
        const apiKey = 'b503dd6a3b8710c9d5f397a68d510fb4';
        const user = 'SH20FK';
        const statusEl = document.getElementById('lastfm-status');
        const trackEl = document.getElementById('lastfm-track');

        statusEl.textContent = 'Обновление...';
        trackEl.textContent = '';
        refreshBtn.classList.add('loading');

        try {
            const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=1`);
            const data = await response.json();

            if (data.error || !data.recenttracks || !data.recenttracks.track.length) {
                throw new Error('Не удалось получить данные от Last.fm');
            }

            const recentTrack = data.recenttracks.track[0];
            const isNowPlaying = recentTrack['@attr']?.nowplaying === 'true';

            statusEl.textContent = isNowPlaying ? 'Сейчас играет:' : 'Последний трек:';
            trackEl.textContent = `${recentTrack.artist['#text']} — ${recentTrack.name}`;

        } catch (error) {
            console.error(error);
            statusEl.textContent = 'Ошибка загрузки';
            trackEl.textContent = 'Попробуйте обновить позже.';
        } finally {
            refreshBtn.classList.remove('loading');
        }
    }

    refreshBtn.addEventListener('click', fetchNowPlaying);
    fetchNowPlaying();


    // --- ЛОГИКА ДЛЯ ИНТЕРАКТИВНОЙ КАРТОЧКИ ---
    const cardHeader = document.getElementById('interactive-card-header');
    const flipper = document.getElementById('flipper-container');
    const cardFront = flipper.querySelector('.card-front');
    const cardBack = flipper.querySelector('.card-back');
    const cardTitle = document.getElementById('interactive-card-title');
    const cardArrow = document.getElementById('interactive-card-arrow');
    
    // ИСПРАВЛЕНИЕ: Функция для подстройки высоты карточки
    function updateFlipperHeight() {
        if (flipper.classList.contains('is-flipped')) {
            flipper.style.height = cardBack.scrollHeight + 'px';
        } else {
            flipper.style.height = cardFront.scrollHeight + 'px';
        }
    }

    if (cardHeader) {
        // Устанавливаем начальную высоту
        updateFlipperHeight();

        cardHeader.addEventListener('click', () => {
            flipper.classList.toggle('is-flipped');
            // Обновляем высоту при каждом клике
            updateFlipperHeight();
            
            if (flipper.classList.contains('is-flipped')) {
                cardTitle.textContent = 'Рабочее окружение';
                cardArrow.innerHTML = '←';
            } else {
                cardTitle.textContent = 'Мои проекты';
                cardArrow.innerHTML = '→';
            }
        });

        // Пересчитываем высоту при изменении размера окна
        window.addEventListener('resize', updateFlipperHeight);
    }
});