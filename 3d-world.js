class Interactive3DWorld {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.environment = null;
        this.currentMood = 'happy';
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createEnvironment();
        this.createCharacter();
        this.animate();
        this.setupInteractions();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // سماء زرقاء
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('virtual-world').appendChild(this.renderer.domElement);
    }

    createLights() {
        // ضوء رئيسي
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createEnvironment() {
        this.createGround();
        this.createSky();
        this.createTrees();
        this.createFlowers();
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(50, 50);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x7CFC00, // أخضر عشبي
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createSky() {
        // إضافة غيوم
        for (let i = 0; i < 5; i++) {
            const cloudGeometry = new THREE.SphereGeometry(1, 8, 8);
            const cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            
            cloud.position.set(
                Math.random() * 30 - 15,
                8 + Math.random() * 3,
                Math.random() * 30 - 15
            );
            cloud.scale.set(2, 0.5, 1);
            this.scene.add(cloud);
        }
    }

    createTrees() {
        for (let i = 0; i < 8; i++) {
            const treeGroup = new THREE.Group();
            
            // جذع الشجرة
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1;
            trunk.castShadow = true;
            
            // أوراق الشجرة
            const leavesGeometry = new THREE.SphereGeometry(1.5, 8, 8);
            const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 3;
            
            treeGroup.add(trunk);
            treeGroup.add(leaves);
            treeGroup.position.set(
                Math.random() * 40 - 20,
                0,
                Math.random() * 40 - 20
            );
            
            this.scene.add(treeGroup);
        }
    }

    createFlowers() {
        const flowerColors = [0xFF69B4, 0xFFD700, 0x9370DB, 0x00CED1];
        
        for (let i = 0; i < 15; i++) {
            const flowerGroup = new THREE.Group();
            
            // ساق الزهرة
            const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
            const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.y = 0.4;
            
            // زهرة
            const petalGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const petalMaterial = new THREE.MeshLambertMaterial({ 
                color: flowerColors[Math.floor(Math.random() * flowerColors.length)] 
            });
            const petals = new THREE.Mesh(petalGeometry, petalMaterial);
            petals.position.y = 0.9;
            
            flowerGroup.add(stem);
            flowerGroup.add(petals);
            flowerGroup.position.set(
                Math.random() * 30 - 15,
                0,
                Math.random() * 30 - 15
            );
            
            this.scene.add(flowerGroup);
        }
    }

    createCharacter() {
        this.character = new THREE.Group();
        
        // جسم الشخصية
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8A2BE2 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        
        // رأس الشخصية
        const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFEBCD });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.5;
        
        this.character.add(body);
        this.character.add(head);
        this.character.position.set(0, 0, 0);
        this.character.castShadow = true;
        
        this.scene.add(this.character);
    }

    changeEnvironment(mood) {
        this.currentMood = mood;
        
        switch(mood) {
            case 'happy':
                this.changeToHappyEnvironment();
                break;
            case 'calm':
                this.changeToCalmEnvironment();
                break;
            case 'peaceful':
                this.changeToPeacefulEnvironment();
                break;
        }
    }

    changeToHappyEnvironment() {
        // تغيير إلى بيئة مبهجة
        gsap.to(this.scene.background, { r: 0.53, g: 0.81, b: 0.92, duration: 1 });
        
        // إضافة فراشات
        this.addButterflies();
        
        // جعل الزهور تتمايل
        this.animateFlowers();
    }

    changeToCalmEnvironment() {
        // تغيير إلى بيئة هادئة
        gsap.to(this.scene.background, { r: 0.12, g: 0.56, b: 1.0, duration: 1 });
        
        // إضافة نافورة ماء
        this.addWaterFountain();
    }

    addButterflies() {
        for (let i = 0; i < 3; i++) {
            const butterfly = this.createButterfly();
            butterfly.position.set(
                Math.random() * 10 - 5,
                3 + Math.random() * 2,
                Math.random() * 10 - 5
            );
            this.scene.add(butterfly);
            this.animateButterfly(butterfly);
        }
    }

    createButterfly() {
        const butterfly = new THREE.Group();
        
        const wingGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        wingGeometry.scale(2, 0.1, 1);
        
        const leftWing = new THREE.Mesh(wingGeometry, new THREE.MeshLambertMaterial({ color: 0xFF69B4 }));
        const rightWing = new THREE.Mesh(wingGeometry, new THREE.MeshLambertMaterial({ color: 0xFF69B4 }));
        
        leftWing.position.set(-0.3, 0, 0);
        rightWing.position.set(0.3, 0, 0);
        
        butterfly.add(leftWing);
        butterfly.add(rightWing);
        
        return butterfly;
    }

    animateButterfly(butterfly) {
        gsap.to(butterfly.rotation, {
            y: Math.PI * 2,
            duration: 4,
            repeat: -1,
            ease: "none"
        });
        
        gsap.to(butterfly.position, {
            y: "+=1",
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    animateFlowers() {
        this.scene.children.forEach(child => {
            if (child.children && child.children.length > 0 && child.children[1] && child.children[1].geometry instanceof THREE.SphereGeometry) {
                gsap.to(child.rotation, {
                    x: Math.random() * 0.5 - 0.25,
                    z: Math.random() * 0.5 - 0.25,
                    duration: 2,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                });
            }
        });
    }

    setupInteractions() {
        // تفاعلات مع العالم
        document.addEventListener('click', (event) => {
            this.handleClick(event);
        });
    }

    handleClick(event) {
        // تفاعل عند النقر - يمكن تطويره
        if (this.character) {
            gsap.to(this.character.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // حركات مستمرة
        if (this.character) {
            this.character.rotation.y += 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
