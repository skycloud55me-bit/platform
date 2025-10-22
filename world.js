let scene, camera, renderer, character, moodColor;

function enterWorld(mood, avatarType) {
  const canvas = document.getElementById("world-canvas");
  canvas.style.display = "block";

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  switch (mood) {
    case "sad": moodColor = 0x6fa3ef; break;
    case "happy": moodColor = 0xfff176; break;
    case "angry": moodColor = 0xff8a80; break;
    case "anxious": moodColor = 0xb0bec5; break;
    default: moodColor = 0xcfd8dc;
  }

  scene.background = new THREE.Color(moodColor);

  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const charGeometry = new THREE.BoxGeometry(1, 2, 1);
  const charColor = avatarType === "male" ? 0x3366cc : 0xcc6699;
  const charMaterial = new THREE.MeshLambertMaterial({ color: charColor });
  character = new THREE.Mesh(charGeometry, charMaterial);
  character.position.y = 1;
  scene.add(character);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  camera.position.z = 10;
  camera.position.y = 3;

  animateWorld();
  window.addEventListener("keydown", moveCharacter);
}

function moveCharacter(event) {
  if (!character) return;
  const step = 0.3;
  switch (event.key) {
    case "ArrowUp": character.position.z -= step; break;
    case "ArrowDown": character.position.z += step; break;
    case "ArrowLeft": character.position.x -= step; break;
    case "ArrowRight": character.position.x += step; break;
  }
}

function animateWorld() {
  requestAnimationFrame(animateWorld);
  renderer.render(scene, camera);
}
