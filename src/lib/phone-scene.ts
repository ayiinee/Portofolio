import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { ShowcaseScreen, ShowcaseSlide } from "@/types/project";

export type PhoneScene = {
  rotate: (x: number, y: number) => void;
  reset: () => void;
  dispose: () => void;
};

function roundedShape(width: number, height: number, radius: number) {
  const x = -width / 2, y = -height / 2, shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function roundedPlane(width: number, height: number, radius: number) {
  const shape = roundedShape(width, height, radius);
  const geometry = new THREE.ShapeGeometry(shape, 16);
  const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (positions.getX(i) + width / 2) / width, (positions.getY(i) + height / 2) / height);
  return geometry;
}

async function screenTexture(screen: ShowcaseScreen, signal: AbortSignal) {
  const canvas = document.createElement("canvas");
  canvas.width = 720; canvas.height = 1560;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ecf5fc"; ctx.fillRect(0, 0, 720, 1560);
  if (screen.media) {
    const response = await fetch(screen.media.src, { signal });
    if (!response.ok) throw new Error(`Screen could not load: ${screen.id}`);
    const url = URL.createObjectURL(await response.blob());
    const image = new Image();
    image.src = url;
    try {
      // Image.decode also accepts SVG fixtures, unlike createImageBitmap in Chrome.
      await image.decode();
      signal.throwIfAborted();
      const scale = Math.min(720 / image.naturalWidth, 1560 / image.naturalHeight);
      const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
      ctx.drawImage(image, (720 - w) / 2, (1560 - h) / 2, w, h);
    } finally { URL.revokeObjectURL(url); }
  } else {
    ctx.strokeStyle = "#bed7ea"; ctx.lineWidth = 2;
    ctx.strokeRect(48, 105, 624, 1350);
    ctx.fillStyle = "#17618b"; ctx.textAlign = "center";
    ctx.font = "500 22px sans-serif"; ctx.fillText("SCREENSHOT PLACEHOLDER", 360, 580);
    ctx.fillStyle = "#143754"; ctx.font = "600 46px sans-serif";
    const words = screen.label.split(" ");
    let line = "", y = 680;
    for (const word of words) {
      if (ctx.measureText(`${line} ${word}`).width > 570) { ctx.fillText(line, 360, y); line = word; y += 62; }
      else line = line ? `${line} ${word}` : word;
    }
    ctx.fillText(line, 360, y);
    ctx.fillStyle = "#40637e"; ctx.font = "26px sans-serif";
    ctx.fillText("Original screen coming soon", 360, y + 90);
    ctx.beginPath(); ctx.arc(360, 970, 38, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(343, 970); ctx.lineTo(377, 970); ctx.moveTo(360, 953); ctx.lineTo(360, 987); ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function phone(texture: THREE.Texture) {
  const group = new THREE.Group();
  const metal = new THREE.MeshPhysicalMaterial({ color: "#8395a7", metalness: 1, roughness: .22, clearcoat: .6 });
  const black = new THREE.MeshPhysicalMaterial({ color: "#080b10", metalness: .35, roughness: .19, clearcoat: 1 });
  const shell = new THREE.ExtrudeGeometry(roundedShape(1.59, 3.34, .21), { depth: .16, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 5, steps: 1, curveSegments: 20 });
  shell.translate(0, 0, -.11);
  const body = new THREE.Mesh(shell, metal);
  body.castShadow = true; body.receiveShadow = true; group.add(body);
  const bezel = new THREE.Mesh(roundedPlane(1.59, 3.34, .21), black);
  bezel.position.z = .14; group.add(bezel);
  const display = new THREE.Mesh(roundedPlane(1.46, 3.16, .13), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  display.position.z = .146; group.add(display);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(.038, 32), new THREE.MeshBasicMaterial({ color: "#06090e" }));
  lens.position.set(0, 1.48, .151); group.add(lens);
  const speaker = new THREE.Mesh(new RoundedBoxGeometry(.24, .018, .018, 2, .008), black);
  speaker.position.set(0, 1.637, .144); group.add(speaker);
  for (const [y, height] of [[.64, .43], [-.04, .25]]) {
    const button = new THREE.Mesh(new RoundedBoxGeometry(.04, height, .09, 2, .012), metal);
    button.position.set(.837, y, 0); group.add(button);
  }
  const back = new THREE.Mesh(roundedPlane(1.54, 3.28, .16), new THREE.MeshPhysicalMaterial({ color: "#223d55", metalness: .65, roughness: .32 }));
  back.position.z = -.112; back.rotation.y = Math.PI; group.add(back);
  const cameraBase = new THREE.Mesh(new RoundedBoxGeometry(.63, .83, .09, 4, .12), black);
  cameraBase.position.set(-.38, 1.08, -.16); group.add(cameraBase);
  for (const y of [.88, 1.28]) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .045, 32), metal);
    ring.rotation.x = Math.PI / 2; ring.position.set(-.38, y, -.22); group.add(ring);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(.103, 32), new THREE.MeshPhysicalMaterial({ color: "#071320", metalness: .7, roughness: .08, clearcoat: 1 }));
    glass.rotation.y = Math.PI; glass.position.set(-.38, y, -.247); group.add(glass);
  }
  return group;
}

/** One demand-rendered scene per visible slide. No idle animation or orbit loop. */
export async function createPhoneScene(host: HTMLElement, screens: ShowcaseScreen[], layout: ShowcaseSlide["layout"], signal: AbortSignal, onFailure: () => void): Promise<PhoneScene> {
  const textures: THREE.Texture[] = [];
  try {
    // Sequential loading ensures already-created textures are disposed on partial failure.
    for (const screen of screens.slice(0, layout === "scroll" ? 1 : 2)) textures.push(await screenTexture(screen, signal));
    signal.throwIfAborted();
  } catch (error) { textures.forEach(texture => texture.dispose()); throw error; }
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: "low-power" }); }
  catch (error) { textures.forEach(texture => texture.dispose()); throw error; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new THREE.Scene(), rig = new THREE.Group();
  let environment: THREE.WebGLRenderTarget;
  const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
  try { environment = pmrem.fromScene(room, .04); }
  catch (error) { textures.forEach(texture => texture.dispose()); renderer.dispose(); renderer.forceContextLoss(); throw error; }
  finally { room.dispose(); pmrem.dispose(); }
  scene.environment = environment.texture;
  scene.environmentIntensity = .9;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1c416c, 2));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(-3, 5, 7); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.normalBias = .03;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x70dfff, 3);
  rim.position.set(4, 1, -2); scene.add(rim);
  textures.forEach((texture, index) => {
    const device = phone(texture);
    if (textures.length > 1) {
      device.position.set(index ? .87 : -.85, index ? -.24 : .24, index ? .3 : 0);
      device.rotation.set(index ? .09 : -.08, index ? -.32 : .33, index ? .13 : -.18);
      if (layout === "comparison") { device.rotation.z = index ? -.06 : .06; device.position.y = index ? -.12 : .12; }
      if (layout === "hero") {
        device.position.set(index ? .5 : -.9, index ? -.6 : .17, index ? .25 : 0);
        device.rotation.set(-.04, index ? -.3 : .38, -.27);
        device.scale.setScalar(.9);
      }
    } else { device.rotation.set(-.06, -.22, -.07); device.scale.setScalar(1.1); }
    rig.add(device);
  });
  scene.add(rig);
  const camera = new THREE.OrthographicCamera(-2.3, 2.3, 2.3, -2.3, .1, 50);
  camera.position.set(0, 0, 12); camera.lookAt(0, 0, 0);
  let disposed = false, frame = 0;
  function invalidate() {
    if (disposed || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (disposed) return;
      try { renderer.render(scene, camera); } catch { onFailure(); }
    });
  }
  let renderedWidth = 0, renderedHeight = 0;
  const resize = () => {
    const width = host.clientWidth, height = host.clientHeight;
    if (disposed || !width || !height || (width === renderedWidth && height === renderedHeight)) return;
    renderedWidth = width; renderedHeight = height;
    const aspect = width / height;
    const extent = layout === "hero" ? Math.max(2.05, 1.75 / aspect) : Math.max(2.25, 2.15 / aspect);
    camera.top = extent; camera.bottom = -extent;
    camera.left = -extent * aspect; camera.right = extent * aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false); invalidate();
  };
  const observer = new ResizeObserver(resize);
  const lost = (event: Event) => { event.preventDefault(); onFailure(); };
  const api: PhoneScene = {
    rotate(x, y) { rig.rotation.y += x; rig.rotation.x = THREE.MathUtils.clamp(rig.rotation.x + y, -.8, .8); invalidate(); },
    reset() { rig.rotation.set(0, 0, 0); invalidate(); },
    dispose() {
      if (disposed) return;
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose()); environment.dispose(); key.shadow.dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
  try {
    signal.throwIfAborted();
    renderer.domElement.addEventListener("webglcontextlost", lost);
    host.appendChild(renderer.domElement); observer.observe(host); resize();
    // Resolve only after the first frame is drawn. The stage can then reveal
    // the live canvas without an empty frame or a differently posed poster.
    cancelAnimationFrame(frame); frame = 0;
    renderer.render(scene, camera);
    signal.throwIfAborted();
    return api;
  } catch (error) {
    api.dispose();
    throw error;
  }
}
