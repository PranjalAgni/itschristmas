import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set a custom background color
// const backgroundColor = 0x2d2d2d; // Replace with your desired color
// scene.background = new THREE.Color(backgroundColor);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 0); // Adjust the position of the light
scene.add(directionalLight);

// Load GLTF model
const loader = new GLTFLoader();
let loadedModel: THREE.Group<THREE.Object3DEventMap>;
loader.load(
  "/christmas.glb",
  (gltf) => {
    console.log("Model is loaded...");
    loadedModel = gltf.scene;
    loadedModel.position.set(0, 0, 2);
    loadedModel.rotation.set(0, Math.PI / 2, 0);
    loadedModel.scale.set(0.05, 0.05, 0.05); // Adjust the scale as needed
    scene.add(loadedModel);

    // Set up camera position and orientation to focus on the model
    const boundingBox = new THREE.Box3().setFromObject(loadedModel);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const maxSize = Math.max(size.x, size.y, size.z);
    const distance = maxSize / Math.tan((Math.PI * camera.fov) / 360);

    camera.position.copy(center);
    camera.position.z += distance;
  },
  undefined,
  (error) => {
    console.error("Error loading model ", error);
  }
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;

// set camera position so it does not start inside the model
camera.position.set(0, 0, 5);

// Zoom animation parameters
const zoomTarget = 1; // Target zoom distance
const zoomSpeed = 0.01; // Zoom speed

// Set up animation
const animate = function () {
  requestAnimationFrame(animate);
  // if (loadedModel) {
  //   // loadedModel.rotation.y += 0.0001; // Adjust the rotation speed as needed
  // }

  // Zoom in gradually
  if (camera.position.z > zoomTarget) {
    // camera.position.z -= zoomSpeed;
  }

  // Update controls
  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
};

function addUIListeners() {
  const playButton = document.getElementById("playButton");
  const backgroundMusic = document.getElementById("backgroundMusic") as HTMLAudioElement;
  // Play background music!!!
  playButton?.addEventListener("click", (event) => {
    event.preventDefault();

    if (!backgroundMusic.paused) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.volume = 0.5; // Adjust the volume as needed
      backgroundMusic.play();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    controls.update();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

animate();
addUIListeners();
