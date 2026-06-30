gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    document.body.style.overflow = "hidden";

    const textElement = document.getElementById("welcome-text");
    const btnStart = document.getElementById("btn-start-experience");
    const triggerContainer = document.getElementById("trigger-container");
    const music = document.getElementById("bg-music");
    const slides = document.querySelectorAll(".memory-slide");

    const textGroups = [
        "Hola,",
        "el mejor capítulo",
        "de nuestras vidas",
        "está por comenzar"
    ];
    gsap.set(textElement, { opacity: 0, y: 10 });
    let currentSlideIndex = 0;
    let slideshowTimeline;

    function startMemoriesSlideshow() {
        if (slides.length === 0) return;
        gsap.set(slides, { opacity: 0, scale: 1 });
        
        function crossfade() {
            const currentSlide = slides[currentSlideIndex];
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            const nextSlide = slides[currentSlideIndex];

            slideshowTimeline = gsap.timeline({ onComplete: crossfade });
            slideshowTimeline.to(currentSlide, { 
                opacity: 0, 
                duration: 1.5, 
                ease: "power1.inOut" 
            });

            slideshowTimeline.fromTo(nextSlide, 
                { opacity: 0, scale: 1.02 },
                { opacity: 0.45, scale: 1.08, duration: 5.0, ease: "linear" },
                "-=1.5"
            );
        }

        gsap.fromTo(slides[0], 
            { opacity: 0, scale: 1.02 },
            { opacity: 0.45, scale: 1.08, duration: 5.0, ease: "linear", onComplete: crossfade }
        );
    }

    startMemoriesSlideshow();
    gsap.set("#rings-svg", { opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.set("#rings-svg", { opacity: 1 });

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
            const preloaderEl = document.getElementById("preloader");
            if (preloaderEl) preloaderEl.remove();
            document.body.style.overflow = "auto";

            initHeroAnimation();
        }
    });

    if (btnStart) {
        btnStart.addEventListener("click", () => {
            
            if (music) {
                music.play().catch(err => {
                    console.log("Audio bloqueado por directiva del navegador:", err);
                });
            }

            if (slideshowTimeline) slideshowTimeline.kill();
            gsap.killTweensOf(slides);

            const transitionTl = gsap.timeline();

            transitionTl.to(triggerContainer, { 
                opacity: 0, 
                y: 15, 
                duration: 0.4, 
                ease: "power2.in",
                onComplete: () => { if (triggerContainer) triggerContainer.style.display = "none"; }
            });

            if (slides.length > 0) {
                transitionTl.set(slides, { opacity: 0, scale: 1.05 });
                
                slides.forEach((slide) => {
                    transitionTl.to(slide, { opacity: 0.5, duration: 0.12, ease: "power1.inOut" })
                                 .to(slide, { opacity: 0, duration: 0.12 });
                });
            }

            transitionTl.to(".preloader-memories", { 
                opacity: 0, 
                duration: 0.5, 
                ease: "power2.out",
                onComplete: () => {
                    tl.play();
                }
            });
        });
    }
});

function initHeroAnimation() {
    gsap.set(".hero-top, .hero-bottom", { opacity: 0, y: 15 });
    gsap.set("#amp", { opacity: 0, scale: 0.9 });
    gsap.set(".main-content", { autoAlpha: 1 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(["#name-r", "#name-l"], {
        y: "0%",
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.12
    })
    .to("#amp", { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=1.0");

    gsap.to(".hero-top, .hero-bottom", { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.6 });

    initURLPersonalization();
    initRSVPFlow();
    startCountdown();
    initEditorialSection();
    initCarouselSection();
    initDetailsSection();
    initAudioControl()

    gsap.to("#scroll-hint", {
        autoAlpha: 1,
        duration: 0.8,
        delay: 1.2
    });

    ScrollTrigger.create({
        trigger: "#wedding-details-wrapper",
        start: "top 75%",
        onEnter: () => gsap.to("#scroll-hint", { autoAlpha: 0, duration: 0.4 }),
        onLeaveBack: () => gsap.to("#scroll-hint", { autoAlpha: 1, duration: 0.4 })
    });
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
        xPercent: 25,
        ease: "none",
        scrollTrigger: {
            trigger: "#story-editorial",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".line-left", {
        xPercent: -25,
        ease: "none",
        scrollTrigger: {
            trigger: "#story-editorial",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    const photosConfig = [
        { selector: ".photo-1", yPercent: -35 }, 
        { selector: ".photo-2", yPercent: -65 },
        { selector: ".photo-3", yPercent: -45 },
        { selector: ".photo-4", yPercent: -85 },
        { selector: ".photo-5", yPercent: -60 }
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

function initURLPersonalization() {
    const nameContainer = document.getElementById("custom-family-name");
    if (!nameContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("to");

    if (guestName) {
        const cleanedName = guestName.trim();
        window.guestFamilyName = cleanedName;
        nameContainer.textContent = cleanedName + ", ";
    } else {
        window.guestFamilyName = "Invitado Especial";
    }
}

async function initRSVPFlow() {
    const btnYes = document.getElementById("btn-confirm-yes");
    const btnNo = document.getElementById("btn-confirm-no");
    const btnCalendar = document.getElementById("btn-download-ics");
    
    const initialState = document.getElementById("rsvp-initial-state");
    const successState = document.getElementById("rsvp-success-state");
    const statusState = document.getElementById("rsvp-status-state");
    const statusTitle = document.getElementById("status-title");
    const statusText = document.getElementById("status-text");
    const undoYes = document.getElementById("undo-link-yes");
    const undoWrapperYes = document.getElementById("undo-wrapper-yes");
    const undoNo = document.getElementById("undo-link-no");
    const undoWrapperNo = document.getElementById("undo-wrapper-no");

    const guestName = window.guestFamilyName || "Invitado Web Anónimo";
    const deadlineDate = new Date("2026-08-31T00:00:00");
    const today = new Date();

    function transitionState(fromEl, toEl) {
        gsap.to(fromEl, {
            opacity: 0,
            y: -15,
            duration: 0.4,
            onComplete: () => {
                fromEl.style.display = "none";
                toEl.style.display = "flex";
                gsap.fromTo(toEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
            }
        });
    }

    if (today >= deadlineDate) {
        if (initialState) {
            initialState.style.display = "none";
            statusState.style.display = "flex";
            statusState.style.opacity = "1";
            statusTitle.textContent = "Confirmaciones Cerradas";
            statusTitle.style.color = "#8A9A86";
            statusText.innerHTML = `El plazo para la confirmación digital expiró el <strong>30 de Agosto de 2026</strong>. Si tienes alguna novedad de último momento, por favor comunícate directamente con los novios.`;
        }
        return;
    }

    if (!btnYes || !btnNo) return;

    try {
        const { data, error } = await supabaseClient
            .from('rsvp')
            .select('attendance')
            .eq('family_name', guestName)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            initialState.style.display = "none";
            
            if (data.attendance === "SI") {
                successState.style.display = "flex";
                successState.style.opacity = "1";
            } else {
                statusState.style.display = "flex";
                statusState.style.opacity = "1";
                statusTitle.textContent = "Agradecemos tu respuesta";
                statusText.innerHTML = `Hemos registrado previamente que <strong>no podrás asistir</strong> a la celebración. Si tus planes cambiaron y deseas acompañarnos, comunícate con Robert o Laura para reservar tu cupo manualmente.`;
            }
        }
    } catch (err) {
        console.error("Error al verificar base de datos:", err);
    }

    async function executeRSVP(attendanceValue, targetButton, originalLabel) {
        targetButton.classList.add("is-loading");
        targetButton.querySelector(".btn-text").textContent = "Procesando...";
        
        btnYes.disabled = true;
        btnNo.disabled = true;

        try {
            const { error } = await supabaseClient
                .from('rsvp')
                .upsert(
                    { family_name: guestName, attendance: attendanceValue },
                    { onConflict: 'family_name' }
                );

            if (error) throw error;

            if (attendanceValue === "SI") {
                if (undoWrapperYes) undoWrapperYes.style.display = "block";
                
                transitionState(initialState, successState);
                triggerCalendarDownload();
            } else {
                statusTitle.textContent = "Respuesta Guardada";
                statusText.innerHTML = `Hemos registrado tu respuesta. Lamentamos mucho que no puedas acompañarnos en el altar, se te extrañará un montón en la celebración.`;
                if (undoWrapperNo) undoWrapperNo.style.display = "block";
                
                transitionState(initialState, statusState);
            }

        } catch (err) {
            console.error("Error crítico en transacción RSVP:", err);
            alert("Tuvimos un percance al sincronizar tu respuesta. Por favor, intenta de nuevo.");
            
            targetButton.classList.remove("is-loading");
            targetButton.querySelector(".btn-text").textContent = originalLabel;
            btnYes.disabled = false;
            btnNo.disabled = false;
        }
    }

    function handleUndo(currentState) {
        btnYes.disabled = false;
        btnNo.disabled = false;
        btnYes.classList.remove("is-loading");
        btnNo.classList.remove("is-loading");
        document.getElementById("btn-confirm-yes").querySelector(".btn-text").textContent = "Sí, allí estaré";
        document.getElementById("btn-confirm-no").querySelector(".btn-text").textContent = "No podré asistir";

        transitionState(currentState, initialState);
    }

    btnYes.addEventListener("click", () => executeRSVP("SI", btnYes, "Sí, allí estaré"));
    btnNo.addEventListener("click", () => executeRSVP("NO", btnNo, "No podré asistir"));

    if (undoYes) {
        undoYes.addEventListener("click", () => handleUndo(successState));
    }
    if (undoNo) {
        undoNo.addEventListener("click", () => handleUndo(statusState));
    }

    if (btnCalendar) {
        btnCalendar.addEventListener("click", () => {
            triggerCalendarDownload();
        });
    }
}

function triggerCalendarDownload() {
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Nuestra Boda//Robert & Laura//ES",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "@nuestraboda.com",
        "DTSTAMP:20260625T000000Z",
        "DTSTART:20261010T160000",
        "DTEND:20261011T020000",
        "SUMMARY:Nuestra Boda — Robert & Laura",
        "DESCRIPTION:¡Llegó el gran día! Te esperamos para celebrar juntos. Recuerda revisar los detalles de vestimenta y ubicación en nuestra web oficial.\\n\\nRegalo: Luvia de sobres.\\n\\n¡GRACIAS POR ACOMPAÑARNOS!",
        "LOCATION:Hacienda Santa Elena\\, Kilómetro 1.5\\, Vía Cota — Siberia",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "boda_robert_laura.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function initAudioControl() {
    const audioBtn = document.getElementById("audio-control");
    const music = document.getElementById("bg-music");

    if (!audioBtn || !music) return;

    audioBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play().catch(err => console.log("Error al reproducir:", err));
            audioBtn.classList.remove("is-paused");
        } else {
            music.pause();
            audioBtn.classList.add("is-paused");
        }
    });
}