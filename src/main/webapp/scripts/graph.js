let scene, camera, renderer, mouse, plane, controls;
const canvas = document.getElementById('graphCanvas');
const rSelect = document.getElementById('r');
let currentR = 4;
let triangleMesh, arcMesh, rectMesh;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0xffffff, 0);

    mouse = new THREE.Vector2();

    camera.position.set(5, 3, 6);
    camera.lookAt(0, 0, 0);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = 0;
    scene.add(plane);

    drawAxesAndLabels();
    drawGraph(currentR);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function drawAxesAndLabels() {
    const material = new THREE.LineBasicMaterial({ color: 0x2d4057 });

    // ось x + стрелки
    let points = [new THREE.Vector3(-5,0, 0), new THREE.Vector3(5, 0, 0)];
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    const xAxis = new THREE.Line(geometry, material);
    xAxis.renderOrder = 5;
    scene.add(xAxis);

    geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(4.8, 0, -0.2),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(4.8, 0, 0.2)
    ]);
    const xArrowPos = new THREE.Line(geometry, material);
    xArrowPos.renderOrder = 5;
    scene.add(xArrowPos);

    // ось y + стрелки
    points = [new THREE.Vector3(0, -5, 0), new THREE.Vector3(0, 5, 0)];
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    const yAxis = new THREE.Line(geometry, material);
    yAxis.renderOrder = 5;
    scene.add(yAxis);

    geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 4.8, -0.2),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(0, 4.8, 0.2)
    ]);
    const yArrowPos = new THREE.Line(geometry, material);
    yArrowPos.renderOrder = 5;
    scene.add(yArrowPos);

    // ось z + стрелки
    points = [new THREE.Vector3(0, 0, -5), new THREE.Vector3(0, 0, 5)];
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    const zAxis = new THREE.Line(geometry, material);
    zAxis.renderOrder = 5;
    scene.add(zAxis);

    geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.2, 0, 4.8),
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(0.2, 0, 4.8)
    ]);
    const zArrowPos = new THREE.Line(geometry, material);
    zArrowPos.renderOrder = 5;
    scene.add(zArrowPos);

    // ticks для меток
    [-4, -3, -2, -1, 1, 2, 3, 4].forEach(val => {
        geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(val, -0.1, 0),
            new THREE.Vector3(val, 0.1, 0)
        ]);
        const xTick = new THREE.Line(geometry, material);
        xTick.renderOrder = 5;
        scene.add(xTick);

        geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-0.1, val, 0),
            new THREE.Vector3(0.1, val, 0)
        ]);
        const yTick = new THREE.Line(geometry, material);
        yTick.renderOrder = 5;
        scene.add(yTick);

        geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.1, val),
            new THREE.Vector3(0, 0.1, val)
        ]);
        const zTick = new THREE.Line(geometry, material);
        zTick.renderOrder = 5;
        scene.add(zTick);
    });

    // сфера для 0
    const zeroSphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const zeroSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x2d4057 });
    const zeroSphere = new THREE.Mesh(zeroSphereGeometry, zeroSphereMaterial);
    zeroSphere.position.set(0, 0, 0);
    zeroSphere.renderOrder = 5;
    scene.add(zeroSphere);

    // текстуры меток
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = '96px Helvetica';
        context.fillStyle = '#2d4057';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.5,
            depthTest: false,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1, 1, 1);
        sprite.renderOrder = 10;
        return sprite;
    }

    // метки
    [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(x => {
        const sprite = createTextSprite(x.toString());
        sprite.position.set(x, -0.3, 0);
        scene.add(sprite);
    });

    [-4, -3, -2, -1, 1, 2, 3, 4].forEach(y => {
        const sprite = createTextSprite(y.toString());
        sprite.position.set(0.3, y, 0);
        scene.add(sprite);
    });

    [-4, -3, -2, -1, 1, 2, 3, 4].forEach(z => {
        const sprite = createTextSprite(z.toString());
        sprite.position.set(0, -0.3, z);
        scene.add(sprite);
    });

    const zeroSprite = createTextSprite('0');
    zeroSprite.position.set(0.3, -0.3, 0);
    scene.add(zeroSprite);
}

function drawGraph(R) {
    const shapeMaterial = new THREE.MeshBasicMaterial({
        color: 0xa341a1,
        opacity: 0.55,
        transparent: true,
        side: THREE.DoubleSide
    });

    if (triangleMesh) scene.remove(triangleMesh);
    if (arcMesh) scene.remove(arcMesh);
    if (rectMesh) scene.remove(rectMesh);

    // треугольник
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, -R);
    triangleShape.lineTo(-R, 0);
    triangleShape.lineTo(0, 0);
    triangleShape.closePath();
    let geometry = new THREE.ShapeGeometry(triangleShape);
    triangleMesh = new THREE.Mesh(geometry, shapeMaterial);
    triangleMesh.position.z = 0;
    scene.add(triangleMesh);

    // окружность
    const arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, R, Math.PI / 2, Math.PI, false);
    arcShape.lineTo(0, 0);
    arcShape.closePath();
    geometry = new THREE.ShapeGeometry(arcShape);
    arcMesh = new THREE.Mesh(geometry, shapeMaterial);
    arcMesh.position.z = 0;
    scene.add(arcMesh);

    // прямоугольник
    const rectShape = new THREE.Shape();
    rectShape.moveTo(R, 0);
    rectShape.lineTo(0, 0);
    rectShape.lineTo(0, R);
    rectShape.lineTo(R, R);
    rectShape.closePath();
    geometry = new THREE.ShapeGeometry(rectShape);
    rectMesh = new THREE.Mesh(geometry, shapeMaterial);
    rectMesh.position.z = 0;
    scene.add(rectMesh);

    drawPointsFromSession();
}

rSelect.addEventListener('change', () => {
    const newR = parseFloat(rSelect.value);
    if (newR) {
        currentR = newR;
        drawGraph(currentR);
    }
    saveFormState();
});

function getCanvasData(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    mouse.x = (clickX / width) * 2 - 1;
    mouse.y = -(clickY / height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        const x = point.x.toFixed(4);
        const y = point.y.toFixed(4);
        const r = rSelect.value;
        const method = document.querySelector('input[name="method"]:checked')?.value || 'POST';
        const disableRedirect = document.getElementById('disableRedirect').checked;
        return { x, yValues: [y], r, method, disableRedirect };
    } else {
        return null;
    }
}

function drawPointsFromSession() {
    const oldGroup = scene.getObjectByName('sessionPoints');
    if (oldGroup) {
        scene.remove(oldGroup);
    }

    if (!window.ALL_POINTS_FROM_SESSION || ALL_POINTS_FROM_SESSION.length === 0) return;

    const pointsGroup = new THREE.Group();
    pointsGroup.name = 'sessionPoints';

    window.ALL_POINTS_FROM_SESSION.forEach((point, index) => {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: index === window.ALL_POINTS_FROM_SESSION.length - 1
                ? (point.hit ? 0x00805a : 0xff0059)
                : 0x656570
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.x, point.y, 0);
        pointsGroup.add(sphere);
    });

    scene.add(pointsGroup);
}