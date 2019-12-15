export default {
    particles: {
        number: {
            value: 15,
            density: { enable: true, value_area: 1104.8066982851817 }
        },
        color: { value: '#64ffda' },
        shape: {
            type: 'polygon',
            stroke: { width: 0, color: '#64ffda' },
            polygon: { nb_sides: 6 },
        },
        opacity: {
            value: 1,
            random: true,
            anim: {
                enable: true,
                speed: 0.16241544246026904,
                opacity_min: 0,
                sync: true
            }
        },
        size: {
            value: 10,
            random: true,
            anim: { enable: true, speed: 15, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 100,
            color: '#64ffda',
            opacity: 0.16572100474277726,
            width: 0
        },
        move: {
            enable: true,
            // enable: false,
            speed: 4,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'bounce',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'bubble' },
            onclick: { enable: true, mode: 'repulse' },
            resize: true
        },
        modes: {
            grab: { distance: 251.74825174825176, line_linked: { opacity: 1 } },
            bubble: {
                distance: 100,
                size: 15,
                duration: 0.5684540486109415,
                opacity: 0.2679854800594439,
                speed: 6
            },
            repulse: { distance: 97.44926547616141, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true
}
