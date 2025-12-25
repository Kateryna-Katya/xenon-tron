/**
 * XenonTron Project - Final Stable Script
 * Решена проблема с загрузкой секции Education
 */

window.addEventListener('load', () => {
    // 1. Инициализация иконок
    lucide.createIcons();

    // 2. Инициализация Lenis
    const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    // Связываем Lenis со ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. Регистрация плагина
    gsap.registerPlugin(ScrollTrigger);

    // --- ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ АНИМАЦИЙ ---
    const initAnimations = () => {
        
        // Hero
        gsap.from('.hero__content > *', {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Исправленная секция Education
        const eduCards = document.querySelectorAll('.edu-card');
        eduCards.forEach((card) => {
            // Устанавливаем начальное состояние через GSAP (важно!)
            gsap.set(card, { autoAlpha: 0, y: 50 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%", // Срабатывает чуть раньше для надежности
                    toggleActions: "play none none none",
                    // invalidateOnRefresh пересчитывает точки при изменении высоты
                    invalidateOnRefresh: true, 
                }
            });

            tl.to(card, {
                autoAlpha: 1, // Плавно включает visibility и opacity
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

        // Блог и другие секции
        document.querySelectorAll('.blog-item').forEach((item) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 95%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8
            });
        });

        // Инновации
        gsap.from(".innovations__viz", {
            scrollTrigger: {
                trigger: ".innovations",
                start: "top 80%",
            },
            scale: 0.6,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
        });
    };

    // --- 4. ЗАПУСК И ГАРАНТИЯ ПЕРЕСЧЕТА ---
    
    // Запускаем анимации
    initAnimations();

    // ПРИНУДИТЕЛЬНЫЙ ПЕРЕСЧЕТ (ТРИЖДЫ)
    // 1. Сразу
    ScrollTrigger.refresh();
    
    // 2. Через 500мс (когда Lenis "утряс" высоту)
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    // 3. Через 1.5 сек (на случай тяжелых картинок)
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1500);

    // --- 5. ФОРМА ---
    const contactForm = document.getElementById('ai-contact-form');
    if (contactForm) {
        const n1 = Math.floor(Math.random() * 8) + 1;
        const n2 = Math.floor(Math.random() * 5) + 1;
        const result = n1 + n2;
        const label = document.getElementById('captcha-label');
        if (label) label.textContent = `Сколько будет ${n1} + ${n2}?`;

        contactForm.onsubmit = (e) => {
            e.preventDefault();
            if (parseInt(document.getElementById('captcha-input').value) !== result) {
                alert('Неверный ответ!'); return;
            }
            const btn = contactForm.querySelector('button');
            btn.disabled = true; btn.textContent = 'Отправка...';
            setTimeout(() => {
                const msg = document.getElementById('form-message');
                msg.style.display = 'block';
                msg.className = 'form__message success';
                msg.textContent = 'Успешно! Мы скоро свяжемся с вами.';
                contactForm.reset();
                btn.textContent = 'Готово';
            }, 1000);
        };
    }

    // --- 6. COOKIES ---
    const cookie = document.getElementById('cookie-popup');
    if (cookie && !localStorage.getItem('xenon_cookies')) {
        setTimeout(() => cookie.classList.add('active'), 3000);
        document.getElementById('cookie-accept').onclick = () => {
            localStorage.setItem('xenon_cookies', 'true');
            cookie.classList.remove('active');
        };
    }
});