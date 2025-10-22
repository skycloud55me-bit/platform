// three-scene.js  (يعمل كـ ES module)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('threeArea');
if(container){
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02111a, 0.06);
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0,0,6);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,10,7);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x333333));

  // Sphere (self core)
  const geom = new THREE.IcosahedronGeometry(1.6, 3);
  const mat = new THREE.MeshStandardMaterial({
    roughness:0.4,
    metalness:0.1,
    emissive:0x072a3a,
    emissiveIntensity:0.6,
    color:0x2f6b8f
  });
  const core = new THREE.Mesh(geom, mat);
  scene.add(core);

  // Particles halo
  const particlesGeo = new THREE.BufferGeometry();
  const count = 300;
  const pos = new Float32Array(count * 3);
  for(let i=0;i<count;i++){
    pos[i*3+0] = (Math.random()-0.5)*8;
    pos[i*3+1] = (Math.random()-0.5)*4;
    pos[i*3+2] = (Math.random()-0.5)*6;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particlesMat = new THREE.PointsMaterial({ size: 0.06, transparent:true, opacity:0.8 });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  // Resize handling
  window.addEventListener('resize', ()=> {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  // Animation loop
  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    core.rotation.y = t * 0.2;
    core.rotation.x = Math.sin(t*0.3)*0.1;
    particles.rotation.y = t*0.02;
    particles.rotation.x = Math.sin(t*0.1)*0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // React to notes updates (change color intensity)
  window.addEventListener('xi:notesUpdated', (e)=>{
    const notes = e.detail || [];
    const n = notes.length;
    // Map n to color/emissive changes
    const hue = (n * 37) % 360; // changes with count
    const color = new THREE.Color(`hsl(${hue} 70% 45%)`);
    core.material.color = color;
    core.material.emissive = color.clone().multiplyScalar(0.2);
    particles.material.size = Math.min(0.16, 0.04 + n*0.008);
  });

  window.addEventListener('xi:reset3D', ()=>{
    core.material.color = new THREE.Color(0x2f6b8f);
    core.material.emissive = new THREE.Color(0x072a3a);
  });
}
