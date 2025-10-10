document.addEventListener('DOMContentLoaded', () => {

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
        const triggerPoint = 10;
        if (scrollPosition > triggerPoint) {
            heroSection.classList.add('fade-out');
            mainContent.classList.add('visible');
        } else {
            heroSection.classList.remove('fade-out');
            mainContent.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', handleScroll);


    const songs = [
        {
            title: 'Эпилог',
            artist: 'mzlff',
            audioSrc: 'audio/song1.mp3', 
            coverSrc: 'images/cover1.jpg'  
        },
        {
            title: 'Свободное падение',
            artist: 'mzlff',
            audioSrc: 'audio/song2.mp3',
            coverSrc: 'images/cover2.jpg'
        },
        {
            title: 'Цветочек маленький',
            artist: 'mzlff',
            audioSrc: 'audio/song3.mp3',
            coverSrc: 'images/cover3.jpg'
        },
	{
            title: 'Слово Мера 2',
            artist: 'Слава КПСС',
            audioSrc: 'audio/song4.mp3', // Путь к вашему файлу
            coverSrc: 'images/cover4.jpg'  // Путь к вашей обложке
        },
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

    let currentSongIndex = 0;
    let isPlaying = false;


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
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
        albumArt.classList.add('playing');
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playPauseBtn.classList.remove('pause');
        playPauseBtn.classList.add('play');
        albumArt.classList.remove('playing');
        audio.pause();
    }

    function playNextSong() {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0; 
        }
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function playPrevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1; 
        }
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
        const minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        element.textContent = `${minutes}:${seconds}`;
    }

    playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextSong); 
    progressContainer.addEventListener('click', setProgress);

    loadSong(songs[currentSongIndex]);
});