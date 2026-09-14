const fs = require('fs');
const path = require('path');

const dir = 'D:/AXIELEGENDS/public/assets/minions';
const files = ['mage2_bone.glb', 'mage2_walk.glb', 'mage2_idle.glb', 'mage2_attack.glb'];

function readGLB(filePath) {
  const buf = fs.readFileSync(filePath);
  const chunkLength = buf.readUInt32LE(12);
  const json = buf.slice(20, 20 + chunkLength).toString('utf8');
  return JSON.parse(json);
}

for (const file of files) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) { console.log(`\n❌ NO EXISTE: ${p}`); continue; }

  const gltf = readGLB(p);
  const nodes = gltf.nodes || [];
  const skins = gltf.skins || [];
  const boneIndices = new Set();
  skins.forEach(s => (s.joints || []).forEach(i => boneIndices.add(i)));

  console.log(`\n========================================`);
  console.log(`  ${file}`);
  console.log(`========================================`);
  console.log(`Nodos totales: ${nodes.length}`);
  console.log(`Huesos (joints): ${boneIndices.size}`);

  if (boneIndices.size > 0) {
    console.log('--- NOMBRES DE HUESOS ---');
    [...boneIndices].forEach(i => console.log(`  ${nodes[i]?.name}`));
  }

  const anims = gltf.animations || [];
  console.log(`Animaciones: ${anims.length}`);
  anims.forEach((a, ai) => {
    const targets = new Set();
    (a.channels || []).forEach(ch => targets.add(ch.target.node));
    console.log(`  Anim #${ai} "${a.name || '(sin nombre)'}" → ${targets.size} nodos animados:`);
    [...targets].forEach(i => console.log(`    ${nodes[i]?.name}`));
  });
}