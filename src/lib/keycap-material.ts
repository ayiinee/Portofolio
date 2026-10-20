import * as THREE from "three";

/** A reflection-only studio: the page remains transparent behind the keycap. */
export function createKeycapEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#26354a");
  const panels = [
    { position: [-3, 5, -4], width: 4, height: 5, color: "#fff9ed", intensity: 6 },
    { position: [4, 1, -3], width: 2, height: 5, color: "#94c5ff", intensity: 4 },
    { position: [-1, -.5, 5], width: 5, height: 3, color: "#e6e4db", intensity: 1.5 },
  ];
  for (const panel of panels) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(panel.color).multiplyScalar(panel.intensity),
      side: THREE.DoubleSide, toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(panel.width, panel.height), material);
    mesh.position.set(panel.position[0], panel.position[1], panel.position[2]);
    mesh.lookAt(0, 0, 0); studio.add(mesh);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(studio, .06, .1, 100, { size: 128 });
  studio.traverse(object => {
    if (object instanceof THREE.Mesh) { object.geometry.dispose(); object.material.dispose(); }
  });
  generator.dispose();
  return environment;
}

/** Grain is anchored to the shell, with derivatives filtering it at small sizes. */
export function applyIvoryGrain(material: THREE.MeshPhysicalMaterial) {
  material.envMapIntensity = .9;
  material.onBeforeCompile = shader => {
    shader.vertexShader = `varying vec3 vKeycapPosition;\n${shader.vertexShader}`.replace(
      "#include <begin_vertex>", "#include <begin_vertex>\nvKeycapPosition = position;",
    );
    shader.fragmentShader = /* glsl */`
      varying vec3 vKeycapPosition;
      float keycapHash(vec3 p) {
        p = fract(p * vec3(.1031, .11369, .13787));
        p += dot(p, p.yxz + 19.19);
        return fract((p.x + p.y) * p.z);
      }
      float keycapNoise(vec3 p) {
        vec3 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(keycapHash(i), keycapHash(i + vec3(1,0,0)), f.x),
              mix(keycapHash(i + vec3(0,1,0)), keycapHash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(keycapHash(i + vec3(0,0,1)), keycapHash(i + vec3(1,0,1)), f.x),
              mix(keycapHash(i + vec3(0,1,1)), keycapHash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      ${shader.fragmentShader}
    `.replace("#include <roughnessmap_fragment>", /* glsl */`
      #include <roughnessmap_fragment>
      vec3 grainPosition = vKeycapPosition * 140.0;
      float grainFootprint = max(length(dFdx(grainPosition)), length(dFdy(grainPosition)));
      float grainVisibility = 1.0 - smoothstep(.8, 3.0, grainFootprint);
      float plasticGrain = (keycapNoise(grainPosition) - .5) * grainVisibility;
      float plasticMottle = keycapNoise(vKeycapPosition * 34.0) - .5;
      roughnessFactor = clamp(roughnessFactor + plasticGrain * .075 + plasticMottle * .025, .28, .55);
      diffuseColor.rgb *= 1.0 + plasticGrain * .035;
    `).replace("#include <normal_fragment_maps>", /* glsl */`
      #include <normal_fragment_maps>
      // Small surface-gradient perturbation keeps the molded plastic from looking glassy.
      vec3 grainDx = normalize(dFdx(-vViewPosition));
      vec3 grainDy = normalize(dFdy(-vViewPosition));
      vec3 grainR1 = cross(grainDy, normal), grainR2 = cross(normal, grainDx);
      float grainDet = dot(grainDx, grainR1) * faceDirection;
      vec3 grainGradient = sign(grainDet) * (dFdx(plasticGrain) * grainR1 + dFdy(plasticGrain) * grainR2) * .045;
      normal = normalize(abs(grainDet) * normal - grainGradient);
    `);
  };
  material.customProgramCacheKey = () => "aini-ivory-grain-v1";
}
