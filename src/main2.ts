import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a Christmas tree
const christmasTree = new THREE.Object3D();
const treeGeometry = new THREE.ConeGeometry(1, 2, 4);
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff33 });
const tree = new THREE.Mesh(treeGeometry, treeMaterial);
christmasTree.add(tree);

// Add the presents underneath the tree

const presentGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const presentMaterial = new THREE.MeshStandardMaterial({ color: 0xff3333 });

const present1 = new THREE.Mesh(presentGeometry, presentMaterial);
present1.position.set(-0.5, -1, 0);
christmasTree.add(present1);

const present2 = new THREE.Mesh(presentGeometry, presentMaterial);
present2.position.set(0.5, -1, 0);
christmasTree.add(present2);

const present3 = new THREE.Mesh(presentGeometry, presentMaterial);
present3.position.set(0, -1, 0.5);
christmasTree.add(present3);

// Add lights to the tree
const light1 = new THREE.PointLight(0xff3333, 1, 10);
light1.position.set(-1, 1, 0);
christmasTree.add(light1);

const light2 = new THREE.PointLight(0xff3333, 1, 10);
light2.position.set(1, 1, 0);
christmasTree.add(light2);

const light3 = new THREE.PointLight(0xff3333, 1, 10);
light3.position.set(0, 1, 1);
christmasTree.add(light3);

const light4 = new THREE.PointLight(0xff3333, 1, 10);
light4.position.set(0, 1, -1);
christmasTree.add(light4);

// Add snowfall effect
const snowflakesPositions = [];
const snowflakeGeometry = new THREE.BufferGeometry();
const snowflakeMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff });

for (let i = 0; i < 500; i++) {
  const x = (Math.random() - 0.5) * 20;
  const y = Math.random() * 10;
  const z = (Math.random() - 0.5) * 20;
  snowflakesPositions.push(x, y, z);
  snowflakeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(snowflakesPositions, 3));
}

const snowflakeSystem = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
christmasTree.add(snowflakeSystem);

scene.add(christmasTree);
// Allow the user to rotate around the tree using the mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = christmasTree.position;

function animate() {
  requestAnimationFrame(animate);
  // Rotate Christmas tree
  christmasTree.rotation.y += 0.005;

  // Update snowfall
  const snowflakePositions = snowflakeGeometry.attributes.position.array;
  for (let i = 1; i < snowflakePositions.length; i += 3) {
    snowflakePositions[i] -= 0.05; // Adjust the falling speed
    if (snowflakePositions[i] < 0) {
      snowflakePositions[i] = 10; // Reset to the top when reaching the bottom
      snowflakePositions[i - 1] = Math.random() * 10; // Randomize the y-coordinate for a more natural look
    }
  }
  snowflakeGeometry.attributes.position.needsUpdate = true;

  // Animate snowfall
  snowflakeSystem.rotation.y += 0.002;

  renderer.render(scene, camera);
}

animate();
