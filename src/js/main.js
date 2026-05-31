gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    const textElement = document.getElementById("welcome-text");

    const textGroups = [
        "Hola,",
        "el mejor capítulo",
        "de nuestras vidas",
        "está por comenzar"
    ];

    function splitTextToChars(text) {
        textElement.innerHTML = "";
        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.classList.add("char");
            if (char === " ") {
                span.classList.add("space");
                span.innerHTML = "&nbsp;";
            } else {
                span.innerText = char;
            }
            textElement.appendChild(span);
        });
    }

    const tl = gsap.timeline();


    //// stop 


    const paths = document.querySelectorAll(".draw-path");
    paths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });
    });

    // 2. Animamos el trazo continuo (Single Line Draw)
    tl.to(".draw-path", {
        strokeDashoffset: 0,
        duration: 2.5, // Le subí 0.5s porque la ruta matemática ahora es mucho más larga
        ease: "power2.inOut"
    })
        .to({}, { duration: 0.5 });

    textGroups.forEach((group, index) => {
        const isLast = index === textGroups.length - 1;

        // ✅ .call() ejecuta la función EN TIEMPO DE REPRODUCCIÓN, no de registro
        tl.call(() => splitTextToChars(group));

        // ✅ Usamos una función flecha para que GSAP resuelva ".char" en el momento justo
        tl.call(() => {
            const chars = document.querySelectorAll(".char");
            gsap.set(chars, { opacity: 0 }); // Garantizamos estado inicial limpio

            gsap.to(chars, {
                opacity: 1,
                stagger: 0.06,
                duration: 0.1,
                ease: "none"
            });
        });

        // Pausa para que la animación de entrada termine + tiempo de lectura
        // El grupo más largo tiene ~30 chars × 0.06s stagger = ~1.8s, usamos 2.5s de margen
        tl.to({}, { duration: isLast ? 3.2 : 2.8 });

        // Salida: fade out
        tl.call(() => {
            const chars = document.querySelectorAll(".char");
            gsap.to(chars, {
                opacity: 0,
                duration: isLast ? 0.6 : 0.4,
                ease: "power2.out"
            });
        });

        // Pausa post-salida
        tl.to({}, { duration: isLast ? 1.0 : 0.5 });
    });


    tl.to(".svg-container", {
        opacity: 0,
        y: -20, // Se elevan sutilmente 20px mientras desaparecen
        duration: 0.8,
        ease: "power2.out"
    });
    // Pequeña pausa de respiro antes de que el círculo te devore la pantalla
    tl.to({}, { duration: 0.3 });

    // Cierre en círculo
    tl.to(".preloader", {
        y: "-100vh", // En lugar de "100vh" positivo (abajo), usamos negativo para que suba.
        borderBottomLeftRadius: "50% 15vh", // Curvamos sutilmente la parte baja al subir
        borderBottomRightRadius: "50% 15vh",
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
            document.getElementById("preloader").remove();
            document.body.style.overflow = "auto";

            // Asegúrate de que aquí disparas la animación de la página principal
            initHeroAnimation();

        }
    });
});

function initHeroAnimation() {
    gsap.set(".main-content", { autoAlpha: 1 });

    const tl = gsap.timeline({ delay: 0.3 });

    // 1. Sube Robert y Laura casi al mismo tiempo (stagger de 0.1s para dinamismo)
    tl.to(["#name-r", "#name-l"], {
        y: "0%",
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1
    })

        // 2. Aparece el ampersand en el centro sutilmente
        .fromTo("#amp",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.5)" },
            "-=0.9" // Se adelanta para aparecer mientras los nombres aún están subiendo
        );

    // 3. Aparecen los demás elementos (Top y Bottom)
    gsap.fromTo(".hero-top, .hero-bottom",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
    );

    startCountdown();
    initStorytellingIntro();
}

// --- LOGICA DEL AUDIO ---
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

    // Le damos un pequeño efecto visual al botón al hacer clic
    gsap.fromTo(audioBtn, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
});

function startCountdown() {
    const targetDate = new Date("October 10, 2026 15:00:00").getTime(); // Ajusta la hora

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            return; // Boda en curso o ya pasó
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Formateamos para que siempre tenga 2 dígitos (ej. 09 en vez de 9)
        document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
        document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("cd-mins").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("cd-secs").innerText = seconds.toString().padStart(2, '0');
    }, 1000);
}

function initStorytellingIntro() {
    // 1. Cambio sutil de color de fondo desde el Hero al Story Intro
    gsap.to("body", {
        backgroundColor: "#95A37D", // Color verde oliva de la intro
        scrollTrigger: {
            trigger: "#story-intro",
            start: "top 70%", // Comienza la transición antes de que llegue arriba
            end: "top 20%",
            scrub: 1,
        }
    });

    // Limpiamos el fondo del section para que el body se vea
    gsap.set("#story-intro", { backgroundColor: "transparent" });

    // 2. Timeline principal con scrub y PIN para centrar el texto
    const introTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#story-intro",
            start: "top top", // Inicia cuando el section llega al tope de la pantalla
            end: "+=300%",    // Dura 2.5 veces el alto de la pantalla (más tiempo de scroll)
            pin: true,        // Pineamos la sección
            scrub: 1.2,       // Scrub suave
        }
    });

    // Fase 1: Aparece el texto elegantemente centrado
    introTl.fromTo(".intro-text",
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }
    )

    .to(".intro-img", { 
        y: "-300vh", // Hacemos que viajen mucho hacia arriba para cruzar toda la pantalla
        duration: 8, // Le damos mucho "peso" en la línea de tiempo
        ease: "none" // En scrub, "none" evita acelerones raros
    }, "+=0.5")

    // Fase 2: Imágenes suben con parallax por encima del texto
    // Se desplazan en Y negativas (hacia arriba)
   .to(".img-1", { rotation: -8, duration: 8 }, "<")
    .to(".img-2", { rotation: 6, duration: 8 }, "<")
    .to(".img-3", { rotation: -5, duration: 8 }, "<")
    .to(".img-4", { rotation: 9, duration: 8 }, "<");
}