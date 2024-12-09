import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Get a reference to the container element
const container = document.querySelector('#container');

// Create a Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

// Create a Camera
const fov = 35; // Field of View
const aspect = container.clientWidth / container.clientHeight; // Aspect ratio
const near = 0.1; // Near clipping plane
const far = 100; // Far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(5, 5, 10);

// Create a Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
container.appendChild(renderer.domElement);

// Create OrbitControls for panning
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true; // Enable panning
controls.minDistance = 1; // Minimum zoom distance
controls.maxDistance = 50; // Maximum zoom distance

// Create a Cube with shadows
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; // Cube casts shadows
scene.add(cube);

// Add a Plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
plane.position.y = -2; // Place it below the cube
plane.receiveShadow = true; // Plane receives shadows
scene.add(plane);

// Add a Directional Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5); // Position the light
light.castShadow = true; // Light casts shadows
light.shadow.mapSize.width = 1024; // Shadow map resolution
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5; // Near clipping plane for shadows
light.shadow.camera.far = 50; // Far clipping plane for shadows
scene.add(light);

// Add a helper to visualize the light direction
const lightHelper = new THREE.DirectionalLightHelper(light, 1);
scene.add(lightHelper);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Required for damping to work
    controls.update();

    renderer.render(scene, camera);
}

// Start the animation loop
animate();