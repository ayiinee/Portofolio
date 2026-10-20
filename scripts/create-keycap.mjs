import { readFile, writeFile, mkdir } from "node:fs/promises";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

// GLTFExporter uses the browser FileReader API for its final binary container.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buffer => { this.result = buffer; this.onloadend?.(); });
  }
};

const root = new URL("../", import.meta.url);
const fontData = JSON.parse(await readFile(new URL("scripts/assets/helvetiker_regular.typeface.json", root), "utf8"));
const font = new FontLoader().parse(fontData);

function roundedSquare(half, radius) {
  const s = new THREE.Shape();
  s.moveTo(-half + radius, -half);
  s.lineTo(half - radius, -half);
  s.quadraticCurveTo(half, -half, half, -half + radius);
  s.lineTo(half, half - radius);
  s.quadraticCurveTo(half, half, half - radius, half);
  s.lineTo(-half + radius, half);
  s.quadraticCurveTo(-half, half, -half, half - radius);
  s.lineTo(-half, -half + radius);
  s.quadraticCurveTo(-half, -half, -half + radius, -half);
  return s.getSpacedPoints(128).slice(0, -1);
}

// Horizontal profiles create a tapered skirt, rounded shoulder and shallow dish.
const profiles = [
  [1.015, -.40, .19], [1.07, -.37, .20], [1.08, -.31, .20],
  [.94, .20, .18], [.91, .28, .18], [.86, .34, .17],
  [.80, .36, .17], [.65, .338, .16], [.38, .322, .12],
];
const vertices = [], uv = [], indices = [], segments = 128;
for (const [half, y, radius] of profiles) {
  for (const p of roundedSquare(half, radius)) {
    vertices.push(p.x, y, p.y);
    uv.push(p.x / 2.16 + .5, p.y / 2.16 + .5);
  }
}
for (let ring = 0; ring < profiles.length - 1; ring++) {
  for (let j = 0; j < segments; j++) {
    const a = ring * segments + j, b = ring * segments + (j + 1) % segments;
    indices.push(a, a + segments, b, b, a + segments, b + segments);
  }
}
const bottom = vertices.length / 3;
vertices.push(0, -.40, 0, 0, .318, 0); uv.push(.5, .5, .5, .5);
for (let j = 0; j < segments; j++) {
  const next = (j + 1) % segments, top = (profiles.length - 1) * segments;
  indices.push(j, next, bottom, top + j, bottom + 1, top + next);
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
geometry.setIndex(indices);
geometry.computeVertexNormals();

const model = new THREE.Group(); model.name = "Aini_Keycap";
const cap = new THREE.Group(); cap.name = "Pressable_Cap"; model.add(cap);
const body = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
  name: "Ivory_Satin_Plastic", color: "#f2eee3", roughness: .34, metalness: 0,
  clearcoat: .28, clearcoatRoughness: .24, ior: 1.46, specularIntensity: .85,
}));
body.name = "Ivory_Shell"; cap.add(body);
const ink = new THREE.MeshPhysicalMaterial({ color: "#152c49", roughness: .62, specularIntensity: .22 });
for (const letter of ["A", "I", "N"]) {
  const text = new TextGeometry(letter, { font, size: .88, depth: .004, curveSegments: 8, bevelEnabled: false });
  text.computeBoundingBox();
  const bounds = text.boundingBox;
  text.translate(-(bounds.min.x + bounds.max.x) / 2, -(bounds.min.y + bounds.max.y) / 2, 0);
  const mesh = new THREE.Mesh(text, ink);
  mesh.name = `Legend_${letter}`;
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = .333;
  mesh.scale.setScalar(letter === "A" ? 1 : 0);
  cap.add(mesh);
}
const stem = new THREE.Mesh(new THREE.BoxGeometry(.34, .3, .34), new THREE.MeshStandardMaterial({ color: "#d4d1c9", roughness: .55 }));
stem.position.y = -.49; stem.name = "Stationary_Stem"; model.add(stem);
model.userData = { sequence: ["A", "I", "N", "I"], pressTravel: .16, upAxis: "Y", font: "Helvetiker, MAGENTA Ltd. 2004; license in KEYCAP.md" };
const binary = await new GLTFExporter().parseAsync(model, { binary: true, trs: true, copyright: "Keycap geometry: A’ini portfolio. Glyphs: Copyright (c) 2004 MAGENTA Ltd." });
await mkdir(new URL("public/models/", root), { recursive: true });
await writeFile(new URL("public/models/aini-keycap.glb", root), Buffer.from(binary));
await writeFile(new URL("public/models/KEYCAP.md", root), `# A’ini keycap\n\nRegenerate with \`node scripts/create-keycap.mjs\`.\n\nY is up. Animate \`Pressable_Cap.position.y\` from 0 to -0.16. Keep \`Stationary_Stem\` fixed. The meshes \`Legend_A\`, \`Legend_I\`, \`Legend_N\` are independent; set the selected mesh's scale to 1 and the others to 0. The default letter is A. The website cycles A → I → N → I. Materials are ivory plastic and navy ink. The model contains no external textures.\n\nThe GLB includes a dielectric satin-plastic material with clearcoat and IOR. The website adds a filtered procedural grain shader and a generated studio reflection environment in \`src/lib/keycap-material.ts\`. Those runtime effects are not baked into the GLB; other viewers need their own environment lighting.\n\n## Glyph attribution\n\nHelvetiker typeface data from three.js r186, examples/fonts/helvetiker_regular.typeface.json.\n\n${fontData.original_font_information.license_description}\n`);
console.log(`Created public/models/aini-keycap.glb (${binary.byteLength} bytes)`);
