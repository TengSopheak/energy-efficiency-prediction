import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("three-container");
const loader = document.getElementById("threeLoader");

if (!container) {
    // No 3D container on the page
    console.error("Three.js container not found");
} else {
    let scene, camera, renderer, controls, building;
    let initialized = false;
    let lastFrameTime = performance.now();

    function init3D() {
        if (initialized) return;
        initialized = true;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0b1220, 30, 80);

        camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            200,
        );
        camera.position.set(18, 14, 22);
        camera.lookAt(0, 4, 0);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        container.appendChild(renderer.domElement);

        // Lights
        const ambient = new THREE.AmbientLight(0x88aaff, 0.35);
        scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0x88ccee, 0x1a1a2a, 0.5);
        scene.add(hemi);

        const keyLight = new THREE.DirectionalLight(0xffeecc, 1.4);
        keyLight.position.set(15, 25, 12);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 80;
        keyLight.shadow.camera.left = -30;
        keyLight.shadow.camera.right = 30;
        keyLight.shadow.camera.top = 30;
        keyLight.shadow.camera.bottom = -30;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.radius = 8;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
        fillLight.position.set(-12, 8, -10);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x10b981, 0.5);
        rimLight.position.set(-5, 4, 15);
        scene.add(rimLight);

        // Ground
        const groundGeo = new THREE.CircleGeometry(40, 64);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x1a2336,
            roughness: 0.9,
            metalness: 0.1,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Grid
        const grid = new THREE.GridHelper(60, 30, 0x10b981, 0x1e293b);
        grid.material.opacity = 0.15;
        grid.material.transparent = true;
        grid.position.y = 0.01;
        scene.add(grid);

        // Building
        building = new Building3D();
        scene.add(building.group);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 12;
        controls.maxDistance = 45;
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.target.set(0, 4, 0);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
        controls.enablePan = false;

        // Pause auto-rotate on interaction
        controls.addEventListener("start", () => {
            controls.autoRotate = false;
        });
        controls.addEventListener("end", () => {
            setTimeout(() => {
                controls.autoRotate = true;
            }, 4000);
        });

        // Apply initial state
        const initialState = window.energyEfficiencyState || {};
        Object.keys(initialState).forEach((k) =>
            building.setFeature(k, initialState[k]),
        );

        if (loader) {
            setTimeout(() => {
                loader.style.opacity = "0";
                loader.style.transition = "opacity 0.5s";
                setTimeout(() => (loader.style.display = "none"), 500);
            }, 600);
        }

        window.addEventListener("resize", onResize);
        animate();
    }

    function onResize() {
        if (!camera || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate(now = performance.now()) {
        requestAnimationFrame(animate);
        const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
        lastFrameTime = now;

        building.update(dt);
        controls.update();
        renderer.render(scene, camera);
    }

    /* ============================================================
   BUILDING 3D CLASS
   ============================================================ */
    class Building3D {
        constructor() {
            this.group = new THREE.Group();

            // State (current and target for smooth lerp)
            this.target = {
                width: 8,
                depth: 8,
                height: 3.5,
                orientation: 0,
                glazingArea: 0.1,
                glazingDist: 0,
                wallHighlight: 0,
                roofHighlight: 0,
                surfacePulse: 0,
            };
            this.current = { ...this.target };
            this.focusMode = null;

            // Materials
            this.wallMat = new THREE.MeshStandardMaterial({
                color: 0xc8d4e8,
                roughness: 0.7,
                metalness: 0.05,
                emissive: 0x10b981,
                emissiveIntensity: 0,
            });
            this.roofMat = new THREE.MeshStandardMaterial({
                color: 0x4a5878,
                roughness: 0.6,
                metalness: 0.2,
                emissive: 0x38bdf8,
                emissiveIntensity: 0,
            });
            this.foundationMat = new THREE.MeshStandardMaterial({
                color: 0x2a3447,
                roughness: 0.9,
                metalness: 0.1,
            });
            this.windowMat = new THREE.MeshPhysicalMaterial({
                color: 0x60a5fa,
                roughness: 0.1,
                metalness: 0.3,
                transmission: 0.4,
                transparent: true,
                opacity: 0.7,
                emissive: 0x60a5fa,
                emissiveIntensity: 0.4,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
            });

            // Meshes
            this.body = new THREE.Mesh(
                new THREE.BoxGeometry(8, 3.5, 8),
                this.wallMat,
            );
            this.body.position.y = 1.75 + 0.3;
            this.body.castShadow = true;
            this.body.receiveShadow = true;
            this.group.add(this.body);

            this.roof = new THREE.Mesh(
                new THREE.BoxGeometry(8.4, 0.3, 8.4),
                this.roofMat,
            );
            this.roof.position.y = 3.5 + 0.45;
            this.roof.castShadow = true;
            this.group.add(this.roof);

            this.foundation = new THREE.Mesh(
                new THREE.BoxGeometry(8.2, 0.3, 8.2),
                this.foundationMat,
            );
            this.foundation.position.y = 0.15;
            this.foundation.castShadow = true;
            this.foundation.receiveShadow = true;
            this.group.add(this.foundation);

            // Windows — 4 faces × grid
            this.windowGroup = new THREE.Group();
            this.group.add(this.windowGroup);
            this.windows = [];
            this.createWindows();

            // Outline for surface area pulse
            this.outline = new THREE.LineSegments(
                new THREE.EdgesGeometry(new THREE.BoxGeometry(8.4, 4.1, 8.4)),
                new THREE.LineBasicMaterial({
                    color: 0x10b981,
                    transparent: true,
                    opacity: 0,
                }),
            );
            this.outline.position.y = 2.05 + 0.3;
            this.group.add(this.outline);

            // Compass marker
            this.compass = this.createCompass();
            this.compass.position.set(0, 0.05, 0);
            this.group.add(this.compass);
        }

        createWindows() {
            // Clear existing
            while (this.windowGroup.children.length)
                this.windowGroup.remove(this.windowGroup.children[0]);
            this.windows = [];

            const cols = 3,
                rows = 2;
            const faces = [
                { dir: "north", normal: [0, 0, -1], rotY: 0 },
                { dir: "south", normal: [0, 0, 1], rotY: Math.PI },
                { dir: "east", normal: [1, 0, 0], rotY: Math.PI / 2 },
                { dir: "west", normal: [-1, 0, 0], rotY: -Math.PI / 2 },
            ];

            faces.forEach((face) => {
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const win = new THREE.Mesh(
                            new THREE.PlaneGeometry(1, 1),
                            this.windowMat.clone(),
                        );
                        win.userData = {
                            face: face.dir,
                            row: r,
                            col: c,
                        };
                        this.windows.push(win);
                        this.windowGroup.add(win);
                    }
                }
            });
        }

        createCompass() {
            const g = new THREE.Group();
            const marker = new THREE.Mesh(
                new THREE.ConeGeometry(0.4, 0.8, 4),
                new THREE.MeshBasicMaterial({ color: 0xfb923c }),
            );
            marker.rotation.x = Math.PI / 2;
            marker.position.set(0, 0, -6);
            g.add(marker);
            return g;
        }

        setFeature(id, value) {
            switch (id) {
                case "compactness":
                    // Morph between elongated and compact footprint
                    // compactness 0.5 → elongated (depth 5, width 12), 1.0 → compact cube (8x8)
                    const t = (value - 0.5) / 0.5;
                    this.target.width = 10 - t * 2; // 10 → 8
                    this.target.depth = 6 + t * 2; // 6 → 8
                    break;
                case "surfaceArea":
                    // Trigger pulse
                    this.target.surfacePulse = 1;
                    setTimeout(() => {
                        this.target.surfacePulse = 0;
                    }, 800);
                    break;
                case "wallArea":
                    this.target.wallHighlight = 1;
                    setTimeout(() => {
                        this.target.wallHighlight = 0.5;
                    }, 800);
                    break;
                case "roofArea":
                    this.target.roofHighlight = 1;
                    setTimeout(() => {
                        this.target.roofHighlight = 0.3;
                    }, 800);
                    break;
                case "height":
                    this.target.height = value;
                    break;
                case "orientation":
                    const orientations = {
                        North: 0,
                        East: -Math.PI / 2,
                        South: Math.PI,
                        West: Math.PI / 2,
                    };
                    this.target.orientation = orientations[value] || 0;
                    break;
                case "glazingArea":
                    this.target.glazingArea = value;
                    break;
                case "glazingDist":
                    this.target.glazingDist = parseInt(value.charAt(0));
                    break;
            }
        }

        focusFeature(id) {
            this.focusMode = id;
            // Subtle camera hint via target offset
            if (id === "roofArea") {
                controls.target.lerp(new THREE.Vector3(0, 6, 0), 0.3);
            } else if (id === "wallArea") {
                controls.target.lerp(new THREE.Vector3(0, 3, 0), 0.3);
            }
        }

        unfocusFeature() {
            this.focusMode = null;
            controls.target.lerp(new THREE.Vector3(0, 4, 0), 0.3);
        }

        update(dt) {
            // Lerp current toward target
            const lerp = (a, b, t) => a + (b - a) * Math.min(1, t);
            const speed = 6;

            this.current.width = lerp(
                this.current.width,
                this.target.width,
                dt * speed,
            );
            this.current.depth = lerp(
                this.current.depth,
                this.target.depth,
                dt * speed,
            );
            this.current.height = lerp(
                this.current.height,
                this.target.height,
                dt * speed,
            );
            this.current.orientation = lerp(
                this.current.orientation,
                this.target.orientation,
                dt * speed,
            );
            this.current.glazingArea = lerp(
                this.current.glazingArea,
                this.target.glazingArea,
                dt * speed,
            );
            this.current.wallHighlight = lerp(
                this.current.wallHighlight,
                this.target.wallHighlight,
                dt * 4,
            );
            this.current.roofHighlight = lerp(
                this.current.roofHighlight,
                this.target.roofHighlight,
                dt * 4,
            );
            this.current.surfacePulse = lerp(
                this.current.surfacePulse,
                this.target.surfacePulse,
                dt * 5,
            );

            // Apply to body
            this.body.scale.set(
                this.current.width / 8,
                this.current.height / 3.5,
                this.current.depth / 8,
            );
            this.body.position.y = this.current.height / 2 + 0.3;

            // Roof
            this.roof.scale.set(
                this.current.width / 8,
                1,
                this.current.depth / 8,
            );
            this.roof.position.y = this.current.height + 0.45;

            // Foundation
            this.foundation.scale.set(
                this.current.width / 8,
                1,
                this.current.depth / 8,
            );

            // Outline
            this.outline.scale.set(
                this.current.width / 8,
                this.current.height / 3.5,
                this.current.depth / 8,
            );
            this.outline.position.y = this.current.height / 2 + 0.3;
            this.outline.material.opacity = this.current.surfacePulse * 0.8;
            const pulseScale = 1 + this.current.surfacePulse * 0.04;
            this.outline.scale.multiplyScalar(pulseScale);

            // Rotation
            this.group.rotation.y = this.current.orientation;

            // Wall highlight (emissive pulse)
            this.wallMat.emissiveIntensity = this.current.wallHighlight * 0.3;
            // Roof highlight
            this.roofMat.emissiveIntensity = this.current.roofHighlight * 0.6;

            // Windows
            const dist = this.current.glazingDist;
            const winScale = Math.max(
                0.05,
                (this.current.glazingArea / 0.4) * 1.5 + 0.1,
            );
            const winOpacity = 0.2 + this.current.glazingArea * 1.8;

            this.windows.forEach((win) => {
                const face = win.userData.face;
                let visible = false;
                // Distribution logic
                if (dist === 0) visible = false;
                else if (dist === 5) visible = true;
                else if (dist === 1) visible = face === "north";
                else if (dist === 2) visible = face === "east";
                else if (dist === 3) visible = face === "south";
                else if (dist === 4) visible = face === "west";

                // Position
                const cols = 3,
                    rows = 2;
                const w = this.current.width;
                const d = this.current.depth;
                const h = this.current.height;
                const c = win.userData.col,
                    r = win.userData.row;

                const xOff = (c - 1) * (w / 4);
                const yOff = (r - 0.5) * (h / 3) + h / 2 + 0.3;

                const winW = 1.2 * winScale * (w / 8);
                const winH = 0.9 * winScale * (h / 3.5);
                win.scale.set(winW, winH, 1);

                const baseOpacity = visible ? winOpacity : 0;
                win.material.opacity = baseOpacity;
                win.material.emissiveIntensity = visible
                    ? 0.3 + this.current.glazingArea * 1.5
                    : 0;
                win.material.transparent = true;
                win.visible = visible || this.current.glazingArea > 0.01;

                if (!visible) win.material.opacity *= 0.15;

                // Position by face
                switch (face) {
                    case "north":
                        win.position.set(xOff, yOff, -d / 2 - 0.01);
                        win.rotation.y = 0;
                        break;
                    case "south":
                        win.position.set(xOff, yOff, d / 2 + 0.01);
                        win.rotation.y = Math.PI;
                        break;
                    case "east":
                        win.position.set(w / 2 + 0.01, yOff, xOff);
                        win.rotation.y = Math.PI / 2;
                        break;
                    case "west":
                        win.position.set(-w / 2 - 0.01, yOff, xOff);
                        win.rotation.y = -Math.PI / 2;
                        break;
                }
            });
        }
    }

    // Lazy init when visible
    const demoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    init3D();
                    demoObserver.disconnect();
                }
            });
        },
        { threshold: 0.1 },
    );
    demoObserver.observe(container);

    // Expose globally
    window.building3D = {
        setFeature: (id, v) => {
            if (building) building.setFeature(id, v);
        },
        focusFeature: (id) => {
            if (building) building.focusFeature(id);
        },
        unfocusFeature: () => {
            if (building) building.unfocusFeature();
        },
    };
}
