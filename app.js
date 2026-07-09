/* ==========================================================================
   BIJOU MANAGEMENT APPLICATION LOGIC (PDF SLIDES PRESENTATION EDITION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Prevent iOS auto-scroll on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Clear hash on load to prevent jumping if URL has anchor
    if (window.location.hash) {
        setTimeout(() => window.scrollTo(0, 0), 1);
        history.replaceState(null, null, window.location.pathname);
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* --- Internationalization (i18n) Logic --- */
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('bijou_lang') || defaultLang;

    function applyTranslations(lang) {
        try {
            if (typeof translations === 'undefined') {
                console.warn('translations not loaded');
                return;
            }
            if (!translations[lang]) lang = defaultLang;
            
            document.documentElement.lang = lang;
        
        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        // Update active class on language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        } catch (e) {
            console.error('i18n error:', e);
        }
    }

    // Attach click listeners to language switchers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            currentLang = lang;
            localStorage.setItem('bijou_lang', lang);
            applyTranslations(lang);
        });
    });

    // Initial translation application
    applyTranslations(currentLang);

    /* --- Navbar Scroll Behavior --- */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Handle smooth scrolling and menu close
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent URL hash update to avoid jump on refresh
                
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* --- Active Navigation Link on Scroll --- */
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav);

    /* --- Contact Popup Modal Handles --- */
    const popupModal = document.getElementById('contact-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const openPopupBtns = document.querySelectorAll('.open-popup-btn');
    
    const openModal = () => {
        if (popupModal) {
            popupModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop scroll
        }
    };
    
    const closeModal = () => {
        if (popupModal) {
            popupModal.classList.remove('open');
            document.body.style.overflow = ''; // Resume scroll
        }
    };
    
    openPopupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closeModal);
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal on Escape press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupModal && popupModal.classList.contains('open')) {
            closeModal();
        }
    });

    /* --- Dynamic Form Role Toggle --- */
    const roleSelect = document.getElementById('Role');
    const optionalFieldWrappers = document.querySelectorAll('.optional-field-wrapper');
    
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const selectedValue = this.value.toLowerCase();
            
            optionalFieldWrappers.forEach(wrapper => {
                const targetRole = wrapper.dataset.role.toLowerCase();
                const input = wrapper.querySelector('input');
                
                if (targetRole === selectedValue) {
                    wrapper.style.display = 'flex';
                    if (input) input.setAttribute('required', 'required');
                } else {
                    wrapper.style.display = 'none';
                    if (input) input.removeAttribute('required');
                }
            });
        });
    }

    /* --- Instagram Link Caret Lock and Prefix Force --- */
    const instagramInput = document.getElementById('Instagram');
    const instPrefix = "https://www.instagram.com/";
    
    if (instagramInput) {
        instagramInput.addEventListener('focus', function() {
            if (!this.value) {
                this.value = instPrefix;
            }
        });
        
        instagramInput.addEventListener('keydown', function(e) {
            const caret = this.selectionStart;
            // Prevent deleting the prefix
            if ((e.key === "Backspace" && caret <= instPrefix.length) || 
                (e.key === "Delete" && caret < instPrefix.length)) {
                e.preventDefault();
            }
        });
        
        instagramInput.addEventListener('blur', function() {
            if (this.value === instPrefix) {
                this.value = '';
            }
        });
    }

    /* --- Stats Counter Animation --- */
    const resultsSection = document.getElementById('results');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const start = 0;
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                
                const currentValue = Math.floor(easeProgress * (target - start) + start);
                
                // Formatting suffixes specifically for case values
                if (stat.getAttribute('data-target') === '8000') {
                    stat.textContent = `$${currentValue.toLocaleString()}`;
                } else if (stat.getAttribute('data-target') === '5000') {
                    stat.textContent = `$${currentValue.toLocaleString()}+`;
                } else {
                    stat.textContent = currentValue;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Final values
                    if (stat.getAttribute('data-target') === '8000') stat.textContent = '$8,000';
                    if (stat.getAttribute('data-target') === '5000') stat.textContent = '$5,000+';
                }
            };
            
            requestAnimationFrame(updateCount);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animateStats();
                animatedStats = true;
            }
        });
    }, { threshold: 0.3 });

    if (resultsSection) {
        statsObserver.observe(resultsSection);
    }

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* --- Cookies Consent Popup Handles --- */
    const cookiesPopup = document.getElementById('cookies-popup');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const denyCookiesBtn = document.getElementById('deny-cookies');
    const closeCookiesBtn = document.getElementById('close-cookies-popup');
    
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    
    function setCookie(name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
        document.cookie = updatedCookie;
    }
    
    if (cookiesPopup) {
        if (!getCookie('bijou_cookies_accepted') && !getCookie('bijou_cookies_denied')) {
            setTimeout(() => {
                cookiesPopup.classList.add('show');
            }, 2000);
        }
        
        acceptCookiesBtn.addEventListener('click', () => {
            const date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
            setCookie('bijou_cookies_accepted', 'yes', { expires: date });
            cookiesPopup.classList.remove('show');
        });
        
        denyCookiesBtn.addEventListener('click', () => {
            const date = new Date();
            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
            setCookie('bijou_cookies_denied', 'yes', { expires: date });
            cookiesPopup.classList.remove('show');
        });
        
        closeCookiesBtn.addEventListener('click', () => {
            cookiesPopup.classList.remove('show');
        });
    }

    /* --- Income Split Calculator Logic --- */
    const calcSlider = document.getElementById('calc-slider');
    const calcRevVal = document.getElementById('calc-rev-val');
    const calcPayoutVal = document.getElementById('calc-payout-val');
    
    if (calcSlider && calcRevVal && calcPayoutVal) {
        const updateCalculator = () => {
            const revenue = parseInt(calcSlider.value, 10);
            const payout = Math.round(revenue * 0.3); // 30% payout
            
            calcRevVal.textContent = `$${revenue.toLocaleString()}`;
            calcPayoutVal.textContent = `$${payout.toLocaleString()}`;
        };
        
        calcSlider.addEventListener('input', updateCalculator);
        // Run once on load to initialize correct value
        updateCalculator();
    }

    /* --- Form Submission Logic --- */
    const popupForm = document.getElementById('wf-form-Popup-Form');
    const popupFormStatus = document.getElementById('popup-form-status');
    const popupSubmitBtn = document.getElementById('popup-submit-btn');
    
    if (popupForm && popupFormStatus) {
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            popupSubmitBtn.disabled = true;
            const originalText = popupSubmitBtn.textContent;
            popupSubmitBtn.textContent = currentLang === 'ru' ? 'Отправка...' :
                                        currentLang === 'uk' ? 'Відправлення...' :
                                        currentLang === 'es' ? 'Enviando...' :
                                        'Sending...';
            
            const formData = new FormData(popupForm);
            const data = {
                name: formData.get('Name'),
                contact: formData.get('Contact-Details'),
                role: formData.get('Role'),
                instagram: formData.get('Instagram'),
                message: formData.get('Message')
            };
            
            fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                popupSubmitBtn.disabled = false;
                popupSubmitBtn.textContent = originalText;
                applyTranslations(currentLang); // Re-apply to fix button text
                
                if (result.success) {
                    popupFormStatus.textContent = currentLang === 'ru' ? 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.' : 
                                                 currentLang === 'ua' ? 'Дякуємо! Вашу заявку успішно відправлено. Ми зв\'яжемося з вами найближчим часом.' :
                                                 currentLang === 'es' ? '¡Gracias! Su solicitud ha sido enviada con éxito. Nos pondremos en contacto con usted en breve.' :
                                                 'Thank you! Your request has been successfully sent. We will contact you shortly.';
                    popupFormStatus.className = 'form-status-y success';
                    
                    popupForm.reset();
                    
                    // Hide dynamic wrappers
                    if (typeof optionalFieldWrappers !== 'undefined') {
                        optionalFieldWrappers.forEach(wrapper => {
                            wrapper.style.display = 'none';
                            const input = wrapper.querySelector('input');
                            if (input) input.removeAttribute('required');
                        });
                    }
                    
                    setTimeout(() => {
                        popupFormStatus.textContent = '';
                        popupFormStatus.className = 'form-status-y';
                        closeModal();
                    }, 5000);
                } else {
                    popupFormStatus.textContent = currentLang === 'ru' ? 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.' : 'An error occurred while sending. Please try again later.';
                    popupFormStatus.className = 'form-status-y error';
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                popupSubmitBtn.disabled = false;
                popupSubmitBtn.textContent = originalText;
                applyTranslations(currentLang);
                
                popupFormStatus.textContent = currentLang === 'ru' ? 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.' : 'An error occurred while sending. Please try again later.';
                popupFormStatus.className = 'form-status-y error';
            });
        });
    }
});
