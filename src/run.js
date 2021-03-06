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
import LeePerrySmith from "../assets/models/LeePerrySmith.glb";

import mapCOL from "../assets/images/Map-COL.jpg";
import mapSPEC from "../assets/images/Map-SPEC.jpg";
import smoothUV from "../assets/images/Infinite-Level_02_Tangent_SmoothUV.jpg";


let container, stats, loader;

let camera, scene, renderer;

let mesh;

let directionalLight, pointLight, ambientLight;

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let composer, effectFXAA;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    27,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 1700;
  camera.position.x = 0;
  camera.position.y = 20;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  // LIGHTS

  ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0xffffff, 1.25, 1000);
  pointLight.position.set(0, 0, 600);

  scene.add(pointLight);

  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, -0.5, -1);
  scene.add(directionalLight);

  const textureLoader = new THREE.TextureLoader();

  const diffuseMap = textureLoader.load(mapCOL);
  diffuseMap.encoding = THREE.sRGBEncoding;

  const specularMap = textureLoader.load(mapSPEC);
  specularMap.encoding = THREE.sRGBEncoding;

  const normalMap = textureLoader.load(smoothUV);

  const material = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    specular: 0x222222,
    shininess: 35,
    map: diffuseMap,
    specularMap: specularMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.8, 0.8),
  });

  loader = new GLTFLoader();
  loader.load(LeePerrySmith, function (gltf) {
    createScene(gltf.scene.children[0].geometry, 100, material);
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //

  stats = new Stats();
  container.appendChild(stats.dom);

  // COMPOSER

  renderer.autoClear = false;

  const renderModel = new RenderPass(scene, camera);

  const effectBleach = new ShaderPass(BleachBypassShader);
  const effectColor = new ShaderPass(ColorCorrectionShader);
  effectFXAA = new ShaderPass(FXAAShader);
  const gammaCorrection = new ShaderPass(GammaCorrectionShader);

  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );

  effectBleach.uniforms["opacity"].value = 0.2;

  effectColor.uniforms["powRGB"].value.set(1.4, 1.45, 1.45);
  effectColor.uniforms["mulRGB"].value.set(1.1, 1.1, 1.1);

  composer = new EffectComposer(renderer);

  composer.addPass(renderModel);
  composer.addPass(effectFXAA);
  composer.addPass(effectBleach);
  composer.addPass(effectColor);
  composer.addPass(gammaCorrection);

  // EVENTS

  document.addEventListener("mousemove", onDocumentMouseMove);
  window.addEventListener("resize", onWindowResize);
}

function createScene(geometry, scale, material) {
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.y = -50;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

  scene.add(mesh);
}

//

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);

  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

//

function animate() {
  requestAnimationFrame(animate);

  render();

  stats.update();
}

function render() {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  if (mesh) {
    mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
    mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
  }

  composer.render();
}
