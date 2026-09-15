import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MenuScreen } from './ui/MenuScreen.js';
import { getAxieById, getAllAxies } from './config/axies.js';

const CONFIG = {
    gravedad: -20,
    velocidadSalto: 7,
    shadowMapSize: 256,
    pixelRatio: 1.2,
    updateInterval: 1,
    minionLimitZ: 26,
    camaraAngulo: 60,
    camaraDistancia: 20,
    camaraAltura: 16,
    SPAWN_DELAY: 15,
    towerRange: 5,
    towerDamage: 20,
    towerFireRate: 1.5,
    projectileSpeed: 8,
    towerHealth: 500,
    nexusHealth: 1000,
    meleeSpacing: 1.1,
    mageSpacing: 0.9,
    meleeSpeed: 0.48,
    mageSpeed: 0.42,
    axieSpeed: 1.5,
    smoothSpeed: 2.5,
    cameraSmoothSpeed: 3.0,
    attackRange: 4.0,
    attackDamage: 15,
    attackSpeed: 0.7,
    agroRange: 12.0,
    reevaluationTime: 2.0,
    chaseTime: 3.0,
    playerMaxHealth: 200,
    playerMaxMana: 200,
    enemyMaxHealth: 200,
    RESPAWN_TIME: 3.0,
    AXIE_SPAWN_DELAY: 5.0,
    firstWaveGhostDuration: 28,
    SHOP_INTERACTION_DISTANCE: 6.0,
    SHOP_AUTO_OPEN_DISTANCE: 2.5,
    SHOP_POTION_LIMIT: 10,
    AXIE_SPAWN_TIME: 3.0,
    MINION_SPAWN_TIME: 15.0,
    SHOP_AUTO_OPEN_COOLDOWN: 1.5,
    MINION_LANE_LIMIT_X: 2.0,
    MINION_LANE_LIMIT_Z: 24,
    MINION_MAX_Z_ALLY: 16.5,
    MINION_MAX_Z_ENEMY: -16.5,
    AXIE_RETREAT_SAFE_DISTANCE: 1.5,
    AXIE_POTION_USE_THRESHOLD: 0.50,
    AXIE_POTION_BUY_THRESHOLD: 300,
    AXIE_MAX_POTIONS: 10,
    AXIE_POTION_HEAL: 80,
    AXIE_POTION_COST: 50,
    AXIE_RETREAT_MIN_TIME: 1.5,
    AXIE_RETREAT_COOLDOWN: 3.0,
    SPAWN_STAGGER_DELAY: 1.0,
    AXIE_SHOP_DAMAGE_MEMORY: 3.0,
    AXIE_SHOP_HP_MIN: 0.60,
    AXIE_SHOP_CANCEL_HP: 0.50,
    AXIE_SHOP_CANCEL_DAMAGE_MEMORY: 2.0,
    AXIE_SHOP_ENEMY_NEARBY_RADIUS: 6.0,
    MINION_AGGRO_TO_AXIE: 7.0,
    AXIE_AGGRO_TO_PLAYER: 10.0,
    MINION_AGGRO_RANGE: 10.0,
    MINION_AGGRO_RANGE_EXTENDED: 15.0,
    MAX_ITEM_SLOTS: 6,
    POTION_USE_COOLDOWN: 1.5,
    DEPLOY_TRIGGER_DIST: 0.5,
    MINION_TOWER_ATTACK_RANGE: 25,

    // 🔧 FIX: Ruta base de los Axies
    AXIES_BASE_PATH: '/public/assets/axies/',

    MINION_GLB_MAGE_ENEMY: '/public/assets/minions/mage2_bone.glb',
    MINION_GLB_MELEE_ENEMY: null,

    MAGE_GLB_WALK:   '/public/assets/minions/mage2_walk.glb',
    MAGE_GLB_IDLE:   '/public/assets/minions/mage2_idle.glb',
    MAGE_GLB_ATTACK: '/public/assets/minions/mage2_attack.glb',
    MAGE_GLB_STAFF:  '/public/assets/minions/mage2_staff.glb',

    TERRAIN_GLB_LANE: '/public/assets/terrain/carril_1.glb',

    TOWER_GLB_ALLY: '/public/assets/tower/tower1.glb',
    TOWER_GLB_ENEMY: '/public/assets/tower/tower2.glb',
    TOWER_GLB_HEIGHT: 2.8,
    TOWER_GLB_SCALE_ALLY: 1.0,
    TOWER_GLB_SCALE_ENEMY: 1.3,
    TOWER_GLB_ROTATION_Y_ENEMY: Math.PI,
    TOWER_GLB_ROTATION_Y_ALLY: 0,

    NEXUS_GLB_ALLY: '/public/assets/nexus/nexus1.glb',
    NEXUS_GLB_ENEMY: '/public/assets/nexus/nexus2.glb',
    NEXUS_GLB_HEIGHT: 2.3,
    NEXUS_GLB_SCALE_ALLY: 1.0,
    NEXUS_GLB_SCALE_ENEMY: 0.85,
    NEXUS_GLB_ROTATION_Y_ALLY: 0,
    NEXUS_GLB_ROTATION_Y_ENEMY: Math.PI,

    SHOP_GLB_ALLY: '/public/assets/shop/shop1.glb',
    SHOP_GLB_ENEMY: '/public/assets/shop/shop2.glb',
    SHOP_GLB_HEIGHT: 1.3,
    SHOP_GLB_SCALE_ALLY: 1.0,
    SHOP_GLB_SCALE_ENEMY: 1.0,
    SHOP_GLB_ROTATION_Y_ALLY: 0,
    SHOP_GLB_ROTATION_Y_ENEMY: 0,

    MINION_GLB_HEIGHT: 0.45,
    MINION_COLLISION_DISTANCE: 0.75,
};

// 🔧 FIX: Función auxiliar para resolver rutas de Axies
function getAxieModelPath(axieData) {
    if (!axieData) return CONFIG.AXIES_BASE_PATH + 'bing.glb';
    
    // Si el modelo ya viene con ruta completa, usarlo
    if (axieData.modelo && axieData.modelo.startsWith('/')) {
        // 🔧 FIX: Si tiene ruta vieja, redirigir a nueva carpeta
        if (axieData.modelo.includes('/axie-3d-assets/')) {
            const fileName = axieData.modelo.split('/').pop();
            return CONFIG.AXIES_BASE_PATH + fileName;
        }
        return axieData.modelo;
    }
    
    // Si solo viene el nombre, agregar la ruta base
    if (axieData.modelo) {
        return CONFIG.AXIES_BASE_PATH + axieData.modelo;
    }
    
    // Fallback: usar id
    if (axieData.id) {
        return CONFIG.AXIES_BASE_PATH + axieData.id + '.glb';
    }
    
    return CONFIG.AXIES_BASE_PATH + 'bing.glb';
}

function clampMinionToLane(minion) {
    if (!minion || !minion.group) return;
    const limX = CONFIG.MINION_LANE_LIMIT_X;
    const limZ = CONFIG.MINION_LANE_LIMIT_Z;
    
    if (minion.group.position.x > limX) minion.group.position.x = limX;
    else if (minion.group.position.x < -limX) minion.group.position.x = -limX;
    
    if (minion.isEnemy) {
        if (minion.group.position.z < CONFIG.MINION_MAX_Z_ENEMY) {
            minion.group.position.z = CONFIG.MINION_MAX_Z_ENEMY;
        }
        if (minion.group.position.z > limZ) minion.group.position.z = limZ;
    } else {
        if (minion.group.position.z > CONFIG.MINION_MAX_Z_ALLY) {
            minion.group.position.z = CONFIG.MINION_MAX_Z_ALLY;
        }
        if (minion.group.position.z < -limZ) minion.group.position.z = -limZ;
    }
}

const ECONOMY = {
    PLAYER_STARTING_GOLD: 100,
    REWARD_MINION_KILL: 12,
    REWARD_MAGE_KILL: 18,
    REWARD_TOWER_KILL: 60,
    REWARD_ENEMY_AXIE_KILL: 80,
    REWARD_NEXUS_KILL: 0,
    REWARD_WAVE_SURVIVED: 35,
    REWARD_FIRST_BLOOD: 25,
    STREAK_BONUS_PER_KILL: 3,
    STREAK_MAX_BONUS: 30,
    GOLD_POPUP_LIFETIME: 1.2,
    PENALTY_PLAYER_DEATH: 0,
};

const PLAYER_SHOP_CATALOG = {
    potions: {
        hp: { id: 'hp', emoji: '🧪', name: 'Poción de HP', desc: '+50 HP (click en HUD)', color: '#ff6644', cost: 25, max: 10,
            apply: () => { playerHealth = Math.min(playerMaxHealth, playerHealth + 50); updatePlayerHUD(); } },
        mp: { id: 'mp', emoji: '💧', name: 'Poción de MP', desc: '+50 MP (click en HUD)', color: '#44aaff', cost: 20, max: 10,
            apply: () => { playerMana = Math.min(playerMaxMana, playerMana + 50); updatePlayerHUD(); } }
    },
    items: {
        botas:  { id: 'botas',  emoji: '👢', name: 'Botas',  desc: '+10% velocidad',      color: '#88ff88', cost: 80,  apply: () => { playerSpeed *= 1.10; } },
        espada: { id: 'espada', emoji: '⚔️', name: 'Espada', desc: '+15% daño',           color: '#ff8844', cost: 100, apply: () => { attackDamage = Math.round(attackDamage * 1.15); } },
        arco:   { id: 'arco',   emoji: '🏹', name: 'Arco',   desc: '+12% vel. ataque',    color: '#ffaa44', cost: 90,  apply: () => { attackSpeed = Math.max(0.2, attackSpeed * 0.88); } },
        baculo: { id: 'baculo', emoji: '🔮', name: 'Báculo', desc: '+0.5 rango',          color: '#aa88ff', cost: 110, apply: () => { attackRange += 0.5; } },
        daga:   { id: 'daga',   emoji: '🗡️', name: 'Daga',   desc: '+10% vel, +8% daño', color: '#ff4488', cost: 95,  apply: () => { playerSpeed *= 1.10; attackDamage = Math.round(attackDamage * 1.08); } }
    }
};

let playerGold = 0;
let playerKillStreak = 0;
let playerFirstBlood = false;
let playerItemSlots = [null, null, null, null, null, null];
let playerDeathCount = 0;
const PLAYER_DEATH_PENALTIES = [3, 6, 9];

if (!document.getElementById('gold-popup-styles')) {
    const style = document.createElement('style');
    style.id = 'gold-popup-styles';
    style.textContent = `
        @keyframes goldPopupFloat {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -70%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -150%) scale(1); }
        }
    `;
    document.head.appendChild(style);
}

let GROUND_Y = -0.35;
let LANE_TOP_Y = -0.35;
let groundReady = false;

function suavizarYEntidades(delta) {
    if (!groundReady) return;
    const factor = Math.min(1, 6 * delta);
    const allEntities = [...aliados, ...enemigos, ...towers, nexusAliado, nexusEnemigo, shopAliada, shopEnemiga].filter(e => e && e.group && !e.isDead);
    for (const entity of allEntities) {
        const diff = GROUND_Y - entity.group.position.y;
        if (Math.abs(diff) > 0.001) entity.group.position.y += diff * factor;
        else entity.group.position.y = GROUND_Y;
    }
    if (playerModel && !isPlayerDead && smoothPlayerPos && playerSpawned) {
        smoothPlayerPos.y = GROUND_Y;
        playerModel.position.y = GROUND_Y;
    }
}

let playerHealth = CONFIG.playerMaxHealth;
let playerMaxHealth = CONFIG.playerMaxHealth;
let playerMana = CONFIG.playerMaxMana;
let playerMaxMana = CONFIG.playerMaxMana;
let isPlayerDead = false;
let playerRespawnTimer = 0;
let playerAttackTarget = null;
let playerSpawned = false;
let gameTime = 0;
let isFirstWave = true;
let firstWaveTimer = 0;
let gameFinished = false;
let victoryScreen = null;
let defeatScreen = null;
let gamePaused = false;
let pauseMenu = null;
let selectedAxieId = 'bestia';
let axieLoaded = false;
let currentAxieName = 'Bing';

let potionHPCount = 0;
let potionMPCount = 0;
let potionUseCooldown = 0;

let isAutoWalkingToShop = false;
let autoWalkShopTarget = null;

const factionFocusTarget = {
    ally: { target: null, count: 0, timestamp: 0 },
    enemy: { target: null, count: 0, timestamp: 0 }
};
const FOCUS_FIRE_MAX = 4;

function registerFactionAttack(faction, target) {
    const focus = factionFocusTarget[faction];
    if (!target) return;
    if (focus.target === target) focus.count++;
    else { focus.target = target; focus.count = 1; }
    focus.timestamp = gameTime;
}

function getFactionFocusCount(faction, target) {
    const focus = factionFocusTarget[faction];
    if (focus.target !== target) return 0;
    if (gameTime - focus.timestamp > 3.0) { focus.count = 0; return 0; }
    return focus.count;
}

let isAITrainingMode = false;
let aiTrainingMatches = 0;
let aiTrainingStartTime = 0;
let aiTrainingAutoRestartTimer = 0;
let aiTrainingIsRestarting = false;
let playerAITarget = null;
let playerAITargetTimer = 0;

let dynamicCameraTarget = null;
let dynamicCameraTimer = 0;
let dynamicCameraMode = 'player';
let dynamicCameraSmoothPos = new THREE.Vector3(0, 0, 0);
let dynamicCameraSmoothTarget = new THREE.Vector3(0, 0, 0);
let dynamicCameraInitialized = false;
let dynamicCameraLastSwitch = 0;
const DYNAMIC_CAMERA_PLAYER_DURATION = [10, 18];
const DYNAMIC_CAMERA_ENEMY_DURATION = [10, 18];
const DYNAMIC_CAMERA_IDLE_DURATION = [4, 8];
const DYNAMIC_CAMERA_MIN_HOLD = 8;

let playerAIGold = 0;
let playerAIItems = {};
let playerAIBonuses = { speedMultiplier: 1.0, damageMultiplier: 1.0, attackSpeedMultiplier: 1.0, rangeBonus: 0, critChance: 0 };
let playerAIShopCooldown = 0;
let playerAIShopUses = 0;
const PLAYER_AI_SHOP_COOLDOWN = 8.0;
const PLAYER_AI_SHOP_MAX_USES = 3;
let playerAIIsShopping = false;
let playerAIShopInteractionTimer = 0;

const PLAYER_GOLD_PER_MINION_KILL = 15;
const PLAYER_GOLD_PER_ENEMY_AXIE_KILL = 50;
const PLAYER_GOLD_PER_TOWER_KILL = 80;
const PLAYER_GOLD_PER_NEXUS_KILL = 150;
const PLAYER_GOLD_PASSIVE_PER_WAVE = 25;

let enemyAxieLastDamageTime = -999;
let enemyAxieRetreatTimer = 0;
let enemyAxieIsRetreating = false;
let enemyAxieRetreatCooldown = 0;
const ENEMY_AXIE_RETREAT_DURATION = 2.5;
const ENEMY_AXIE_DAMAGE_MEMORY = 2.0;
const ENEMY_AXIE_RETREAT_TOWER_RANGE = 6.5;

let playerAILastDamageTime = -999;
let playerAIRetreatTimer = 0;
let playerAIIsRetreating = false;
let playerAIRetreatCooldown = 0;
const PLAYER_AI_RETREAT_DURATION = 2.5;
const PLAYER_AI_DAMAGE_MEMORY = 2.0;
const PLAYER_AI_RETREAT_TOWER_RANGE = 6.5;

const factionBrain = {
    ally: { weights: { aggression: 1.0, caution: 1.0, focusPlayer: 1.0, focusMinions: 1.0, focusStructure: 1.0, groupBehavior: 1.0 }, stats: { wavesWon: 0, wavesLost: 0, totalKills: 0, totalDeaths: 0 } },
    enemy: { weights: { aggression: 1.0, caution: 1.0, focusPlayer: 1.0, focusMinions: 1.0, focusStructure: 1.0, groupBehavior: 1.0 }, stats: { wavesWon: 0, wavesLost: 0, totalKills: 0, totalDeaths: 0 } }
};

const enemyAxieBrain = {
    weights: { aggression: 1.0, caution: 1.0, focusPlayer: 1.0, focusMinions: 1.0, focusStructure: 1.0, kiting: 1.0, retreatHP: 0.3, shopPriority: 1.0 },
    stats: {
        kills: 0, deaths: 0, damageDealt: 0, damageTaken: 0,
        timesRetreated: 0, timesKilledPlayer: 0, timesKilledByPlayer: 0, timesKilledByTower: 0,
        timesUsedShop: 0, itemsPurchased: 0, goldEarned: 0,
        _shopLogged: false, _retreatLogged: false, _lastTargetType: null, _forcedPlayerTarget: null,
    }
};

const ENEMY_AXIE_ITEM_CATALOG = {
    botas: { emoji: '👢', name: 'Botas', cost: 30, maxStack: 2, apply: (b) => { b.speedMultiplier += 0.15; }, desc: '+15% velocidad' },
    espada: { emoji: '⚔️', name: 'Espada', cost: 40, maxStack: 3, apply: (b) => { b.damageMultiplier += 0.20; }, desc: '+20% daño' },
    arco: { emoji: '🏹', name: 'Arco', cost: 35, maxStack: 2, apply: (b) => { b.attackSpeedMultiplier += 0.15; }, desc: '+15% vel. ataque' },
    baculo: { emoji: '🔮', name: 'Báculo', cost: 45, maxStack: 2, apply: (b) => { b.rangeBonus += 0.5; b.damageMultiplier += 0.05; }, desc: '+0.5 rango, +5% daño' },
    daga: { emoji: '🗡️', name: 'Daga', cost: 35, maxStack: 2, apply: (b) => { b.critChance += 0.15; }, desc: '+15% crítico' }
};

let enemyAxiePotionCount = 0;
let enemyAxiePotionCooldown = 0;
const ENEMY_AXIE_POTION_COOLDOWN = 1.5;

let playerAIPotionCount = 0;
let playerAIPotionCooldown = 0;
const PLAYER_AI_POTION_COOLDOWN = 1.5;

const spawnQueue = [];
let spawnQueueTimer = 0;

function clampWeights(weights) {
    for (const key in weights) {
        if (key === 'retreatHP') weights[key] = Math.max(0.1, Math.min(0.6, weights[key]));
        else weights[key] = Math.max(0.3, Math.min(2.5, weights[key]));
    }
}

function saveBrains() {
    try {
        localStorage.setItem('axie_factionBrain', JSON.stringify(factionBrain));
        localStorage.setItem('axie_enemyAxieBrain', JSON.stringify(enemyAxieBrain));
    } catch (e) {}
}

function loadBrains() {
    try {
        const fb = localStorage.getItem('axie_factionBrain');
        const eb = localStorage.getItem('axie_enemyAxieBrain');
        if (fb) {
            const p = JSON.parse(fb);
            Object.assign(factionBrain.ally.weights, p.ally?.weights || {});
            Object.assign(factionBrain.enemy.weights, p.enemy?.weights || {});
            Object.assign(factionBrain.ally.stats, p.ally?.stats || {});
            Object.assign(factionBrain.enemy.stats, p.enemy?.stats || {});
        }
        if (eb) {
            const p = JSON.parse(eb);
            Object.assign(enemyAxieBrain.weights, p.weights || {});
            Object.assign(enemyAxieBrain.stats, p.stats || {});
        }
        if (factionBrain.ally.weights.aggression < 1.2) applyFactoryBoost();
        console.log('🧠 Brains cargados');
    } catch (e) {}
}

function applyFactoryBoost() {
    const ally = factionBrain.ally.weights;
    const enemy = factionBrain.enemy.weights;
    ally.aggression = Math.max(ally.aggression, 1.3);
    ally.focusStructure = Math.max(ally.focusStructure, 1.3);
    enemy.aggression = Math.max(enemy.aggression, 1.3);
    enemy.focusStructure = Math.max(enemy.focusStructure, 1.3);
    clampWeights(ally);
    clampWeights(enemy);
}

window.resetBrains = function() {
    localStorage.removeItem('axie_factionBrain');
    localStorage.removeItem('axie_enemyAxieBrain');
    localStorage.removeItem('axie_ai_training_stats');
    console.log('🧠 Brains reseteados');
};

window.showBrains = function() {
    console.log('🧠 ALIADA:', factionBrain.ally.weights);
    console.log('🧠 ENEMIGA:', factionBrain.enemy.weights);
    console.log('🤖 AXIE ENEMIGO:', enemyAxieBrain.weights);
    console.log('💰 Oro jugador:', playerGold, playerItemSlots);
    console.log('💰 Jugador-IA:', playerAIGold, playerAIItems);
    console.log('💰 Axie Enemigo:', enemyAxieGold, enemyAxieItems);
};

function givePlayerGold(baseAmount, reason = '') {
    if (isAITrainingMode) return;
    const streakBonus = Math.min(playerKillStreak * ECONOMY.STREAK_BONUS_PER_KILL, ECONOMY.STREAK_MAX_BONUS);
    const total = baseAmount + streakBonus;
    playerGold += total;
    if (reason) console.log(`💰 +${total} oro (${reason})${streakBonus > 0 ? ` [racha +${streakBonus}]` : ''} | Total: ${playerGold}`);
    updatePlayerGoldHUD();
}

function spendPlayerGold(amount) {
    if (playerGold < amount) return false;
    playerGold -= amount;
    updatePlayerGoldHUD();
    return true;
}

function resetPlayerEconomy() {
    playerGold = ECONOMY.PLAYER_STARTING_GOLD;
    playerKillStreak = 0;
    playerFirstBlood = false;
    playerItemSlots = [null, null, null, null, null, null];
    potionHPCount = 0;
    potionMPCount = 0;
    potionUseCooldown = 0;
    updatePlayerGoldHUD();
}

function updatePlayerGoldHUD() {
    const el = document.getElementById('player-gold-display');
    if (!el) return;
    if (isAITrainingMode) {
        el.textContent = `🦊 💰 ${playerAIGold}  |  🤖 💰 ${enemyAxieGold}`;
    } else {
        el.textContent = `💰 ${playerGold}`;
    }
}

function showGoldPopup(amount, sx, sy, color = '#ffcc44') {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed; left: ${sx}px; top: ${sy}px;
        color: ${color}; font-family: 'Courier New', monospace;
        font-size: 20px; font-weight: bold;
        text-shadow: 0 0 10px ${color}, 2px 2px 0 #000;
        pointer-events: none; z-index: 9999;
        transform: translate(-50%, -50%);
        animation: goldPopupFloat ${ECONOMY.GOLD_POPUP_LIFETIME}s ease-out forwards;
    `;
    popup.textContent = `+${amount} 💰`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), ECONOMY.GOLD_POPUP_LIFETIME * 1000);
}

function showGoldPopupAt3D(amount, worldPos, color = '#ffcc44') {
    if (!worldPos) return;
    try {
        const v = worldPos.clone();
        v.project(camera);
        const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
        if (sx < 0 || sx > window.innerWidth || sy < 0 || sy > window.innerHeight) return;
        showGoldPopup(amount, sx, sy, color);
    } catch (e) {}
}

const healthBarCache = new Map();
function getHealthBarTexture(segments, visibleSegments, isEnemy) {
    const key = `${segments}-${visibleSegments}-${isEnemy}`;
    if (healthBarCache.has(key)) return healthBarCache.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 20;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 128, 20);
    ctx.strokeStyle = '#fff'; ctx.strokeRect(0, 0, 128, 20);
    const sw = 124 / segments;
    const colors = isEnemy ? ['#ff4444', '#ff6666'] : ['#4488ff', '#66aaff'];
    for (let i = 0; i < visibleSegments; i++) {
        ctx.fillStyle = i % 2 === 0 ? colors[0] : colors[1];
        ctx.fillRect(2 + i * sw, 2, sw - 1, 16);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    healthBarCache.set(key, tex);
    return tex;
}

function createHealthBar(segments = 10, isEnemy = false) {
    const texture = getHealthBarTexture(segments, segments, isEnemy);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.2, 0.2, 1);
    sprite.renderOrder = 999;
    return { sprite, spriteMat };
}

function updateHealthBarSprite(spriteMat, segments, visibleSegments, isEnemy) {
    spriteMat.map = getHealthBarTexture(segments, visibleSegments, isEnemy);
    spriteMat.needsUpdate = true;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.Fog(0x0a0a1a, 35, 55);

const frustumSize = 8.0;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-frustumSize * aspect / 2, frustumSize * aspect / 2, frustumSize / 2, -frustumSize / 2, 0.1, 100);
camera.zoom = 1.0;

const CAMERA_ANGLE_RAD = CONFIG.camaraAngulo * Math.PI / 180;
const CAMERA_OFFSET = new THREE.Vector3(
    Math.sin(CAMERA_ANGLE_RAD) * CONFIG.camaraDistancia,
    CONFIG.camaraAltura,
    Math.cos(CAMERA_ANGLE_RAD) * CONFIG.camaraDistancia
);

const cameraSmoothPos = new THREE.Vector3(0, 0, 0);
const cameraSmoothTarget = new THREE.Vector3(0, 0, 0);
let CAMERA_FIXED_Y = 0;
let CAMERA_FIXED_TARGET_Y = 0;
let camaraInicializada = false;

function inicializarCamaraFija() {
    if (!groundReady) return;
    CAMERA_FIXED_Y = GROUND_Y + CAMERA_OFFSET.y;
    CAMERA_FIXED_TARGET_Y = GROUND_Y;
    const px = playerModel ? playerModel.position.x : 0;
    const pz = playerModel ? playerModel.position.z : 0;
    cameraSmoothPos.set(px + CAMERA_OFFSET.x, CAMERA_FIXED_Y, pz + CAMERA_OFFSET.z);
    cameraSmoothTarget.set(px, CAMERA_FIXED_TARGET_Y, pz);
    camera.position.copy(cameraSmoothPos);
    camera.lookAt(cameraSmoothTarget);
    camera.updateProjectionMatrix();
    camaraInicializada = true;
}

function updateCameraPosition() {
    if (!playerModel || !camaraInicializada) return;
    const targetX = playerModel.position.x;
    const targetZ = playerModel.position.z;
    const sf = 1 - Math.exp(-CONFIG.cameraSmoothSpeed * 0.016);
    cameraSmoothPos.x = THREE.MathUtils.lerp(cameraSmoothPos.x, targetX + CAMERA_OFFSET.x, sf);
    cameraSmoothPos.z = THREE.MathUtils.lerp(cameraSmoothPos.z, targetZ + CAMERA_OFFSET.z, sf);
    cameraSmoothPos.y = CAMERA_FIXED_Y;
    cameraSmoothTarget.x = THREE.MathUtils.lerp(cameraSmoothTarget.x, targetX, sf);
    cameraSmoothTarget.z = THREE.MathUtils.lerp(cameraSmoothTarget.z, targetZ, sf);
    cameraSmoothTarget.y = CAMERA_FIXED_TARGET_Y;
    camera.position.copy(cameraSmoothPos);
    camera.lookAt(cameraSmoothTarget);
    camera.position.y = CAMERA_FIXED_Y;
    camera.updateMatrixWorld(true);
}

function chooseNewDynamicCameraTarget() {
    const otherMode = dynamicCameraMode === 'player' ? 'enemy' : 'player';
    let chosenMode = 'player';
    if (otherMode === 'enemy' && enemyAxieModel && !enemyAxieIsDead) chosenMode = 'enemy';
    else if (otherMode === 'player' && playerModel && !isPlayerDead) chosenMode = 'player';
    else if (playerModel && !isPlayerDead) chosenMode = 'player';
    else if (enemyAxieModel && !enemyAxieIsDead) chosenMode = 'enemy';
    else chosenMode = 'idle';
    dynamicCameraMode = chosenMode;
    dynamicCameraLastSwitch = gameTime;
    if (chosenMode === 'player') {
        const r = DYNAMIC_CAMERA_PLAYER_DURATION;
        dynamicCameraTimer = r[0] + Math.random() * (r[1] - r[0]);
        dynamicCameraTarget = playerModel.position.clone();
    } else if (chosenMode === 'enemy') {
        const r = DYNAMIC_CAMERA_ENEMY_DURATION;
        dynamicCameraTimer = r[0] + Math.random() * (r[1] - r[0]);
        dynamicCameraTarget = enemyAxieModel.position.clone();
    } else {
        const r = DYNAMIC_CAMERA_IDLE_DURATION;
        dynamicCameraTimer = r[0] + Math.random() * (r[1] - r[0]);
        dynamicCameraTarget = new THREE.Vector3(0, GROUND_Y, 0);
    }
}

function updateDynamicCamera(delta) {
    if (!isAITrainingMode || !camaraInicializada) return;
    dynamicCameraTimer -= delta;
    const currentUnavailable = 
        (dynamicCameraMode === 'player' && (!playerModel || isPlayerDead)) ||
        (dynamicCameraMode === 'enemy' && (!enemyAxieModel || enemyAxieIsDead));
    const minHoldElapsed = (gameTime - dynamicCameraLastSwitch) >= DYNAMIC_CAMERA_MIN_HOLD;
    if (dynamicCameraTimer <= 0 || currentUnavailable) {
        if (minHoldElapsed || currentUnavailable) chooseNewDynamicCameraTarget();
        else dynamicCameraTimer = DYNAMIC_CAMERA_MIN_HOLD - (gameTime - dynamicCameraLastSwitch);
    }
    if (dynamicCameraMode === 'player' && playerModel && !isPlayerDead) {
        dynamicCameraTarget.copy(playerModel.position);
    } else if (dynamicCameraMode === 'enemy' && enemyAxieModel && !enemyAxieIsDead) {
        dynamicCameraTarget.copy(enemyAxieModel.position);
    }
    const sf = 1 - Math.exp(-0.9 * delta);
    cameraSmoothPos.x += (dynamicCameraTarget.x + CAMERA_OFFSET.x - cameraSmoothPos.x) * sf;
    cameraSmoothPos.z += (dynamicCameraTarget.z + CAMERA_OFFSET.z - cameraSmoothPos.z) * sf;
    cameraSmoothPos.y = CAMERA_FIXED_Y;
    cameraSmoothTarget.x += (dynamicCameraTarget.x - cameraSmoothTarget.x) * sf;
    cameraSmoothTarget.z += (dynamicCameraTarget.z - cameraSmoothTarget.z) * sf;
    cameraSmoothTarget.y = CAMERA_FIXED_TARGET_Y;
    camera.position.copy(cameraSmoothPos);
    camera.lookAt(cameraSmoothTarget);
    camera.position.y = CAMERA_FIXED_Y;
    camera.updateMatrixWorld(true);
}

function resetDynamicCamera() {
    dynamicCameraTarget = null;
    dynamicCameraTimer = 0;
    dynamicCameraMode = 'player';
    dynamicCameraInitialized = false;
    dynamicCameraLastSwitch = 0;
}

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.pixelRatio));
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.style.display = 'none';
document.body.prepend(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
const roomEnv = new RoomEnvironment();
const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
scene.environment = envTexture;

scene.add(new THREE.AmbientLight(0x303048, 0.7));
const mainLight = new THREE.DirectionalLight(0xffeedd, 1.4);
mainLight.position.set(15, 25, 10);
scene.add(mainLight);
const fillLight = new THREE.DirectionalLight(0x4488ff, 0.2);
fillLight.position.set(-10, 10, -10);
scene.add(fillLight);

const laneLoader = new GLTFLoader();
const LANE_PATH = CONFIG.TERRAIN_GLB_LANE;
const LANE_TARGET_WIDTH = 10;
const LANE_TARGET_LENGTH = 52;
const LANE_OVERLAP = 1.0;
const LANE_TARGET_LENGTH_EACH = LANE_TARGET_LENGTH / 2 + LANE_OVERLAP / 2;

let lanesCargados = 0;
const lanesData = [];

function cargarLanePart(index) {
    laneLoader.load(LANE_PATH, (gltf) => {
        const laneModel = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(laneModel);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);
        lanesData.push({ index, model: laneModel, size, center });
        lanesCargados++;
        if (lanesCargados >= 2) procesarLanes();
    }, undefined, (err) => console.error(`❌ Carril ${index + 1}:`, err));
}

function procesarLanes() {
    const dims = [
        { axis: 'x', value: lanesData[0].size.x },
        { axis: 'y', value: lanesData[0].size.y },
        { axis: 'z', value: lanesData[0].size.z },
    ].sort((a, b) => b.value - a.value);

    const largoAxis = dims[0].axis;
    const anchoAxis = dims[1].axis;
    const altoAxis = dims[2].axis;

    const scaleLargo = LANE_TARGET_LENGTH_EACH / dims[0].value;
    const scaleAncho = LANE_TARGET_WIDTH / dims[1].value;
    const scaleAlto = (scaleLargo + scaleAncho) / 4;

    const scaleMap = { x: 1, y: 1, z: 1 };
    scaleMap[largoAxis] = scaleLargo;
    scaleMap[anchoAxis] = scaleAncho;
    scaleMap[altoAxis] = scaleAlto;

    const rotacionY = (largoAxis === 'x') ? Math.PI / 2 : 0;
    const rotacionX = (largoAxis === 'y') ? -Math.PI / 2 : 0;

    let maxTopY = -Infinity;

    lanesData.forEach((data, idx) => {
        const m = data.model;
        m.scale.set(scaleMap.x, scaleMap.y, scaleMap.z);
        if (rotacionY) m.rotation.y = rotacionY;
        if (rotacionX) m.rotation.x = rotacionX;
        const bbox = new THREE.Box3().setFromObject(m);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        const halfLength = LANE_TARGET_LENGTH_EACH / 2;
        const targetCenterZ = (idx === 0) ? -(halfLength - LANE_OVERLAP / 2) : (halfLength - LANE_OVERLAP / 2);
        m.position.x -= center.x;
        m.position.z += targetCenterZ - center.z;
        m.position.y = -0.44 - bbox.min.y;
        m.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = false;
                node.receiveShadow = false;
                if (node.material) {
                    const mats = Array.isArray(node.material) ? node.material : [node.material];
                    mats.forEach(mat => {
                        if ('roughness' in mat) mat.roughness = 0.95;
                        if ('metalness' in mat) mat.metalness = 0.0;
                        if ('envMapIntensity' in mat) mat.envMapIntensity = 0.5;
                        mat.needsUpdate = true;
                    });
                }
            }
        });
        scene.add(m);
        const bboxFinal = new THREE.Box3().setFromObject(m);
        if (bboxFinal.max.y > maxTopY) maxTopY = bboxFinal.max.y;
    });

    LANE_TOP_Y = maxTopY;
    GROUND_Y = maxTopY - 0.12;
    groundReady = true;
    console.log(`✅ GROUND_Y = ${GROUND_Y.toFixed(3)}`);

    if (!nexusAliado) nexusAliado = new Nexus(2.0, -21, false);
    if (!nexusEnemigo) nexusEnemigo = new Nexus(-1.2, 21, true);
    if (!shopAliada) shopAliada = new Shop(-2.5, -22, false);
    if (!shopEnemiga) shopEnemiga = new Shop(2.5, 22, true);
    if (towers.length === 0) {
        createTower(-2.5, -18, false, 1);
        createTower(-2.5, -6, false, 2);
        createTower(4.0, 18, true, 1);
        createTower(4.0, 6, true, 2);
    }
    inicializarCamaraFija();
}

let nexusAliado = null;
let nexusEnemigo = null;
let shopAliada = null;
let shopEnemiga = null;

cargarLanePart(0);
cargarLanePart(1);

class Nexus {
    constructor(x, z, isEnemy = false) {
        this.isEnemy = isEnemy;
        this.maxHealth = CONFIG.nexusHealth;
        this.health = this.maxHealth;
        this.isDead = false;
        this.segments = 10;
        this.type = 'nexus';
        this.explosionParticles = [];
        this.isExploding = false;
        const color = isEnemy ? 0x882222 : 0x224488;
        const emissiveColor = isEnemy ? 0xff4444 : 0x4488ff;
        const targetHeight = isEnemy ? CONFIG.NEXUS_GLB_HEIGHT * CONFIG.NEXUS_GLB_SCALE_ENEMY : CONFIG.NEXUS_GLB_HEIGHT * CONFIG.NEXUS_GLB_SCALE_ALLY;
        this.group = new THREE.Group();
        this.group.userData.targetRef = this;
        const useGLB = isEnemy ? !!CONFIG.NEXUS_GLB_ENEMY : !!CONFIG.NEXUS_GLB_ALLY;
        if (useGLB) this.loadNexusGLB(isEnemy);
        else this.buildProceduralNexus(isEnemy, color, emissiveColor);
        const hb = createHealthBar(this.segments, this.isEnemy);
        hb.sprite.position.y = targetHeight + 0.5;
        this.group.add(hb.sprite);
        this.spriteMat = hb.spriteMat;
        this.group.position.set(x, GROUND_Y, z);
        scene.add(this.group);
        this.position = new THREE.Vector3(x, 0, z);
    }

    loadNexusGLB(isEnemy) {
        const loader = new GLTFLoader();
        const path = isEnemy ? CONFIG.NEXUS_GLB_ENEMY : CONFIG.NEXUS_GLB_ALLY;
        const rY = isEnemy ? CONFIG.NEXUS_GLB_ROTATION_Y_ENEMY : CONFIG.NEXUS_GLB_ROTATION_Y_ALLY;
        const eq = isEnemy ? CONFIG.NEXUS_GLB_SCALE_ENEMY : CONFIG.NEXUS_GLB_SCALE_ALLY;
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const curH = size.y > 0.0001 ? size.y : 1;
            const sf = (CONFIG.NEXUS_GLB_HEIGHT / curH) * eq;
            model.scale.setScalar(sf);
            const bbox2 = new THREE.Box3().setFromObject(model);
            model.position.y = -bbox2.min.y;
            model.position.x = -(bbox2.min.x + bbox2.max.x) / 2;
            model.position.z = -(bbox2.min.z + bbox2.max.z) / 2;
            model.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; n.userData.targetRef = this; } });
            model.rotation.y = rY;
            this.group.add(model);
        }, undefined, () => this.buildProceduralNexus(isEnemy, isEnemy ? 0x882222 : 0x224488, isEnemy ? 0xff4444 : 0x4488ff));
    }

    buildProceduralNexus(isEnemy, color, emissiveColor) {
        const baseGeo = new THREE.CylinderGeometry(1.8, 2.1, 0.35, 24);
        const baseMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.userData.targetRef = this;
        this.group.add(base);
        const nexusGeo = new THREE.SphereGeometry(0.9, 24, 24);
        const nexusMat = new THREE.MeshStandardMaterial({ color: emissiveColor, emissive: emissiveColor, emissiveIntensity: 0.8, transparent: true, opacity: 0.85 });
        const nexusMesh = new THREE.Mesh(nexusGeo, nexusMat);
        nexusMesh.position.y = 1.0;
        nexusMesh.userData.targetRef = this;
        this.group.add(nexusMesh);
    }

    updateHealthBar() {
        const hp = this.health / this.maxHealth;
        const vis = Math.max(0, Math.min(this.segments, Math.ceil(hp * this.segments)));
        updateHealthBarSprite(this.spriteMat, this.segments, vis, this.isEnemy);
    }

    takeDamage(damage) {
        if (this.isDead) return;
        this.health -= damage;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.startExplosion();
            console.log(`💀 NEXO ${this.isEnemy ? 'ENEMIGO' : 'ALIADO'} DESTRUIDO!`);
            if (this.isEnemy) showVictoryScreen();
            else showDefeatScreen();
        }
    }

    startExplosion() {
        if (this.isExploding) return;
        this.isExploding = true;
        this.group.visible = false;
        const pos = this.group.position.clone();
        pos.y = 1.0;
        for (let i = 0; i < 50; i++) {
            const geo = new THREE.SphereGeometry(0.2, 6, 6);
            const mat = new THREE.MeshBasicMaterial({ color: [0xff4444, 0xff8800, 0xffff00][Math.floor(Math.random() * 3)], transparent: true, opacity: 0.8 });
            const p = new THREE.Mesh(geo, mat);
            p.position.copy(pos);
            p.userData.vel = new THREE.Vector3((Math.random() - 0.5) * 8, Math.random() * 6, (Math.random() - 0.5) * 8);
            p.userData.life = 1.5 + Math.random() * 1.5;
            p.userData.maxLife = p.userData.life;
            scene.add(p);
            this.explosionParticles.push(p);
        }
    }

    updateExplosion(delta) {
        if (!this.isExploding) return;
        for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
            const p = this.explosionParticles[i];
            p.userData.life -= delta;
            if (p.userData.life <= 0) { scene.remove(p); this.explosionParticles.splice(i, 1); continue; }
            const ratio = p.userData.life / p.userData.maxLife;
            p.position.x += p.userData.vel.x * delta;
            p.position.y += p.userData.vel.y * delta;
            p.position.z += p.userData.vel.z * delta;
            p.userData.vel.y -= 2 * delta;
            p.material.opacity = ratio * 0.8;
        }
    }

    die() { this.takeDamage(this.health); }
}

let shopUI = null;
let shopOpen = false;
let shopActiveTab = 'potions';
let shopAutoOpenCooldown = 0;

class Shop {
    constructor(x, z, isEnemy = false) {
        this.isEnemy = isEnemy;
        this.x = x;
        this.z = z;
        this.group = new THREE.Group();
        this.group.position.set(x, GROUND_Y, z);
        this.type = 'shop';
        this.isEnemyShop = isEnemy;
        this.group.rotation.y = isEnemy ? Math.PI : 0;
        const useGLB = isEnemy ? !!CONFIG.SHOP_GLB_ENEMY : !!CONFIG.SHOP_GLB_ALLY;
        if (useGLB) this.loadShopGLB(isEnemy);
        else this.buildProceduralShop(isEnemy);
        scene.add(this.group);
    }

    loadShopGLB(isEnemy) {
        const loader = new GLTFLoader();
        const path = isEnemy ? CONFIG.SHOP_GLB_ENEMY : CONFIG.SHOP_GLB_ALLY;
        const rY = isEnemy ? CONFIG.SHOP_GLB_ROTATION_Y_ENEMY : CONFIG.SHOP_GLB_ROTATION_Y_ALLY;
        const eq = isEnemy ? CONFIG.SHOP_GLB_SCALE_ENEMY : CONFIG.SHOP_GLB_SCALE_ALLY;
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const curH = size.y > 0.0001 ? size.y : 1;
            const sf = (CONFIG.SHOP_GLB_HEIGHT / curH) * eq;
            model.scale.setScalar(sf);
            const bbox2 = new THREE.Box3().setFromObject(model);
            model.position.y = -bbox2.min.y;
            model.position.x = -(bbox2.min.x + bbox2.max.x) / 2;
            model.position.z = -(bbox2.min.z + bbox2.max.z) / 2;
            model.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; n.userData.shopRef = this; } });
            model.rotation.y = rY;
            this.group.add(model);
        }, undefined, () => this.buildProceduralShop(isEnemy));
    }

    buildProceduralShop(isEnemy) {
        const baseGeo = new THREE.CylinderGeometry(1.0, 1.3, 0.25, 20);
        const baseMat = new THREE.MeshStandardMaterial({ color: isEnemy ? 0x882222 : 0x224488, roughness: 0.3, metalness: 0.5 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.userData.shopRef = this;
        this.group.add(base);
    }

    update() {}
}

function createShopUI() {
    if (shopUI) shopUI.remove();
    shopUI = document.createElement('div');
    shopUI.id = 'shop-ui';
    shopUI.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 600px; max-height: 70vh; background: rgba(0,0,0,0.95);
        border: 3px solid rgba(255,200,50,0.6); border-radius: 16px;
        z-index: 2000; color: #fff; display: none; flex-direction: column;
    `;
    const header = document.createElement('div');
    header.style.cssText = `display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:rgba(255,200,50,0.1);border-bottom:2px solid rgba(255,200,50,0.3);border-radius:13px 13px 0 0;`;
    header.innerHTML = `<div style="font-size:24px;font-weight:bold;color:#ffcc44;letter-spacing:3px;">🏪 TIENDA</div>`;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `background:rgba(255,68,68,0.2);border:2px solid rgba(255,68,68,0.6);color:#ff4444;font-size:20px;font-weight:bold;width:36px;height:36px;border-radius:8px;cursor:pointer;`;
    closeBtn.onclick = () => closeShop();
    header.appendChild(closeBtn);
    shopUI.appendChild(header);

    const tabs = document.createElement('div');
    tabs.style.cssText = `display:flex;gap:5px;padding:10px 20px;background:rgba(0,0,0,0.5);`;
    const potionsTab = document.createElement('button');
    potionsTab.textContent = '🧪 Pociones';
    potionsTab.dataset.tab = 'potions';
    potionsTab.className = 'shop-tab active';
    potionsTab.style.cssText = `flex:1;padding:12px;background:rgba(68,255,136,0.2);border:2px solid rgba(68,255,136,0.6);color:#44ff88;font-size:16px;font-weight:bold;border-radius:8px;cursor:pointer;`;
    potionsTab.onclick = () => switchTab('potions');
    tabs.appendChild(potionsTab);
    const itemsTab = document.createElement('button');
    itemsTab.textContent = '⚔️ Items';
    itemsTab.dataset.tab = 'items';
    itemsTab.className = 'shop-tab';
    itemsTab.style.cssText = `flex:1;padding:12px;background:rgba(136,170,255,0.1);border:2px solid rgba(136,170,255,0.3);color:#88aaff;font-size:16px;font-weight:bold;border-radius:8px;cursor:pointer;`;
    itemsTab.onclick = () => switchTab('items');
    tabs.appendChild(itemsTab);
    shopUI.appendChild(tabs);

    const content = document.createElement('div');
    content.id = 'shop-content';
    content.style.cssText = `flex:1;padding:20px;overflow-y:auto;min-height:300px;`;
    shopUI.appendChild(content);
    document.body.appendChild(shopUI);
}

function switchTab(tab) {
    shopActiveTab = tab;
    const tabs = document.querySelectorAll('.shop-tab');
    tabs.forEach(t => {
        if (t.dataset.tab === tab) {
            t.style.background = 'rgba(68,255,136,0.3)';
            t.style.borderColor = 'rgba(68,255,136,0.8)';
            t.style.color = '#44ff88';
        } else {
            t.style.background = 'rgba(136,170,255,0.1)';
            t.style.borderColor = 'rgba(136,170,255,0.3)';
            t.style.color = '#88aaff';
        }
    });
    renderShopContent();
}

function renderShopContent() {
    const content = document.getElementById('shop-content');
    if (!content) return;
    content.innerHTML = '';
    if (shopActiveTab === 'potions') renderPotions(content);
    else renderItems(content);
}

function renderPotions(container) {
    const potions = Object.values(PLAYER_SHOP_CATALOG.potions);
    potions.forEach(p => {
        const count = p.id === 'hp' ? potionHPCount : potionMPCount;
        const atMax = count >= p.max;
        const canAfford = playerGold >= p.cost;
        const item = createShopItem(
            p.emoji, 
            p.name, 
            p.desc, 
            p.color, 
            `💰 ${p.cost}  ·  Tienes: ${count}/${p.max}`, 
            !atMax && canAfford, 
            atMax ? 'Máximo (10)' : (canAfford ? 'Comprar' : 'Sin oro'), 
            () => buyPotion(p.id)
        );
        container.appendChild(item);
    });
}

function renderItems(container) {
    const items = Object.values(PLAYER_SHOP_CATALOG.items);
    const hasEmptySlot = playerItemSlots.some(s => s === null);
    const slotsUsed = playerItemSlots.filter(s => s !== null).length;
    
    items.forEach(itemData => {
        const canAfford = playerGold >= itemData.cost;
        const canBuy = hasEmptySlot && canAfford;
        const desc = `${itemData.desc}`;
        const statusText = !hasEmptySlot ? `Slots: ${slotsUsed}/6` : (canAfford ? 'Comprar' : 'Sin oro');
        const item = createShopItem(
            itemData.emoji, 
            itemData.name, 
            desc, 
            itemData.color, 
            `💰 ${itemData.cost}  ·  Slots: ${slotsUsed}/6`, 
            canBuy, 
            statusText, 
            () => buyItem(itemData.id)
        );
        container.appendChild(item);
    });
}

function createShopItem(emoji, name, desc, color, priceText, enabled, buttonText, onBuy) {
    const item = document.createElement('div');
    item.style.cssText = `display:flex;align-items:center;gap:15px;padding:12px 15px;margin-bottom:10px;background:rgba(255,255,255,${enabled ? '0.05' : '0.02'});border:1px solid rgba(255,255,255,${enabled ? '0.1' : '0.05'});border-radius:10px;opacity:${enabled ? '1' : '0.5'};`;
    if (enabled) {
        item.onmouseenter = () => { item.style.background = 'rgba(255,255,255,0.1)'; item.style.borderColor = color; };
        item.onmouseleave = () => { item.style.background = 'rgba(255,255,255,0.05)'; item.style.borderColor = 'rgba(255,255,255,0.1)'; };
    }
    const icon = document.createElement('div');
    icon.textContent = emoji;
    icon.style.cssText = `font-size:36px;width:50px;text-align:center;`;
    item.appendChild(icon);
    const info = document.createElement('div');
    info.style.cssText = 'flex:1;';
    info.innerHTML = `<div style="font-size:16px;font-weight:bold;color:${color};margin-bottom:3px;">${name}</div><div style="font-size:12px;color:#aaa;margin-bottom:3px;">${desc}</div><div style="font-size:12px;color:#ffcc44;font-weight:bold;">${priceText}</div>`;
    item.appendChild(info);
    const buyBtn = document.createElement('button');
    buyBtn.textContent = buttonText;
    buyBtn.disabled = !enabled;
    buyBtn.style.cssText = `padding:10px 20px;background:${enabled ? `linear-gradient(135deg, ${color}, ${color}88)` : 'rgba(255,255,255,0.1)'};border:none;color:${enabled ? '#000' : '#666'};font-size:14px;font-weight:bold;border-radius:8px;cursor:${enabled ? 'pointer' : 'not-allowed'};min-width:100px;`;
    if (enabled) {
        buyBtn.onmouseenter = () => { buyBtn.style.transform = 'scale(1.05)'; };
        buyBtn.onmouseleave = () => { buyBtn.style.transform = 'scale(1)'; };
        buyBtn.onclick = onBuy;
    }
    item.appendChild(buyBtn);
    return item;
}

function openShop() {
    if (shopOpen) return;
    if (!shopUI) createShopUI();
    shopOpen = true;
    shopUI.style.display = 'flex';
    switchTab('potions');
    gamePaused = true;
    isMovingToTarget = false;
    targetPosition = null;
    isAutoMovingToTarget = false;
    window.currentTarget = null;
    if (targetUI) targetUI.style.display = 'none';
    isMouseDownRight = false;
    isMouseDownLeft = false;
    isDragging = false;
    console.log('🏪 Tienda abierta (juego pausado)');
}

function closeShop() {
    if (shopUI) shopUI.style.display = 'none';
    shopOpen = false;
    gamePaused = false;
    lastTime = performance.now();
    isMouseDownRight = false;
    isMouseDownLeft = false;
    isDragging = false;
    shopAutoOpenCooldown = CONFIG.SHOP_AUTO_OPEN_COOLDOWN;
    console.log('🏪 Tienda cerrada (juego reanudado)');
}

function buyPotion(type) {
    const potion = PLAYER_SHOP_CATALOG.potions[type];
    if (!potion) return;
    const currentCount = type === 'hp' ? potionHPCount : potionMPCount;
    if (currentCount >= potion.max) return;
    if (!spendPlayerGold(potion.cost)) { console.log(`⛔ Sin oro`); return; }
    if (type === 'hp') potionHPCount++;
    else if (type === 'mp') potionMPCount++;
    console.log(`🛒 ${potion.name} (${potion.cost} oro) | Tienes: ${type === 'hp' ? potionHPCount : potionMPCount}/${potion.max}`);
    updatePotionHUD();
    renderShopContent();
    renderer.render(scene, camera);
}

function buyItem(itemId) {
    const itemData = PLAYER_SHOP_CATALOG.items[itemId];
    if (!itemData) return;
    
    const emptySlotIndex = playerItemSlots.findIndex(s => s === null);
    if (emptySlotIndex === -1) {
        console.log('⛔ Inventario lleno (6/6 items)');
        return;
    }
    
    if (!spendPlayerGold(itemData.cost)) { console.log(`⛔ Sin oro`); return; }
    
    itemData.apply();
    playerItemSlots[emptySlotIndex] = { id: itemId, emoji: itemData.emoji, name: itemData.name, color: itemData.color };
    
    console.log(`🛒 ${itemData.name} comprado → slot ${emptySlotIndex + 1}/6`);
    
    updateItemHUD();
    renderShopContent();
    renderer.render(scene, camera);
}

function updateItemHUD() {
    for (let i = 0; i < itemSlots.length; i++) {
        const slot = itemSlots[i];
        const item = playerItemSlots[i];
        if (item) {
            slot.textContent = item.emoji;
            slot.style.fontSize = '18px';
            slot.style.background = `${item.color}22`;
            slot.style.borderColor = item.color;
            slot.title = item.name;
            slot.dataset.itemName = item.id;
        } else {
            slot.textContent = '';
            slot.style.fontSize = '13px';
            slot.style.background = 'rgba(255,255,255,0.05)';
            slot.style.borderColor = 'rgba(255,255,255,0.15)';
            slot.title = '';
            delete slot.dataset.itemName;
        }
    }
}

function getShopFromClick(event) {
    if (!renderer) return null;
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const selectables = [];
    [shopAliada, shopEnemiga].forEach(shop => { if (shop) shop.group.traverse(c => { if (c.isMesh) selectables.push(c); }); });
    const intersects = raycaster.intersectObjects(selectables);
    if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent) {
            if (parent.userData && parent.userData.shopRef) return parent.userData.shopRef;
            parent = parent.parent;
        }
    }
    return null;
}

class TowerProjectile {
    constructor(startPos, target, isEnemy = false, damage = 20) {
        this.target = target; this.damage = damage; this.isEnemy = isEnemy;
        this.speed = CONFIG.projectileSpeed; this.active = true; this.targetRef = target;
        const color = isEnemy ? 0xff4444 : 0x4488ff;
        const geo = new THREE.SphereGeometry(0.12, 8, 8);
        const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8 });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.copy(startPos); this.mesh.position.y = 0.3;
        scene.add(this.mesh);
    }

    update(delta) {
        if (!this.active) return;
        if (!this.targetRef || !this.targetRef.group || this.targetRef.isDead) { this.active = false; scene.remove(this.mesh); return; }
        const tp = this.targetRef.group.position.clone(); tp.y = 0.3;
        const dir = new THREE.Vector3().subVectors(tp, this.mesh.position); dir.y = 0; dir.normalize();
        this.mesh.position.x += dir.x * this.speed * delta;
        this.mesh.position.z += dir.z * this.speed * delta;
        if (this.mesh.position.distanceTo(this.targetRef.group.position) < 0.8) this.hit();
        if (Math.abs(this.mesh.position.x) > 20 || Math.abs(this.mesh.position.z) > 30) { this.active = false; scene.remove(this.mesh); }
    }

    hit() {
        if (!this.active) return;
        this.active = false;
        if (!this.targetRef.isDead) {
            let targetDied = false;
            let reward = 0;
            const deathPosition = this.mesh.position.clone();
            if (this.targetRef.type === 'player') {
                playerTakeDamage(this.damage);
                if (isAITrainingMode) playerAILastDamageTime = gameTime;
            } else if (this.targetRef.type === 'enemy_axie' && enemyAxie) {
                const prev = enemyAxie.health;
                enemyAxieTakeDamage(this.damage);
                enemyAxieLastDamageTime = gameTime;
                if (prev > 0 && enemyAxieIsDead) {
                    targetDied = true;
                    reward = Math.round(ECONOMY.REWARD_ENEMY_AXIE_KILL * 0.5);
                    if (enemyAxieModel) deathPosition.copy(enemyAxieModel.position);
                }
            } else {
                this.targetRef.health -= this.damage;
                if (this.targetRef.updateHealthBar) this.targetRef.updateHealthBar();
                if (this.targetRef.health <= 0) {
                    targetDied = true;
                    if (this.targetRef.type === 'tower') { reward = ECONOMY.REWARD_TOWER_KILL; if (this.targetRef.position) deathPosition.copy(this.targetRef.position); }
                    else if (this.targetRef.type === 'minion') {
                        const isMage = this.targetRef.tipo === 'mage';
                        reward = Math.round((isMage ? ECONOMY.REWARD_MAGE_KILL : ECONOMY.REWARD_MINION_KILL) * 0.5);
                        if (this.targetRef.group) deathPosition.copy(this.targetRef.group.position);
                    }
                    if (this.targetRef.die) this.targetRef.die('tower');
                }
            }
            if (targetDied && !this.isEnemy && !isAITrainingMode && reward > 0) {
                givePlayerGold(reward, `🗼 Torre aliada (asistencia)`);
                deathPosition.y = GROUND_Y + 1.2;
                showGoldPopupAt3D(reward, deathPosition, '#88ddff');
            }
        }
        scene.remove(this.mesh);
    }
}

class PlayerProjectile {
    constructor(startPos, target, damage = 15) {
        this.target = target; this.damage = damage; this.speed = CONFIG.projectileSpeed;
        this.active = true; this.targetRef = target;
        const color = 0x44ff88;
        const geo = new THREE.SphereGeometry(0.15, 8, 8);
        const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.0 });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.copy(startPos); this.mesh.position.y = 0.5;
        scene.add(this.mesh);
        this.startPos = startPos.clone();
        this.endPos = target.group.position.clone(); this.endPos.y = 0.5;
        this.progress = 0;
    }

    update(delta) {
        if (!this.active) return;
        if (!this.targetRef || !this.targetRef.group || this.targetRef.isDead) { this.active = false; scene.remove(this.mesh); return; }
        this.endPos.copy(this.targetRef.group.position); this.endPos.y = 0.5;
        this.progress += delta * this.speed;
        if (this.progress >= 1) { this.hit(); return; }
        const cur = new THREE.Vector3().lerpVectors(this.startPos, this.endPos, this.progress);
        this.mesh.position.copy(cur);
    }

    hit() {
        if (!this.active) return;
        this.active = false;
        if (this.targetRef.isDead) { scene.remove(this.mesh); return; }
        const wasEnemyAxie = this.targetRef.type === 'enemy_axie';
        const wasTower = this.targetRef.type === 'tower';
        const wasNexus = this.targetRef.type === 'nexus';
        const wasMinion = this.targetRef.type === 'minion';
        let targetDied = false;
        let reward = 0;
        let rewardReason = '';
        const deathPosition = this.mesh.position.clone();
        if (wasEnemyAxie && enemyAxie) {
            const prev = enemyAxie.health;
            enemyAxieTakeDamage(this.damage);
            if (prev > 0 && enemyAxieIsDead) {
                targetDied = true;
                reward = ECONOMY.REWARD_ENEMY_AXIE_KILL;
                rewardReason = '🤖 Axie enemigo eliminado';
                if (enemyAxieModel) deathPosition.copy(enemyAxieModel.position);
            }
        } else if (this.targetRef.isEnemy === true) {
            this.targetRef.health -= this.damage;
            if (this.targetRef.updateHealthBar) this.targetRef.updateHealthBar();
            if (window.currentTarget === this.targetRef) window.showTarget(this.targetRef);
            if (this.targetRef.health <= 0) {
                targetDied = true;
                if (wasTower) { reward = ECONOMY.REWARD_TOWER_KILL; rewardReason = '🗼 Torre destruida'; if (this.targetRef.position) deathPosition.copy(this.targetRef.position); }
                else if (wasNexus) { reward = ECONOMY.REWARD_NEXUS_KILL; rewardReason = '💎 Nexo destruido'; }
                else if (wasMinion) {
                    const isMage = this.targetRef.tipo === 'mage';
                    reward = isMage ? ECONOMY.REWARD_MAGE_KILL : ECONOMY.REWARD_MINION_KILL;
                    rewardReason = isMage ? '🧙 Mago eliminado' : '⚔️ Minion eliminado';
                    if (this.targetRef.group) deathPosition.copy(this.targetRef.group.position);
                }
                if (this.targetRef.die) this.targetRef.die('player');
                if (window.currentTarget === this.targetRef) { window.currentTarget = null; targetUI.style.display = 'none'; }
            }
        }
        if (targetDied && !isAITrainingMode) {
            if (!playerFirstBlood && wasMinion) {
                playerFirstBlood = true;
                reward += ECONOMY.REWARD_FIRST_BLOOD;
                rewardReason += ' + 🩸 ¡Primera sangre!';
            }
            playerKillStreak++;
            givePlayerGold(reward, rewardReason);
            deathPosition.y = GROUND_Y + 1.2;
            showGoldPopupAt3D(reward, deathPosition, '#ffcc44');
        }
        if (targetDied && isAITrainingMode) {
            let aiReward = 0;
            if (wasTower) aiReward = PLAYER_GOLD_PER_TOWER_KILL;
            else if (wasNexus) aiReward = PLAYER_GOLD_PER_NEXUS_KILL;
            else if (wasMinion) { aiReward = (this.targetRef.tipo === 'mage') ? 18 : PLAYER_GOLD_PER_MINION_KILL; }
            else if (wasEnemyAxie) aiReward = PLAYER_GOLD_PER_ENEMY_AXIE_KILL;
            playerAIGold += aiReward;
        }
        playerAttackTarget = this.targetRef;
        setTimeout(() => { playerAttackTarget = null; }, 2000);
        scene.remove(this.mesh);
    }
}

class AxieTower {
    constructor(x, z, isEnemy = false, tier = 1) {
        this.isEnemy = isEnemy;
        this.tier = tier;
        this.maxHealth = CONFIG.towerHealth + (tier === 2 ? 200 : 0);
        this.health = this.maxHealth;
        this.isDead = false;
        this.range = CONFIG.towerRange + (tier === 2 ? 1 : 0);
        this.damage = CONFIG.towerDamage + (tier === 2 ? 10 : 0);
        this.fireRate = CONFIG.towerFireRate - (tier === 2 ? 0.3 : 0);
        this.cooldown = 0;
        this.target = null;
        this.segments = 10;
        this.type = 'tower';
        this.group = new THREE.Group();
        this.group.userData.targetRef = this;
        const tH = isEnemy ? CONFIG.TOWER_GLB_HEIGHT * CONFIG.TOWER_GLB_SCALE_ENEMY : CONFIG.TOWER_GLB_HEIGHT * CONFIG.TOWER_GLB_SCALE_ALLY;
        this.firePoint = new THREE.Object3D();
        this.firePoint.position.y = tH * 0.85;
        this.group.add(this.firePoint);
        const hb = createHealthBar(this.segments, this.isEnemy);
        hb.sprite.position.y = tH + 0.4;
        this.group.add(hb.sprite);
        this.spriteMat = hb.spriteMat;
        this.group.position.set(x, GROUND_Y, z);
        scene.add(this.group);
        this.position = new THREE.Vector3(x, 0, z);
        this.projectiles = [];
        this.loadTowerGLB(tier);
    }

    loadTowerGLB(tier) {
        const loader = new GLTFLoader();
        const path = this.isEnemy ? CONFIG.TOWER_GLB_ENEMY : CONFIG.TOWER_GLB_ALLY;
        const rY = this.isEnemy ? CONFIG.TOWER_GLB_ROTATION_Y_ENEMY : CONFIG.TOWER_GLB_ROTATION_Y_ALLY;
        const eq = this.isEnemy ? CONFIG.TOWER_GLB_SCALE_ENEMY : CONFIG.TOWER_GLB_SCALE_ALLY;
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const curH = size.y > 0.0001 ? size.y : 1;
            const sf = (CONFIG.TOWER_GLB_HEIGHT / curH) * eq;
            model.scale.setScalar(sf);
            const bbox2 = new THREE.Box3().setFromObject(model);
            model.position.y = -bbox2.min.y;
            model.position.x = -(bbox2.min.x + bbox2.max.x) / 2;
            model.position.z = -(bbox2.min.z + bbox2.max.z) / 2;
            model.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; n.userData.targetRef = this; } });
            model.rotation.y = rY;
            this.group.add(model);
        }, undefined, () => this.buildProceduralTower());
    }

    buildProceduralTower() {
        const baseGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.25, 12);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.8, metalness: 0.2 });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = 0.125;
        baseMesh.userData.targetRef = this;
        this.group.add(baseMesh);
    }

    updateHealthBar() {
        const hp = this.health / this.maxHealth;
        const vis = Math.max(0, Math.min(this.segments, Math.ceil(hp * this.segments)));
        updateHealthBarSprite(this.spriteMat, this.segments, vis, this.isEnemy);
    }

    takeDamage(damage) {
        if (this.isDead) return;
        this.health -= damage;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.health = 0; this.isDead = true; this.group.visible = false;
            for (const p of this.projectiles) { p.active = false; scene.remove(p.mesh); }
            this.projectiles = [];
        }
    }

    die() { this.takeDamage(this.health); }

    update(delta, enemies) {
        if (this.isDead) return;
        this.cooldown -= delta;
        let closestEnemy = null;
        let closestDist = this.range + 1;
        const targets = this.isEnemy ? enemies.aliados : enemies.enemigos;
        for (const enemy of targets) {
            if (enemy.isDead) continue;
            const dist = this.position.distanceTo(enemy.group.position);
            if (dist < closestDist && dist <= this.range) { closestDist = dist; closestEnemy = enemy; }
        }
        if (this.isEnemy && !closestEnemy && playerModel && !isPlayerDead && playerSpawned) {
            const dist = this.position.distanceTo(playerModel.position);
            if (dist <= this.range) { closestEnemy = { group: playerModel, isDead: false, type: 'player' }; closestDist = dist; }
        }
        if (!this.isEnemy && !closestEnemy && enemyAxieModel && !enemyAxieIsDead) {
            const dist = this.position.distanceTo(enemyAxieModel.position);
            if (dist <= this.range) { closestEnemy = { group: enemyAxieModel, isDead: enemyAxieIsDead, type: 'enemy_axie' }; closestDist = dist; }
        }
        this.target = closestEnemy;
        if (this.target && closestDist <= this.range && this.cooldown <= 0) {
            this.fire();
            this.cooldown = this.fireRate;
        }
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(delta);
            if (!p.active) this.projectiles.splice(i, 1);
        }
    }

    fire() {
        if (!this.target || this.isDead) return;
        const startPos = new THREE.Vector3();
        this.firePoint.getWorldPosition(startPos);
        const proj = new TowerProjectile(startPos, this.target, this.isEnemy, this.damage);
        this.projectiles.push(proj);
    }
}

const towers = [];
function createTower(x, z, isEnemy = false, tier = 1) {
    const tower = new AxieTower(x, z, isEnemy, tier);
    towers.push(tower);
    return tower;
}

const timerDiv = document.createElement('div');
timerDiv.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);color:#44ff88;font-family:monospace;font-size:28px;font-weight:bold;background:rgba(0,0,0,0.8);padding:8px 24px;border-radius:12px;z-index:100;pointer-events:none;border:2px solid rgba(68,255,136,0.3);display:none;`;
timerDiv.textContent = '00:00';
document.body.appendChild(timerDiv);

const fpsDiv = document.createElement('div');
fpsDiv.style.cssText = `position:fixed;top:20px;right:20px;color:#88aaff;font-family:monospace;font-size:18px;font-weight:bold;background:rgba(0,0,0,0.7);padding:6px 14px;border-radius:8px;z-index:100;pointer-events:none;display:none;`;
fpsDiv.textContent = 'FPS: 0';
document.body.appendChild(fpsDiv);

const waveDiv = document.createElement('div');
waveDiv.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);color:#ffaa44;font-family:monospace;font-size:16px;font-weight:bold;background:rgba(0,0,0,0.7);padding:4px 16px;border-radius:8px;z-index:100;pointer-events:none;display:none;`;
waveDiv.textContent = '⏳ 15s';
document.body.appendChild(waveDiv);

const goldDiv = document.createElement('div');
goldDiv.id = 'player-gold-display';
goldDiv.style.cssText = `position:fixed;top:20px;left:20px;color:#ffcc44;font-family:'Courier New',monospace;font-size:20px;font-weight:bold;background:rgba(0,0,0,0.8);padding:8px 18px;border-radius:12px;z-index:100;pointer-events:none;border:2px solid rgba(255,200,50,0.4);text-shadow:0 0 15px rgba(255,200,50,0.5);letter-spacing:1px;display:none;`;
goldDiv.textContent = '💰 0';
document.body.appendChild(goldDiv);

const enemyAxieDebugHUD = document.createElement('div');
enemyAxieDebugHUD.style.cssText = `position:fixed;top:120px;right:20px;color:#ffcc44;font-family:monospace;font-size:12px;background:rgba(0,0,0,0.75);padding:8px 12px;border-radius:8px;z-index:100;pointer-events:none;border:1px solid rgba(255,200,68,0.3);display:none;min-width:200px;line-height:1.5;`;
document.body.appendChild(enemyAxieDebugHUD);

function updateEnemyAxieDebugHUD() {
    if (!enemyAxieSpawned || gameFinished || !isAITrainingMode) {
        enemyAxieDebugHUD.style.display = 'none';
        return;
    }
    enemyAxieDebugHUD.style.display = 'block';
    const itemsE = Object.keys(enemyAxieItems).length > 0 ? Object.entries(enemyAxieItems).map(([id, c]) => `${ENEMY_AXIE_ITEM_CATALOG[id]?.emoji || '?'}×${c}`).join(' ') : '—';
    const itemsP = Object.keys(playerAIItems).length > 0 ? Object.entries(playerAIItems).map(([id, c]) => `${ENEMY_AXIE_ITEM_CATALOG[id]?.emoji || '?'}×${c}`).join(' ') : '—';
    const hpPctE = Math.round((enemyAxie.health / enemyAxieMaxHealth) * 100);
    const hpPctP = Math.round((playerHealth / playerMaxHealth) * 100);
    enemyAxieDebugHUD.innerHTML = `
        <div style="color:#ff6644;font-weight:bold;margin-bottom:4px;">🤖 IA vs IA</div>
        <div style="color:#88ddff;">🦊 Jugador-IA</div>
        <div>  💰 ${playerAIGold} | ❤️ ${hpPctP}%</div>
        <div>  🧪 Pociones: ${playerAIPotionCount}/${CONFIG.AXIE_MAX_POTIONS}</div>
        <div>  🛒 ${itemsP}</div>
        <div style="color:#ff4444;margin-top:4px;">🤖 Axie Enemigo</div>
        <div>  💰 ${enemyAxieGold} | ❤️ ${hpPctE}%</div>
        <div>  🧪 Pociones: ${enemyAxiePotionCount}/${CONFIG.AXIE_MAX_POTIONS}</div>
        <div>  🛒 ${itemsE}</div>
        <div style="color:#aaa;margin-top:4px;font-size:10px;">Cámara: ${dynamicCameraMode}</div>
    `;
}

function updateDynamicHUDForCamera() {
    if (!isAITrainingMode) return;
    if (!hudWrapper || !playerHUD) return;

    const nameEl = playerHUD.querySelector('div[style*="font-weight:bold"]');
    const healthBar = document.getElementById('player-hud-health-bar');
    const healthText = document.getElementById('player-hud-health-text');
    const manaBar = document.getElementById('player-hud-mana-bar');
    const manaText = document.getElementById('player-hud-mana-text');
    const potionHPEl = document.getElementById('potion-hp-count');
    const potionMPEl = document.getElementById('potion-mp-count');

    const mode = dynamicCameraMode;

    itemSlots.forEach((slot) => {
        slot.textContent = '';
        slot.style.background = 'rgba(255,255,255,0.05)';
        slot.style.borderColor = 'rgba(255,255,255,0.15)';
        slot.style.color = '';
        delete slot.dataset.itemName;
    });

    if (mode === 'player') {
        if (nameEl) { nameEl.textContent = `🦊 ${currentAxieName} (IA)`; nameEl.style.color = '#44ff88'; }
        if (healthBar) {
            const pct = Math.max(0, (playerHealth / playerMaxHealth) * 100);
            healthBar.style.width = `${pct}%`;
            healthBar.style.background = 'linear-gradient(90deg,#ff2244,#ff6644)';
        }
        if (healthText) healthText.textContent = `${Math.floor(playerHealth)}/${playerMaxHealth}`;
        if (manaBar) manaBar.style.width = `${Math.max(0, (playerMana / playerMaxMana) * 100)}%`;
        if (manaText) manaText.textContent = `${Math.floor(playerMana)}/${playerMaxMana}`;
        if (potionHPEl) potionHPEl.textContent = `${potionHPCount}`;
        if (potionMPEl) potionMPEl.textContent = `${potionMPCount}`;

        for (let i = 0; i < itemSlots.length && i < 6; i++) {
            const item = playerItemSlots[i];
            if (!item) continue;
            const slot = itemSlots[i];
            slot.textContent = item.emoji;
            slot.style.fontSize = '18px';
            slot.style.background = `${item.color}22`;
            slot.style.borderColor = item.color;
            slot.title = item.name;
            slot.dataset.itemName = item.id;
        }
    } else if (mode === 'enemy') {
        if (nameEl) { nameEl.textContent = `🤖 ${enemyAxie ? enemyAxie.nombre : 'Axie'} (IA)`; nameEl.style.color = '#ff6644'; }
        if (healthBar) {
            const pct = enemyAxie ? Math.max(0, (enemyAxie.health / enemyAxieMaxHealth) * 100) : 0;
            healthBar.style.width = `${pct}%`;
            healthBar.style.background = 'linear-gradient(90deg,#ff2244,#ff6644)';
        }
        if (healthText) healthText.textContent = enemyAxie ? `${Math.floor(enemyAxie.health)}/${enemyAxieMaxHealth}` : '0/200';
        if (manaBar) manaBar.style.width = '100%';
        if (manaText) manaText.textContent = `${enemyAxieMaxHealth}/${enemyAxieMaxHealth}`;
        if (potionHPEl) potionHPEl.textContent = `${enemyAxiePotionCount}`;
        if (potionMPEl) potionMPEl.textContent = `0`;

        let slotIdx = 0;
        for (const [itemId, count] of Object.entries(enemyAxieItems)) {
            if (slotIdx >= itemSlots.length) break;
            const item = ENEMY_AXIE_ITEM_CATALOG[itemId];
            if (!item) continue;
            const slot = itemSlots[slotIdx];
            slot.textContent = count > 1 ? `${item.emoji}${count}` : item.emoji;
            slot.style.fontSize = '16px';
            slot.style.background = 'rgba(255,102,102,0.15)';
            slot.style.borderColor = '#ff6644';
            slot.dataset.itemName = itemId;
            slotIdx++;
        }
    }
}

class Minion {
    constructor(x, z, isEnemy = false, tipo = 'melee', formationIndex = 0) {
        this.isEnemy = isEnemy;
        this.tipo = tipo;
        this.formationIndex = formationIndex;
        this.minionType = tipo;
        this.maxHealth = tipo === 'mage' ? 60 : 100;
        this.health = this.maxHealth;
        this.speed = tipo === 'melee' ? CONFIG.meleeSpeed : CONFIG.mageSpeed;
        this.direction = isEnemy ? -1 : 1;
        this.attackDamage = tipo === 'mage' ? 15 : 10;
        this.attackRange = tipo === 'mage' ? 4.0 : 1.5;
        this.attackCooldown = 0;
        this.attackSpeed = tipo === 'mage' ? 1.5 : 1.0;
        this.state = 'move';
        this.target = null;
        this.isDead = false;
        this.segments = tipo === 'mage' ? 3 : 6;
        this.hpPerSegment = tipo === 'mage' ? 20 : 17;
        this.currentVisibleSegments = this.segments;
        this.type = 'minion';
        this.reevaluationTimer = 0;
        this.isGhost = false;
        this.ghostTimer = CONFIG.firstWaveGhostDuration;
        this.memory = {
            kills: 0, deaths: 0, damageDealt: 0, damageTaken: 0,
            lastKilledType: null, lastKilledBy: null, survivedWaves: 0,
            weights: { ...factionBrain[isEnemy ? 'enemy' : 'ally'].weights },
        };
        this.mixer = null;
        this.glbModel = null;

        this.combatOffsetX = 0;
        this.combatOffsetZ = 0;
        if (tipo === 'melee') {
            const meleeSlots = [0, -1.0, 1.0, -2.0, 2.0];
            this.combatOffsetX = meleeSlots[formationIndex % meleeSlots.length] || 0;
            this.combatOffsetZ = 0;
        } else {
            const mageSlots = [0, -1.2, 1.2];
            this.combatOffsetX = mageSlots[(formationIndex - 5) % mageSlots.length] || 0;
            this.combatOffsetZ = isEnemy ? -2.5 : 2.5;
        }
        this.mySlotX = this.combatOffsetX;
        this.formationSet = false;
        this.deployProgress = 0;

        this.group = new THREE.Group();
        this.group.userData.targetRef = this;

        const usarGLB = isEnemy && tipo === 'mage';
        if (usarGLB) {
            this.loadMinionGLB(tipo);
        } else {
            this.buildProceduralModel(isEnemy);
            const texture = getHealthBarTexture(this.segments, this.segments, this.isEnemy);
            const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(0.7, 0.15, 1);
            sprite.position.y = 0.65;
            sprite.renderOrder = 999;
            this.group.add(sprite);
            this.spriteMat = spriteMat;
        }

        this.group.rotation.y = isEnemy ? Math.PI : 0;
        this.group.position.set(x, GROUND_Y - 0.5, z);
        scene.add(this.group);
        this.mesh = this.group;
    }

    loadMinionGLB(tipo) {
        const loader = new GLTFLoader();
        loader.load(CONFIG.MINION_GLB_MAGE_ENEMY, (gltf) => {
            while (this.group.children.length > 0) this.group.remove(this.group.children[0]);
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const curH = size.y > 0.0001 ? size.y : 1;
            const sf = CONFIG.MINION_GLB_HEIGHT / curH;
            model.scale.setScalar(sf);
            const bbox2 = new THREE.Box3().setFromObject(model);
            model.position.y = -bbox2.min.y;
            model.position.x = -(bbox2.min.x + bbox2.max.x) / 2;
            model.position.z = -(bbox2.min.z + bbox2.max.z) / 2;
            model.traverse((n) => {
                if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; n.userData.targetRef = this; }
            });
            model.rotation.y = 0;
            this.group.add(model);
            this.glbModel = model;

            this.mixer = new THREE.AnimationMixer(model);
            this.actions = {};
            const walkPath = CONFIG.MAGE_GLB_WALK;
            if (walkPath) {
                new GLTFLoader().load(walkPath, (walkGltf) => {
                    if (walkGltf.animations && walkGltf.animations[0]) {
                        const action = this.mixer.clipAction(walkGltf.animations[0]);
                        action.setLoop(THREE.LoopRepeat);
                        this.actions.walk = action;
                        action.play();
                    }
                });
            }

            const texture = getHealthBarTexture(this.segments, this.segments, this.isEnemy);
            const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(0.7, 0.15, 1);
            sprite.position.y = CONFIG.MINION_GLB_HEIGHT + 0.55;
            sprite.renderOrder = 999;
            this.group.add(sprite);
            this.spriteMat = spriteMat;
        }, undefined, (err) => {
            this.buildProceduralModel(this.isEnemy);
            const texture = getHealthBarTexture(this.segments, this.segments, this.isEnemy);
            const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(0.7, 0.15, 1);
            sprite.position.y = 0.65;
            sprite.renderOrder = 999;
            this.group.add(sprite);
            this.spriteMat = spriteMat;
        });
    }

    buildProceduralModel(isEnemy) {
        const scale = 0.5;
        const lightColor = isEnemy ? (this.tipo === 'mage' ? 0xdd66cc : 0xff5555) : (this.tipo === 'mage' ? 0x66ccff : 0x5588ff);
        const bodyGeo = new THREE.SphereGeometry(0.3 * scale, 8, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: lightColor, roughness: 0.6 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.set(0.9, 1.2, 0.8);
        body.position.y = 0.5 * scale;
        body.userData.targetRef = this;
        this.group.add(body);
        const headGeo = new THREE.SphereGeometry(0.22 * scale, 8, 8);
        const head = new THREE.Mesh(headGeo, bodyMat);
        head.position.set(0, 0.9 * scale, 0);
        head.userData.targetRef = this;
        this.group.add(head);
    }

    adjustWeightsOnKill(targetType) {
        const w = this.memory.weights;
        if (targetType === 'player') { 
            w.aggression += 0.2; 
            w.focusPlayer += 0.25; 
        }
        else if (targetType === 'minion') {
            w.focusMinions += 0.12;
            if (this.memory.kills >= 3) { 
                w.focusStructure += 0.15; 
                w.focusMinions -= 0.05; 
            }
        } 
        else if (targetType === 'tower' || targetType === 'nexus') { 
            w.focusStructure += 0.25; 
            w.aggression += 0.1;
            w.focusMinions -= 0.08; 
        }
        clampWeights(w);
    }

    adjustWeightsOnDeath(killedBy) {
        const w = this.memory.weights;
        w.caution += 0.15;
        if (killedBy === 'player') { w.focusPlayer -= 0.2; w.caution += 0.15; }
        else if (killedBy === 'tower') { w.caution += 0.25; w.focusStructure -= 0.2; }
        else if (killedBy === 'minion') { w.focusMinions -= 0.15; w.groupBehavior += 0.2; }
        clampWeights(w);
    }

    updateHealthBar() {
        const cur = Math.ceil(this.health / this.hpPerSegment);
        const vis = Math.max(0, Math.min(this.segments, cur));
        if (vis !== this.currentVisibleSegments) {
            this.currentVisibleSegments = vis;
            const tex = getHealthBarTexture(this.segments, vis, this.isEnemy);
            if (this.spriteMat) { this.spriteMat.map = tex; this.spriteMat.needsUpdate = true; }
        }
    }

    update(delta, aliados, enemigos, towers, playerModel) {
        if (this.isDead || gameFinished) return;
        if (this.mixer) this.mixer.update(delta);
        this.reevaluationTimer += delta;

        if (isFirstWave && this.ghostTimer > 0) {
            this.ghostTimer -= delta;
            let nz = this.group.position.z + this.direction * this.speed * delta;
            nz = Math.max(-CONFIG.minionLimitZ, Math.min(CONFIG.minionLimitZ, nz));
            this.group.position.z = nz;
            this.state = 'move';
            clampMinionToLane(this);
            this.updateHealthBar();
            return;
        }

        this.attackCooldown -= delta;

        const w = this.memory.weights;
        const enemyMinions = this.isEnemy ? aliados : enemigos;
        const enemyAxie = this.isEnemy ? playerModel : enemyAxieModel;
        const enemyAxieIsDeadFlag = this.isEnemy ? isPlayerDead : enemyAxieIsDead;
        const myAllies = this.isEnemy ? enemigos : aliados;

        const AGGRO_RANGE = CONFIG.MINION_AGGRO_RANGE;
        const AGGRO_RANGE_EXTENDED = CONFIG.MINION_AGGRO_RANGE_EXTENDED;

        const enemiesAttackingAllies = new Set();
        for (const ally of myAllies) {
            if (ally.isDead) continue;
            if (ally.target && !ally.target.isDead) {
                const attacker = ally.target;
                if (attacker.group) {
                    enemiesAttackingAllies.add(attacker);
                }
            }
        }

        const enemyTowers = this.isEnemy
            ? towers.filter(t => !t.isDead && !t.isEnemy)
            : towers.filter(t => !t.isDead && t.isEnemy);

        let priority1Target = null;
        let priority1Dist = Infinity;
        for (const em of enemyMinions) {
            if (em.isDead) continue;
            if (!enemiesAttackingAllies.has(em)) continue;
            const dist = this.group.position.distanceTo(em.group.position);
            if (dist < AGGRO_RANGE_EXTENDED && dist < priority1Dist) {
                priority1Dist = dist;
                priority1Target = em;
            }
        }

        let priority2Target = null;
        let priority2Dist = Infinity;
        if (!priority1Target) {
            for (const em of enemyMinions) {
                if (em.isDead) continue;
                const dx = Math.abs(em.group.position.x - this.group.position.x);
                if (dx > 4.0) continue;
                const dist = this.group.position.distanceTo(em.group.position);
                if (dist > AGGRO_RANGE) continue;
                const dz = em.group.position.z - this.group.position.z;
                const isAhead = this.isEnemy ? dz < 0 : dz > 0;
                if (!isAhead && Math.abs(dz) > 3.0) continue;
                if (dist < priority2Dist) {
                    priority2Dist = dist;
                    priority2Target = em;
                }
            }
        }

        let priority3Target = null;
        let priority3Dist = Infinity;
        if (!priority1Target && !priority2Target) {
            for (const tower of enemyTowers) {
                const dist = this.group.position.distanceTo(tower.position);
                if (dist > CONFIG.MINION_TOWER_ATTACK_RANGE) continue;
                const isAhead = this.isEnemy ? tower.position.z < this.group.position.z : tower.position.z > this.group.position.z;
                if (!isAhead && dist > 8) continue;
                let score = dist;
                if (isAhead) score -= 30;
                const tHP = tower.health / tower.maxHealth;
                if (tHP < 0.5) score -= 10;
                if (tHP < 0.3) score -= 20;
                if (score < priority3Dist) {
                    priority3Dist = score;
                    priority3Target = tower;
                }
            }
        }

        let priority4Target = null;
        if (!priority1Target && !priority2Target && !priority3Target && enemyAxie && !enemyAxieIsDeadFlag) {
            const axieDx = Math.abs(enemyAxie.position.x - this.group.position.x);
            const axieDist = this.group.position.distanceTo(enemyAxie.position);
            if (axieDist < CONFIG.MINION_AGGRO_TO_AXIE && axieDx < 3.5) {
                priority4Target = {
                    group: enemyAxie,
                    isDead: false,
                    type: this.isEnemy ? 'player' : 'enemy_axie',
                    health: 999999,
                    _isAxie: true
                };
            }
        }

        let priority5Target = null;
        if (!priority1Target && !priority2Target && !priority3Target && !priority4Target) {
            const hasLivingTowers = enemyTowers.length > 0;
            if (!hasLivingTowers) {
                const enemyNexus = this.isEnemy ? nexusAliado : nexusEnemigo;
                if (enemyNexus && !enemyNexus.isDead) {
                    const dist = this.group.position.distanceTo(enemyNexus.position);
                    if (dist < 40) priority5Target = enemyNexus;
                }
            }
        }

        const finalTarget = priority1Target || priority2Target || priority3Target || priority4Target || priority5Target;

        const DEPLOY_TRIGGER_DIST = CONFIG.DEPLOY_TRIGGER_DIST;

        if (finalTarget) {
            this.target = finalTarget;
            const targetPos = finalTarget.group ? finalTarget.group.position : finalTarget.position;
            const dx = targetPos.x - this.group.position.x;
            const dz = targetPos.z - this.group.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            this.group.rotation.y = Math.atan2(dx, dz);

            let attackRange = this.attackRange;
            if (finalTarget.type === 'tower' || finalTarget.type === 'nexus') attackRange += 0.5;

            const distToAttack = Math.max(0, dist - attackRange);
            const deployTarget = distToAttack < DEPLOY_TRIGGER_DIST ? 1 : 0;
            this.deployProgress += (deployTarget - this.deployProgress) * Math.min(1, 2.5 * delta);
            if (this.deployProgress < 0.01) this.deployProgress = 0;
            if (this.deployProgress > 0.99) this.deployProgress = 1;

            if (dist <= attackRange) {
                this.state = 'attack';
                if (this.attackCooldown <= 0) {
                    registerFactionAttack(this.isEnemy ? 'enemy' : 'ally', finalTarget);
                    
                    if (finalTarget._isAxie || finalTarget.type === 'player' || finalTarget.type === 'enemy_axie') {
                        if (finalTarget.type === 'player') {
                            playerTakeDamage(this.attackDamage);
                        } else if (finalTarget.type === 'enemy_axie' && typeof enemyAxieTakeDamage === 'function') {
                            enemyAxieTakeDamage(this.attackDamage);
                        }
                        this.attackCooldown = this.attackSpeed;
                    } else if (finalTarget.type === 'tower' || finalTarget.type === 'nexus') {
                        if (finalTarget.takeDamage) finalTarget.takeDamage(this.attackDamage);
                        this.attackCooldown = this.attackSpeed;
                    } else {
                        finalTarget.health -= this.attackDamage;
                        this.attackCooldown = this.attackSpeed;
                        if (finalTarget.updateHealthBar) finalTarget.updateHealthBar();
                        if (finalTarget.health <= 0) {
                            this.memory.kills++;
                            this.adjustWeightsOnKill(finalTarget.type || 'minion');
                            factionBrain[this.isEnemy ? 'enemy' : 'ally'].stats.totalKills++;
                            if (finalTarget.die) finalTarget.die('minion');
                            this.target = null;
                            this.state = 'move';
                        }
                    }
                }
                const desiredX = targetPos.x + this.mySlotX * this.deployProgress;
                const smoothFactor = 2.0 * this.deployProgress;
                this.group.position.x += (desiredX - this.group.position.x) * Math.min(1, smoothFactor * delta);
            } else {
                this.state = 'move';
                const norm = dist > 0.1 ? dist : 1;
                
                this.group.position.z += (dz / norm) * this.speed * delta;
                this.group.position.x += (dx / norm) * this.speed * delta;
                
                if (this.deployProgress > 0.01) {
                    const desiredX = targetPos.x + this.mySlotX * this.deployProgress;
                    this.group.position.x += (desiredX - this.group.position.x) * Math.min(1, 1.5 * this.deployProgress * delta);
                }
            }
        } else {
            this.target = null;
            this.state = 'move';
            let nz = this.group.position.z + this.direction * this.speed * delta;
            nz = Math.max(-CONFIG.minionLimitZ, Math.min(CONFIG.minionLimitZ, nz));
            this.group.position.z = nz;
            this.group.position.x += (0 - this.group.position.x) * Math.min(1, 2 * delta);
            this.group.rotation.y = this.isEnemy ? Math.PI : 0;
            this.deployProgress += (0 - this.deployProgress) * Math.min(1, 2 * delta);
        }

        clampMinionToLane(this);
        this.updateHealthBar();
    }

    die(killedBy = 'unknown') {
        if (this.isDead) return;
        this.isDead = true;
        this.state = 'dead';
        this.group.visible = false;
        if (factionFocusTarget.ally.target === this) { factionFocusTarget.ally.target = null; factionFocusTarget.ally.count = 0; }
        if (factionFocusTarget.enemy.target === this) { factionFocusTarget.enemy.target = null; factionFocusTarget.enemy.count = 0; }
        this.memory.deaths++;
        this.adjustWeightsOnDeath(killedBy);
        factionBrain[this.isEnemy ? 'enemy' : 'ally'].stats.totalDeaths++;
    }
}

const aliados = [];
const enemigos = [];
let waveNumber = 1;
let waveCooldown = 0;
const WAVE_DELAY = 1.5;
let gameStarted = false;
let startTimer = CONFIG.SPAWN_DELAY;

function getWaveComposition() {
    if (waveNumber === 1) return { melee: 5, mage: 3 };
    return { melee: 3, mage: 2 };
}

function evaluateWaveOutcome() {
    factionFocusTarget.ally.target = null;
    factionFocusTarget.ally.count = 0;
    factionFocusTarget.enemy.target = null;
    factionFocusTarget.enemy.count = 0;
    const aa = aliados.filter(m => !m.isDead).length;
    const ae = enemigos.filter(m => !m.isDead).length;
    const aW = factionBrain.ally.weights;
    const eW = factionBrain.enemy.weights;
    if (aa > ae) {
        factionBrain.ally.stats.wavesWon++;
        factionBrain.enemy.stats.wavesLost++;
        aW.aggression = Math.min(2.5, aW.aggression + 0.1);
        eW.caution = Math.min(2.5, eW.caution + 0.15);
    } else if (ae > aa) {
        factionBrain.enemy.stats.wavesWon++;
        factionBrain.ally.stats.wavesLost++;
        eW.aggression = Math.min(2.5, eW.aggression + 0.1);
        aW.caution = Math.min(2.5, aW.caution + 0.15);
    }
    clampWeights(aW);
    clampWeights(eW);
    if (enemyAxieSpawned && !enemyAxieIsDead) enemyAxieGold += 25;
    if (isAITrainingMode && playerModel && !isPlayerDead) playerAIGold += PLAYER_GOLD_PASSIVE_PER_WAVE;
    if (!isAITrainingMode && aliados.filter(m => !m.isDead).length > 0) {
        givePlayerGold(ECONOMY.REWARD_WAVE_SURVIVED, `Oleada ${waveNumber - 1} sobrevivida`);
    }
}

function spawnWave() {
    if (gameFinished) return;
    if (waveNumber > 1) evaluateWaveOutcome();

    for (let i = aliados.length - 1; i >= 0; i--) {
        if (aliados[i].isDead) { if (aliados[i].group.parent) scene.remove(aliados[i].group); aliados.splice(i, 1); }
    }
    for (let i = enemigos.length - 1; i >= 0; i--) {
        if (enemigos[i].isDead) { if (enemigos[i].group.parent) scene.remove(enemigos[i].group); enemigos.splice(i, 1); }
    }

    const comp = getWaveComposition();
    waveDiv.textContent = `⚔️ OLEADA ${waveNumber}`;

    const startZ = -13;
    const ROW_SPACING = 1.2;
    const mageSpacingSpawn = 1.0;

    let queueIndex = 0;

    for (let i = 0; i < comp.melee; i++) {
        const z = startZ - i * ROW_SPACING;
        spawnQueue.push({ team: 'ally', tipo: 'melee', index: i, delay: queueIndex * CONFIG.SPAWN_STAGGER_DELAY, z });
        queueIndex++;
    }

    const mageStartZ = startZ - comp.melee * ROW_SPACING - 1.0;
    for (let i = 0; i < comp.mage; i++) {
        let z = mageStartZ - i * mageSpacingSpawn;
        z = Math.max(-CONFIG.MINION_LANE_LIMIT_Z + 0.5, Math.min(CONFIG.MINION_LANE_LIMIT_Z - 0.5, z));
        spawnQueue.push({ team: 'ally', tipo: 'mage', index: i + comp.melee, delay: queueIndex * CONFIG.SPAWN_STAGGER_DELAY, z });
        queueIndex++;
    }

    for (let i = 0; i < comp.melee; i++) {
        const z = -(startZ - i * ROW_SPACING);
        spawnQueue.push({ team: 'enemy', tipo: 'melee', index: i, delay: queueIndex * CONFIG.SPAWN_STAGGER_DELAY, z });
        queueIndex++;
    }

    for (let i = 0; i < comp.mage; i++) {
        let z = -(mageStartZ - i * mageSpacingSpawn);
        z = Math.max(-CONFIG.MINION_LANE_LIMIT_Z + 0.5, Math.min(CONFIG.MINION_LANE_LIMIT_Z - 0.5, z));
        spawnQueue.push({ team: 'enemy', tipo: 'mage', index: i + comp.melee, delay: queueIndex * CONFIG.SPAWN_STAGGER_DELAY, z });
        queueIndex++;
    }

    console.log(`🌊 [t=${gameTime.toFixed(2)}s] Oleada ${waveNumber}: ${comp.melee} melee + ${comp.mage} mage por equipo (spawn 1s escalonado)`);

    waveNumber++;
    waveCooldown = 0;
}

function processSpawnQueue(delta) {
    if (spawnQueue.length === 0) return;
    spawnQueueTimer += delta;
    for (let i = spawnQueue.length - 1; i >= 0; i--) {
        const item = spawnQueue[i];
        if (spawnQueueTimer >= item.delay) {
            if (item.team === 'ally') {
                const m = new Minion(0, item.z, false, item.tipo, item.index);
                clampMinionToLane(m);
                if (isFirstWave) { m.isGhost = true; m.ghostTimer = CONFIG.firstWaveGhostDuration; }
                aliados.push(m);
            } else {
                const m = new Minion(0, item.z, true, item.tipo, item.index);
                clampMinionToLane(m);
                if (isFirstWave) { m.isGhost = true; m.ghostTimer = CONFIG.firstWaveGhostDuration; }
                enemigos.push(m);
            }
            console.log(`👾 [t=${gameTime.toFixed(2)}s] Spawn: ${item.team} ${item.tipo} #${item.index + 1}`);
            spawnQueue.splice(i, 1);
        }
    }
    if (spawnQueue.length === 0) spawnQueueTimer = 0;
}

let playerModel = null;
let mixer = null;
let animIdle = null;
let animWalk = null;
let currentAnim = 'idle';
let targetPosition = null;
let isMovingToTarget = false;
let playerSpeed = CONFIG.axieSpeed;
const playerSpawnPosition = new THREE.Vector3(0, 0, -20);
let smoothPlayerPos = new THREE.Vector3(0, 0, -20);
let smoothTargetPos = new THREE.Vector3(0, 0, -20);
let attackCooldown = 0;
let playerProjectiles = [];
let isAttacking = false;
let attackRange = CONFIG.attackRange;
let attackDamage = CONFIG.attackDamage;
let attackSpeed = CONFIG.attackSpeed;
let isAutoMovingToTarget = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getGroundIntersection(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ip = new THREE.Vector3();
    const intersectPoint = raycaster.ray.intersectPlane(plane, ip);
    if (intersectPoint) {
        intersectPoint.x = Math.max(-17, Math.min(17, intersectPoint.x));
        intersectPoint.z = Math.max(-26, Math.min(26, intersectPoint.z));
        intersectPoint.y = GROUND_Y;
        return intersectPoint;
    }
    return null;
}

renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

function loadSelectedAxie(axieId) {
    return new Promise((resolve) => {
        const axieData = getAxieById(axieId);
        if (!axieData) { loadDefaultAxie().then(resolve); return; }
        const loader = new GLTFLoader();
        // 🔧 FIX: resolver ruta con función auxiliar
        const modelPath = getAxieModelPath(axieData);
        console.log(`🦊 Cargando Axie: ${axieData.nombre} desde ${modelPath}`);
        loader.load(modelPath, (gltf) => {
            if (playerModel) { scene.remove(playerModel); if (mixer) { mixer.stopAllAction(); mixer = null; } }
            playerModel = gltf.scene;
            const escala = axieData.escala || 1.2;
            playerModel.scale.set(escala, escala, escala);
            playerModel.position.copy(playerSpawnPosition);
            playerModel.position.y = GROUND_Y;
            smoothPlayerPos.copy(playerSpawnPosition);
            smoothPlayerPos.y = GROUND_Y;
            playerModel.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; } });
            scene.add(playerModel);
            mixer = new THREE.AnimationMixer(playerModel);
            gltf.animations.forEach(clip => {
                const name = clip.name.toLowerCase();
                if (name.includes('idle')) animIdle = mixer.clipAction(clip);
                if (name.includes('walk')) animWalk = mixer.clipAction(clip);
            });
            if (animIdle) animIdle.play();
            axieLoaded = true;
            currentAxieName = axieData.nombre;
            resolve();
        }, undefined, (err) => {
            console.error(`❌ Error cargando ${modelPath}:`, err);
            loadDefaultAxie().then(resolve);
        });
    });
}

function loadDefaultAxie() {
    return new Promise((resolve) => {
        const loader = new GLTFLoader();
        // 🔧 FIX: ruta nueva de Axies
        const defaultPath = CONFIG.AXIES_BASE_PATH + 'bing.glb';
        console.log(`🦊 Cargando Axie por defecto: ${defaultPath}`);
        loader.load(defaultPath, (gltf) => {
            if (playerModel) { scene.remove(playerModel); if (mixer) { mixer.stopAllAction(); mixer = null; } }
            playerModel = gltf.scene;
            playerModel.scale.set(1.2, 1.2, 1.2);
            playerModel.position.copy(playerSpawnPosition);
            playerModel.position.y = GROUND_Y;
            smoothPlayerPos.copy(playerSpawnPosition);
            smoothPlayerPos.y = GROUND_Y;
            scene.add(playerModel);
            mixer = new THREE.AnimationMixer(playerModel);
            gltf.animations.forEach(clip => {
                const name = clip.name.toLowerCase();
                if (name.includes('idle')) animIdle = mixer.clipAction(clip);
                if (name.includes('walk')) animWalk = mixer.clipAction(clip);
            });
            if (animIdle) animIdle.play();
            axieLoaded = true;
            currentAxieName = 'Bing';
            resolve();
        }, undefined, (err) => {
            console.error(`❌ Error cargando Axie por defecto (${defaultPath}):`, err);
            console.warn('⚠️ Usando cubo rojo como fallback');
            const fb = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0xff4444 }));
            fb.position.copy(playerSpawnPosition);
            fb.position.y = GROUND_Y;
            scene.add(fb);
            playerModel = fb;
            smoothPlayerPos.copy(playerSpawnPosition);
            axieLoaded = true;
            currentAxieName = 'Bing';
            resolve();
        });
    });
}

let playerHUD = null;
let hudWrapper = null;
let potionHUD = null;
let itemHUD = null;
let itemSlots = [];

function createPlayerHUD() {
    if (playerHUD) playerHUD.remove();
    if (hudWrapper) hudWrapper.remove();
    hudWrapper = document.createElement('div');
    hudWrapper.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;align-items:stretch;gap:10px;z-index:1000;pointer-events:none;`;
    document.body.appendChild(hudWrapper);

    playerHUD = document.createElement('div');
    playerHUD.style.cssText = `width:400px;background:rgba(0,0,0,0.9);border:2px solid rgba(255,255,255,0.3);border-radius:12px;padding:15px;color:#fff;box-sizing:border-box;`;
    playerHUD.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="font-size:20px;">⚔️</div>
            <div style="font-weight:bold;font-size:18px;color:#44ff88;">${currentAxieName}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="color:#ff6644;">❤️</span>
            <div style="flex:1;height:18px;background:rgba(255,255,255,0.15);border-radius:4px;overflow:hidden;">
                <div id="player-hud-health-bar" style="width:100%;height:100%;background:linear-gradient(90deg,#ff2244,#ff6644);"></div>
            </div>
            <span id="player-hud-health-text" style="font-size:14px;font-weight:bold;">200/200</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
            <span style="color:#44aaff;">💧</span>
            <div style="flex:1;height:18px;background:rgba(255,255,255,0.15);border-radius:4px;overflow:hidden;">
                <div id="player-hud-mana-bar" style="width:100%;height:100%;background:linear-gradient(90deg,#2266ff,#44aaff);"></div>
            </div>
            <span id="player-hud-mana-text" style="font-size:14px;font-weight:bold;">200/200</span>
        </div>
    `;
    hudWrapper.appendChild(playerHUD);
    requestAnimationFrame(() => {
        const h = playerHUD.offsetHeight;
        createPotionHUD(h);
        createItemHUD(h);
    });
}

function createPotionHUD(h) {
    if (potionHUD) potionHUD.remove();
    potionHUD = document.createElement('div');
    potionHUD.style.cssText = `width:70px;height:${h}px;background:rgba(0,0,0,0.9);border:2px solid rgba(255,255,255,0.3);border-radius:12px;display:flex;flex-direction:column;gap:4px;padding:6px;box-sizing:border-box;pointer-events:auto;`;
    
    const hpBox = document.createElement('div');
    hpBox.id = 'potion-hp-box';
    hpBox.style.cssText = `
        flex:1;background:rgba(255,68,68,0.15);border:2px solid rgba(255,68,68,0.4);
        border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-size:11px;color:#ff6644;font-weight:bold;cursor:pointer;user-select:none;
        transition:all 0.15s;position:relative;
    `;
    hpBox.innerHTML = `<div style="font-size:16px;">🧪</div><div id="potion-hp-count" style="font-size:11px;">0</div>`;
    hpBox.onclick = () => usePotion('hp');
    hpBox.onmouseenter = () => { hpBox.style.background = 'rgba(255,68,68,0.35)'; hpBox.style.transform = 'scale(1.05)'; };
    hpBox.onmouseleave = () => { hpBox.style.background = 'rgba(255,68,68,0.15)'; hpBox.style.transform = 'scale(1)'; };
    hpBox.title = 'Click para usar Poción HP (+50)';
    potionHUD.appendChild(hpBox);
    
    const mpBox = document.createElement('div');
    mpBox.id = 'potion-mp-box';
    mpBox.style.cssText = `
        flex:1;background:rgba(68,170,255,0.15);border:2px solid rgba(68,170,255,0.4);
        border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-size:11px;color:#44aaff;font-weight:bold;cursor:pointer;user-select:none;
        transition:all 0.15s;position:relative;
    `;
    mpBox.innerHTML = `<div style="font-size:16px;">💧</div><div id="potion-mp-count" style="font-size:11px;">0</div>`;
    mpBox.onclick = () => usePotion('mp');
    mpBox.onmouseenter = () => { mpBox.style.background = 'rgba(68,170,255,0.35)'; mpBox.style.transform = 'scale(1.05)'; };
    mpBox.onmouseleave = () => { mpBox.style.background = 'rgba(68,170,255,0.15)'; mpBox.style.transform = 'scale(1)'; };
    mpBox.title = 'Click para usar Poción MP (+50)';
    potionHUD.appendChild(mpBox);
    
    hudWrapper.appendChild(potionHUD);
}

function createItemHUD(h) {
    if (itemHUD) itemHUD.remove();
    itemHUD = document.createElement('div');
    itemHUD.style.cssText = `width:130px;height:${h}px;background:rgba(0,0,0,0.9);border:2px solid rgba(255,255,255,0.3);border-radius:12px;padding:6px;display:flex;flex-direction:column;align-items:center;box-sizing:border-box;`;
    const title = document.createElement('div');
    title.textContent = 'ITEMS';
    title.style.cssText = `font-size:10px;color:#ffcc44;font-weight:bold;margin-bottom:3px;letter-spacing:2px;`;
    itemHUD.appendChild(title);
    const grid = document.createElement('div');
    grid.style.cssText = `display:grid;grid-template-columns:repeat(3,1fr);gap:4px;`;
    itemSlots = [];
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.dataset.slotIndex = i;
        slot.style.cssText = `width:30px;height:30px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.15);border-radius:6px;display:flex;justify-content:center;align-items:center;font-size:13px;pointer-events:auto;`;
        itemSlots.push(slot);
        grid.appendChild(slot);
    }
    itemHUD.appendChild(grid);
    hudWrapper.appendChild(itemHUD);
}

function updatePlayerHUD() {
    if (!playerHUD) return;
    if (isAITrainingMode) { updateDynamicHUDForCamera(); return; }

    const hpPct = Math.max(0, (playerHealth / playerMaxHealth) * 100);
    const mpPct = Math.max(0, (playerMana / playerMaxMana) * 100);

    const hpBar = document.getElementById('player-hud-health-bar');
    const hpText = document.getElementById('player-hud-health-text');
    const mpBar = document.getElementById('player-hud-mana-bar');
    const mpText = document.getElementById('player-hud-mana-text');

    if (hpBar) hpBar.style.width = `${hpPct}%`;
    if (hpText) hpText.textContent = `${Math.floor(playerHealth)}/${playerMaxHealth}`;
    if (mpBar) mpBar.style.width = `${mpPct}%`;
    if (mpText) mpText.textContent = `${Math.floor(playerMana)}/${playerMaxMana}`;
}

function updatePotionHUD() {
    const hpCount = document.getElementById('potion-hp-count');
    const mpCount = document.getElementById('potion-mp-count');
    if (hpCount) hpCount.textContent = `${potionHPCount}`;
    if (mpCount) mpCount.textContent = `${potionMPCount}`;
}

function usePotion(type) {
    if (gamePaused) return;
    if (isAITrainingMode) return;
    if (!playerSpawned || isPlayerDead) return;
    
    if (potionUseCooldown > 0) {
        console.log(`⏳ Cooldown poción: ${potionUseCooldown.toFixed(1)}s`);
        return;
    }
    
    if (type === 'hp') {
        if (potionHPCount <= 0) { console.log('⛔ Sin pociones HP'); return; }
        if (playerHealth >= playerMaxHealth) { console.log('⛔ HP lleno'); return; }
        
        potionHPCount--;
        playerHealth = Math.min(playerMaxHealth, playerHealth + 50);
        potionUseCooldown = CONFIG.POTION_USE_COOLDOWN;
        console.log(`💊 Poción HP usada (+50) | HP: ${Math.floor(playerHealth)}/${playerMaxHealth} | Quedan: ${potionHPCount}`);
        
        flashPotionHUD('hp');
    } else if (type === 'mp') {
        if (potionMPCount <= 0) { console.log('⛔ Sin pociones MP'); return; }
        if (playerMana >= playerMaxMana) { console.log('⛔ MP lleno'); return; }
        
        potionMPCount--;
        playerMana = Math.min(playerMaxMana, playerMana + 50);
        potionUseCooldown = CONFIG.POTION_USE_COOLDOWN;
        console.log(`💧 Poción MP usada (+50) | MP: ${Math.floor(playerMana)}/${playerMaxMana} | Quedan: ${potionMPCount}`);
        
        flashPotionHUD('mp');
    }
    
    updatePlayerHUD();
    updatePotionHUD();
}

function flashPotionHUD(type) {
    const box = document.getElementById(type === 'hp' ? 'potion-hp-box' : 'potion-mp-box');
    if (!box) return;
    const originalBg = box.style.background;
    box.style.background = 'rgba(68,255,136,0.6)';
    box.style.transform = 'scale(1.15)';
    setTimeout(() => {
        box.style.background = originalBg;
        box.style.transform = 'scale(1)';
    }, 200);
}

function getPlayerRespawnTime() {
    const idx = Math.min(playerDeathCount, PLAYER_DEATH_PENALTIES.length - 1);
    const time = PLAYER_DEATH_PENALTIES[idx];
    playerDeathCount++;
    console.log(`🔄 Respawn: ${time}s (muerte #${playerDeathCount})`);
    return time;
}

function playerTakeDamage(damage) {
    if (isPlayerDead) return;
    if (!playerSpawned) return;
    playerHealth -= damage;
    if (playerHealth < 0) playerHealth = 0;
    updatePlayerHUD();
    if (playerHealth <= 0) {
        playerHealth = 0;
        isPlayerDead = true;
        playerRespawnTimer = getPlayerRespawnTime();
        if (playerModel) playerModel.visible = false;
        playerKillStreak = 0;
        playerAIIsRetreating = false;
        playerAIRetreatTimer = 0;
        playerAIRetreatCooldown = 0;
        playerAILastDamageTime = -999;
        if (ECONOMY.PENALTY_PLAYER_DEATH > 0 && !isAITrainingMode) {
            playerGold = Math.max(0, playerGold - ECONOMY.PENALTY_PLAYER_DEATH);
            updatePlayerGoldHUD();
        }
    }
}

let enemyAxieGold = 0;
let enemyAxieItems = {};
let enemyAxieBonuses = { speedMultiplier: 1.0, damageMultiplier: 1.0, attackSpeedMultiplier: 1.0, rangeBonus: 0, critChance: 0 };
let enemyAxieShopCooldown = 0;
let enemyAxieShopUses = 0;
const ENEMY_AXIE_SHOP_COOLDOWN = 8.0;
const ENEMY_AXIE_SHOP_MAX_USES = 3;
let enemyAxieIsShopping = false;
let enemyAxieShopInteractionTimer = 0;

function enemyAxieTakeDamage(damage) {
    if (enemyAxieIsDead || !enemyAxie) return;
    enemyAxie.health -= damage;
    if (enemyAxie.health < 0) enemyAxie.health = 0;
    updateEnemyHealthBar();
    if (window.currentTarget && window.currentTarget.type === 'enemy_axie') {
        window.currentTarget.health = enemyAxie.health;
        window.showTarget(window.currentTarget);
    }
    if (enemyAxie.health <= 0) {
        enemyAxie.health = 0;
        enemyAxieIsDead = true;
        enemyAxieRespawnTimer = CONFIG.RESPAWN_TIME;
        if (enemyAxieModel) enemyAxieModel.visible = false;
        enemyAxieShopUses = 0;
        enemyAxieShopCooldown = 0;
        enemyAxieIsShopping = false;
        enemyAxieIsRetreating = false;
        enemyAxieRetreatTimer = 0;
        enemyAxieRetreatCooldown = 0;
        enemyAxieLastDamageTime = -999;
        enemyAxieBrain.stats._forcedPlayerTarget = null;
        enemyAxieBrain.stats.deaths++;
        enemyAxieBrain.weights.caution += 0.2;
        clampWeights(enemyAxieBrain.weights);
    }
}

function showDefeatScreen() {
    if (gameFinished) return;
    gameFinished = true;
    if (isAITrainingMode) { handleAITrainingMatchEnd('defeat'); return; }
    if (defeatScreen) defeatScreen.remove();
    defeatScreen = document.createElement('div');
    defeatScreen.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1000;`;
    defeatScreen.innerHTML = `
        <div style="font-size:80px;color:#ff2244;font-family:'Arial Black';">💀 DERROTA 💀</div>
        <button style="margin-top:40px;padding:16px 48px;font-size:24px;background:linear-gradient(135deg,#ff4444,#cc2222);color:#fff;border:none;border-radius:12px;cursor:pointer;" onclick="window.location.reload()">🏠 Ir a Inicio</button>
    `;
    document.body.appendChild(defeatScreen);
}

let enemyAxie = null;
let enemyAxieModel = null;
let enemyAxieMixer = null;
let enemyAxieAnimIdle = null;
let enemyAxieAnimWalk = null;
let enemyAxieCurrentAnim = 'idle';
let enemyAxieAttackCooldown = 0;
let enemyAxieHealth = CONFIG.enemyMaxHealth;
let enemyAxieMaxHealth = CONFIG.enemyMaxHealth;
let enemyAxieIsDead = false;
let enemyAxieRespawnTimer = 0;
let enemyAxieSpawned = false;
const ENEMY_AXIE_ATTACK_RANGE = 2.5;
const ENEMY_AXIE_ATTACK_DAMAGE = 10;
const ENEMY_AXIE_ATTACK_SPEED = 0.8;
const ENEMY_AXIE_SPEED = 1.2;
const ENEMY_AXIE_SPAWN_POS = new THREE.Vector3(0, 0, 22);

let enemyHealthBarMat = null;
const ENEMY_HEALTH_SEGMENTS = 10;

function makeEnemyAxieRef() {
    return {
        group: enemyAxieModel,
        isDead: enemyAxieIsDead,
        health: enemyAxie ? enemyAxie.health : 0,
        maxHealth: enemyAxieMaxHealth,
        type: 'enemy_axie',
        isEnemy: true,
        updateHealthBar: updateEnemyHealthBar,
        takeDamage: enemyAxieTakeDamage,
        die: function () {
            enemyAxieIsDead = true;
            enemyAxieRespawnTimer = CONFIG.RESPAWN_TIME;
            if (enemyAxieModel) enemyAxieModel.visible = false;
        }
    };
}

function spawnEnemyAxie() {
    if (enemyAxieSpawned || gameFinished) return;
    console.log(`🤖 [t=${gameTime.toFixed(2)}s] Spawneando Axie enemigo...`);
    const allAxies = getAllAxies();
    const available = allAxies.filter(a => a.id !== selectedAxieId);
    const randomAxie = available[Math.floor(Math.random() * available.length)];
    enemyAxie = { id: randomAxie.id, nombre: randomAxie.nombre, data: randomAxie, health: enemyAxieHealth, maxHealth: enemyAxieMaxHealth, isDead: false };
    
    enemyAxieGold = 0;
    enemyAxieItems = {};
    enemyAxieBonuses = { speedMultiplier: 1.0, damageMultiplier: 1.0, attackSpeedMultiplier: 1.0, rangeBonus: 0, critChance: 0 };
    enemyAxieShopCooldown = 0;
    enemyAxieShopUses = 0;
    enemyAxieIsShopping = false;
    enemyAxieIsRetreating = false;
    enemyAxieRetreatTimer = 0;
    enemyAxieRetreatCooldown = 0;
    enemyAxieLastDamageTime = -999;
    enemyAxieBrain.stats._forcedPlayerTarget = null;
    enemyAxieBrain.stats._lastTargetType = null;
    enemyAxiePotionCount = 0;
    enemyAxiePotionCooldown = 0;
    
    const loader = new GLTFLoader();
    // 🔧 FIX: resolver ruta con función auxiliar
    const modelPath = getAxieModelPath(randomAxie);
    console.log(`🤖 Cargando Axie enemigo: ${randomAxie.nombre} desde ${modelPath}`);
    loader.load(modelPath, (gltf) => {
        enemyAxieModel = gltf.scene;
        enemyAxieModel.position.set(ENEMY_AXIE_SPAWN_POS.x, GROUND_Y - 0.5, ENEMY_AXIE_SPAWN_POS.z);
        const escala = randomAxie.escala || 1.2;
        enemyAxieModel.scale.set(escala, escala, escala);
        enemyAxieModel.rotation.y = Math.PI;
        enemyAxieModel.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; } });
        scene.add(enemyAxieModel);
        enemyAxieMixer = new THREE.AnimationMixer(enemyAxieModel);
        gltf.animations.forEach(clip => {
            const name = clip.name.toLowerCase();
            if (name.includes('idle')) enemyAxieAnimIdle = enemyAxieMixer.clipAction(clip);
            if (name.includes('walk')) enemyAxieAnimWalk = enemyAxieMixer.clipAction(clip);
        });
        if (enemyAxieAnimIdle) { enemyAxieAnimIdle.play(); enemyAxieCurrentAnim = 'idle'; }
        const hb = createHealthBar(ENEMY_HEALTH_SEGMENTS, true);
        hb.sprite.position.set(0, 1.8, 0);
        enemyAxieModel.add(hb.sprite);
        enemyHealthBarMat = hb.spriteMat;
        enemyAxieSpawned = true;
    }, undefined, (err) => {
        console.error(`❌ Error cargando Axie enemigo:`, err);
        crearEnemyAxieFallback(randomAxie);
    });
}

function crearEnemyAxieFallback(axieData) {
    const group = new THREE.Group();
    group.position.set(ENEMY_AXIE_SPAWN_POS.x, GROUND_Y - 0.5, ENEMY_AXIE_SPAWN_POS.z);
    const color = new THREE.Color(axieData.color || '#ff4444');
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
    body.position.y = 0.6;
    group.add(body);
    scene.add(group);
    enemyAxieModel = group;
    enemyAxieSpawned = true;
    const hb = createHealthBar(ENEMY_HEALTH_SEGMENTS, true);
    hb.sprite.position.set(0, 1.8, 0);
    group.add(hb.sprite);
    enemyHealthBarMat = hb.spriteMat;
}

function updateEnemyHealthBar() {
    if (!enemyHealthBarMat || !enemyAxie) return;
    const hp = Math.max(0, enemyAxie.health / enemyAxieMaxHealth);
    const vis = Math.max(0, Math.min(ENEMY_HEALTH_SEGMENTS, Math.ceil(hp * ENEMY_HEALTH_SEGMENTS)));
    updateHealthBarSprite(enemyHealthBarMat, ENEMY_HEALTH_SEGMENTS, vis, true);
}

function buyEnemyAxieItems() {
    if (enemyAxieGold >= CONFIG.AXIE_POTION_BUY_THRESHOLD && enemyAxiePotionCount < CONFIG.AXIE_MAX_POTIONS) {
        const cantidad = Math.min(
            Math.floor(enemyAxieGold / CONFIG.AXIE_POTION_COST),
            CONFIG.AXIE_MAX_POTIONS - enemyAxiePotionCount
        );
        if (cantidad > 0) {
            const costo = cantidad * CONFIG.AXIE_POTION_COST;
            enemyAxieGold -= costo;
            enemyAxiePotionCount += cantidad;
            console.log(`🧪 Axie enemigo compró ${cantidad} pociones (total: ${enemyAxiePotionCount}/${CONFIG.AXIE_MAX_POTIONS}) | Oro: ${enemyAxieGold}`);
            return;
        }
    }
    
    const hpPct = enemyAxie.health / enemyAxieMaxHealth;
    const enemiesAlive = aliados.filter(m => !m.isDead).length;
    const allyTowersAlive = towers.filter(t => !t.isDead && !t.isEnemy).length;
    const priorities = [];
    if (hpPct < 0.5) priorities.push('botas', 'espada');
    if (allyTowersAlive > 0) priorities.push('espada', 'daga');
    if (enemiesAlive > 3) priorities.push('arco', 'baculo');
    priorities.push('espada', 'botas', 'arco', 'daga', 'baculo');
    for (const itemId of priorities) {
        const item = ENEMY_AXIE_ITEM_CATALOG[itemId];
        if (!item) continue;
        const stack = enemyAxieItems[itemId] || 0;
        if (stack >= item.maxStack) continue;
        if (enemyAxieGold < item.cost) continue;
        enemyAxieGold -= item.cost;
        enemyAxieItems[itemId] = stack + 1;
        item.apply(enemyAxieBonuses);
        console.log(`🛒 Axie enemigo compró ${item.emoji} ${item.name} (${enemyAxieGold} oro restante)`);
        break;
    }
}

function buyPlayerAIItems() {
    if (playerAIGold >= CONFIG.AXIE_POTION_BUY_THRESHOLD && playerAIPotionCount < CONFIG.AXIE_MAX_POTIONS) {
        const cantidad = Math.min(
            Math.floor(playerAIGold / CONFIG.AXIE_POTION_COST),
            CONFIG.AXIE_MAX_POTIONS - playerAIPotionCount
        );
        if (cantidad > 0) {
            const costo = cantidad * CONFIG.AXIE_POTION_COST;
            playerAIGold -= costo;
            playerAIPotionCount += cantidad;
            console.log(`🧪 Jugador-IA compró ${cantidad} pociones (total: ${playerAIPotionCount}/${CONFIG.AXIE_MAX_POTIONS}) | Oro: ${playerAIGold}`);
            return;
        }
    }
    
    const hpPct = playerHealth / playerMaxHealth;
    const enemiesAlive = enemigos.filter(m => !m.isDead).length;
    const enemyTowersAlive = towers.filter(t => !t.isDead && t.isEnemy).length;
    const priorities = [];
    if (hpPct < 0.5) priorities.push('botas', 'espada');
    if (enemyTowersAlive > 0) priorities.push('espada', 'daga');
    if (enemiesAlive > 3) priorities.push('arco', 'baculo');
    priorities.push('espada', 'botas', 'arco', 'daga', 'baculo');
    for (const itemId of priorities) {
        const item = ENEMY_AXIE_ITEM_CATALOG[itemId];
        if (!item) continue;
        const stack = playerAIItems[itemId] || 0;
        if (stack >= item.maxStack) continue;
        if (playerAIGold < item.cost) continue;
        playerAIGold -= item.cost;
        playerAIItems[itemId] = stack + 1;
        item.apply(playerAIBonuses);
        console.log(`🛒 Jugador-IA compró ${item.emoji} ${item.name} (${playerAIGold} oro restante)`);
        break;
    }
}

function findBestEnemyTarget() {
    if (!enemyAxieModel || enemyAxieIsDead) return null;
    const enemyPos = enemyAxieModel.position;
    const w = enemyAxieBrain.weights;
    const hpPct = enemyAxie.health / enemyAxieMaxHealth;
    
    const timeSinceDamageShop = gameTime - enemyAxieLastDamageTime;
    const underAttack = timeSinceDamageShop < CONFIG.AXIE_SHOP_DAMAGE_MEMORY;
    const lowHP = hpPct < CONFIG.AXIE_SHOP_HP_MIN;
    
    const canUseShop = shopEnemiga && enemyAxieShopCooldown <= 0 && enemyAxieShopUses < ENEMY_AXIE_SHOP_MAX_USES;
    const hasItemsToBuy = Object.entries(ENEMY_AXIE_ITEM_CATALOG).some(([id, item]) => {
        const stack = enemyAxieItems[id] || 0;
        return stack < item.maxStack && enemyAxieGold >= item.cost;
    });
    const hasGoldForPotions = enemyAxieGold >= CONFIG.AXIE_POTION_BUY_THRESHOLD && enemyAxiePotionCount < CONFIG.AXIE_MAX_POTIONS;
    const hasMinGold = enemyAxieGold >= 30;
    
    if (hasMinGold && !underAttack && !lowHP && (hasItemsToBuy || hasGoldForPotions) && canUseShop) {
        const dts = enemyPos.distanceTo(shopEnemiga.group.position);
        if (dts < 40) {
            const shopPos = shopEnemiga.group.position.clone();
            shopPos.x = Math.max(-17, Math.min(17, shopPos.x));
            shopPos.z = Math.max(-26, Math.min(26, shopPos.z));
            return { position: shopPos, type: 'shop', isDead: false, dist: dts, isShopRun: true };
        }
    }

    const candidates = [];
    const enemiesAlive = aliados.filter(m => !m.isDead).length;
    const myAlliesAlive = enemigos.filter(m => !m.isDead).length;
    const aliveAllyTowers = towers.filter(t => !t.isDead && !t.isEnemy);
    const myTowers = towers.filter(t => !t.isDead && t.isEnemy);
    const hasAdvantage = myAlliesAlive > enemiesAlive;

    for (const minion of aliados) {
        if (minion.isDead) continue;
        if (Math.abs(minion.group.position.x) > 3.0) continue;
        const dist = enemyPos.distanceTo(minion.group.position);
        if (dist > 20) continue;
        const isAhead = minion.group.position.z < enemyPos.z + 2;
        if (!isAhead) continue;
        let score = 200 - dist * 3;
        if (minion.health / minion.maxHealth < 0.3) score += 40;
        if (minion.tipo === 'mage') score += 15;
        candidates.push({ position: minion.group.position, type: 'minion', health: minion.health, isDead: minion.isDead, ref: minion, dist, score, reason: '🗡️ Limpiar carril' });
    }

    if (playerModel && !isPlayerDead && playerSpawned) {
        const dist = enemyPos.distanceTo(playerModel.position);
        const playerAggroRange = CONFIG.AXIE_AGGRO_TO_PLAYER + (w.focusPlayer - 1.0) * 3.0;
        if (dist < playerAggroRange && Math.abs(playerModel.position.x - enemyPos.x) < 3.5) {
            let score = 250 - dist * 5;
            if (playerHealth / playerMaxHealth < 0.3) score += 100;
            if (playerHealth / playerMaxHealth < 0.15) score += 150;
            candidates.push({ position: playerModel.position, type: 'player', health: playerHealth, isDead: isPlayerDead, ref: { group: playerModel, type: 'player' }, dist, score, takeDamage: playerTakeDamage, reason: '⚔️ Jugador' });
        }
    }

    const minionsInLane = aliados.filter(m => !m.isDead && Math.abs(m.group.position.x) < 3.0).length;
    if (minionsInLane === 0) {
        for (const tower of aliveAllyTowers) {
            const dist = enemyPos.distanceTo(tower.position);
            if (dist >= 25) continue;
            let score = 80 + (25 - dist) * 2 * w.focusStructure;
            if (enemiesAlive === 0) score += 150;
            else if (hasAdvantage) score += 60;
            const tHP = tower.health / tower.maxHealth;
            if (tHP < 0.3) score += 60;
            if (tHP < 0.1) score += 100;
            if (hpPct < 0.4 && dist < 7) score -= 100;
            candidates.push({ position: tower.position, type: 'tower', health: tower.health, isDead: tower.isDead, ref: tower, dist, score, reason: '🗼 Torre' });
        }
    }

    for (const myTower of myTowers) {
        for (const enemy of aliados) {
            if (enemy.isDead) continue;
            if (enemy.group.position.distanceTo(myTower.position) < 5.5) {
                const d = enemyPos.distanceTo(enemy.group.position);
                if (d < 16) candidates.push({ position: enemy.group.position, type: 'defend', isDead: enemy.isDead, ref: enemy, dist: d, score: 250, reason: '🛡️ Defensa' });
            }
        }
        if (playerModel && !isPlayerDead && playerSpawned && playerModel.position.distanceTo(myTower.position) < 6.5) {
            const d = enemyPos.distanceTo(playerModel.position);
            if (d < 16) candidates.push({ position: playerModel.position, type: 'defend_player', isDead: isPlayerDead, ref: { group: playerModel, type: 'player' }, dist: d, score: 260 });
        }
    }

    if (nexusAliado && !nexusAliado.isDead && aliveAllyTowers.length === 0 && minionsInLane === 0) {
        const dist = enemyPos.distanceTo(nexusAliado.position);
        if (dist < 30) {
            let score = 120 + (30 - dist) * 2 * w.focusStructure;
            if (enemiesAlive === 0) score += 100;
            candidates.push({ position: nexusAliado.position, type: 'nexus', health: nexusAliado.health, isDead: nexusAliado.isDead, ref: nexusAliado, dist, score, reason: '💎 Nexo' });
        }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
}

function enemyAxieAttack(target) {
    if (!target || target.isDead || enemyAxieIsDead) return;
    if (target.type === 'tower' || target.type === 'nexus') {
        enemyAxieBrain.weights.focusStructure = Math.min(2.5, enemyAxieBrain.weights.focusStructure + 0.03);
    }
    if (target.type === 'player' || target.type === 'defend_player') {
        enemyAxieBrain.weights.focusPlayer = Math.min(2.5, enemyAxieBrain.weights.focusPlayer + 0.05);
    }
    const isCrit = Math.random() < enemyAxieBonuses.critChance;
    const fd = Math.round(ENEMY_AXIE_ATTACK_DAMAGE * enemyAxieBonuses.damageMultiplier * (isCrit ? 2 : 1));
    if (target.type === 'player' || target.type === 'defend_player') {
        playerTakeDamage(fd);
        if (isPlayerDead) enemyAxieGold += 50;
        return;
    }
    if (target.ref && target.ref.health !== undefined) {
        target.ref.health -= fd;
        if (target.ref.updateHealthBar) target.ref.updateHealthBar();
        if (target.ref.health <= 0 && target.ref.die) {
            target.ref.die('enemy_axie');
            if (target.type === 'minion') enemyAxieGold += 15;
            else if (target.type === 'tower') enemyAxieGold += 80;
            else if (target.type === 'nexus') enemyAxieGold += 150;
        }
    }
}

function updateEnemyAxie(delta) {
    if (!enemyAxieSpawned || !enemyAxieModel || gameFinished) return;
    if (enemyAxieIsDead) {
        enemyAxieRespawnTimer -= delta;
        if (enemyAxieRespawnTimer <= 0) {
            enemyAxieIsDead = false;
            enemyAxie.health = enemyAxieMaxHealth;
            if (enemyAxieModel) {
                enemyAxieModel.position.set(ENEMY_AXIE_SPAWN_POS.x, GROUND_Y - 0.5, ENEMY_AXIE_SPAWN_POS.z);
                enemyAxieModel.visible = true;
                enemyAxieModel.rotation.y = Math.PI;
            }
            updateEnemyHealthBar();
        }
        return;
    }
    
    if (enemyAxiePotionCooldown > 0) enemyAxiePotionCooldown -= delta;
    const hpPctNow = enemyAxie.health / enemyAxieMaxHealth;
    if (hpPctNow < CONFIG.AXIE_POTION_USE_THRESHOLD && enemyAxiePotionCount > 0 && enemyAxiePotionCooldown <= 0) {
        enemyAxiePotionCount--;
        enemyAxiePotionCooldown = ENEMY_AXIE_POTION_COOLDOWN;
        enemyAxie.health = Math.min(enemyAxieMaxHealth, enemyAxie.health + CONFIG.AXIE_POTION_HEAL);
        updateEnemyHealthBar();
        console.log(`💊 Axie enemigo usó poción (+${CONFIG.AXIE_POTION_HEAL} HP) | HP: ${Math.floor(enemyAxie.health)}/${enemyAxieMaxHealth} | Pociones: ${enemyAxiePotionCount}`);
    }
    
    if (enemyAxieShopCooldown > 0) {
        enemyAxieShopCooldown -= delta;
        if (enemyAxieShopCooldown < 0) enemyAxieShopCooldown = 0;
    }
    const diffY = GROUND_Y - enemyAxieModel.position.y;
    if (Math.abs(diffY) > 0.001) enemyAxieModel.position.y += diffY * Math.min(1, 6 * delta);
    else enemyAxieModel.position.y = GROUND_Y;
    
    if (enemyAxieRetreatCooldown > 0) enemyAxieRetreatCooldown -= delta;
    if (enemyAxieRetreatTimer > 0) enemyAxieRetreatTimer -= delta;

    const timeSinceDamage = gameTime - enemyAxieLastDamageTime;
    const hasRecentDamage = timeSinceDamage < ENEMY_AXIE_DAMAGE_MEMORY;
    const nearShootingTower = towers.some(t => 
        !t.isDead && !t.isEnemy && 
        enemyAxieModel.position.distanceTo(t.position) < (t.range + 0.5)
    );
    
    if (hasRecentDamage && nearShootingTower && !enemyAxieIsRetreating && enemyAxieRetreatCooldown <= 0) {
        enemyAxieIsRetreating = true;
        enemyAxieRetreatTimer = CONFIG.AXIE_RETREAT_MIN_TIME;
        console.log('🚨 Axie enemigo retrocede fuera del rango de torre');
    }
    
    if (enemyAxieIsRetreating) {
        const mustKeepRetreating = enemyAxieRetreatTimer > 0;
        const shootingTowers = towers.filter(t => !t.isDead && !t.isEnemy);
        let nearestTower = null;
        let nearestTowerDist = Infinity;
        for (const t of shootingTowers) {
            const d = enemyAxieModel.position.distanceTo(t.position);
            if (d < nearestTowerDist) { nearestTowerDist = d; nearestTower = t; }
        }
        
        if (nearestTower) {
            const safeDist = nearestTower.range + CONFIG.AXIE_RETREAT_SAFE_DISTANCE;
            const dx = enemyAxieModel.position.x - nearestTower.position.x;
            const dz = enemyAxieModel.position.z - nearestTower.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            
            if (dist < safeDist || mustKeepRetreating) {
                const targetX = nearestTower.position.x + (dx / (dist || 1)) * safeDist;
                const targetZ = nearestTower.position.z + (dz / (dist || 1)) * safeDist;
                const rdx = targetX - enemyAxieModel.position.x;
                const rdz = targetZ - enemyAxieModel.position.z;
                const rdist = Math.sqrt(rdx * rdx + rdz * rdz);
                
                if (rdist > 0.15) {
                    const ms = ENEMY_AXIE_SPEED * 1.3 * enemyAxieBonuses.speedMultiplier * delta;
                    enemyAxieModel.position.x += (rdx / rdist) * ms;
                    enemyAxieModel.position.z += (rdz / rdist) * ms;
                    enemyAxieModel.rotation.y = Math.atan2(rdx, rdz);
                    
                    if (enemyAxieCurrentAnim !== 'walk' && enemyAxieAnimWalk) {
                        if (enemyAxieAnimIdle) enemyAxieAnimIdle.stop();
                        enemyAxieAnimWalk.play();
                        enemyAxieCurrentAnim = 'walk';
                    }
                } else if (!mustKeepRetreating) {
                    enemyAxieIsRetreating = false;
                    enemyAxieRetreatCooldown = CONFIG.AXIE_RETREAT_COOLDOWN;
                    console.log('✅ Axie enemigo fuera del rango de torre');
                }
            } else if (!mustKeepRetreating) {
                enemyAxieIsRetreating = false;
                enemyAxieRetreatCooldown = CONFIG.AXIE_RETREAT_COOLDOWN;
                console.log('✅ Axie enemigo fuera del rango de torre');
            }
        } else if (!mustKeepRetreating) {
            enemyAxieIsRetreating = false;
            enemyAxieRetreatCooldown = CONFIG.AXIE_RETREAT_COOLDOWN;
        }
        
        enemyAxieModel.position.x = Math.max(-17, Math.min(17, enemyAxieModel.position.x));
        enemyAxieModel.position.z = Math.max(-26, Math.min(26, enemyAxieModel.position.z));
        updateEnemyHealthBar();
        if (enemyAxieMixer) enemyAxieMixer.update(delta);
        return;
    }
    
    enemyAxieAttackCooldown -= delta * enemyAxieBonuses.attackSpeedMultiplier;

    if (playerModel && !isPlayerDead && playerSpawned) {
        const distToPlayer = enemyAxieModel.position.distanceTo(playerModel.position);
        const playerPhysRange = ENEMY_AXIE_ATTACK_RANGE + enemyAxieBonuses.rangeBonus;
        if (distToPlayer < playerPhysRange) {
            enemyAxieModel.rotation.y = Math.atan2(
                playerModel.position.x - enemyAxieModel.position.x,
                playerModel.position.z - enemyAxieModel.position.z
            );
            if (enemyAxieAttackCooldown <= 0) {
                enemyAxieAttack({
                    type: 'player',
                    isDead: false,
                    ref: { group: playerModel, type: 'player' }
                });
                enemyAxieAttackCooldown = ENEMY_AXIE_ATTACK_SPEED;
            }
            if (enemyAxieCurrentAnim !== 'idle' && enemyAxieAnimIdle) {
                if (enemyAxieAnimWalk) enemyAxieAnimWalk.stop();
                enemyAxieAnimIdle.play();
                enemyAxieCurrentAnim = 'idle';
            }
            updateEnemyHealthBar();
            if (enemyAxieMixer) enemyAxieMixer.update(delta);
            return;
        }
    }

    const bestTarget = findBestEnemyTarget();
    if (bestTarget) {
        const dynamicRange = ENEMY_AXIE_ATTACK_RANGE + enemyAxieBonuses.rangeBonus;
        const distToTarget = enemyAxieModel.position.distanceTo(bestTarget.position);
        
        if (bestTarget.isShopRun) {
            const nearbyEnemyMinion = aliados.find(m => !m.isDead && enemyAxieModel.position.distanceTo(m.group.position) < CONFIG.AXIE_SHOP_ENEMY_NEARBY_RADIUS);
            const nearbyPlayer = playerModel && !isPlayerDead && playerSpawned && enemyAxieModel.position.distanceTo(playerModel.position) < CONFIG.AXIE_SHOP_ENEMY_NEARBY_RADIUS;
            
            if (nearbyEnemyMinion || nearbyPlayer) {
                enemyAxieShopCooldown = 5.0;
                enemyAxieIsShopping = false;
                console.log('⚔️ Axie enemigo cancela tienda (enemigo cercano)');
            } else {
                const timeSinceDamageInShop = gameTime - enemyAxieLastDamageTime;
                const underAttackInShop = timeSinceDamageInShop < CONFIG.AXIE_SHOP_CANCEL_DAMAGE_MEMORY;
                const hpPctInShop = enemyAxie.health / enemyAxieMaxHealth;
                
                if (underAttackInShop || hpPctInShop < CONFIG.AXIE_SHOP_CANCEL_HP) {
                    enemyAxieShopCooldown = 5.0;
                    enemyAxieIsShopping = false;
                    console.log('⚠️ Axie enemigo cancela ida a tienda (bajo ataque o HP bajo)');
                } else {
                    const dx = bestTarget.position.x - enemyAxieModel.position.x;
                    const dz = bestTarget.position.z - enemyAxieModel.position.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    const shopReachDist = 2.0;
                    if (dist > shopReachDist) {
                        const ms = ENEMY_AXIE_SPEED * 1.15 * enemyAxieBonuses.speedMultiplier * delta;
                        enemyAxieModel.position.x += (dx / dist) * ms;
                        enemyAxieModel.position.z += (dz / dist) * ms;
                        enemyAxieModel.rotation.y = Math.atan2(dx, dz);
                        if (enemyAxieCurrentAnim !== 'walk' && enemyAxieAnimWalk) {
                            if (enemyAxieAnimIdle) enemyAxieAnimIdle.stop();
                            enemyAxieAnimWalk.play();
                            enemyAxieCurrentAnim = 'walk';
                        }
                    } else {
                        if (!enemyAxieIsShopping) {
                            const canBuySomething = Object.entries(ENEMY_AXIE_ITEM_CATALOG).some(([id, item]) => {
                                const stack = enemyAxieItems[id] || 0;
                                return stack < item.maxStack && enemyAxieGold >= item.cost;
                            }) || (enemyAxieGold >= CONFIG.AXIE_POTION_BUY_THRESHOLD && enemyAxiePotionCount < CONFIG.AXIE_MAX_POTIONS);
                            
                            if (canBuySomething) {
                                enemyAxieIsShopping = true;
                                enemyAxieShopUses++;
                                enemyAxieShopCooldown = ENEMY_AXIE_SHOP_COOLDOWN;
                                buyEnemyAxieItems();
                                console.log('🛒 Axie enemigo compró items');
                                enemyAxieShopInteractionTimer = 1.0;
                            } else {
                                enemyAxieShopCooldown = 5.0;
                                enemyAxieShopInteractionTimer = 0;
                                enemyAxieIsShopping = false;
                                console.log('⚠️ Axie enemigo no puede comprar, volviendo al combate');
                            }
                        }
                    }
                    if (enemyAxieShopInteractionTimer > 0) {
                        enemyAxieShopInteractionTimer -= delta;
                        if (enemyAxieShopInteractionTimer <= 0) enemyAxieIsShopping = false;
                    }
                }
            }
        } else if (distToTarget <= dynamicRange) {
            enemyAxieModel.rotation.y = Math.atan2(bestTarget.position.x - enemyAxieModel.position.x, bestTarget.position.z - enemyAxieModel.position.z);
            if (enemyAxieAttackCooldown <= 0) {
                enemyAxieAttack(bestTarget);
                enemyAxieAttackCooldown = ENEMY_AXIE_ATTACK_SPEED;
            }
            if (enemyAxieCurrentAnim !== 'idle' && enemyAxieAnimIdle) {
                if (enemyAxieAnimWalk) enemyAxieAnimWalk.stop();
                enemyAxieAnimIdle.play();
                enemyAxieCurrentAnim = 'idle';
            }
        } else {
            const dx = bestTarget.position.x - enemyAxieModel.position.x;
            const dz = bestTarget.position.z - enemyAxieModel.position.z;
            const td = Math.sqrt(dx * dx + dz * dz);
            if (td > 0.5) {
                const speedBoost = (bestTarget.type === 'player' || bestTarget.type === 'defend_player') ? 1.3 : 1.0;
                const ms = ENEMY_AXIE_SPEED * enemyAxieBonuses.speedMultiplier * speedBoost * delta;
                enemyAxieModel.position.x += (dx / td) * ms;
                enemyAxieModel.position.z += (dz / td) * ms;
                enemyAxieModel.rotation.y = Math.atan2(dx, dz);
                if (enemyAxieCurrentAnim !== 'walk' && enemyAxieAnimWalk) {
                    if (enemyAxieAnimIdle) enemyAxieAnimIdle.stop();
                    enemyAxieAnimWalk.play();
                    enemyAxieCurrentAnim = 'walk';
                }
            }
        }
    } else {
        const ms = ENEMY_AXIE_SPEED * enemyAxieBonuses.speedMultiplier * delta * 0.8;
        enemyAxieModel.position.z -= ms;
        if (enemyAxieModel.position.z < -26) enemyAxieModel.position.z = -26;
    }
    enemyAxieModel.position.x = Math.max(-17, Math.min(17, enemyAxieModel.position.x));
    updateEnemyHealthBar();
    if (enemyAxieMixer) enemyAxieMixer.update(delta);
}

function resetEnemyAxie() {
    if (enemyAxieModel) { scene.remove(enemyAxieModel); enemyAxieModel = null; }
    enemyAxie = null;
    enemyAxieMixer = null;
    enemyAxieAnimIdle = null;
    enemyAxieAnimWalk = null;
    enemyAxieSpawned = false;
    enemyAxieIsDead = false;
    enemyAxieHealth = enemyAxieMaxHealth;
    enemyAxieRespawnTimer = 0;
    enemyHealthBarMat = null;
    enemyAxieShopUses = 0;
    enemyAxieShopCooldown = 0;
    enemyAxieIsShopping = false;
    enemyAxieShopInteractionTimer = 0;
    enemyAxieIsRetreating = false;
    enemyAxieRetreatTimer = 0;
    enemyAxieRetreatCooldown = 0;
    enemyAxieLastDamageTime = -999;
    enemyAxieGold = 0;
    enemyAxieItems = {};
    enemyAxieBonuses = { speedMultiplier: 1.0, damageMultiplier: 1.0, attackSpeedMultiplier: 1.0, rangeBonus: 0, critChance: 0 };
    enemyAxieBrain.stats._forcedPlayerTarget = null;
    enemyAxieBrain.stats._lastTargetType = null;
    enemyAxiePotionCount = 0;
    enemyAxiePotionCooldown = 0;
}

function resolveMinionCollisions(delta) {
    const all = aliados.concat(enemigos);
    const minDist = CONFIG.MINION_COLLISION_DISTANCE;
    
    for (let i = 0; i < all.length; i++) {
        const a = all[i];
        if (a.isDead || !a.group.visible) continue;
        for (let j = i + 1; j < all.length; j++) {
            const b = all[j];
            if (b.isDead || !b.group.visible) continue;
            const dx = b.group.position.x - a.group.position.x;
            const dz = b.group.position.z - a.group.position.z;
            const dSq = dx * dx + dz * dz;
            if (dSq < minDist * minDist && dSq > 0.0001) {
                const dist = Math.sqrt(dSq);
                const overlap = (minDist - dist) * 0.04;
                const nx = dx / dist, nz = dz / dist;
                a.group.position.x -= nx * overlap;
                a.group.position.z -= nz * overlap;
                b.group.position.x += nx * overlap;
                b.group.position.z += nz * overlap;
            }
        }
    }
    
    for (const m of all) {
        if (m.isDead || !m.group.visible) continue;
        clampMinionToLane(m);
    }
}

function findBestPlayerAITarget() {
    if (!playerModel || isPlayerDead) return null;
    const playerPos = playerModel.position;
    const candidates = [];
    const hpPct = playerHealth / playerMaxHealth;
    const enemiesAlive = enemigos.filter(m => !m.isDead).length;
    const aliveEnemyTowers = towers.filter(t => !t.isDead && t.isEnemy);
    const myTowers = towers.filter(t => !t.isDead && !t.isEnemy);
    const hasAdvantage = aliados.filter(m => !m.isDead).length > enemiesAlive;

    for (const minion of enemigos) {
        if (minion.isDead) continue;
        if (Math.abs(minion.group.position.x) > 3.0) continue;
        const dist = playerPos.distanceTo(minion.group.position);
        if (dist > 20) continue;
        const isAhead = minion.group.position.z > playerPos.z - 2;
        if (!isAhead) continue;
        let score = 200 - dist * 3;
        if (minion.health / minion.maxHealth < 0.3) score += 40;
        if (minion.tipo === 'mage') score += 15;
        candidates.push({ position: minion.group.position, type: 'minion', isDead: minion.isDead, ref: minion, dist, score, reason: '🗡️ Limpiar carril' });
    }

    if (enemyAxieModel && !enemyAxieIsDead) {
        const dist = playerPos.distanceTo(enemyAxieModel.position);
        const axieAggroRange = CONFIG.AXIE_AGGRO_TO_PLAYER;
        if (dist < axieAggroRange && Math.abs(enemyAxieModel.position.x - playerPos.x) < 3.5) {
            let score = 250 - dist * 5;
            const eHP = enemyAxie ? enemyAxie.health / enemyAxieMaxHealth : 1;
            if (eHP < 0.3) score += 100;
            if (eHP < 0.15) score += 150;
            candidates.push({ position: enemyAxieModel.position, type: 'enemy_axie', isDead: enemyAxieIsDead, ref: makeEnemyAxieRef(), dist, score, reason: '⚔️ Axie enemigo' });
        }
    }

    const minionsInLane = enemigos.filter(m => !m.isDead && Math.abs(m.group.position.x) < 3.0).length;
    if (minionsInLane === 0) {
        for (const tower of aliveEnemyTowers) {
            const dist = playerPos.distanceTo(tower.position);
            if (dist >= 25) continue;
            let score = 80 + (25 - dist) * 2;
            if (enemiesAlive === 0) score += 150;
            else if (hasAdvantage) score += 60;
            const tHP = tower.health / tower.maxHealth;
            if (tHP < 0.3) score += 60;
            if (hpPct < 0.4 && dist < 7) score -= 100;
            candidates.push({ position: tower.position, type: 'tower', isDead: tower.isDead, ref: tower, dist, score, reason: '🗼 Torre' });
        }
    }

    for (const myTower of myTowers) {
        for (const enemy of enemigos) {
            if (enemy.isDead) continue;
            if (enemy.group.position.distanceTo(myTower.position) < 5.5) {
                const d = playerPos.distanceTo(enemy.group.position);
                if (d < 16) candidates.push({ position: enemy.group.position, type: 'defend', isDead: enemy.isDead, ref: enemy, dist: d, score: 250, reason: '🛡️ Defensa' });
            }
        }
        if (enemyAxieModel && !enemyAxieIsDead && enemyAxieModel.position.distanceTo(myTower.position) < 6.5) {
            const d = playerPos.distanceTo(enemyAxieModel.position);
            if (d < 16) candidates.push({ position: enemyAxieModel.position, type: 'defend_axie', isDead: enemyAxieIsDead, ref: makeEnemyAxieRef(), dist: d, score: 260, reason: '🛡️ Defensa Axie' });
        }
    }

    if (nexusEnemigo && !nexusEnemigo.isDead && aliveEnemyTowers.length === 0 && minionsInLane === 0) {
        const dist = playerPos.distanceTo(nexusEnemigo.position);
        if (dist < 30) {
            let score = 120 + (30 - dist) * 2;
            if (enemiesAlive === 0) score += 100;
            candidates.push({ position: nexusEnemigo.position, type: 'nexus', isDead: nexusEnemigo.isDead, ref: nexusEnemigo, dist, score, reason: '💎 Nexo' });
        }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].ref;
}

function updatePlayerAsAI(delta) {
    if (!isAITrainingMode || !playerModel || isPlayerDead || gameFinished) return;
    if (!playerSpawned) return;
    
    if (playerAIPotionCooldown > 0) playerAIPotionCooldown -= delta;
    const hpPctAI = playerHealth / playerMaxHealth;
    if (hpPctAI < CONFIG.AXIE_POTION_USE_THRESHOLD && playerAIPotionCount > 0 && playerAIPotionCooldown <= 0) {
        playerAIPotionCount--;
        playerAIPotionCooldown = PLAYER_AI_POTION_COOLDOWN;
        playerHealth = Math.min(playerMaxHealth, playerHealth + CONFIG.AXIE_POTION_HEAL);
        updatePlayerHUD();
        console.log(`💊 Jugador-IA usó poción (+${CONFIG.AXIE_POTION_HEAL} HP) | HP: ${Math.floor(playerHealth)}/${playerMaxHealth} | Pociones: ${playerAIPotionCount}`);
    }
    
    if (playerAIShopCooldown > 0) {
        playerAIShopCooldown -= delta;
        if (playerAIShopCooldown < 0) playerAIShopCooldown = 0;
    }
    
    if (playerAIRetreatCooldown > 0) playerAIRetreatCooldown -= delta;
    if (playerAIRetreatTimer > 0) playerAIRetreatTimer -= delta;

    const timeSinceDamage = gameTime - playerAILastDamageTime;
    const hasRecentDamage = timeSinceDamage < PLAYER_AI_DAMAGE_MEMORY;
    const nearShootingTower = towers.some(t => 
        !t.isDead && t.isEnemy && 
        playerModel.position.distanceTo(t.position) < (t.range + 0.5)
    );
    
    if (hasRecentDamage && nearShootingTower && !playerAIIsRetreating && playerAIRetreatCooldown <= 0) {
        playerAIIsRetreating = true;
        playerAIRetreatTimer = CONFIG.AXIE_RETREAT_MIN_TIME;
        console.log('🚨 Jugador-IA retrocede fuera del rango de torre');
    }
    
    if (playerAIIsRetreating) {
        const mustKeepRetreating = playerAIRetreatTimer > 0;
        const shootingTowers = towers.filter(t => !t.isDead && t.isEnemy);
        let nearestTower = null;
        let nearestTowerDist = Infinity;
        for (const t of shootingTowers) {
            const d = playerModel.position.distanceTo(t.position);
            if (d < nearestTowerDist) { nearestTowerDist = d; nearestTower = t; }
        }
        
        if (nearestTower) {
            const safeDist = nearestTower.range + CONFIG.AXIE_RETREAT_SAFE_DISTANCE;
            const dx = smoothPlayerPos.x - nearestTower.position.x;
            const dz = smoothPlayerPos.z - nearestTower.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            
            if (dist < safeDist || mustKeepRetreating) {
                const targetX = nearestTower.position.x + (dx / (dist || 1)) * safeDist;
                const targetZ = nearestTower.position.z + (dz / (dist || 1)) * safeDist;
                const rdx = targetX - smoothPlayerPos.x;
                const rdz = targetZ - smoothPlayerPos.z;
                const rdist = Math.sqrt(rdx * rdx + rdz * rdz);
                
                if (rdist > 0.15) {
                    const ms = playerSpeed * 1.3 * playerAIBonuses.speedMultiplier * delta;
                    smoothPlayerPos.x += (rdx / rdist) * ms;
                    smoothPlayerPos.z += (rdz / rdist) * ms;
                    smoothPlayerPos.y = GROUND_Y;
                    smoothPlayerPos.x = Math.max(-17, Math.min(17, smoothPlayerPos.x));
                    smoothPlayerPos.z = Math.max(-26, Math.min(26, smoothPlayerPos.z));
                    
                    if (currentAnim !== 'walk' && animWalk) {
                        if (animIdle) animIdle.stop();
                        animWalk.play();
                        currentAnim = 'walk';
                    }
                    
                    const angle = Math.atan2(rdx, rdz);
                    let diff = angle - playerModel.rotation.y;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    playerModel.rotation.y += diff * Math.min(1, 6 * delta);
                } else if (!mustKeepRetreating) {
                    playerAIIsRetreating = false;
                    playerAIRetreatCooldown = CONFIG.AXIE_RETREAT_COOLDOWN;
                    console.log('✅ Jugador-IA fuera del rango de torre');
                }
            } else if (!mustKeepRetreating) {
                playerAIIsRetreating = false;
                playerAIRetreatCooldown = CONFIG.AXIE_RETREAT_COOLDOWN;
                console.log('✅ Jugador-IA fuera del rango de torre');
            }
        } else if (!mustKeepRetreating) {
            playerAIIsRetreating = false;
            playerAIRetreatCooldown = CONFIG.AXIE_RETREAT_COOLDOWN;
        }
        
        playerModel.position.x = smoothPlayerPos.x;
        playerModel.position.z = smoothPlayerPos.z;
        playerModel.position.y = GROUND_Y;
        return;
    }
    
    playerAITargetTimer -= delta;
    
    const timeSinceDamageShopAI = gameTime - playerAILastDamageTime;
    const underAttackAI = timeSinceDamageShopAI < CONFIG.AXIE_SHOP_DAMAGE_MEMORY;
    const lowHPAI = hpPctAI < CONFIG.AXIE_SHOP_HP_MIN;
    
    const canUseShop = shopAliada && playerAIShopCooldown <= 0 && playerAIShopUses < PLAYER_AI_SHOP_MAX_USES;
    const hasItemsToBuyAI = Object.entries(ENEMY_AXIE_ITEM_CATALOG).some(([id, item]) => {
        const stack = playerAIItems[id] || 0;
        return stack < item.maxStack && playerAIGold >= item.cost;
    });
    const hasGoldForPotionsAI = playerAIGold >= CONFIG.AXIE_POTION_BUY_THRESHOLD && playerAIPotionCount < CONFIG.AXIE_MAX_POTIONS;
    const hasMinGoldAI = playerAIGold >= 30;
    
    if (hasMinGoldAI && !underAttackAI && !lowHPAI && (hasItemsToBuyAI || hasGoldForPotionsAI) && canUseShop && (!playerAITarget || playerAITarget.type !== 'shop_run')) {
        const dts = playerModel.position.distanceTo(shopAliada.group.position);
        if (dts < 40) {
            const shopPos = shopAliada.group.position.clone();
            shopPos.x = Math.max(-17, Math.min(17, shopPos.x));
            shopPos.z = Math.max(-26, Math.min(26, shopPos.z));
            playerAITarget = { type: 'shop_run', position: shopPos, ref: shopAliada, isShopRun: true };
            playerAITargetTimer = 1.5;
        }
    }
    if (!playerAITarget || playerAITarget.isDead || playerAITargetTimer <= 0) {
        playerAITarget = findBestPlayerAITarget();
        playerAITargetTimer = 0.5;
    }
    if (!playerAITarget) {
        if (currentAnim !== 'idle' && animIdle) {
            if (animWalk) animWalk.stop();
            animIdle.play();
            currentAnim = 'idle';
        }
        return;
    }
    if (playerAITarget.isShopRun) {
        const timeSinceDamageInShopAI = gameTime - playerAILastDamageTime;
        const underAttackInShopAI = timeSinceDamageInShopAI < CONFIG.AXIE_SHOP_CANCEL_DAMAGE_MEMORY;
        const hpPctInShopAI = playerHealth / playerMaxHealth;
        
        const nearbyEnemyMinionAI = enemigos.find(m => !m.isDead && playerModel.position.distanceTo(m.group.position) < CONFIG.AXIE_SHOP_ENEMY_NEARBY_RADIUS);
        const nearbyEnemyAxie = enemyAxieModel && !enemyAxieIsDead && playerModel.position.distanceTo(enemyAxieModel.position) < CONFIG.AXIE_SHOP_ENEMY_NEARBY_RADIUS;
        
        if (underAttackInShopAI || hpPctInShopAI < CONFIG.AXIE_SHOP_CANCEL_HP || nearbyEnemyMinionAI || nearbyEnemyAxie) {
            playerAIShopCooldown = 5.0;
            playerAIIsShopping = false;
            playerAITarget = null;
            console.log('⚠️ Jugador-IA cancela ida a tienda');
        } else {
            const shopPos = playerAITarget.position;
            const dx = shopPos.x - playerModel.position.x;
            const dz = shopPos.z - playerModel.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const shopReachDist = 2.0;
            if (dist > shopReachDist) {
                const ms = playerSpeed * playerAIBonuses.speedMultiplier * delta;
                smoothPlayerPos.x += (dx / dist) * ms;
                smoothPlayerPos.z += (dz / dist) * ms;
                smoothPlayerPos.y = GROUND_Y;
                smoothPlayerPos.x = Math.max(-17, Math.min(17, smoothPlayerPos.x));
                smoothPlayerPos.z = Math.max(-26, Math.min(26, smoothPlayerPos.z));
                if (currentAnim !== 'walk' && animWalk) {
                    if (animIdle) animIdle.stop();
                    animWalk.play();
                    currentAnim = 'walk';
                }
                const angle = Math.atan2(dx, dz);
                let diff = angle - playerModel.rotation.y;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                playerModel.rotation.y += diff * Math.min(1, 6 * delta);
            } else {
                if (!playerAIIsShopping) {
                    const canBuySomethingAI = Object.entries(ENEMY_AXIE_ITEM_CATALOG).some(([id, item]) => {
                        const stack = playerAIItems[id] || 0;
                        return stack < item.maxStack && playerAIGold >= item.cost;
                    }) || (playerAIGold >= CONFIG.AXIE_POTION_BUY_THRESHOLD && playerAIPotionCount < CONFIG.AXIE_MAX_POTIONS);
                    
                    if (canBuySomethingAI) {
                        playerAIIsShopping = true;
                        playerAIShopUses++;
                        playerAIShopCooldown = PLAYER_AI_SHOP_COOLDOWN;
                        buyPlayerAIItems();
                        console.log('🛒 Jugador-IA compró items');
                        playerAIShopInteractionTimer = 1.0;
                    } else {
                        playerAIShopCooldown = 5.0;
                        playerAIShopInteractionTimer = 0;
                        playerAIIsShopping = false;
                        console.log('⚠️ Jugador-IA no puede comprar, volviendo al combate');
                    }
                }
            }
            if (playerAIShopInteractionTimer > 0) {
                playerAIShopInteractionTimer -= delta;
                if (playerAIShopInteractionTimer <= 0) playerAIIsShopping = false;
            }
        }
        playerModel.position.x = smoothPlayerPos.x;
        playerModel.position.z = smoothPlayerPos.z;
        playerModel.position.y = GROUND_Y;
        return;
    }
    let targetPos = null;
    if (playerAITarget.position) targetPos = playerAITarget.position;
    else if (playerAITarget.group && playerAITarget.group.position) targetPos = playerAITarget.group.position;
    if (!targetPos) { playerAITarget = null; playerAITargetTimer = 0; return; }
    const dx = targetPos.x - playerModel.position.x;
    const dz = targetPos.z - playerModel.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 35) { playerAITarget = null; playerAITargetTimer = 0; return; }
    const dynamicRange = attackRange + playerAIBonuses.rangeBonus;
    if (dist > dynamicRange * 0.9) {
        const ms = playerSpeed * playerAIBonuses.speedMultiplier * delta;
        smoothPlayerPos.x += (dx / dist) * ms;
        smoothPlayerPos.z += (dz / dist) * ms;
        smoothPlayerPos.y = GROUND_Y;
        smoothPlayerPos.x = Math.max(-17, Math.min(17, smoothPlayerPos.x));
        smoothPlayerPos.z = Math.max(-26, Math.min(26, smoothPlayerPos.z));
        if (currentAnim !== 'walk' && animWalk) {
            if (animIdle) animIdle.stop();
            animWalk.play();
            currentAnim = 'walk';
        }
        const angle = Math.atan2(dx, dz);
        let diff = angle - playerModel.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        playerModel.rotation.y += diff * Math.min(1, 6 * delta);
    } else {
        if (currentAnim !== 'idle' && animIdle) {
            if (animWalk) animWalk.stop();
            animIdle.play();
            currentAnim = 'idle';
        }
        playerModel.rotation.y = Math.atan2(dx, dz);
        attackCooldown -= delta * playerAIBonuses.attackSpeedMultiplier;
        if (attackCooldown <= 0 && !isAttacking) {
            let vt = playerAITarget;
            if (!vt.group && vt.ref && vt.ref.group) vt = vt.ref;
            if (vt && vt.group) {
                const sp = playerModel.position.clone();
                sp.y = 0.5;
                let dmg = Math.round(attackDamage * playerAIBonuses.damageMultiplier);
                if (Math.random() < playerAIBonuses.critChance) dmg = Math.round(dmg * 2);
                const proj = new PlayerProjectile(sp, vt, dmg);
                playerProjectiles.push(proj);
                attackCooldown = attackSpeed;
                isAttacking = true;
                setTimeout(() => { isAttacking = false; }, 50);
            }
        }
    }
    playerModel.position.x = smoothPlayerPos.x;
    playerModel.position.z = smoothPlayerPos.z;
    playerModel.position.y = GROUND_Y;
}

let isMouseDownRight = false;
let isMouseDownLeft = false;
let isDragging = false;
let mouseDownPos = { x: 0, y: 0 };

function isEnemyForPlayer(entity) {
    if (!entity) return false;
    if (entity.type === 'shop') return entity.isEnemy === true;
    if (entity.type === 'enemy_axie') return true;
    if (entity.type === 'minion' && entity.isEnemy === true) return true;
    if (entity.type === 'tower' && entity.isEnemy === true) return true;
    if (entity.type === 'nexus' && entity.isEnemy === true) return true;
    return false;
}

function getEntityFromClick(event) {
    if (!renderer) return null;
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseVec = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouseVec, camera);

    const selectables = [];

    if (enemyAxieModel && !enemyAxieIsDead) {
        enemyAxieModel.traverse((child) => {
            if (child.isMesh) { child.userData.targetRef = makeEnemyAxieRef(); selectables.push(child); }
        });
    }
    for (const em of enemigos) {
        if (em.isDead) continue;
        em.group.traverse((child) => {
            if (child.isMesh) { child.userData.targetRef = em; selectables.push(child); }
        });
    }
    for (const am of aliados) {
        if (am.isDead) continue;
        am.group.traverse((child) => {
            if (child.isMesh) { child.userData.targetRef = am; selectables.push(child); }
        });
    }
    for (const t of towers) {
        if (t.isDead) continue;
        t.group.traverse((child) => {
            if (child.isMesh) { child.userData.targetRef = t; selectables.push(child); }
        });
    }
    if (nexusEnemigo && !nexusEnemigo.isDead) {
        nexusEnemigo.group.traverse((child) => {
            if (child.isMesh) { child.userData.targetRef = nexusEnemigo; selectables.push(child); }
        });
    }
    if (nexusAliado && !nexusAliado.isDead) {
        nexusAliado.group.traverse((child) => {
            if (child.isMesh) { child.userData.targetRef = nexusAliado; selectables.push(child); }
        });
    }

    if (shopAliada) {
        shopAliada.group.traverse((child) => {
            if (child.isMesh) {
                child.userData.targetRef = {
                    type: 'shop', isEnemy: false, ref: shopAliada,
                    group: shopAliada.group, isDead: false, health: 999999, maxHealth: 999999
                };
                selectables.push(child);
            }
        });
    }
    if (shopEnemiga) {
        shopEnemiga.group.traverse((child) => {
            if (child.isMesh) {
                child.userData.targetRef = {
                    type: 'shop', isEnemy: true, ref: shopEnemiga,
                    group: shopEnemiga.group, isDead: false, health: 999999, maxHealth: 999999
                };
                selectables.push(child);
            }
        });
    }

    const intersects = ray.intersectObjects(selectables);
    if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent) {
            if (parent.userData && parent.userData.targetRef) return parent.userData.targetRef;
            parent = parent.parent;
        }
    }
    return null;
}

renderer.domElement.addEventListener('mousedown', (e) => {
    if (isAITrainingMode) return;
    if (e.button === 2) {
        isMouseDownRight = true;
        isDragging = false;
        mouseDownPos.x = e.clientX;
        mouseDownPos.y = e.clientY;
    } else if (e.button === 0) {
        isMouseDownLeft = true;
    }
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (isAITrainingMode) return;
    if (isMouseDownRight) {
        const dx = e.clientX - mouseDownPos.x;
        const dy = e.clientY - mouseDownPos.y;
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) isDragging = true;
    }
});

renderer.domElement.addEventListener('mouseup', (e) => {
    if (isAITrainingMode) return;
    if (!playerModel || isPlayerDead) return;

    if (e.button === 0 && isMouseDownLeft) {
        isMouseDownLeft = false;
        const target = getEntityFromClick(e);
        
        if (target && !target.isDead) {
            window.currentTarget = target;
            window.showTarget(target);
            
            const targetPos = target.group ? target.group.position : target.position;
            if (targetPos) {
                const isEnemy = isEnemyForPlayer(target);
                const stopDistance = isEnemy ? Math.max(1.5, attackRange - 0.5) : 2.0;
                const dx = targetPos.x - playerModel.position.x;
                const dz = targetPos.z - playerModel.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist > stopDistance) {
                    const ratio = stopDistance / dist;
                    const targetX = playerModel.position.x + dx * (1 - ratio);
                    const targetZ = playerModel.position.z + dz * (1 - ratio);
                    targetPosition = new THREE.Vector3(targetX, GROUND_Y, targetZ);
                    smoothTargetPos.copy(targetPosition);
                    isMovingToTarget = true;
                    isAutoMovingToTarget = true;
                }
            }
        } else {
            window.currentTarget = null;
            targetUI.style.display = 'none';
        }
    }

    if (e.button === 2 && isMouseDownRight) {
        isMouseDownRight = false;
        if (shopOpen && !isDragging) {
            closeShop();
            isDragging = false;
            return;
        }
        if (!isDragging) {
            const point = getGroundIntersection(e);
            if (point) {
                targetPosition = point.clone();
                smoothTargetPos.copy(targetPosition);
                isMovingToTarget = true;
                isAutoMovingToTarget = false;
                window.currentTarget = null;
                targetUI.style.display = 'none';
            }
        }
        isDragging = false;
    }
});

function showPauseMenu() {
    if (gamePaused) return;
    if (gameFinished && !isAITrainingMode) return;
    gamePaused = true;
    pauseMenu = document.createElement('div');
    pauseMenu.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1500;color:#fff;font-family:Arial;`;
    const totalMin = Math.floor((Date.now() - aiTrainingStartTime) / 60000);
    pauseMenu.innerHTML = `
        <div style="font-size:56px;font-weight:bold;color:#88ddff;margin-bottom:20px;font-family:'Arial Black';">⏸️ ${isAITrainingMode ? 'ENTRENAMIENTO' : 'PAUSA'}</div>
        ${isAITrainingMode ? `<div style="color:#aa88ff;font-family:monospace;font-size:16px;margin-bottom:30px;text-align:center;line-height:1.8;">🤖 Partidas: <b>${aiTrainingMatches}</b><br>⏱️ Sesión: <b>${totalMin} min</b></div>` : ''}
        <button id="btn-exit" style="padding:16px 48px;font-size:24px;font-weight:bold;background:linear-gradient(135deg,#ff4444,#cc2222);color:#fff;border:none;border-radius:12px;cursor:pointer;">${isAITrainingMode ? '🚪 Salir al Menú' : '🚪 Volver al Inicio'}</button>
        <button id="btn-resume" style="margin-top:15px;padding:12px 36px;font-size:18px;background:rgba(255,255,255,0.1);color:#88aaff;border:2px solid rgba(136,170,255,0.3);border-radius:12px;cursor:pointer;">↩️ Reanudar</button>
    `;
    document.body.appendChild(pauseMenu);
    document.getElementById('btn-exit').onclick = () => isAITrainingMode ? exitAITrainingMode() : abandonGame();
    document.getElementById('btn-resume').onclick = () => hidePauseMenu();
}

function hidePauseMenu() {
    gamePaused = false;
    lastTime = performance.now();
    if (pauseMenu) { pauseMenu.remove(); pauseMenu = null; }
}

function abandonGame() {
    saveBrains();
    isAITrainingMode = false;
    aiTrainingIsRestarting = false;
    aiTrainingAutoRestartTimer = 0;
    playerAITarget = null;
    resetDynamicCamera();
    const banner = document.getElementById('ai-transition-banner');
    if (banner) banner.remove();
    const hud = document.getElementById('ai-training-hud');
    if (hud) hud.remove();
    gameFinished = true;
    gamePaused = false;
    if (pauseMenu) { pauseMenu.remove(); pauseMenu = null; }
    if (victoryScreen) { victoryScreen.remove(); victoryScreen = null; }
    if (defeatScreen) { defeatScreen.remove(); defeatScreen = null; }
    if (playerHUD) { playerHUD.remove(); playerHUD = null; }
    if (hudWrapper) { hudWrapper.remove(); hudWrapper = null; }
    enemyAxieDebugHUD.style.display = 'none';
    goldDiv.style.display = 'none';
    for (const m of aliados) if (m.group && m.group.parent) scene.remove(m.group);
    for (const m of enemigos) if (m.group && m.group.parent) scene.remove(m.group);
    aliados.length = 0; enemigos.length = 0;
    spawnQueue.length = 0;
    spawnQueueTimer = 0;
    for (const p of playerProjectiles) if (p.mesh && p.mesh.parent) scene.remove(p.mesh);
    playerProjectiles.length = 0;
    for (const t of towers) if (t.group && t.group.parent) scene.remove(t.group);
    towers.length = 0;
    if (nexusAliado) { nexusAliado.isDead = false; nexusAliado.health = nexusAliado.maxHealth; nexusAliado.group.visible = true; nexusAliado.updateHealthBar(); }
    if (nexusEnemigo) { nexusEnemigo.isDead = false; nexusEnemigo.health = nexusEnemigo.maxHealth; nexusEnemigo.group.visible = true; nexusEnemigo.updateHealthBar(); }
    createTower(-2.5, -18, false, 1);
    createTower(-2.5, -6, false, 2);
    createTower(4.0, 18, true, 1);
    createTower(4.0, 6, true, 2);
    gameStarted = false;
    startTimer = CONFIG.SPAWN_DELAY;
    waveNumber = 1;
    gameTime = 0;
    isFirstWave = true;
    firstWaveTimer = 0;
    gameFinished = false;
    isPlayerDead = false;
    playerHealth = playerMaxHealth;
    playerMana = playerMaxMana;
    playerRespawnTimer = 0;
    playerDeathCount = 0;
    playerGold = 0;
    playerKillStreak = 0;
    playerFirstBlood = false;
    playerItemSlots = [null, null, null, null, null, null];
    potionHPCount = 0;
    potionMPCount = 0;
    potionUseCooldown = 0;
    playerAIIsRetreating = false;
    playerAIRetreatTimer = 0;
    playerAIRetreatCooldown = 0;
    playerAILastDamageTime = -999;
    enemyAxieSpawned = false;
    enemyAxieShopInteractionTimer = 0;
    playerAIShopInteractionTimer = 0;
    shopAutoOpenCooldown = 0;
    playerSpawned = false;
    enemyAxiePotionCount = 0;
    playerAIPotionCount = 0;
    enemyAxiePotionCooldown = 0;
    playerAIPotionCooldown = 0;
    enemyAxieRetreatCooldown = 0;
    resetEnemyAxie();
    if (renderer) renderer.domElement.style.display = 'none';
    showMainMenu();
}

function exitAITrainingMode() {
    const stats = JSON.parse(localStorage.getItem('axie_ai_training_stats') || '{"matches":0,"totalTime":0}');
    stats.matches = aiTrainingMatches;
    stats.totalTime = (stats.totalTime || 0) + Math.floor((Date.now() - aiTrainingStartTime) / 1000);
    localStorage.setItem('axie_ai_training_stats', JSON.stringify(stats));
    saveBrains();
    abandonGame();
}

function handleAITrainingMatchEnd(result) {
    if (aiTrainingIsRestarting) return;
    aiTrainingIsRestarting = true;
    aiTrainingMatches++;
    console.log(`🤖 Partida #${aiTrainingMatches}: ${result.toUpperCase()}`);
    const stats = JSON.parse(localStorage.getItem('axie_ai_training_stats') || '{"matches":0,"totalTime":0}');
    stats.matches = aiTrainingMatches;
    stats.totalTime = (stats.totalTime || 0) + Math.floor((Date.now() - aiTrainingStartTime) / 1000);
    localStorage.setItem('axie_ai_training_stats', JSON.stringify(stats));
    saveBrains();
    mostrarBannerTransicion(result);
    aiTrainingAutoRestartTimer = 3.0;
}

function mostrarBannerTransicion(result) {
    const old = document.getElementById('ai-transition-banner');
    if (old) old.remove();
    const banner = document.createElement('div');
    banner.id = 'ai-transition-banner';
    banner.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3000;padding:30px 60px;background:rgba(0,0,0,0.9);border:3px solid ${result === 'victory' ? '#44ff88' : '#ff4444'};border-radius:16px;font-family:'Arial Black';font-size:32px;color:${result === 'victory' ? '#44ff88' : '#ff4444'};text-align:center;pointer-events:none;`;
    banner.innerHTML = `
        ${result === 'victory' ? '🏆 ALIADOS GANARON' : '💀 ENEMIGOS GANARON'}<br>
        <span style="font-size:18px;color:#88aaff;">Reiniciando en 3s...</span><br>
        <span style="font-size:14px;color:#aaa;">Partidas: ${aiTrainingMatches}</span>
    `;
    document.body.appendChild(banner);
}

function updateHUDEntrenamiento() {
    let hud = document.getElementById('ai-training-hud');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'ai-training-hud';
        hud.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:2000;padding:10px 16px;background:rgba(102,68,255,0.85);color:#fff;border:2px solid rgba(170,140,255,0.8);border-radius:10px;font-family:monospace;font-size:13px;font-weight:bold;pointer-events:none;line-height:1.6;text-align:center;`;
        document.body.appendChild(hud);
    }
    const totalMin = Math.floor((Date.now() - aiTrainingStartTime) / 60000);
    const camE = { player: '🦊', enemy: '🤖', idle: '🎯' }[dynamicCameraMode] || '🎥';
    const camT = { player: 'Aliado', enemy: 'Enemigo', idle: 'Centro' }[dynamicCameraMode] || 'Auto';
    hud.innerHTML = `
        🤖 <b>ENTRENAMIENTO IA</b> · 🎮 #${aiTrainingMatches + 1} · ⏱️ ${totalMin} min<br>
        ${camE} Cámara: <b>${camT}</b> · Pulsa ESC para salir
    `;
}

function showVictoryScreen() {
    if (gameFinished) return;
    gameFinished = true;
    if (isAITrainingMode) { handleAITrainingMatchEnd('victory'); return; }
    if (victoryScreen) victoryScreen.remove();
    victoryScreen = document.createElement('div');
    victoryScreen.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1000;`;
    victoryScreen.innerHTML = `
        <div style="font-size:80px;color:#ffdd44;font-family:'Arial Black';">🏆 GANASTE 🏆</div>
        <div style="font-size:28px;color:#88ddff;margin-top:20px;">¡Has destruido el Nexo Enemigo!</div>
        <button style="margin-top:40px;padding:16px 48px;font-size:24px;background:linear-gradient(135deg,#44ff88,#22aa66);color:#fff;border:none;border-radius:12px;cursor:pointer;" onclick="window.location.reload()">🏠 Ir a Inicio</button>
    `;
    document.body.appendChild(victoryScreen);
}

let menuScreen = null;
let pantallaCarga = null;

function actualizarPantallaCarga(progreso, texto) {
    if (!pantallaCarga) return;
    const barra = pantallaCarga.querySelector('#loading-progress-bar');
    const textoEl = pantallaCarga.querySelector('#loading-text');
    if (barra) barra.style.width = `${progreso}%`;
    if (textoEl) textoEl.textContent = texto || `Cargando... ${progreso}%`;
}

function mostrarPantallaCarga() {
    if (pantallaCarga) return;
    pantallaCarga = document.createElement('div');
    pantallaCarga.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#0a0a1a,#1a1a3a);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:5000;font-family:Arial;`;
    pantallaCarga.innerHTML = `
        <div style="font-size:56px;font-weight:bold;color:#44ff88;margin-bottom:60px;letter-spacing:4px;">⚔️ AXIE LEGENDS</div>
        <div style="font-size:18px;color:#88aaff;margin-bottom:30px;">Cargando terreno de batalla...</div>
        <div style="width:400px;height:14px;background:rgba(255,255,255,0.1);border-radius:8px;overflow:hidden;border:2px solid rgba(68,255,136,0.4);">
            <div id="loading-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#44ff88,#22aa66);transition:width 0.3s;"></div>
        </div>
        <div id="loading-text" style="font-size:14px;color:#aaa;margin-top:20px;">Cargando... 0%</div>
    `;
    document.body.appendChild(pantallaCarga);
}

function ocultarPantallaCarga() {
    if (pantallaCarga) { pantallaCarga.remove(); pantallaCarga = null; }
}

function showMainMenu() {
    if (renderer) renderer.domElement.style.display = 'none';
    if (timerDiv) timerDiv.style.display = 'none';
    if (fpsDiv) fpsDiv.style.display = 'none';
    if (waveDiv) waveDiv.style.display = 'none';
    if (targetUI) targetUI.style.display = 'none';
    if (goldDiv) goldDiv.style.display = 'none';
    enemyAxieDebugHUD.style.display = 'none';
    if (menuScreen) { menuScreen.destroy(); menuScreen = null; }
    menuScreen = new MenuScreen();
    menuScreen.show(
        (axieId, mode) => { selectedAxieId = axieId; startGame(axieId); },
        (axieId) => { selectedAxieId = axieId; }
    );
    setTimeout(() => {
        if (document.getElementById('btn-ai-training')) return;
        const btn = document.createElement('button');
        btn.id = 'btn-ai-training';
        btn.innerHTML = '🤖 Entrenar IA (Auto)<br><span style="font-size:11px;opacity:0.7;">IA vs IA · rondas infinitas</span>';
        btn.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:10000;padding:14px 22px;background:linear-gradient(135deg,#6644ff,#4422aa);color:#fff;border:2px solid rgba(170,140,255,0.6);border-radius:12px;font-family:Arial;font-size:14px;font-weight:bold;cursor:pointer;text-align:center;line-height:1.3;`;
        btn.onclick = () => {
            btn.remove();
            const info = document.getElementById('ai-training-info');
            if (info) info.remove();
            startAITrainingMode();
        };
        document.body.appendChild(btn);
        const stats = JSON.parse(localStorage.getItem('axie_ai_training_stats') || '{"matches":0,"totalTime":0}');
        if (stats.matches > 0) {
            const info = document.createElement('div');
            info.id = 'ai-training-info';
            info.style.cssText = `position:fixed;bottom:110px;right:30px;z-index:10000;padding:8px 14px;background:rgba(0,0,0,0.7);color:#aa88ff;border:1px solid rgba(170,140,255,0.4);border-radius:8px;font-family:monospace;font-size:11px;text-align:center;line-height:1.5;`;
            const mins = Math.floor(stats.totalTime / 60);
            info.innerHTML = `📊 Entrenamientos: <b>${stats.matches}</b><br>⏱️ Total: ${mins} min`;
            document.body.appendChild(info);
        }
    }, 100);
}

async function startAITrainingMode() {
    isAITrainingMode = true;
    aiTrainingMatches = 0;
    aiTrainingStartTime = Date.now();
    aiTrainingAutoRestartTimer = 0;
    aiTrainingIsRestarting = false;
    const stats = JSON.parse(localStorage.getItem('axie_ai_training_stats') || '{"matches":0,"totalTime":0}');
    aiTrainingMatches = stats.matches || 0;
    const allAxies = getAllAxies();
    const randomAxie = allAxies[Math.floor(Math.random() * allAxies.length)];
    await startAIGame(randomAxie.id);
}

async function startAIGame(axieId) {
    mostrarPantallaCarga();
    actualizarPantallaCarga(5, 'Iniciando entrenamiento...');
    if (menuScreen) { menuScreen.destroy(); menuScreen = null; }
    while (!groundReady || !nexusAliado || !nexusEnemigo || towers.length === 0 || !shopAliada || !shopEnemiga) {
        actualizarPantallaCarga(15, 'Cargando...');
        await new Promise(r => setTimeout(r, 100));
    }
    actualizarPantallaCarga(60, 'Cargando Axie...');
    await loadSelectedAxie(axieId);
    playerModel.position.copy(playerSpawnPosition);
    playerModel.position.y = GROUND_Y - 100;
    smoothPlayerPos.copy(playerSpawnPosition);
    smoothPlayerPos.y = GROUND_Y;
    playerModel.visible = false;
    playerSpawned = false;
    gameFinished = false;
    gameStarted = false;
    startTimer = CONFIG.MINION_SPAWN_TIME;
    waveNumber = 1;
    gameTime = 0;
    isFirstWave = true;
    firstWaveTimer = 0;
    isPlayerDead = false;
    playerHealth = playerMaxHealth;
    playerMana = playerMaxMana;
    playerRespawnTimer = 0;
    isMovingToTarget = false;
    targetPosition = null;
    window.currentTarget = null;
    attackCooldown = 0;
    isAttacking = false;
    playerAITarget = null;
    playerAITargetTimer = 0;
    playerAIGold = 0;
    playerAIItems = {};
    playerAIBonuses = { speedMultiplier: 1.0, damageMultiplier: 1.0, attackSpeedMultiplier: 1.0, rangeBonus: 0, critChance: 0 };
    playerAIShopCooldown = 0;
    playerAIShopUses = 0;
    playerAIIsShopping = false;
    playerAIShopInteractionTimer = 0;
    playerAIIsRetreating = false;
    playerAIRetreatTimer = 0;
    playerAIRetreatCooldown = 0;
    playerAILastDamageTime = -999;
    playerAIPotionCount = 0;
    playerAIPotionCooldown = 0;
    playerDeathCount = 0;
    shopAutoOpenCooldown = 0;
    spawnQueue.length = 0;
    spawnQueueTimer = 0;
    factionFocusTarget.ally.target = null;
    factionFocusTarget.ally.count = 0;
    factionFocusTarget.enemy.target = null;
    factionFocusTarget.enemy.count = 0;
    potionHPCount = 0;
    potionMPCount = 0;
    potionUseCooldown = 0;
    for (const m of aliados) if (m.group && m.group.parent) scene.remove(m.group);
    for (const m of enemigos) if (m.group && m.group.parent) scene.remove(m.group);
    aliados.length = 0; enemigos.length = 0;
    for (const p of playerProjectiles) if (p.mesh && p.mesh.parent) scene.remove(p.mesh);
    playerProjectiles.length = 0;
    for (const t of towers) if (t.group && t.group.parent) scene.remove(t.group);
    towers.length = 0;
    if (nexusAliado) { nexusAliado.isDead = false; nexusAliado.health = nexusAliado.maxHealth; nexusAliado.group.visible = true; nexusAliado.updateHealthBar(); }
    if (nexusEnemigo) { nexusEnemigo.isDead = false; nexusEnemigo.health = nexusEnemigo.maxHealth; nexusEnemigo.group.visible = true; nexusEnemigo.updateHealthBar(); }
    createTower(-2.5, -18, false, 1);
    createTower(-2.5, -6, false, 2);
    createTower(4.0, 18, true, 1);
    createTower(4.0, 6, true, 2);
    resetEnemyAxie();
    inicializarCamaraFija();
    resetDynamicCamera();
    chooseNewDynamicCameraTarget();
    if (!playerHUD) { createPlayerHUD(); updatePlayerHUD(); }
    updatePotionHUD();
    goldDiv.style.display = 'block';
    updatePlayerGoldHUD();
    renderer.domElement.style.display = 'block';
    timerDiv.style.display = 'block';
    fpsDiv.style.display = 'block';
    waveDiv.style.display = 'block';
    camera.position.copy(cameraSmoothPos);
    camera.lookAt(cameraSmoothTarget);
    renderer.render(scene, camera);
    await new Promise(r => requestAnimationFrame(r));
    actualizarPantallaCarga(100, '¡Listo!');
    await new Promise(r => setTimeout(r, 200));
    ocultarPantallaCarga();
    setTimeout(() => {
        if (gameFinished) return;
        if (playerModel && !playerSpawned) {
            playerSpawned = true;
            playerModel.position.copy(playerSpawnPosition);
            playerModel.position.y = GROUND_Y;
            smoothPlayerPos.copy(playerSpawnPosition);
            smoothPlayerPos.y = GROUND_Y;
            playerModel.visible = true;
            console.log(`🦊 [t=${gameTime.toFixed(2)}s] Axie aliado aparece`);
        }
        if (!enemyAxieSpawned) spawnEnemyAxie();
    }, CONFIG.AXIE_SPAWN_TIME * 1000);
    updateHUDEntrenamiento();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

async function startGame(axieId) {
    mostrarPantallaCarga();
    actualizarPantallaCarga(5, 'Iniciando...');
    if (menuScreen) { menuScreen.destroy(); menuScreen = null; }
    isAITrainingMode = false;
    console.log('🎮 Modo: JUGADOR HUMANO');
    while (!groundReady || !nexusAliado || !nexusEnemigo || towers.length === 0 || !shopAliada || !shopEnemiga) {
        actualizarPantallaCarga(15, 'Cargando...');
        await new Promise(r => setTimeout(r, 100));
    }
    actualizarPantallaCarga(60, 'Cargando Axie...');
    await loadSelectedAxie(axieId);
    playerModel.position.copy(playerSpawnPosition);
    playerModel.position.y = GROUND_Y - 100;
    smoothPlayerPos.copy(playerSpawnPosition);
    smoothPlayerPos.y = GROUND_Y;
    playerModel.visible = false;
    playerSpawned = false;
    gameFinished = false;
    gameStarted = false;
    startTimer = CONFIG.MINION_SPAWN_TIME;
    waveNumber = 1;
    gameTime = 0;
    isFirstWave = true;
    firstWaveTimer = 0;
    isPlayerDead = false;
    playerHealth = playerMaxHealth;
    playerMana = playerMaxMana;
    playerRespawnTimer = 0;
    resetPlayerEconomy();
    playerDeathCount = 0;
    shopAutoOpenCooldown = 0;
    spawnQueue.length = 0;
    spawnQueueTimer = 0;
    factionFocusTarget.ally.target = null;
    factionFocusTarget.ally.count = 0;
    factionFocusTarget.enemy.target = null;
    factionFocusTarget.enemy.count = 0;
    for (const m of aliados) if (m.group && m.group.parent) scene.remove(m.group);
    for (const m of enemigos) if (m.group && m.group.parent) scene.remove(m.group);
    aliados.length = 0; enemigos.length = 0;
    inicializarCamaraFija();
    if (!playerHUD) { createPlayerHUD(); updatePlayerHUD(); }
    updateItemHUD();
    updatePotionHUD();
    goldDiv.style.display = 'block';
    updatePlayerGoldHUD();
    renderer.domElement.style.display = 'block';
    timerDiv.style.display = 'block';
    fpsDiv.style.display = 'block';
    waveDiv.style.display = 'block';
    camera.position.copy(cameraSmoothPos);
    camera.lookAt(cameraSmoothTarget);
    renderer.render(scene, camera);
    await new Promise(r => requestAnimationFrame(r));
    actualizarPantallaCarga(100, '¡Listo!');
    await new Promise(r => setTimeout(r, 200));
    ocultarPantallaCarga();
    setTimeout(() => {
        if (gameFinished) return;
        if (playerModel && !playerSpawned) {
            playerSpawned = true;
            playerModel.position.copy(playerSpawnPosition);
            playerModel.position.y = GROUND_Y;
            smoothPlayerPos.copy(playerSpawnPosition);
            smoothPlayerPos.y = GROUND_Y;
            playerModel.visible = true;
            console.log(`🦊 [t=${gameTime.toFixed(2)}s] Axie aliado aparece`);
        }
        if (!enemyAxieSpawned) spawnEnemyAxie();
    }, CONFIG.AXIE_SPAWN_TIME * 1000);
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameFinished && !isAITrainingMode) return;
        if (shopOpen) { closeShop(); return; }
        if (isAITrainingMode || gameStarted) {
            if (gamePaused) hidePauseMenu();
            else showPauseMenu();
        }
    }
});

let frameCounter = 0;
let lastTime = 0;
let realFPS = 0;
let fpsCounter = 0;
let fpsTimer = 0;

function gameLoop(time) {
    if (isAITrainingMode && aiTrainingAutoRestartTimer > 0) {
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        aiTrainingAutoRestartTimer -= delta;
        if (nexusEnemigo) nexusEnemigo.updateExplosion(delta);
        if (nexusAliado) nexusAliado.updateExplosion(delta);
        updateHUDEntrenamiento();
        if (aiTrainingAutoRestartTimer <= 0) {
            aiTrainingAutoRestartTimer = 0;
            const banner = document.getElementById('ai-transition-banner');
            if (banner) banner.remove();
            const allAxies = getAllAxies();
            const randomAxie = allAxies[Math.floor(Math.random() * allAxies.length)];
            aiTrainingIsRestarting = false;
            startAIGame(randomAxie.id);
            return;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(gameLoop);
        return;
    }
    if (gameFinished) {
        if (nexusEnemigo) nexusEnemigo.updateExplosion(0.016);
        if (nexusAliado) nexusAliado.updateExplosion(0.016);
        renderer.render(scene, camera);
        requestAnimationFrame(gameLoop);
        return;
    }
    if (gamePaused) {
        lastTime = time;
        renderer.render(scene, camera);
        requestAnimationFrame(gameLoop);
        return;
    }
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    frameCounter++;
    gameTime += delta;

    processSpawnQueue(delta);

    if (potionUseCooldown > 0) {
        potionUseCooldown -= delta;
        if (potionUseCooldown < 0) potionUseCooldown = 0;
    }

    if (shopAutoOpenCooldown > 0) {
        shopAutoOpenCooldown -= delta;
        if (shopAutoOpenCooldown < 0) shopAutoOpenCooldown = 0;
    }

    if (window.currentTarget && !isAITrainingMode) {
        let dead = false;
        if (window.currentTarget.isDead === true) dead = true;
        else if (window.currentTarget.health !== undefined && window.currentTarget.health <= 0) dead = true;
        if (dead) { window.currentTarget = null; targetUI.style.display = 'none'; isAutoMovingToTarget = false; }
    }
    if (isPlayerDead) {
        playerRespawnTimer -= delta;
        if (playerRespawnTimer <= 0 && !gameFinished) {
            isPlayerDead = false;
            playerHealth = playerMaxHealth;
            playerMana = playerMaxMana;
            playerRespawnTimer = 0;
            updatePlayerHUD();
            if (playerModel) {
                playerModel.position.copy(playerSpawnPosition);
                playerModel.position.y = GROUND_Y;
                smoothPlayerPos.copy(playerSpawnPosition);
                smoothPlayerPos.y = GROUND_Y;
                playerModel.visible = true;
            }
        }
    }
    if (isFirstWave) {
        firstWaveTimer += delta;
        if (firstWaveTimer >= CONFIG.firstWaveGhostDuration) isFirstWave = false;
    }
    timerDiv.textContent = `${Math.floor(gameTime / 60).toString().padStart(2, '0')}:${Math.floor(gameTime % 60).toString().padStart(2, '0')}`;
    fpsCounter++;
    fpsTimer += delta;
    if (fpsTimer >= 1.0) {
        realFPS = Math.round(fpsCounter / fpsTimer);
        fpsCounter = 0;
        fpsTimer = 0;
        fpsDiv.textContent = `FPS: ${realFPS}`;
    }

    if (isAITrainingMode) {
        updatePlayerAsAI(delta);
        updateHUDEntrenamiento();
    } else {
        if (playerModel && !isPlayerDead && playerSpawned) {
            if (isMovingToTarget && targetPosition) {
                const dx = smoothTargetPos.x - smoothPlayerPos.x;
                const dz = smoothTargetPos.z - smoothPlayerPos.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < 0.1) {
                    smoothPlayerPos.copy(smoothTargetPos);
                    smoothPlayerPos.y = GROUND_Y;
                    isMovingToTarget = false;
                    targetPosition = null;
                    isAutoMovingToTarget = false;
                    if (animIdle && animWalk) { animWalk.stop(); animIdle.play(); currentAnim = 'idle'; }
                } else {
                    const ms = playerSpeed * delta;
                    smoothPlayerPos.x += (dx / dist) * ms;
                    smoothPlayerPos.z += (dz / dist) * ms;
                    smoothPlayerPos.y = GROUND_Y;

                    const limitX = 17, limitZ = 26;
                    smoothPlayerPos.x = Math.max(-limitX, Math.min(limitX, smoothPlayerPos.x));
                    smoothPlayerPos.z = Math.max(-limitZ, Math.min(limitZ, smoothPlayerPos.z));

                    if (currentAnim !== 'walk' && animWalk) {
                        if (animIdle) animIdle.stop();
                        animWalk.play();
                        currentAnim = 'walk';
                    }

                    const angle = Math.atan2(dx, dz);
                    let diff = angle - playerModel.rotation.y;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    playerModel.rotation.y += diff * Math.min(1, 6 * delta);
                }
                playerModel.position.x = smoothPlayerPos.x;
                playerModel.position.z = smoothPlayerPos.z;
                playerModel.position.y = GROUND_Y;
            }

            if (window.currentTarget && !window.currentTarget.isDead) {
                const targetPos = window.currentTarget.group ? window.currentTarget.group.position : window.currentTarget.position;
                const isEnemy = isEnemyForPlayer(window.currentTarget);

                if (targetPos && isEnemy) {
                    const distToTarget = Math.sqrt(
                        Math.pow(targetPos.x - playerModel.position.x, 2) +
                        Math.pow(targetPos.z - playerModel.position.z, 2)
                    );

                    if (distToTarget <= attackRange && !isMovingToTarget) {
                        const angle = Math.atan2(targetPos.x - playerModel.position.x, targetPos.z - playerModel.position.z);
                        playerModel.rotation.y = angle;

                        if (currentAnim !== 'idle' && animIdle) {
                            if (animWalk) animWalk.stop();
                            animIdle.play();
                            currentAnim = 'idle';
                        }

                        attackCooldown -= delta;
                        if (attackCooldown <= 0 && !isAttacking) {
                            const startPos = playerModel.position.clone();
                            startPos.y = 0.5;
                            const proj = new PlayerProjectile(startPos, window.currentTarget, attackDamage);
                            playerProjectiles.push(proj);
                            attackCooldown = attackSpeed;
                            isAttacking = true;
                            setTimeout(() => { isAttacking = false; }, 100);
                        }
                    }
                }
            }

            if (!shopOpen && shopAutoOpenCooldown <= 0 && shopAliada) {
                const d = playerModel.position.distanceTo(shopAliada.group.position);
                if (d <= CONFIG.SHOP_AUTO_OPEN_DISTANCE) {
                    const pdx = playerModel.position.x - shopAliada.group.position.x;
                    const pdz = playerModel.position.z - shopAliada.group.position.z;
                    const pdist = Math.sqrt(pdx * pdx + pdz * pdz) || 1;
                    const pushDist = 1.0;
                    smoothPlayerPos.x = shopAliada.group.position.x + (pdx / pdist) * (CONFIG.SHOP_AUTO_OPEN_DISTANCE + pushDist);
                    smoothPlayerPos.z = shopAliada.group.position.z + (pdz / pdist) * (CONFIG.SHOP_AUTO_OPEN_DISTANCE + pushDist);
                    smoothPlayerPos.y = GROUND_Y;
                    playerModel.position.x = smoothPlayerPos.x;
                    playerModel.position.z = smoothPlayerPos.z;
                    playerModel.position.y = GROUND_Y;
                    openShop();
                }
            }
        }
    }

    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        const proj = playerProjectiles[i];
        proj.update(delta);
        if (!proj.active) playerProjectiles.splice(i, 1);
    }
    if (mixer && !isPlayerDead) mixer.update(delta);

    if (!gameStarted) {
        startTimer -= delta;
        waveDiv.textContent = `⏳ ${Math.ceil(startTimer)}s`;
        if (startTimer <= 0) {
            gameStarted = true;
            if (aliados.filter(m => !m.isDead).length === 0 && enemigos.filter(m => !m.isDead).length === 0 && spawnQueue.length === 0) {
                spawnWave();
            }
        }
        if (isAITrainingMode) {
            updateDynamicCamera(delta);
            updateDynamicHUDForCamera();
        } else { if (playerModel) updateCameraPosition(); if (camaraInicializada) camera.position.y = CAMERA_FIXED_Y; }
        renderer.render(scene, camera);
        requestAnimationFrame(gameLoop);
        return;
    }

    const enemies = { aliados, enemigos };
    for (const tower of towers) tower.update(delta, enemies);
    for (const m of aliados) m.update(delta, aliados, enemigos, towers, playerModel);
    for (const m of enemigos) m.update(delta, aliados, enemigos, towers, playerModel);
    resolveMinionCollisions(delta);
    suavizarYEntidades(delta);
    if (gameStarted && !gameFinished) updateEnemyAxie(delta);
    if (nexusEnemigo) nexusEnemigo.updateExplosion(delta);
    updateEnemyAxieDebugHUD();

    const aa = aliados.filter(m => !m.isDead);
    const ae = enemigos.filter(m => !m.isDead);
    if (spawnQueue.length === 0 && (aa.length === 0 || ae.length === 0)) {
        waveCooldown += delta;
        if (waveCooldown > WAVE_DELAY) { waveCooldown = 0; spawnWave(); }
    } else waveCooldown = 0;

    if (isAITrainingMode) {
        updateDynamicCamera(delta);
        updateDynamicHUDForCamera();
    } else {
        if (playerModel) updateCameraPosition();
        if (camaraInicializada) camera.position.y = CAMERA_FIXED_Y;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    const fs = 8.0;
    camera.left = -fs * aspect / 2;
    camera.right = fs * aspect / 2;
    camera.top = fs / 2;
    camera.bottom = -fs / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('beforeunload', () => {
    saveBrains();
    healthBarCache.clear();
    renderer.dispose();
});

const targetUI = document.createElement('div');
targetUI.style.cssText = `position:fixed;top:20px;left:20px;width:240px;background:rgba(0,0,0,0.85);border:2px solid rgba(255,200,50,0.6);border-radius:8px;padding:8px 12px;z-index:150;color:#fff;display:none;pointer-events:none;font-family:Arial;`;
document.body.appendChild(targetUI);

window.currentTarget = null;

window.showTarget = function (target) {
    window.currentTarget = target;
    if (!target || target.isDead) { targetUI.style.display = 'none'; return; }
    targetUI.style.display = 'block';
    let name = 'Enemigo';
    if (target.type === 'minion') name = target.isEnemy ? '🔴 Minion' : '🔵 Minion Aliado';
    else if (target.type === 'tower') name = target.isEnemy ? '🗼 Torre Enemiga' : '🏰 Torre Aliada';
    else if (target.type === 'nexus') name = target.isEnemy ? '🔥 Nexo Enemigo' : '💎 Nexo Aliado';
    else if (target.type === 'enemy_axie') name = `🤖 ${enemyAxie ? enemyAxie.nombre : 'Axie'}`;
    else if (target.type === 'player') name = `🦊 ${currentAxieName}`;
    else if (target.type === 'shop') name = target.isEnemy ? '🏪 Tienda Enemiga' : '🏪 Tienda Aliada';

    if (target.type === 'shop') {
        targetUI.innerHTML = `
            <div style="font-weight:bold;font-size:14px;color:#ffcc44;margin-bottom:6px;">${name}</div>
            <div style="font-size:11px;color:#88ddff;">🚶 Camina hacia ella para abrirla</div>
        `;
        return;
    }

    const maxHP = target.maxHealth || 100;
    const curHP = target.health || 100;
    const pct = Math.max(0, (curHP / maxHP) * 100);
    targetUI.innerHTML = `
        <div style="font-weight:bold;font-size:14px;color:#ffcc44;margin-bottom:6px;">${name}</div>
        <div style="display:flex;gap:8px;align-items:center;">
            <div style="flex:1;height:16px;background:rgba(255,255,255,0.12);border-radius:4px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#ff2244,#ff6644);"></div>
            </div>
            <span style="font-size:11px;font-weight:bold;">${Math.floor(curHP)}/${maxHP}</span>
        </div>
    `;
};

window.updateTargetUI = function () {
    if (window.currentTarget && !window.currentTarget.isDead) window.showTarget(window.currentTarget);
    else if (window.currentTarget) { window.currentTarget = null; targetUI.style.display = 'none'; }
};

document.addEventListener('DOMContentLoaded', () => {
    loadBrains();
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
    timerDiv.style.display = 'none';
    fpsDiv.style.display = 'none';
    waveDiv.style.display = 'none';
    targetUI.style.display = 'none';
    goldDiv.style.display = 'none';
    enemyAxieDebugHUD.style.display = 'none';
    showMainMenu();
});
import './js/hub-control.js';
import './js/inject-memory.js';