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
        const lyricsBox = document.getElementById('lyrics-box');
        const lyricsPanel = document.querySelector('.lyrics-panel');
        const musicVisual = document.querySelector('.music-visual');
        const shiftValue = document.getElementById('lyric-shift');
        const shiftButtons = document.querySelectorAll('.shift-btn');
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        const clockTime = document.getElementById('clock-time');
        const backgroundContainer = document.querySelector('.background-container');
        const root = document.documentElement;
        const fallbackArtwork = 'assets/404/404.png';
        let lenis = null;
        let lastFmCache = { data: null, timestamp: 0 };
        let lastLyricsKey = '';
        let lyricTimer = null;
        let lyricLines = [];
        let lyricIndex = -1;
        let lyricContainer = null;
        let lyricStartAt = 0;
        let lyricTick = null;
        let lyricShiftSec = 0;
        let lyricIsPlaying = false;

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
            if (scrollToTopBtn) {
                scrollToTopBtn.classList.toggle("visible", y > 500);
            }
            const scrollHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
            const progress = Math.max(0, Math.min(1, y / scrollHeight));
            root?.style.setProperty('--scroll-progress', progress.toFixed(4));
            root?.style.setProperty('--bg-scroll-y', `${Math.max(-18, progress * -18).toFixed(2)}px`);
        };

        const LenisCtor = window.Lenis || (typeof Lenis !== 'undefined' ? Lenis : null);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const allowLenis = Boolean(LenisCtor && !isTouchDevice && !prefersReducedMotion);

        if (allowLenis) {
            lenis = new LenisCtor({
                duration: 1.1,
                smoothWheel: true,
                smoothTouch: false
            });
            
            if (!isTouchDevice) {
                root?.classList.add('lenis', 'lenis-smooth');
            }
            
            lenis.on("scroll", ({ scroll }) => handleScroll(scroll));
            const raf = (time) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        } else {
            root?.classList.remove('lenis', 'lenis-smooth');
            if (root) root.style.overflow = '';
            if (document.body) document.body.style.overflow = '';
            window.addEventListener("scroll", () => handleScroll(window.scrollY), { passive: true });
        }
        handleScroll(window.scrollY);

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

        const setReveal = (selector, effect, step = 90, startDelay = 0) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.dataset.aos = effect;
                element.style.setProperty('--aos-delay', `${startDelay + index * step}ms`);
            });
        };

        const applyRevealPresets = () => {
            setReveal('.hero-content', 'left', 0, 40);
            setReveal('.hero-visual', 'right', 0, 160);
            setReveal('.stats-grid .stat-card', 'pop', 90, 40);
            setReveal('.module-about .module-header', 'up');
            setReveal('.module-about .about-text', 'left', 0, 80);
            setReveal('.module-about .skills-card', 'right', 0, 160);
            setReveal('.module-work .module-header', 'up');
            setReveal('.work-grid .work-card', 'zoom', 120, 60);
            setReveal('.info-grid .info-card', 'zoom', 120, 80);
            setReveal('.module-contact .contact-header', 'up');
            setReveal('.contact-grid .contact-card', 'zoom', 80, 40);
            setReveal('.module-form .form-wrapper', 'zoom', 0, 80);
        };

        const setupStaggerGroups = () => {
            if (prefersReducedMotion || typeof Element === 'undefined' || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver === 'undefined') {
                return;
            }

            const groups = [
                { container: document.querySelector('.hero-meta'), selector: '.meta-item', x: 0, y: 18, scale: 0.96, step: 90, duration: 520, delay: 200 },
                { container: document.querySelector('.code-body'), selector: '.line:not(.empty)', x: 0, y: 14, scale: 1, step: 50, duration: 420, delay: 200 },
                { container: document.querySelector('.about-highlights'), selector: '.highlight', x: -16, y: 0, scale: 1, step: 80, duration: 500, delay: 160 },
                { container: document.querySelector('.skills-list'), selector: '.skill-item', x: 0, y: 16, scale: 0.98, step: 70, duration: 500, delay: 150 },
                { container: document.querySelector('.setup-list'), selector: '.setup-item', x: -14, y: 0, scale: 1, step: 70, duration: 500, delay: 140 },
                { container: document.querySelector('.contact-form'), selector: '.form-group, .submit-btn', x: 0, y: 20, scale: 0.98, step: 80, duration: 520, delay: 150 }
            ].filter((group) => group.container);

            if (!groups.length) {
                return;
            }

            const groupMap = new Map(groups.map((group) => [group.container, group]));
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const group = groupMap.get(entry.target);
                    if (!group) {
                        return;
                    }

                    entry.target.querySelectorAll(group.selector).forEach((item, index) => {
                        item.animate(
                            [
                                {
                                    opacity: 0,
                                    transform: `translate3d(${group.x}px, ${group.y}px, 0) scale(${group.scale})`
                                },
                                {
                                    opacity: 1,
                                    transform: 'translate3d(0, 0, 0) scale(1)'
                                }
                            ],
                            {
                                duration: group.duration,
                                delay: group.delay + index * group.step,
                                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                                fill: 'both'
                            }
                        );
                    });

                    staggerObserver.unobserve(entry.target);
                });
            }, { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });

            groups.forEach(({ container }) => staggerObserver.observe(container));
        };

        const setupCardTilt = () => {
            if (prefersReducedMotion || !supportsFinePointer) {
                return;
            }

            document.querySelectorAll('.liquid-glass, .code-card').forEach((card) => {
                let frame = 0;
                let nextState = {
                    rotateX: 0,
                    rotateY: 0,
                    shiftX: 0,
                    shiftY: 0,
                    glowX: '50%',
                    glowY: '50%'
                };

                const commit = () => {
                    frame = 0;
                    card.style.setProperty('--pointer-rotate-x', `${nextState.rotateX.toFixed(2)}deg`);
                    card.style.setProperty('--pointer-rotate-y', `${nextState.rotateY.toFixed(2)}deg`);
                    card.style.setProperty('--pointer-translate-x', `${nextState.shiftX.toFixed(2)}px`);
                    card.style.setProperty('--pointer-translate-y', `${nextState.shiftY.toFixed(2)}px`);
                    card.style.setProperty('--glow-x', nextState.glowX);
                    card.style.setProperty('--glow-y', nextState.glowY);
                };

                const schedule = () => {
                    if (!frame) {
                        frame = requestAnimationFrame(commit);
                    }
                };

                const reset = () => {
                    card.classList.remove('is-tilting');
                    nextState = {
                        rotateX: 0,
                        rotateY: 0,
                        shiftX: 0,
                        shiftY: 0,
                        glowX: '50%',
                        glowY: '50%'
                    };
                    schedule();
                };

                card.addEventListener('pointermove', (event) => {
                    if (event.pointerType === 'touch') {
                        return;
                    }

                    const rect = card.getBoundingClientRect();
                    const ratioX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
                    const ratioY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
                    const centeredX = ratioX - 0.5;
                    const centeredY = ratioY - 0.5;

                    nextState = {
                        rotateX: centeredY * -8,
                        rotateY: centeredX * 10,
                        shiftX: centeredX * 10,
                        shiftY: centeredY * 8,
                        glowX: `${(ratioX * 100).toFixed(2)}%`,
                        glowY: `${(ratioY * 100).toFixed(2)}%`
                    };
                    card.classList.add('is-tilting');
                    schedule();
                });

                card.addEventListener('pointerdown', (event) => {
                    const rect = card.getBoundingClientRect();
                    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
                    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
                    card.style.setProperty('--ripple-x', `${x}px`);
                    card.style.setProperty('--ripple-y', `${y}px`);
                });

                card.addEventListener('pointerleave', reset);
                card.addEventListener('pointercancel', reset);
            });
        };

        const setupBackgroundMotion = () => {
            if (!backgroundContainer || prefersReducedMotion || !supportsFinePointer) {
                return;
            }

            let frame = 0;
            let nextX = 0;
            let nextY = 0;

            const commit = () => {
                frame = 0;
                root?.style.setProperty('--bg-shift-x', `${nextX.toFixed(2)}px`);
                root?.style.setProperty('--bg-shift-y', `${nextY.toFixed(2)}px`);
            };

            const schedule = () => {
                if (!frame) {
                    frame = requestAnimationFrame(commit);
                }
            };

            const reset = () => {
                nextX = 0;
                nextY = 0;
                schedule();
            };

            window.addEventListener('pointermove', (event) => {
                if (event.pointerType === 'touch') {
                    return;
                }

                nextX = (event.clientX / window.innerWidth - 0.5) * 28;
                nextY = (event.clientY / window.innerHeight - 0.5) * 20;
                schedule();
            }, { passive: true });

            document.body?.addEventListener('mouseleave', reset);
            window.addEventListener('blur', reset);
        };

        applyRevealPresets();
        setupStaggerGroups();
        setupCardTilt();
        setupBackgroundMotion();

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
                const shortTitle = title.length > 22 ? `${title.slice(0, 22)}...` : title;
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

        const syncLyricsHeight = () => {
            if (!lyricsPanel || !musicVisual) return;
            if (window.matchMedia('(max-width: 1200px)').matches) {
                lyricsPanel.style.height = '';
                lyricsPanel.style.maxHeight = '';
                musicVisual.style.height = '';
                musicVisual.style.maxHeight = '';
                return;
            }
            musicVisual.style.height = '';
            musicVisual.style.maxHeight = '';
            const height = musicVisual.offsetHeight;
            if (height) {
                lyricsPanel.style.height = `${height}px`;
                lyricsPanel.style.maxHeight = `${height}px`;
            }
        };

        const scheduleSyncLyricsHeight = () => {
            requestAnimationFrame(syncLyricsHeight);
        };

        if (lyricsPanel && musicVisual) {
            window.addEventListener('resize', scheduleSyncLyricsHeight);
            scheduleSyncLyricsHeight();
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
            const duration = 1400;
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
                        entry.target.querySelectorAll('.skill-fill').forEach((fill, index) => {
                            const width = fill.getAttribute('data-width') || '0';
                            setTimeout(() => {
                                fill.classList.add('animating');
                                fill.style.width = `${width}%`;
                            }, 200 + index * 150);
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
                    const artist = track.artist?.['#text'] || '';
                    const title = track.name || '';
                    if (artist && title) {
                        fetchLyrics(artist, title, t, isPlaying);
                    } else if (lyricsBox) {
                        lyricsBox.textContent = t.music_none || 'No lyrics';
                    }

                    if (musicArtwork) {
                        const artwork = track.image?.[track.image.length - 1]?.['#text'];
                        musicArtwork.innerHTML = '';
                        const img = document.createElement('img');
                        img.alt = `${track.artist?.['#text'] || ''} - ${track.name || ''}`.trim() || 'Track artwork';
                        img.src = artwork || fallbackArtwork;
                        img.addEventListener('load', scheduleSyncLyricsHeight);
                        img.addEventListener('error', () => {
                            if (!img.dataset.fallback) {
                                img.dataset.fallback = '1';
                                img.src = fallbackArtwork;
                            }
                        });
                        musicArtwork.appendChild(img);
                    }

                    lastFmCache = { data, timestamp: Date.now() };
                    updateNavMusicText(data);
                    scheduleSyncLyricsHeight();
                    retryCount = 0;
                } catch (e) {
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(fetchCard, 5000);
                    } else {
                        if (lastfmStatus) lastfmStatus.textContent = t.music_offline || 'Offline';
                        if (lastfmTrack) lastfmTrack.textContent = t.music_none || '-';
                        if (musicArtwork) {
                            musicArtwork.innerHTML = '';
                            const img = document.createElement('img');
                            img.alt = 'Track artwork';
                            img.src = fallbackArtwork;
                            img.addEventListener('load', scheduleSyncLyricsHeight);
                            musicArtwork.appendChild(img);
                        }
                        if (lyricsBox) lyricsBox.textContent = t.music_none || '-';
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

        const scrollRevealObserverOptions = { threshold: 0.15, rootMargin: '0px 0px -80px 0px' };
        const scrollRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    scrollRevealObserver.unobserve(entry.target);
                }
            });
        }, scrollRevealObserverOptions);
        document.querySelectorAll('[data-scroll-reveal], [data-clip-reveal], [data-stagger], [data-line-reveal]').forEach(el => scrollRevealObserver.observe(el));

        const updateShiftDisplay = () => {
            if (!shiftValue) return;
            const sign = lyricShiftSec > 0 ? '+' : '';
            shiftValue.textContent = `${sign}${lyricShiftSec.toFixed(1)}s`;
        };

        if (shiftButtons.length) {
            shiftButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.reset) {
                        lyricShiftSec = 0;
                    } else {
                        const delta = Number(btn.dataset.shift || 0);
                        if (!Number.isNaN(delta)) {
                            lyricShiftSec = Math.max(-10, Math.min(10, lyricShiftSec + delta));
                        }
                    }
                    updateShiftDisplay();
                    if (lyricIsPlaying && lyricTick) {
                        lyricTick();
                    }
                });
            });
            updateShiftDisplay();
        }

        const stopLyricSync = () => {
            if (lyricTimer) {
                clearInterval(lyricTimer);
                lyricTimer = null;
            }
            lyricLines = [];
            lyricIndex = -1;
            lyricContainer = null;
            lyricTick = null;
            lyricStartAt = 0;
            lyricIsPlaying = false;
        };

        const parseLrc = (lrc) => {
            const lines = [];
            lrc.split('\n').forEach((line) => {
                const matches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\]/g)];
                if (!matches.length) return;
                const text = line.replace(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\]/g, '').trim();
                if (!text) return;
                matches.forEach((m) => {
                    const min = Number(m[1]);
                    const sec = Number(m[2]);
                    const frac = Number(m[3] || '0');
                    const time = min * 60 + sec + frac / 100;
                    lines.push({ time, text });
                });
            });
            return lines.sort((a, b) => a.time - b.time);
        };

        const renderLyricsLines = (lines) => {
            if (!lyricsBox) return [];
            lyricsBox.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.className = 'lyrics-lines';
            lines.forEach((line) => {
                const div = document.createElement('div');
                div.className = 'lyrics-line';
                div.textContent = line.text;
                if (line.time !== null && line.time !== undefined) {
                    div.dataset.time = String(line.time);
                }
                wrapper.appendChild(div);
            });
            lyricsBox.appendChild(wrapper);
            lyricContainer = wrapper;
            return Array.from(wrapper.children);
        };

        const startLyricSync = (lines, isPlaying) => {
            stopLyricSync();
            if (!lines.length) return;
            lyricLines = lines;
            const lineEls = renderLyricsLines(lines);
            lyricIsPlaying = isPlaying;
            if (!isPlaying) return;
            lyricStartAt = performance.now();
            lyricTick = () => {
                const elapsed = (performance.now() - lyricStartAt) / 1000;
                const effective = elapsed - lyricShiftSec;
                let nextIndex = lyricIndex;
                while (nextIndex + 1 < lyricLines.length && effective >= lyricLines[nextIndex + 1].time) {
                    nextIndex += 1;
                }
                if (nextIndex !== lyricIndex) {
                    if (lyricIndex >= 0 && lineEls[lyricIndex]) {
                        lineEls[lyricIndex].classList.remove('active');
                    }
                    if (nextIndex >= 0 && lineEls[nextIndex]) {
                        lineEls[nextIndex].classList.add('active');
                        if (lyricContainer) {
                            const el = lineEls[nextIndex];
                            const top = el.offsetTop - lyricContainer.clientHeight / 2 + el.clientHeight / 2;
                            lyricContainer.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                        }
                    }
                    lyricIndex = nextIndex;
                }
                if (effective > lyricLines[lyricLines.length - 1].time + 6) {
                    stopLyricSync();
                }
            };
            lyricTimer = setInterval(lyricTick, 250);
            lyricTick();
        };

        const renderPlainLyrics = (text) => {
            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
            const mapped = lines.map(line => ({ text: line, time: null }));
            renderLyricsLines(mapped);
        };

        const parseTtmlTime = (value) => {
            if (!value) return null;
            const normalized = String(value).trim();
            const parts = normalized.split(':').map(Number);
            if (parts.some((part) => Number.isNaN(part))) {
                return null;
            }
            if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2];
            }
            if (parts.length === 2) {
                return parts[0] * 60 + parts[1];
            }
            return parts[0];
        };

        const parseTtml = (ttml) => {
            if (!ttml || typeof DOMParser === 'undefined') {
                return [];
            }
            try {
                const parser = new DOMParser();
                const xml = parser.parseFromString(ttml, 'application/xml');
                const lines = Array.from(xml.getElementsByTagName('p'))
                    .map((node) => {
                        const begin = parseTtmlTime(node.getAttribute('begin'));
                        const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
                        return begin === null || !text ? null : { time: begin, text };
                    })
                    .filter(Boolean);
                return lines;
            } catch (_) {
                return [];
            }
        };

        const LYRICS_SERVICES = [
            {
                name: 'better-lyrics',
                hasSynced: true,
                getUrl: (title, artist) => `https://lyrics-api.boidu.dev/getLyrics?a=${encodeURIComponent(artist)}&s=${encodeURIComponent(title)}`,
                parse: (data) => {
                    const syncedLines = parseTtml(data?.ttml || '');
                    return {
                        syncedLines,
                        plain: syncedLines.length ? syncedLines.map((line) => line.text).join('\n') : ''
                    };
                }
            },
            {
                name: 'lrclib',
                hasSynced: true,
                getUrl: (title, artist) => `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`,
                parse: (data) => {
                    const synced = data?.syncedLyrics || '';
                    const syncedLines = synced ? parseLrc(synced) : [];
                    return {
                        syncedLines,
                        plain: data?.plainLyrics || ''
                    };
                }
            },
            {
                name: 'lyrics-ovh',
                hasSynced: false,
                getUrl: (title, artist) => `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
                parse: (data) => ({
                    syncedLines: [],
                    plain: data?.lyrics || ''
                })
            }
        ];

        async function fetchLyrics(artist, title, t, isPlaying) {
            if (!lyricsBox) return;
            const key = `${artist}-${title}`.toLowerCase();
            if (key === lastLyricsKey && lyricsBox.textContent) return;

            stopLyricSync();
            lyricsBox.textContent = (t?.music_loading) || 'Loading...';
            lastLyricsKey = key;

            const fail = () => {
                stopLyricSync();
                lyricsBox.textContent = (t?.music_none) || 'No lyrics';
            };

            const tryService = async (service) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000);
                try {
                    const res = await fetch(service.getUrl(title, artist), {
                        signal: controller.signal,
                        headers: { 'Accept': 'application/json' }
                    });
                    clearTimeout(timeoutId);
                    if (!res.ok) {
                        return null;
                    }
                    const data = await res.json();
                    return service.parse(data);
                } catch (_) {
                    clearTimeout(timeoutId);
                    return null;
                }
            };

            for (const service of LYRICS_SERVICES) {
                const result = await tryService(service);
                if (!result) {
                    continue;
                }

                if (service.hasSynced && result.syncedLines && result.syncedLines.length) {
                    startLyricSync(result.syncedLines, isPlaying);
                    return;
                }

                if (result.plain && result.plain.trim().length > 10) {
                    renderPlainLyrics(result.plain);
                    return;
                }
            }

            fail();
        }
    } catch (error) {
        console.error('Fatal error in script:', error);
    }
});
