// =============================================
// CONFIGURACIÓN DE AXIES (7 TIPOS CON ESCALAS)
// =============================================
// Función auxiliar integrada para evitar problemas de rutas con Rollup y GitHub Pages
function getAssetUrl(path) {
    const base = import.meta.env.BASE_URL || '/';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanBase = base.endsWith('/') ? base : base + '/';
    return cleanBase + cleanPath;
}

export const AXIE_TYPES = {
    BING: 'bing',
    KIBO: 'kibo',
    KOTARO: 'kotaro',
    PALADILL: 'paladill',
    POMODORO: 'pomodoro',
    TRIPP: 'tripp',
    XIA: 'xia',
};

export const AXIES_DATA = {
    bing: {
        id: 'bing',
        nombre: 'Bing',
        descripcion: 'El líder feroz del equipo',
        modelo: getAssetUrl('assets/axies/bing.glb'),
        arma: getAssetUrl('assets/weapons_axies/bing-cannon.glb'),
        color: '#ff4444',
        escala: 1.08,
        stats: { vida: 150, ataque: 20, defensa: 30, velocidad: 1.0 },
        habilidades: {
            pasiva: { nombre: 'Piel Dura', descripcion: 'Reduce el daño recibido en un 15%.', icono: '🛡️' },
            activa: { nombre: 'Garra Salvaje', descripcion: 'Golpea con sus garras causando gran daño.', icono: '🐾', cooldown: 5 },
            definitiva: { nombre: 'Furia Bestial', descripcion: 'Entra en furia aumentando ataque y defensa.', icono: '🔥', cooldown: 28 },
        },
    },
    kibo: {
        id: 'kibo',
        nombre: 'Kibo',
        descripcion: 'Ágil y veloz como el viento',
        modelo: getAssetUrl('assets/axies/kibo.glb'),
        arma: getAssetUrl('assets/weapons_axies/kibo-hammer.glb'),
        color: '#44aaff',
        escala: 0.95,
        stats: { vida: 130, ataque: 22, defensa: 25, velocidad: 1.3 },
        habilidades: {
            pasiva: { nombre: 'Agilidad Felina', descripcion: 'Aumenta la velocidad de movimiento un 10%.', icono: '💨' },
            activa: { nombre: 'Zarpazo Rápido', descripcion: 'Ataca con gran velocidad.', icono: '⚡', cooldown: 4 },
            definitiva: { nombre: 'Furia de Gato', descripcion: 'Aumenta velocidad y ataque por 5s.', icono: '🐱', cooldown: 25 },
        },
    },
    kotaro: {
        id: 'kotaro',
        nombre: 'Kotaro',
        descripcion: 'Astuto y estratégico',
        modelo: getAssetUrl('assets/axies/kotaro.glb'),
        arma: getAssetUrl('assets/weapons_axies/kotaro-sword.glb'),
        color: '#ff8844',
        escala: 1.04,
        stats: { vida: 140, ataque: 18, defensa: 28, velocidad: 1.1 },
        habilidades: {
            pasiva: { nombre: 'Mente Estratégica', descripcion: 'Aumenta el daño crítico un 20%.', icono: '🧠' },
            activa: { nombre: 'Golpe Certero', descripcion: 'Ataque preciso que ignora defensa.', icono: '🎯', cooldown: 6 },
            definitiva: { nombre: 'Tormenta de Arena', descripcion: 'Ciega al enemigo reduciendo su precisión.', icono: '🌪️', cooldown: 30 },
        },
    },
    paladill: {
        id: 'paladill',
        nombre: 'Paladill',
        descripcion: 'Portador de la justicia',
        modelo: getAssetUrl('assets/axies/paladill.glb'),
        arma: getAssetUrl('assets/weapons_axies/paladill-axe.glb'),
        color: '#aa66ff',
        escala: 0.9,
        stats: { vida: 160, ataque: 15, defensa: 35, velocidad: 0.9 },
        habilidades: {
            pasiva: { nombre: 'Escudo Sagrado', descripcion: 'Bloquea el 20% del daño recibido.', icono: '🛡️' },
            activa: { nombre: 'Golpe Divino', descripcion: 'Ataque que restaura vida.', icono: '✨', cooldown: 7 },
            definitiva: { nombre: 'Juicio Final', descripcion: 'Golpea a todos los enemigos cercanos.', icono: '⚖️', cooldown: 35 },
        },
    },
    pomodoro: {
        id: 'pomodoro',
        nombre: 'Pomodoro',
        descripcion: 'Pequeño pero letal',
        modelo: getAssetUrl('assets/axies/pomodoro.glb'),
        arma: getAssetUrl('assets/weapons_axies/pomodoro-staff.glb'),
        color: '#44ff88',
        escala: 0.9,
        stats: { vida: 110, ataque: 28, defensa: 18, velocidad: 1.4 },
        habilidades: {
            pasiva: { nombre: 'Agilidad Tomatera', descripcion: 'Aumenta la velocidad de ataque un 15%.', icono: '🍅' },
            activa: { nombre: 'Bomba Tomate', descripcion: 'Lanza un tomate explosivo.', icono: '💥', cooldown: 5 },
            definitiva: { nombre: 'Lluvia de Tomates', descripcion: 'Cae una lluvia de tomates sobre el área.', icono: '🌧️', cooldown: 28 },
        },
    },
    tripp: {
        id: 'tripp',
        nombre: 'Tripp',
        descripcion: 'Místico y poderoso',
        modelo: getAssetUrl('assets/axies/tripp.glb'),
        arma: getAssetUrl('assets/weapons_axies/tripp-sword.glb'),
        color: '#ff66aa',
        escala: 0.99,
        stats: { vida: 120, ataque: 25, defensa: 22, velocidad: 1.2 },
        habilidades: {
            pasiva: { nombre: 'Energía Mística', descripcion: 'Recupera vida lentamente.', icono: '🔮' },
            activa: { nombre: 'Rayo Mágico', descripcion: 'Lanza un rayo de energía.', icono: '⚡', cooldown: 5 },
            definitiva: { nombre: 'Tormenta Mística', descripcion: 'Crea una tormenta que daña y confunde.', icono: '🌌', cooldown: 30 },
        },
    },
    xia: {
        id: 'xia',
        nombre: 'Xia',
        descripcion: 'Brilla con luz propia',
        modelo: getAssetUrl('assets/axies/xia.glb'),
        arma: getAssetUrl('assets/weapons_axies/xia-axe.glb'),
        color: '#ffdd44',
        escala: 0.99,
        stats: { vida: 125, ataque: 23, defensa: 24, velocidad: 1.3 },
        habilidades: {
            pasiva: { nombre: 'Luz Brillante', descripcion: 'Aumenta la precisión de los ataques.', icono: '⭐' },
            activa: { nombre: 'Destello Cegador', descripcion: 'Ciega al enemigo por 2s.', icono: '✨', cooldown: 6 },
            definitiva: { nombre: 'Supernova', descripcion: 'Explosión de luz que daña a todos.', icono: '💫', cooldown: 32 },
        },
    },
};

// =============================================
// PERFIL DE COMBATE POR AXIE (ataques basicos)
// =============================================
// Cada Axie trae en su GLB clips de arma con el prefijo de su propia arma
// (Cannon.Idle, Sword.Walk, Hammer.Attack...). Aqui se declara, por Axie:
//   clipArma : prefijo de sus clips con arma, o null si no los trae
//   tipo     : 'rango' lanza proyectil | 'melee' golpe fisico sin proyectil
//   ataque   : nombre del clip de ataque dentro del GLB
//   factor   : tamano del arma respecto al Axie (para calibrar a ojo)
//   giroArma : grados de correccion de orientacion del arma en la mano
// De los 7 GLB, tripp es el unico SIN Axe.Idle/Axe.Walk (solo trae
// Axe.Attack), asi que conserva los clips genericos y su prefijo va a null.
export const PERFIL_COMBATE = {
    bing:     { clipArma: 'Cannon', tipo: 'rango', ataque: 'Cannon.Attack', factor: 0.60, giroArma: 0, cancelarHueso: true, separacion: [0, 0, 0] },
    kotaro:   { clipArma: 'Sword',  tipo: 'melee', ataque: 'Sword.Attack',  factor: 0.72, giroArma: 0, separacion: [0, 0, 0] },
    kibo:     { clipArma: 'Hammer', tipo: 'melee', ataque: 'Hammer.Attack', factor: 0.60, giroArma: 0, separacion: [0, 0, 0] },
    paladill: { clipArma: 'Hammer', tipo: 'melee', ataque: 'Hammer.Attack', factor: 0.60, giroArma: 0, separacion: [0, 0, 0] },
    pomodoro: { clipArma: 'Staff',  tipo: 'rango', ataque: 'Staff.Attack',  factor: 0.60, giroArma: 0, separacion: [0, 0, 0] },
    xia:      { clipArma: 'Axe',    tipo: 'melee', ataque: 'Axe.Attack',    factor: 0.60, giroArma: 0, separacion: [0, 0, 0] },
    tripp:    { clipArma: null,     tipo: 'rango', ataque: 'Axe.Attack',    factor: 0.60, giroArma: 0, separacion: [0, 0, 0] },
};

// 'separacion': desplazamiento [x, y, z] del arma respecto al hueso, en
// unidades locales de ese hueso. Sirve para despegarla del cuerpo cuando
// queda metida en el torso o en el sombrero. Empieza en [0, 0, 0] (sin
// cambio) y se calibra Axie a Axie mirando el resultado en pantalla.
//
// Valores neutros de respaldo. NO se parte del perfil de Bing a proposito:
// antes se hacia Object.assign({}, PERFIL_COMBATE.bing, p) y cualquier campo
// propio de Bing (cancelarHueso) se filtraba a TODOS los Axies que no lo
// definieran, porque el merge no distingue entre valores por defecto y
// ajustes de un Axie concreto.
const PERFIL_NEUTRO = { clipArma: null, tipo: 'melee', ataque: null, factor: 0.60, giroArma: 0, cancelarHueso: false, separacion: [0, 0, 0] };

// Devuelve el perfil de combate de un Axie. Si el id no existe devuelve los
// valores neutros, para que ningun llamador tenga que defenderse de undefined.
export function getPerfilCombate(id) {
    const p = PERFIL_COMBATE[id];
    if (!p) return Object.assign({}, PERFIL_NEUTRO);
    return Object.assign({}, PERFIL_NEUTRO, p);
}

export function getAxieById(id) {
    return AXIES_DATA[id] || null;
}

// =============================================
// AXIES HABILITADOS PARA JUGAR
// =============================================
// Solo estos Axies aparecen en la seleccion de 1v1.
// Tarea 2: de los 7 originales se deshabilitan 5 y quedan Bing y Kotaro.
// Para volver a habilitar uno, basta con anadir su id aqui.
export const AXIES_HABILITADOS = ['bing', 'kotaro'];

// Devuelve los objetos completos de los Axies habilitados (en ese orden).
export function getAxiesHabilitados() {
    return AXIES_HABILITADOS
        .map(id => AXIES_DATA[id])
        .filter(Boolean);
}

// Indica si un Axie puede usarse en partida.
export function isAxieHabilitado(id) {
    return AXIES_HABILITADOS.includes(id);
}

// Devuelve TODOS los Axies (habilitados o no). Util para IA/entrenamiento futuro.
export function getAllAxies() {
    return Object.values(AXIES_DATA);
}

export default AXIES_DATA;