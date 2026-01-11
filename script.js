import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let model, skeleton;

/* UI ELEMENTS */
const container = document.getElementById('scene-container');
const overlay = document.getElementById('overlay');
const ui = document.getElementById('ui');

const btnRaiseHand = document.getElementById('raise-hand');
const btnLowerHand = document.getElementById('lower-hand');
const btnRaiseLeg  = document.getElementById('raise-leg');
const btnLowerLeg  = document.getElementById('lower-leg');
const btnReset     = document.getElementById('reset-pose');

/* INIT */
init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));

  const dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(5, 10, 7);
  scene.add(dl);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.enableDamping = true;

  loadModel();
  window.addEventListener('resize', onResize);
}

/* LOAD MODEL */
function loadModel() {
  new GLTFLoader().load('model.glb', (gltf) => {
    model = gltf.scene;

    model.traverse(o => {
      if (o.isSkinnedMesh) skeleton = o.skeleton;
    });

    const box = new THREE.Box3().setFromObject(model);
    model.position.sub(box.getCenter(new THREE.Vector3()));

    scene.add(model);

    overlay.style.display = 'none';
    ui.classList.remove('hidden');

    setupUI();
  });
}

/* UI CONTROLS */
function setupUI() {

  // RIGHT ARM
  btnRaiseHand.onclick = () =>
    setBoneQuaternion('hand_ik.R', 'x', -0.6);
  btnLowerHand.onclick = () =>
    setBoneQuaternion('hand_ik.R', 'x', 0.6);
  // RIGHT LEG
  btnRaiseLeg.onclick = () =>
    setBoneQuaternion('DEF-thighR', 'x', 0.3);
  btnLowerLeg.onclick = () =>
    setBoneQuaternion('DEF-thighR', 'x', -0.3);
  btnReset.onclick = resetPose;
}

function getBoneByKeyword(keyword) {
  return skeleton.bones.find(b => b.name.includes(keyword));
}
function setBoneQuaternion(name, axis, angle) 
{
  const bone = skeleton.getBoneByName(name);
  if (!bone) return console.warn('Bone not found:', name);

  const axisVec =
    axis === 'x' ? new THREE.Vector3(1,0,0) :
    axis === 'y' ? new THREE.Vector3(0,1,0) :
    axis ==='z' ?  new THREE.Vector3(0,0,1) :

  bone.quaternion.multiply(
    new THREE.Quaternion().setFromAxisAngle(axisVec, angle)
  );
}


/* RESET */
function resetPose() {
  skeleton.bones.forEach(b => b.quaternion.identity());
}

/* LOOP */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/* RESIZE */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
