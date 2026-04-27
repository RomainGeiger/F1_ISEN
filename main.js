/* ================================================================
   F1 2026 - main.js
   Three.js scene, GLB loader, click detection, page navigation
   ================================================================ */

(function () {

  const PAGE_ROUTES = {
    roues: 'pages/evolutions.html#pneus-et-freins',
    chassis: 'pages/evolutions.html#architecture-chassis',
    moteur: 'pages/evolutions.html#power-unit-2026',
    aerodynamique: 'pages/evolutions.html#aero-active',
  };

  const container = document.getElementById('canvas-container');
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(0x050507, 0.018);

  const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
  camera.position.set(4, 1.5, 5);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI / 1.9;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;
  controls.target.set(0, 0.2, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x334466, 0.8);
  fillLight.position.set(-6, 3, -4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xe8000d, 0.6);
  rimLight.position.set(0, -2, -6);
  scene.add(rimLight);

  const groundLight = new THREE.DirectionalLight(0x222244, 0.4);
  groundLight.position.set(0, -5, 0);
  scene.add(groundLight);

  const groundGeo = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x090910,
    roughness: 0.15,
    metalness: 0.8,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.72;
  ground.receiveShadow = true;
  scene.add(ground);

  const gridHelper = new THREE.GridHelper(14, 28, 0x1a1a2e, 0x1a1a2e);
  gridHelper.position.y = -0.71;
  gridHelper.material.opacity = 0.5;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  const HOTSPOTS_3D = [
    { id: 'roues', label: 'Roues & Pneus', pos: new THREE.Vector3(1.6, -0.1, 1.2) },
    { id: 'roues', label: 'Roues arriere', pos: new THREE.Vector3(-1.8, -0.1, -0.9) },
    { id: 'chassis', label: 'Chassis / Cockpit', pos: new THREE.Vector3(0.1, 0.5, 0.2) },
    { id: 'moteur', label: 'Power Unit', pos: new THREE.Vector3(-0.5, 0.2, -0.5) },
    { id: 'aerodynamique', label: 'Aile avant', pos: new THREE.Vector3(0.0, 0.1, 2.5) },
    { id: 'aerodynamique', label: 'Aile arriere', pos: new THREE.Vector3(0.0, 0.8, -2.2) },
  ];

  let carModel = null;
  let clickableMeshes = [];
  const progressBar = document.getElementById('progress-bar');
  const loadingText = document.getElementById('loading-text');

  const loader = new THREE.GLTFLoader();

  loader.load(
    'new_f1_car_2026_new_car.glb',
    (gltf) => {
      carModel = gltf.scene;

      const box = new THREE.Box3().setFromObject(carModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.5 / maxDim;
      carModel.scale.setScalar(scale);
      carModel.position.sub(center.multiplyScalar(scale));

      carModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          clickableMeshes.push(child);

          const n = child.name.toLowerCase();
          if (n.includes('wheel') || n.includes('tyre') || n.includes('tire') || n.includes('rim')) {
            child.userData.page = 'roues';
          } else if (n.includes('chassis') || n.includes('cockpit') || n.includes('mono') || n.includes('body')) {
            child.userData.page = 'chassis';
          } else if (n.includes('engine') || n.includes('motor') || n.includes('exhaust') || n.includes('turbo')) {
            child.userData.page = 'moteur';
          } else if (n.includes('wing') || n.includes('aero') || n.includes('flap') || n.includes('front') || n.includes('rear')) {
            child.userData.page = 'aerodynamique';
          } else {
            child.userData.page = 'chassis';
          }
        }
      });

      scene.add(carModel);
      hideLoading();
    },
    (xhr) => {
      const pct = Math.round((xhr.loaded / xhr.total) * 100);
      progressBar.style.width = pct + '%';
      loadingText.textContent = `Chargement du modele... ${pct}%`;
    },
    (err) => {
      console.error('GLB load error:', err);
      loadingText.textContent = 'Erreur de chargement. Placez le fichier .glb dans le meme dossier.';
      progressBar.style.background = '#e8000d';
    }
  );

  function hideLoading() {
    const el = document.getElementById('loading');
    progressBar.style.width = '100%';
    loadingText.textContent = 'Pret.';
    setTimeout(() => el.classList.add('hidden'), 600);
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hotspotEl = document.getElementById('hotspot');
  const hotspotLabel = document.getElementById('hotspot-label');
  const cursorHint = document.getElementById('cursor-hint');

  let hoveredPage = null;

  const LABEL_MAP = {
    roues: 'Roues & Pneumatiques',
    chassis: 'Chassis / Cockpit',
    moteur: 'Power Unit',
    aerodynamique: 'Aerodynamique',
  };

  function updateMouse(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    cursorHint.style.left = e.clientX + 'px';
    cursorHint.style.top = e.clientY + 'px';

    if (clickableMeshes.length === 0) return;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(clickableMeshes, false);

    if (hits.length > 0) {
      const page = hits[0].object.userData.page;
      hoveredPage = page;
      hotspotEl.style.left = e.clientX + 'px';
      hotspotEl.style.top = e.clientY + 'px';
      hotspotLabel.textContent = LABEL_MAP[page] || page;
      hotspotEl.classList.add('visible');
      cursorHint.classList.add('active');
      renderer.domElement.style.cursor = 'pointer';
    } else {
      hoveredPage = null;
      hotspotEl.classList.remove('visible');
      cursorHint.classList.remove('active');
      renderer.domElement.style.cursor = 'crosshair';
    }
  }

  renderer.domElement.addEventListener('mousemove', updateMouse);

  renderer.domElement.addEventListener('click', () => {
    if (hoveredPage) {
      openPage(hoveredPage);
    }
  });

  window.openPage = function (pageId) {
    const route = PAGE_ROUTES[pageId];
    if (route) {
      window.location.href = route;
    }
  };

  window.addEventListener('resize', () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (carModel) {
      carModel.position.y = Math.sin(t * 0.6) * 0.04;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

})();
