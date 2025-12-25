/**
 * XenonTron Project - Ultimate Stable Script
 * Исправлено: Мобильное меню + Анимация секций + Синхронизация Lenis
 */

window.addEventListener('load', () => {
    // 1. Инициализация иконок Lucide
    lucide.createIcons();

    // 2. Инициализация Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    // Синхронизация со ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. Регистрация GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- 4. МОБИЛЬНОЕ МЕНЮ (ИСПРАВЛЕНО) ---
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (burger && mobileMenu) {
        const toggleMenu = () => {
            const isActive = burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            if (isActive) {
                // Останавливаем скролл Lenis и блокируем body
                lenis.stop();
                document.body.style.overflow = 'hidden';
            } else {
                // Запускаем скролл обратно
                lenis.start();
                document.body.style.overflow = '';
            }
        };

        burger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
        });

        // Закрытие при клике на ссылки
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- 5. ХЕДЕР (ЭФФЕКТ ПРИ СКРОЛЛЕ) ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('header--scrolled', window.scrollY > 50);
        }
    });

    // --- 6. ИНИЦИАЛИЗАЦИЯ АНИМАЦИЙ ---
    const initAllAnimations = () => {
        
        // Hero
        gsap.from('.hero__content > *', {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Секция Education (Легко разобраться без опыта)
        const eduCards = document.querySelectorAll('.edu-card');
        eduCards.forEach((card) => {
            // Прячем через GSAP для предотвращения мигания
            gsap.set(card, { autoAlpha: 0, y: 50 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%", 
                    toggleActions: "play none none none",
                    invalidateOnRefresh: true, 
                }
            });

            tl.to(card, {
                autoAlpha: 1, 
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            .from(card.querySelectorAll('.edu-list li'), {
                x: -20,
                opacity: 0,
                stagger: 0.15,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.4");
        });

        // Блог
        document.querySelectorAll('.blog-item').forEach((item) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8
            });
        });

        // Инновации (AI Core)
        const viz = document.querySelector('.innovations__viz');
        if (viz) {
            gsap.from(viz, {
                scrollTrigger: {
                    trigger: ".innovations",
                    start: "top 80%",
                },
                scale: 0.6,
                opacity: 0,
                duration: 1.2,
                ease: "back.out(1.7)"
            });
        }
    };

    // Запуск
    initAllAnimations();

    // ГАРАНТИЯ ПЕРЕСЧЕТА КООРДИНАТ
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1500);

    // --- 7. КОНТАКТНАЯ ФОРМА ---
    const contactForm = document.getElementById('ai-contact-form');
    if (contactForm) {
        const n1 = Math.floor(Math.random() * 8) + 1;
        const n2 = Math.floor(Math.random() * 5) + 1;
        const result = n1 + n2;
        const label = document.getElementById('captcha-label');
        if (label) label.textContent = `Сколько будет ${n1} + ${n2}?`;

        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const captchaInput = document.getElementById('captcha-input');
            if (parseInt(captchaInput.value) !== result) {
                alert('Пожалуйста, решите пример правильно.'); 
                return;
            }
            const btn = contactForm.querySelector('button');
            btn.disabled = true; 
            btn.textContent = 'Отправка...';
            
            setTimeout(() => {
                const msg = document.getElementById('form-message');
                msg.style.display = 'block';
                msg.className = 'form__message success';
                msg.textContent = 'Запрос успешно отправлен!';
                contactForm.reset();
                btn.textContent = 'Готово';
            }, 1000);
        };
    }

    // --- 8. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookiePopup && !localStorage.getItem('xenon_cookies')) {
        setTimeout(() => cookiePopup.classList.add('active'), 3000);
        if (cookieAccept) {
            cookieAccept.onclick = () => {
                localStorage.setItem('xenon_cookies', 'true');
                cookiePopup.classList.remove('active');
            };
        }
    }
});