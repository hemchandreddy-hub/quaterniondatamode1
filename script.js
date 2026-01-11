import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let model, skeleton;
let restPose = new Map();


const container = document.getElementById('scene-container');
const overlay = document.getElementById('overlay');
const ui = document.getElementById('ui');

const handSlider = document.getElementById('handSlider');
const handNumber = document.getElementById('handNumber');
const legSlider  = document.getElementById('legSlider');
const legNumber  = document.getElementById('legNumber');
const resetBtn   = document.getElementById('reset');

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0,1.6,3);
  scene.background = new THREE.Color(0xefffff);


  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff,0x444444,1));
  const dl = new THREE.DirectionalLight(0xffffff,0.8);
  dl.position.set(5,10,7);
  scene.add(dl);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0,1,0);
  controls.enableDamping = true;

  loadModel();
  addUIEvents();
}

function loadModel() {
  new GLTFLoader().load('model.glb', gltf => {
    model = gltf.scene;
    model.traverse(o => { if (o.isSkinnedMesh) skeleton = o.skeleton; });

    scene.add(model);
    overlay.style.display = 'none';
    ui.classList.remove('hidden');
    skeleton.bones.forEach(bone => {
  restPose.set(bone.name, bone.quaternion.clone());
});

  });
}

/* ---- SLIDER + NUMBER SYNC ---- */

function bindControl(slider, number, boneName, axis) {

  function apply(value) {
    slider.value = number.value = value;
    applyQuaternion(boneName, axis, parseFloat(value));
  }

  slider.oninput = e => apply(e.target.value);
  number.oninput = e => apply(e.target.value);
}

function addUIEvents() {
  bindControl(handSlider, handNumber, 'hand_ik.R', 'z');
  bindControl(legSlider,  legNumber,  'DEF-thighR', 'x');

  resetBtn.onclick = resetPose;
}

/* ---- QUATERNION ONLY ---- */

function applyQuaternion(name, axis, angle) {
  const bone = skeleton.getBoneByName(name);
  if (!bone) return;

  const axisVec =
    axis === 'x' ? new THREE.Vector3(1,0,0) :
    axis === 'y' ? new THREE.Vector3(0,1,0) :
                   new THREE.Vector3(0,0,1);

  bone.quaternion.copy(
    new THREE.Quaternion().setFromAxisAngle(axisVec, angle)
  );
}

function resetPose() {
  skeleton.bones.forEach(bone => {
    const q = restPose.get(bone.name);
    if (q) bone.quaternion.copy(q);
  });

  rightHandSlider.value = 0;
  rightLegSlider.value = 0;
}


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

onresize = () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
};
