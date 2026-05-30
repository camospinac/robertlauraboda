document.addEventListener("DOMContentLoaded", () => {

    const textElement = document.getElementById("welcome-text");

    const textGroups = [
        "Hola,",
        "el mejor capítulo",
        "de nuestras vidas",
        "está por comenzar",
        "..."
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
        clipPath: "circle(10% at 50% 50%)",
        duration: 1.2,
        ease: "power3.inOut"
    });

    // Caída y limpieza
    tl.to(".preloader", {
        y: "100vh",
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
            document.getElementById("preloader").remove();
            document.body.style.overflow = "auto";
            initHeroAnimation();
        }
    }, "-=0.2");
});

function initHeroAnimation() {
    // 1. Hacemos visible el main
    gsap.set(".main-content", { autoAlpha: 1 });

    // 2. Animamos los elementos (De adentro hacia afuera)
    gsap.fromTo(".hero-element",
        {
            scale: 0.8,
            opacity: 0,
            y: 20
        },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.3, // Entra primero el top, luego el centro, luego el bottom
            ease: "back.out(1.2)" // Efecto elástico muy premium y sutil
        }
    );

    // 3. Inicializamos el contador
    startCountdown();
}

// --- LOGICA DEL AUDIO ---
const audioBtn = document.getElementById("audio-control");
const audioFile = document.getElementById("bg-music");
const audioAlert = document.getElementById("audio-alert");
let isPlaying = false;

audioBtn.addEventListener("click", () => {
    if (isPlaying) {
        audioFile.pause();
    } else {
        audioFile.play();
        // Ocultamos la alerta una vez que interactúan
        if (audioAlert) audioAlert.style.display = "none";
    }
    isPlaying = !isPlaying;

    // Le damos un pequeño efecto visual al botón al hacer clic
    gsap.fromTo(audioBtn, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
});

// --- LOGICA DEL CONTADOR ---
function startCountdown() {
    const targetDate = new Date("October 13, 2026 15:00:00").getTime(); // Ajusta la hora

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

        // Formateamos para que siempre tenga 2 dígitos (ej. 09 en vez de 9)
        document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
        document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("cd-mins").innerText = minutes.toString().padStart(2, '0');
    }, 1000);
}