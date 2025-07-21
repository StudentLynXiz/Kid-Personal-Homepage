// 3D星系实现
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('galaxy-canvas');
    
    // 场景设置
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 添加星星背景
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.03,
        sizeAttenuation: true
    });
    
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // 创建代表不同内容的星球
    const planets = [];
    const planetInfo = [
        { name: 'intro', color: 0x64B5F6, size: 1.5, position: { x: -8, y: 0, z: 0 } },
        { name: 'expertise', color: 0x4FC3F7, size: 1.3, position: { x: 8, y: 4, z: -5 } },
        { name: 'projects', color: 0x29B6F6, size: 1.4, position: { x: 0, y: -6, z: 3 } },
        { name: 'achievements', color: 0x81D4FA, size: 1.2, position: { x: 6, y: -3, z: -7 } },
        { name: 'contact', color: 0x4DB6AC, size: 1.6, position: { x: -5, y: 5, z: -4 } }
    ];
    
    // 创建星球
    planetInfo.forEach(info => {
        const geometry = new THREE.SphereGeometry(info.size, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: info.color,
            shininess: 80,
            emissive: info.color,
            emissiveIntensity: 0.2,
            specular: 0xffffff
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(info.position.x, info.position.y, info.position.z);
        planet.userData = { name: info.name };
        scene.add(planet);
        planets.push(planet);
        
        // 添加光晕
        const haloGeometry = new THREE.RingGeometry(info.size * 1.2, info.size * 1.8, 64);
        const haloMaterial = new THREE.MeshBasicMaterial({
            color: info.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.rotation.x = Math.PI / 2;
        planet.add(halo);
        
        // 添加轨道
        const orbitGeometry = new THREE.RingGeometry(
            Math.sqrt(planet.position.x * planet.position.x + planet.position.y * planet.position.y + planet.position.z * planet.position.z) - 0.5,
            Math.sqrt(planet.position.x * planet.position.x + planet.position.y * planet.position.y + planet.position.z * planet.position.z) + 0.5,
            128
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x4facfe,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
    });
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x64b5f6, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    // 相机位置
    camera.position.z = 20;
    
    // 鼠标交互变量
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let actualRotationX = 0;
    let actualRotationY = 0;
    
    // 鼠标移动事件
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // 触摸移动事件
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            event.preventDefault();
        }
    }, { passive: false });
    
    // 窗口大小调整处理
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        // 平滑旋转
        targetRotationX = mouseY * 0.0003;
        targetRotationY = mouseX * 0.0003;
        
        actualRotationX += (targetRotationX - actualRotationX) * 0.05;
        actualRotationY += (targetRotationY - actualRotationY) * 0.05;
        
        // 应用旋转到所有行星
        planets.forEach(planet => {
            planet.rotation.x += actualRotationX;
            planet.rotation.y += actualRotationY;
        });
        
        // 让行星缓慢自转
        planets.forEach(planet => {
            planet.rotation.y += 0.001;
        });
        
        // 旋转星星背景
        stars.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
});