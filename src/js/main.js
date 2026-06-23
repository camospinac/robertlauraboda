gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("welcome-text");

    const textGroups = [
        "Hola,",
        "el mejor capítulo",
        "de nuestras vidas",
        "está por comenzar"
    ];
    gsap.set(textElement, { opacity: 0, y: 10 });

    const tl = gsap.timeline();
    const paths = document.querySelectorAll(".draw-path");
    paths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });
    });

    tl.to(".draw-path", {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut"
    }).to({}, { duration: 0.3 });

    textGroups.forEach((group, index) => {
        const isLast = index === textGroups.length - 1;

        tl.call(() => {
            textElement.innerText = group;
        });

        tl.to(textElement, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        });

        tl.to({}, { duration: isLast ? 2.5 : 2.0 });

        tl.to(textElement, {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: "power2.in"
        });

        tl.to({}, { duration: 0.3 });
    });

    tl.to(".svg-container", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power2.out"
    });

    tl.to(".preloader", {
        y: "-100vh",
        borderBottomLeftRadius: "50% 15vh",
        borderBottomRightRadius: "50% 15vh",
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
            document.getElementById("preloader").remove();
            document.body.style.overflow = "auto";
            
            initHeroAnimation();
        }
    });
});

function initHeroAnimation() {
    gsap.set(".main-content", { autoAlpha: 1 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(["#name-r", "#name-l"], {
        y: "0%",
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.12
    })

    .fromTo("#amp",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=1.0"
    );

    gsap.fromTo(".hero-top, .hero-bottom",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.6 }
    );

    startCountdown();
    initEditorialSection();
    initCarouselSection();
    initDetailsSection();
}

function initEditorialSection() {
    gsap.to("body", {
        backgroundColor: "#FFFFFF",
        scrollTrigger: {
            trigger: "#story-editorial",
            start: "top 80%",
            end: "top 20%",
            scrub: true
        }
    });

    gsap.to(".line-right", {
        xPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: "#story-editorial",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".line-left", {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: "#story-editorial",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    const photosConfig = [
        { selector: ".photo-1", yPercent: -40 },
        { selector: ".photo-2", yPercent: -120 },
        { selector: ".photo-3", yPercent: -50 },
        { selector: ".photo-4", yPercent: -140 },
        { selector: ".photo-5", yPercent: -70 }
    ];

    photosConfig.forEach(photo => {
        gsap.to(photo.selector, {
            yPercent: photo.yPercent,
            ease: "none",
            scrollTrigger: {
                trigger: "#story-editorial",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
            }
        });
    });
}

const audioBtn = document.getElementById("audio-control");
const audioFile = document.getElementById("bg-music");
const audioAlert = document.getElementById("audio-alert");
let isPlaying = false;

audioBtn.addEventListener("click", () => {
    if (isPlaying) {
        audioFile.pause();
        audioBtn.classList.add("is-muted");
    } else {
        audioFile.play();
        audioBtn.classList.remove("is-muted");
        if (audioAlert) audioAlert.style.display = "none";
    }
    isPlaying = !isPlaying;

    gsap.fromTo(audioBtn, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "power2.out" });
});

function startCountdown() {
    const targetDate = new Date("October 10, 2026 15:00:00").getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
        document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("cd-mins").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("cd-secs").innerText = seconds.toString().padStart(2, '0');
    }, 1000);
}

function initCarouselSection() {
    const track = document.querySelector(".carousel-track");
    if (!track) return;

    gsap.fromTo(".carousel-title-text", 
        { y: 80, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#story-carousel",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        }
    );

    const carouselTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#story-carousel",
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            pin: true,
            scrub: 1.5,
            invalidateOnRefresh: true 
        }
    });

    const images = document.querySelectorAll(".carousel-slide img");
    images.forEach(img => {
        gsap.set(img, { scale: 1.2, xPercent: -15 });
        carouselTl.to(img, {
            xPercent: 15,
            ease: "none",
            duration: 4
        }, 0);
    });

    carouselTl.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + (window.innerWidth * 0.05)),
        ease: "none", 
        duration: 4
    }, 0);
    
    carouselTl.to({}, { duration: 0.3 });
}

function initDetailsSection() {
    const blocks = document.querySelectorAll(".info-block");
    if (blocks.length === 0) return;

    blocks.forEach(block => {
        const mediaContainer = block.querySelector(".info-media-container");
        const infoCard = block.querySelector(".info-card-content");
        const blockTl = gsap.timeline({
            scrollTrigger: {
                trigger: block,
                start: "top top",
                end: "+=100%",
                pin: true,
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        });

        blockTl.to(mediaContainer, {
            top: "4vh",
            left: "4vw",
            width: "92vw",
            height: "64vh",
            borderRadius: "8px",
            ease: "power1.inOut"
        }, 0);

        blockTl.to(infoCard, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, 0);
    });
}