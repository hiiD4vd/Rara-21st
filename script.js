document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth Scroll Setup (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Navbar Blur on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Hero Section Animation
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "+=100%", // scroll distance for the animation
            scrub: true,
            pin: true,
            pinSpacing: true
        }
    });

    // Animate central image with clip-path to change aspect ratio cleanly
    heroTl.to(".hero-bg-wrapper", {
        clipPath: "inset(12vh 30vw 8vh 30vw round 40px)",
        duration: 1,
        ease: "none"
    }, 0);

    // Scale and fade out text
    heroTl.to(".hero-title-wrapper", {
        scale: 0.65,
        opacity: 0,
        duration: 1,
        ease: "none"
    }, 0);

    heroTl.to(".scroll-prompt", {
        opacity: 0,
        duration: 1,
        ease: "none"
    }, 0);

    // Parallax gallery images sliding in sequentially from diagonal bottom
    heroTl.from(".gallery-img-1", { x: "-30vw", y: "30vh", ease: "power1.out", duration: 1 }, 0);
    heroTl.from(".gallery-img-3", { x: "30vw", y: "30vh", ease: "power1.out", duration: 0.9 }, 0.1);
    heroTl.from(".gallery-img-2", { x: "-30vw", y: "30vh", ease: "power1.out", duration: 0.8 }, 0.2);
    heroTl.from(".gallery-img-4", { x: "30vw", y: "30vh", ease: "power1.out", duration: 0.8 }, 0.2);

    // Reveal Text Animation
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        const spans = text.querySelectorAll('span');
        gsap.to(spans, {
            scrollTrigger: {
                trigger: text,
                start: "top 80%",
                end: "bottom 50%",
                scrub: 1
            },
            opacity: 1,
            stagger: 0.1
        });
    });

    // Fade Up Elements
    const fadeUps = document.querySelectorAll('.fade-up');
    fadeUps.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleClass: "in-view"
            }
        });
    });

    // Story Section Animations
    const storyTitle = document.querySelector('.story-title');
    if (storyTitle) {
        gsap.from(storyTitle, {
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".story-section",
                start: "top 80%"
            }
        });
    }

    const storyCards = gsap.utils.toArray('.story-card');
    const chapters = gsap.utils.toArray('.chapter');

    if (storyCards.length > 0) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".story-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        // Extract final rotations from inline styles
        const finalRotations = storyCards.map(card => {
            const transform = card.style.transform;
            const match = transform.match(/rotate\(([-\d.]+)deg\)/);
            return match ? parseFloat(match[1]) : 0;
        });

        const bgColors = ["#fcf7ed", "#f4ecd8", "#e6d5b8"];
        gsap.set(".story-section", { backgroundColor: bgColors[0] });

        // Initial setup
        storyCards.forEach((card, i) => {
            gsap.set(card, { y: "80vh", rotation: finalRotations[i] - 15 });
        });
        gsap.set(chapters, { opacity: 0, y: 40 });

        // Graceful entrance for Chapter 1
        gsap.to(chapters[0], {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".story-section",
                start: "top 70%"
            }
        });

        storyCards.forEach((card, index) => {
            let chapIndex = Math.floor(index / 6);
            
            if (index % 6 === 0 && index !== 0) {
                // Smooth crossfade with vertical floating effect
                tl.to(chapters[chapIndex - 1], { opacity: 0, y: -40, duration: 1.5, ease: "power2.inOut" });
                tl.to(".story-section", { backgroundColor: bgColors[chapIndex], duration: 2 }, "<");
                tl.to(chapters[chapIndex], { opacity: 1, y: 0, duration: 1.5, ease: "power2.inOut" }, "<0.5");
            }

            // Calculate a staggered final Y position so they don't cover each other completely
            let finalY = ((index - (storyCards.length / 2)) * 15) + "px";

            // Slide up and rotate into final position
            tl.to(card, { 
                y: finalY, 
                rotation: finalRotations[index], 
                ease: "power2.out", 
                duration: 4 
            }, "-=2.5");
        });

        tl.to({}, { duration: 2 }); // Padding
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Countdown Timer
    const targetDate = new Date('June 30, 2026 16:45:00').getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) return;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const cdDays = document.getElementById('cd-days');
        if (cdDays) {
            cdDays.innerText = days;
            document.getElementById('cd-hours').innerText = hours;
            document.getElementById('cd-minutes').innerText = minutes;
            document.getElementById('cd-seconds').innerText = seconds;
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
});
