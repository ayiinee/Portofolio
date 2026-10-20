import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { applyIvoryGrain, createKeycapEnvironment } from "@/lib/keycap-material";

export type KeycapControls = { letter: string; pressed: boolean; reducedMotion: boolean };
export type KeycapScene = { update: (controls: KeycapControls) => void; dispose: () => void };

function disposeModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse(object => {
    if (object instanceof THREE.Mesh) {
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
}

export async function createKeycapScene(host: HTMLSpanElement, signal: AbortSignal, onContextLost: () => void): Promise<KeycapScene> {
  const response = await fetch("/models/aini-keycap.glb", { signal });
  if (!response.ok) throw new Error("Keycap model could not load");
  const model = (await new GLTFLoader().parseAsync(await response.arrayBuffer(), "")).scene;
  if (signal.aborted) { disposeModel(model); signal.throwIfAborted(); }
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (error) { disposeModel(model); throw error; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  let reflection: THREE.WebGLRenderTarget;
  try {
    reflection = createKeycapEnvironment(renderer);
  } catch (error) {
    disposeModel(model); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    throw error;
  }
  scene.environment = reflection.texture;
  scene.environmentIntensity = .7;
  const camera = new THREE.OrthographicCamera(-1.72, 1.72, 1.72, -1.72, .1, 30);
  camera.position.set(3.4, 6.8, 7.7);
  camera.lookAt(0, -.05, 0);
  scene.add(new THREE.HemisphereLight(0xf6f8ff, 0x53749b, .5));
  const key = new THREE.DirectionalLight(0xfff8ed, 2.2);
  key.position.set(-3, 7, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = key.shadow.camera.bottom = -3;
  key.shadow.camera.right = key.shadow.camera.top = 3;
  key.shadow.normalBias = .025;
  key.shadow.bias = -.0001;
  key.shadow.radius = 6;
  key.shadow.blurSamples = 8;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xaccfff, 1.1);
  fill.position.set(4, 2, -3); scene.add(fill);
  model.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = !object.name.startsWith("Legend_"); object.receiveShadow = true;
      if (object.name === "Ivory_Shell" && object.material instanceof THREE.MeshPhysicalMaterial) applyIvoryGrain(object.material);
    }
  });
  scene.add(model);
  const cap = model.getObjectByName("Pressable_Cap")!;
  const legends = ["A", "I", "N"].map(letter => ({ letter, mesh: model.getObjectByName(`Legend_${letter}`)! }));
  let disposed = false, frame = 0, last = 0, velocity = 0, target = 0;
  let reducedMotion = false;

  // Demand rendering stops entirely at rest; there is no idle spin or tilt.
  function draw(time: number) {
    frame = 0;
    if (disposed) return;
    const dt = Math.min((time - last) / 1000 || 1 / 60, 1 / 30); last = time;
    velocity += ((target - cap.position.y) * 850 - velocity * 38) * dt;
    cap.position.y += velocity * dt;
    const moving = !reducedMotion && (Math.abs(target - cap.position.y) > .0002 || Math.abs(velocity) > .002);
    if (!moving) { cap.position.y = target; velocity = 0; }
    renderer.render(scene, camera);
    if (moving) frame = requestAnimationFrame(draw);
  }
  function invalidate() {
    if (!disposed && !frame) { last = performance.now(); frame = requestAnimationFrame(draw); }
  }
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -1.72 * aspect; camera.right = 1.72 * aspect;
    camera.updateProjectionMatrix(); invalidate();
  });
  resize.observe(host);
  const contextLost = (event: Event) => { event.preventDefault(); onContextLost(); };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);

  return {
    update(controls) {
      if (disposed) return;
      legends.forEach(({ letter, mesh }) => mesh.scale.setScalar(letter === controls.letter ? 1 : 0));
      reducedMotion = controls.reducedMotion;
      target = controls.pressed ? -.16 : 0;
      if (reducedMotion) { cap.position.y = target; velocity = 0; }
      invalidate();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame); resize.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      disposeModel(scene); reflection.dispose(); key.shadow.dispose(); renderer.dispose();
      renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
