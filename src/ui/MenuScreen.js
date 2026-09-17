// =============================================
// PANTALLA DE INICIO - SELECCIÓN DE AXIE
// =============================================

import { getAllAxies } from '../config/axies.js';

export class MenuScreen {
    constructor() {
        this.container = null;
        this.selectedAxie = null;
        this.onStartGame = null;
        this.onSelectAxie = null;
    }

    show(onStartGame, onSelectAxie) {
        this.onStartGame = onStartGame;
        this.onSelectAxie = onSelectAxie;

        this.container = document.createElement('div');
        this.container.id = 'menu-screen';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            element.style.background = `url(${import.meta.env.BASE_URL}assets/Axie%20Legends.jpg) center/cover no-repeat`;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Segoe UI', Arial, sans-serif;
            overflow-y: auto;
            padding: 20px;
            animation: menuFadeIn 0.6s ease-out;
        `;

        // Overlay oscuro
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.40);
            z-index: 1;
        `;
        this.container.appendChild(overlay);

        // Estilos
        const style = document.createElement('style');
        style.textContent = `
            @keyframes menuFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .menu-card { 
                transition: all 0.3s ease; 
                position: relative;
                margin: 0;
                transform: scale(1);
                transform-origin: center center;
                cursor: pointer;
            }
            .menu-card:hover { 
                transform: scale(0.90) !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important; 
            }
            .menu-card.selected { 
                border-color: #ffdd44 !important; 
                box-shadow: 0 0 30px rgba(255,220,68,0.3), 0 4px 20px rgba(0,0,0,0.4) !important;
                transform: scale(0.95) !important;
            }
            .btn-5v5 { 
                cursor: not-allowed !important;
                background: rgba(255,255,255,0.12) !important;
                border: 2px solid rgba(255,255,255,0.25) !important;
                color: rgba(255,255,255,0.8) !important;
                backdrop-filter: blur(8px);
            }
            .btn-5v5:hover { 
                transform: none !important; 
                box-shadow: none !important; 
            }
            .menu-play-btn {
                transition: all 0.3s ease;
            }
            .menu-play-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 0 40px rgba(68,255,136,0.4);
            }
        `;
        document.head.appendChild(style);

        // Contenido (z-index: 2)
        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 1000px;
            margin-top: 100px;
        `;

        // Contenedor de tarjetas
        const selectionContainer = document.createElement('div');
        selectionContainer.style.cssText = `
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 800px;
            margin-bottom: 20px;
        `;

        const axies = getAllAxies();
        axies.forEach((axie, index) => {
            const card = this.createAxieCard(axie, index === 0);
            selectionContainer.appendChild(card);
        });

        content.appendChild(selectionContainer);

        // Botones
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 25px;
            margin-top: 8px;
            flex-wrap: wrap;
            justify-content: center;
        `;

        const btn1v1 = this.createGameButton('1 vs 1', 'Disponible', '#44ff88', () => {
            if (this.selectedAxie) {
                this.hide();
                if (this.onStartGame) {
                    this.onStartGame(this.selectedAxie, '1v1');
                }
            } else {
                this.showToast('⚠️ Selecciona un Axie primero');
            }
        }, false);
        buttonsContainer.appendChild(btn1v1);

        const btn5v5 = this.createGameButton('5 vs 5', 'Próximamente', '#888899', () => {
            this.showToast('🌟 Modo 5 vs 5 en desarrollo... ¡Pronto disponible!');
        }, true);
        buttonsContainer.appendChild(btn5v5);

        content.appendChild(buttonsContainer);

        this.container.appendChild(content);
        document.body.appendChild(this.container);
    }

    createAxieCard(axie, isDefault = false) {
        const card = document.createElement('div');
        card.className = 'menu-card';
        if (isDefault) {
            card.classList.add('selected');
            this.selectedAxie = axie.id;
        }
        card.dataset.axieId = axie.id;

        const emojis = {
            bing: '🐻',
            kibo: '🐱',
            kotaro: '🦊',
            paladill: '🐉',
            pomodoro: '🍅',
            tripp: '🦄',
            xia: '⭐'
        };

        const iconEmoji = emojis[axie.id] || axie.habilidades?.pasiva?.icono || '🐾';

        card.style.cssText = `
            width: 110px;
            padding: 10px 8px;
            background: rgba(255,255,255,0.08);
            border: 2px solid ${isDefault ? '#ffdd44' : 'rgba(255,255,255,0.15)'};
            border-radius: 12px;
            cursor: pointer;
            text-align: center;
            color: #fff;
            backdrop-filter: blur(10px);
            box-shadow: ${isDefault ? '0 0 30px rgba(255,220,68,0.15)' : 'none'};
            transition: all 0.3s ease;
            position: relative;
            margin: 0;
            transform: ${isDefault ? 'scale(0.95)' : 'scale(1)'};
            transform-origin: center center;
        `;

        const icon = document.createElement('div');
        icon.style.cssText = `font-size: 32px; margin-bottom: 2px;`;
        icon.textContent = iconEmoji;

        const name = document.createElement('div');
        name.style.cssText = `
            font-size: 13px;
            font-weight: bold;
            color: ${axie.color || '#ffffff'};
            margin-bottom: 1px;
            text-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;
        name.textContent = axie.nombre;

        const type = document.createElement('div');
        type.style.cssText = `font-size: 10px; color: #88aaff; opacity: 0.5;`;
        type.textContent = axie.id.toUpperCase();

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(type);

        card.addEventListener('click', () => {
            document.querySelectorAll('.menu-card').forEach(c => {
                c.classList.remove('selected');
                c.style.borderColor = 'rgba(255,255,255,0.15)';
                c.style.boxShadow = 'none';
                c.style.transform = 'scale(1)';
                c.style.transition = 'all 0.3s ease';
            });
            card.classList.add('selected');
            card.style.borderColor = '#ffdd44';
            card.style.boxShadow = '0 0 30px rgba(255,220,68,0.3), 0 4px 20px rgba(0,0,0,0.4)';
            card.style.transform = 'scale(0.95)';

            this.selectedAxie = axie.id;

            if (this.onSelectAxie) {
                this.onSelectAxie(axie.id);
            }
        });

        return card;
    }

    createGameButton(label, subLabel, color, onClick, isDisabled = false) {
        const btn = document.createElement('button');
        btn.className = isDisabled ? 'btn-5v5' : 'menu-play-btn';
        
        // 🔹 Si es el botón "5 vs 5", usar estilo más visible
        if (isDisabled) {
            btn.style.cssText = `
                padding: 10px 30px;
                font-size: 18px;
                font-weight: bold;
                background: rgba(255,255,255,0.12);
                color: rgba(255,255,255,0.85);
                border: 2px solid rgba(255,255,255,0.25);
                border-radius: 12px;
                cursor: not-allowed;
                transition: all 0.3s ease;
                font-family: 'Segoe UI', Arial, sans-serif;
                min-width: 140px;
                backdrop-filter: blur(8px);
                box-shadow: 0 0 20px rgba(255,255,255,0.05);
            `;
        } else {
            btn.style.cssText = `
                padding: 10px 30px;
                font-size: 18px;
                font-weight: bold;
                background: linear-gradient(135deg, ${color}, ${color}dd);
                color: #fff;
                border: 2px solid ${color};
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 20px ${color}33;
                font-family: 'Segoe UI', Arial, sans-serif;
                min-width: 140px;
            `;
        }

        if (!isDisabled) {
            btn.onmouseenter = () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = `0 0 40px ${color}55`;
            };
            btn.onmouseleave = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = `0 0 20px ${color}33`;
            };
        }

        const mainText = document.createElement('div');
        mainText.textContent = label;
        mainText.style.fontSize = '18px';
        
        const subText = document.createElement('div');
        subText.textContent = subLabel;
        subText.style.fontSize = '11px';
        subText.style.opacity = '0.6';
        subText.style.marginTop = '1px';
        
        btn.appendChild(mainText);
        btn.appendChild(subText);
        btn.addEventListener('click', onClick);
        return btn;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(0,0,0,0.9);
            color: #ffdd44;
            border: 1px solid #ffdd44;
            border-radius: 10px;
            font-size: 15px;
            font-family: 'Segoe UI', Arial, sans-serif;
            z-index: 3000;
            animation: menuFadeIn 0.3s ease-out;
            box-shadow: 0 0 30px rgba(255,220,68,0.2);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 500);
        }, 3000);
    }

    hide() {
        if (this.container && this.container.parentNode) {
            this.container.style.opacity = '0';
            this.container.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (this.container && this.container.parentNode) {
                    this.container.parentNode.removeChild(this.container);
                }
            }, 500);
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export default MenuScreen;



