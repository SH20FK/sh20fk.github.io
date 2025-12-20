"use strict";

document.addEventListener('DOMContentLoaded', () => {
    try {
        const navbar = document.querySelector('.navbar');
        const navMusic = document.getElementById('nav-music');
        const musicText = navMusic?.querySelector('.music-text');
        const langToggle = document.getElementById('lang-toggle');
        const langText = langToggle?.querySelector('.lang-text');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const refreshBtn = document.getElementById('refresh-btn');
        const lastfmStatus = document.getElementById('lastfm-status');
        const lastfmTrack = document.getElementById('lastfm-track');
        const musicArtwork = document.querySelector('.music-artwork');
        const musicMeta = document.querySelector('.music-meta');
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        const clockTime = document.getElementById('clock-time');
        let lenis = null;
        let lastFmCache = { data: null, timestamp: 0 };

        if (typeof initTranslations === 'function') {
            initTranslations();
        }

        let currentLang = localStorage.getItem('lang') || 'ru';
        if (langText) langText.textContent = currentLang.toUpperCase();
        const getT = () => (typeof translations !== 'undefined' ? translations[currentLang] || {} : {});

        langToggle?.addEventListener('click', () => {
            currentLang = currentLang === 'ru' ? 'en' : 'ru';
            localStorage.setItem('lang', currentLang);
            document.documentElement.setAttribute('lang', currentLang);
            if (langText) langText.textContent = currentLang.toUpperCase();
            if (typeof applyTranslations === 'function') {
                applyTranslations(currentLang);
            }
            updateBreadcrumbs();
            updateNavMusicText(lastFmCache.data);
        });

        mobileMenuToggle?.addEventListener('click', () => {
            mobileMenu?.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu?.classList.remove('active');
                mobileMenuToggle?.classList.remove('active');
            });
        });

        document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection && navbar) {
                        const offset = navbar.offsetHeight + 20;
                        const targetPosition = targetSection.offsetTop - offset;
                        if (lenis) {
                            lenis.scrollTo(targetSection, { offset: -offset, duration: 1.1 });
                        } else {
                            window.scrollTo({ top: targetPosition, behavior: "smooth" });
                        }
                    }
                }
            });
        });

        const handleScroll = (y) => {
            if (navbar) {
                if (y < 50) {
                    navbar.classList.add("expanded");
                    navbar.classList.remove("collapsed");
                } else if (y > 100) {
                    navbar.classList.add("collapsed");
                    navbar.classList.remove("expanded");
                }
            }
            updateBreadcrumbs();
            if (scrollToTopBtn) {
                scrollToTopBtn.classList.toggle("visible", y > 500);
            }
        };

        if (navbar && window.scrollY < 50) {
            navbar.classList.add("expanded");
        }

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (navbar) {
                if (y < 50) {
                    navbar.classList.add('expanded');
                    navbar.classList.remove('collapsed');
                } else if (y > 100) {
                    navbar.classList.add('collapsed');
                    navbar.classList.remove('expanded');
                }
            }
            updateBreadcrumbs();
            if (scrollToTopBtn) {
                scrollToTopBtn.classList.toggle('visible', y > 500);
            }
        });
        // Ensure correct navbar state on load (prevents initial jump)
        (function initialNavbarState() {
            const y = window.scrollY;
            if (navbar) {
                if (y < 50) {
                    navbar.classList.add('expanded');
                    navbar.classList.remove('collapsed');
                } else if (y > 100) {
                    navbar.classList.add('collapsed');
                    navbar.classList.remove('expanded');
                }
            }
        })();

        const LenisCtor = window.Lenis || (typeof Lenis !== 'undefined' ? Lenis : null);
        const root = document.documentElement;

        if (LenisCtor) {
            lenis = new LenisCtor({
                duration: 1.1,
                smoothWheel: true,
                smoothTouch: false
            });
            root?.classList.add('lenis', 'lenis-smooth');
            lenis.on("scroll", ({ scroll }) => handleScroll(scroll));
            const raf = (time) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        } else {
            root?.classList.remove('lenis', 'lenis-smooth');
            window.addEventListener("scroll", () => handleScroll(window.scrollY));
            handleScroll(window.scrollY);
        }

        function updateBreadcrumbs() {}

        // --- Clock (Chelyabinsk / Asia-Yekaterinburg) ---
        function updateClock() {
            if (!clockTime) return;
            const formatter = new Intl.DateTimeFormat('ru-RU', {
                timeZone: 'Asia/Yekaterinburg',
                hour: '2-digit',
                minute: '2-digit'
            });
            clockTime.textContent = formatter.format(new Date());
        }
        updateClock();
        setInterval(updateClock, 60000);

        const NAV_CACHE_MS = 30000;

        async function fetchNavMusic() {
            if (!navMusic || !musicText) return;
            const t = getT();
            musicText.textContent = t.music_loading || 'Loading...';

            const now = Date.now();
            if (lastFmCache.data && now - lastFmCache.timestamp < NAV_CACHE_MS) {
                updateNavMusicText(lastFmCache.data);
                return;
            }

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const res = await fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=SH20FK&api_key=b503dd6a3b8710c9d5f397a68d510fb4&format=json&limit=1', { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!res.ok) throw new Error('Network error');
                const data = await res.json();
                lastFmCache = { data, timestamp: Date.now() };
                updateNavMusicText(data);
            } catch (e) {
                musicText.textContent = t.music_offline || 'Offline';
                navMusic?.classList.remove('playing');
            }
        }

        function updateNavMusicText(data) {
            const t = getT();
            if (!musicText) return;
            if (!data) {
                musicText.textContent = t.music_offline || 'Offline';
                navMusic?.classList.remove('playing');
                return;
            }
            const track = data?.recenttracks?.track?.[0];
            const isPlaying = track?.['@attr']?.nowplaying === 'true';
            if (isPlaying) {
                const title = track?.name || '';
                const shortTitle = title.length > 22 ? `${title.slice(0, 22)}…` : title;
                musicText.textContent = `${t.music_playing || 'Playing'}: ${shortTitle}`;
                navMusic?.classList.add('playing');
            } else {
                musicText.textContent = t.music_none || t.music_offline || 'Offline';
                navMusic?.classList.remove('playing');
            }
        }

        if (navMusic && musicText) {
            fetchNavMusic();
            setInterval(fetchNavMusic, 60000);
        }

        const typingText = document.querySelector('.typing-text');
        let words = [];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        window.updateTypingWords = function(newWords) {
            words = newWords || [];
            wordIndex = 0;
            charIndex = 0;
            isDeleting = false;
        };

        const initialT = getT();
        words = [initialT.typing_1, initialT.typing_2, initialT.typing_3].filter(Boolean);

        function type() {
            if (!typingText || words.length === 0) return;
            const currentWord = words[wordIndex] || '';

            typingText.textContent = isDeleting
                ? currentWord.substring(0, charIndex - 1)
                : currentWord.substring(0, charIndex + 1);

            charIndex += isDeleting ? -1 : 1;
            let typeSpeed = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        if (typingText) setTimeout(type, 800);

        const animateCounter = (element, target) => {
            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            const updateCounter = () => {
                start += increment;
                if (start < target) {
                    element.textContent = Math.floor(start);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };
            updateCounter();
        };

        const statsSection = document.querySelector('.module-stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.stat-value[data-count]').forEach(stat => {
                            const target = parseInt(stat.getAttribute('data-count') || '0', 10);
                            animateCounter(stat, target);
                        });
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statsObserver.observe(statsSection);
        }

        const skillsCard = document.querySelector('.skills-card');
        if (skillsCard) {
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                            const width = fill.getAttribute('data-width') || '0';
                            setTimeout(() => fill.style.width = `${width}%`, 200);
                        });
                        skillsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            skillsObserver.observe(skillsCard);
        }

        if (refreshBtn) {
            let retryCount = 0;
            const MAX_RETRIES = 2;

            const fetchCard = async () => {
                const t = getT();
                try {
                    refreshBtn.classList.add('loading');
                    if (lastfmStatus) lastfmStatus.textContent = t.music_loading || 'Loading...';
                    if (lastfmTrack) lastfmTrack.textContent = '';

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);
                    const res = await fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=SH20FK&api_key=b503dd6a3b8710c9d5f397a68d510fb4&format=json&limit=1', { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (!res.ok) throw new Error('Network error');
                    const data = await res.json();

                    const track = data?.recenttracks?.track?.[0];
                    if (!track) throw new Error('No data');

                    const isPlaying = track['@attr']?.nowplaying === 'true';
                    if (lastfmStatus) {
                        lastfmStatus.textContent = isPlaying ? (t.music_playing || 'Playing') : (t.music_paused || 'Paused');
                    }
                    if (lastfmTrack) lastfmTrack.textContent = track.name || '';
                    if (musicMeta) musicMeta.textContent = track.artist?.['#text'] || '';

                    if (musicArtwork) {
                        const artwork = track.image?.[track.image.length - 1]?.['#text'];
                        musicArtwork.innerHTML = '';
                        if (artwork) {
                            const img = document.createElement('img');
                            img.src = artwork;
                            img.alt = `${track.artist?.['#text'] || ''} - ${track.name || ''}`;
                            musicArtwork.appendChild(img);
                        } else {
                            musicArtwork.textContent = t.music_none || '—';
                        }
                    }

                    retryCount = 0;
                } catch (e) {
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(fetchCard, 5000);
                    } else {
                        if (lastfmStatus) lastfmStatus.textContent = t.music_offline || 'Offline';
                        if (lastfmTrack) lastfmTrack.textContent = t.music_none || '—';
                        if (musicArtwork) musicArtwork.textContent = t.music_none || '—';
                    }
                } finally {
                    refreshBtn.classList.remove('loading');
                }
            };

            refreshBtn.addEventListener('click', fetchCard);
            fetchCard();
        }

        if (contactForm) {
            const submitBtn = contactForm.querySelector('.submit-btn');

            const showErrors = (errors) => {
                document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                Object.entries(errors).forEach(([field, message]) => {
                    const errorEl = document.getElementById(`${field}-error`);
                    if (errorEl) errorEl.textContent = message;
                });
            };

            const validateForm = () => {
                const errors = {};
                const t = getT();
                const name = document.getElementById('name')?.value.trim();
                const email = document.getElementById('email')?.value.trim();
                const subject = document.getElementById('subject')?.value.trim();
                const message = document.getElementById('message')?.value.trim();

                if (!name) errors.name = t.form_error_name || 'Please enter your name';
                if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = t.form_error_email || 'Please enter a valid email';
                if (!subject) errors.subject = t.form_error_subject || 'Please enter a subject';
                if (!message || message.length < 10) errors.message = t.form_error_message || 'Message must be at least 10 characters';
                return errors;
            };

            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const t = getT();
                const errors = validateForm();
                if (Object.keys(errors).length) {
                    showErrors(errors);
                    return;
                }

                showErrors({});
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.6';
                    submitBtn.innerHTML = `<span>${t.form_sending || 'Sending...'}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.07" y2="7.07"/><line x1="16.93" y1="16.93" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="7.07" y2="16.93"/><line x1="16.93" y1="7.07" x2="19.78" y2="4.22"/></svg>`;
                }
                const originalText = submitBtn?.innerHTML;

                try {
                    const formData = new FormData(contactForm);
                    const res = await fetch('https://formspree.io/f/xpqaweew', {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (!res.ok) throw new Error('Form submission failed');
                    if (formStatus) {
                        formStatus.textContent = t.form_success || 'Message sent successfully!';
                        formStatus.className = 'form-status success';
                    }
                    contactForm.reset();
                    setTimeout(() => formStatus && (formStatus.className = 'form-status'), 5000);
                } catch (err) {
                    if (formStatus) {
                        formStatus.textContent = t.form_fail || 'Error sending message';
                        formStatus.className = 'form-status error';
                    }
                    setTimeout(() => formStatus && (formStatus.className = 'form-status'), 5000);
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = originalText || t.form_send || 'Send';
                    }
                }
            });
        }

        scrollToTopBtn?.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    } catch (error) {
        console.error('Fatal error in script:', error);
    }
});
