// world.js — مشهد ثلاثي الأبعاد بسيط يتغير بتغير المزاج (Three.js r128)
let world = (function(){
  let scene, camera, renderer, particles, character;
  let width = window.innerWidth, height = window.innerHeight;
  const canvas = document.getElementById('world-canvas');

  function init(){
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha:true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5,10,7); scene.add(dir);

    // أرضية رمزية
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80,80), new THREE.MeshStandardMaterial({color:0x061526, roughness:0.9}));
    ground.rotation.x = -Math.PI/2; ground.position.y = -1.2; scene.add(ground);

    // جسيمات محيطة
    const g = new THREE.BufferGeometry();
    const count = 400;
    const pos = new Float32Array(count*3);
    for(let i=0;i<count;i++){ pos[i*3]= (Math.random()-0.5)*50; pos[i*3+1]=(Math.random()*8)-1; pos[i*3+2]=(Math.random()-0.5)*50; }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3));
    particles = new THREE.Points(g, new THREE.PointsMaterial({size:0.06, transparent:true, opacity:0.9}));
    scene.add(particles);

    // شخصية رمزية بسيطة
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.6,1.1,4,8), new THREE.MeshStandardMaterial({color:0x8aa9a5, roughness:0.6}));
    body.position.y = -0.2;
    character = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34,16,12), new THREE.MeshStandardMaterial({color:0xf1d9c8}));
    head.position.y = 0.95;
    character.add(body); character.add(head);
    character.position.set(0, -0.6, 0);
    scene.add(character);

    window.addEventListener('resize', onResize);
    animate();
  }

  function onResize(){
    width = window.innerWidth; height = window.innerHeight;
    camera.aspect = width/height; camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function applyMood(mood){
    // default values
    let bg = 0x02111a, fog = 0x02111a, particleOpacity = 0.8, ambientI=0.6;
    if(mood === 'sad'){ bg = 0x05263f; fog = 0x042433; particleOpacity=0.5; ambientI=0.35; }
    else if(mood === 'happy'){ bg = 0x123b1e; fog = 0x0b4020; particleOpacity=1.0; ambientI=0.9; }
    else if(mood === 'angry'){ bg = 0x3b0f0f; fog = 0x2a0b0b; particleOpacity=0.9; ambientI=0.7; }
    else if(mood === 'anxious'){ bg = 0x1e2b3a; fog = 0x17202a; particleOpacity=0.7; ambientI=0.5; }

    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.Fog(fog, 2, 28);
    particles.material.opacity = particleOpacity;
    // adjust character color slightly
    const bodyMat = character.children[0].material;
    if(mood === 'female') bodyMat.color.setHex(0xcc6699);
    // subtle breathing
    character.scale.y = 1.0;
  }

  function animate(){
    requestAnimationFrame(animate);
    const t = Date.now()*0.0006;
    character.rotation.y = Math.sin(t)*0.05;
    particles.rotation.y += 0.0006;
    renderer.render(scene, camera);
  }

  return { init, applyMood };
})();

// initialize immediately so canvas shows subtle world
try{ world.init(); }catch(e){ console.warn('World init failed', e); }
