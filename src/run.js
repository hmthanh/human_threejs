import "regenerator-runtime/runtime";
import * as THREE from "./three.module.js";
import { GLTFLoader } from "./GLTFLoader.js";

import Stats from "./stats.module.js";
import { GUI } from "./lil-gui.module.min.js";
import { OrbitControls } from "./OrbitControls.js";

import { EffectComposer } from "./EffectComposer.js";
import { RenderPass } from "./RenderPass.js";
import { ShaderPass } from "./ShaderPass.js";
import { BleachBypassShader } from "./BleachBypassShader.js";
import { ColorCorrectionShader } from "./ColorCorrectionShader.js";
import { FXAAShader } from "./FXAAShader.js";
import { GammaCorrectionShader } from "./GammaCorrectionShader.js";
import facecap from "../assets/models/facecap.glb";
import { KTX2Loader } from "./KTX2Loader.js";
import { MeshoptDecoder } from "./meshopt_decoder.module.js";
import { RoomEnvironment } from "./RoomEnvironment.js";

init();

function init() {
  let mixer;

  const clock = new THREE.Clock();

  const container = document.createElement("div");
  document.body.appendChild(container);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    20
  );
  camera.position.set(-1.8, 0.8, 3);

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  container.appendChild(renderer.domElement);

  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath("/");
  ktx2Loader.detectSupport(renderer);

  new GLTFLoader()
    .setKTX2Loader(ktx2Loader)
    .setMeshoptDecoder(MeshoptDecoder)
    .load(facecap, (gltf) => {
      // const mesh = gltf.scene.children[0];

      // scene.add(mesh);

      // mixer = new THREE.AnimationMixer(mesh);

      // mixer.clipAction(gltf.animations[0]).play();
      // // GUI

      // const head = mesh.getObjectByName("mesh_2");
      // const influences = head.morphTargetInfluences;

      // const gui = new GUI();
      // gui.close();

      // for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
      //   gui
      //     .add(influences, value, 0, 1, 0.01)
      //     .name(key.replace("blendShape1.", ""))
      //     .listen(influences);
      // }
    });

  // const environment = new RoomEnvironment();
  // const pmremGenerator = new THREE.PMREMGenerator(renderer);

  // scene.background = new THREE.Color(0x666666);
  // scene.environment = pmremGenerator.fromScene(environment).texture;

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.minDistance = 2.5;
  // controls.maxDistance = 5;
  // controls.minAzimuthAngle = -Math.PI / 2;
  // controls.maxAzimuthAngle = Math.PI / 2;
  // controls.maxPolarAngle = Math.PI / 1.8;
  // controls.target.set(0, 0.15, -0.2);

  // const stats = new Stats();
  // container.appendChild(stats.dom);

  // renderer.setAnimationLoop(() => {
  //   const delta = clock.getDelta();

  //   if (mixer) {
  //     mixer.update(delta);
  //   }

  //   renderer.render(scene, camera);

  //   controls.update();

  //   stats.update();
  // });

  // window.addEventListener("resize", () => {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // });
}
