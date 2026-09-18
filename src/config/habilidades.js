// =============================================
// CATÁLOGO DE HABILIDADES (Q / W / E / R)
// =============================================
// ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE TOCAR PARA AÑADIR O CAMBIAR HABILIDADES.
//
// Cada habilidad se define con:
//   tecla    : la tecla que la activa (se usa también de hueco en el HUD)
//   nombre   : texto corto bajo la tecla
//   icono    : ruta al PNG/SVG del icono. VACÍO = se dibuja la tecla. En cuanto
//              tengas las imágenes, basta con poner aquí la ruta y aparecen.
//   color    : color del borde y del texto mientras no haya icono
//   tipo     : 'pocion' | 'area' | 'utilidad'  (qué hace, ver aplicarHabilidad)
//   mana     : coste de maná (0 = gratis)
//   cooldown : segundos de recarga
//   radio    : alcance del efecto en unidades del mundo (solo tipo 'area')
//   dano     : daño del efecto (solo tipo 'area')
//   alcance  : alcance de la utilidad (solo tipo 'utilidad')
//
// Para añadir una habilidad nueva: añade una entrada aquí y, si su 'tipo' no es
// uno de los tres ya implementados, añade su rama en aplicarHabilidad() de
// src/main.js. El HUD, las teclas, el coste de maná y la recarga son automáticos.

// Punto de partida de la Onda de choque. Los números no son un balance cerrado.
export const HABILIDADES = {
    q: {
        tecla: 'Q',
        nombre: 'POC HP',
        icono: '',                 // ej: 'assets/habilidades/pocion-hp.png'
        color: '#ff6644',
        tipo: 'pocion',
        pocion: 'hp',
        mana: 0,
        cooldown: 0,               // usa el cooldown propio de las pociones
        radio: 0,
        dano: 0
    },
    w: {
        tecla: 'W',
        nombre: 'ONDA',
        icono: '',                 // ej: 'assets/habilidades/onda-choque.png'
        color: '#bb66ff',
        tipo: 'area',
        mana: 40,
        cooldown: 6.0,
        radio: 6.5,
        dano: 45
    },
    e: {
        tecla: 'E',
        nombre: 'POC MP',
        icono: '',                 // ej: 'assets/habilidades/pocion-mp.png'
        color: '#44aaff',
        tipo: 'pocion',
        pocion: 'mp',
        mana: 0,
        cooldown: 0,
        radio: 0,
        dano: 0
    },
    r: {
        tecla: 'R',
        nombre: 'RESET',
        icono: '',                 // ej: 'assets/habilidades/reset.png'
        color: '#88ff88',
        tipo: 'utilidad',
        utilidad: 'reiniciar',
        mana: 0,
        cooldown: 0,
        radio: 0,
        dano: 0
    }
};

// Orden en el que se pintan en el HUD (de arriba abajo).
export const ORDEN_HABILIDADES = ['q', 'w', 'e', 'r'];

// Devuelve la lista ordenada, lista para recorrer. Si algún día una tecla no
// está en ORDEN_HABILIDADES simplemente no se pinta, y al revés se ignora.
export function getHabilidades() {
    return ORDEN_HABILIDADES
        .map(k => (HABILIDADES[k] ? Object.assign({ id: k }, HABILIDADES[k]) : null))
        .filter(Boolean);
}

export function getHabilidad(id) {
    const h = HABILIDADES[id];
    return h ? Object.assign({ id }, h) : null;
}
