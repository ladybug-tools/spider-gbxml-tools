let group, axesHelper, lightDirectional, cameraHelper;
let renderer, camera, controls, scene;

const THR = {};

THR.init = function () {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(-50, -50, 50);
	camera.up.set(0, 0, 1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcce0ff);
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1;
	controls.maxDistance = 100;
	controls.autoRotate = true;
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.enablePan = true;
	controls.autoRotateSpeed = 5;

	axesHelper = new THREE.AxesHelper(100);
	axesHelper.name = "axesHelper";
	scene.add(axesHelper);

	THR.addLights();

	THR.addGround();

	window.addEventListener("resize", THR.onWindowResize, false);
	window.addEventListener("orientationchange", THR.onWindowResize, false);

	window.addEventListener("keyup", THR.onStart);
	renderer.domElement.addEventListener("click", THR.onStart);
	renderer.domElement.addEventListener("touchstart", THR.onStart);
	renderer.domElement.addEventListener("touchmove", THR.onStart);
	renderer.domElement.addEventListener("touchend", THR.onStart);

	THR.renderer = renderer;
	THR.camera = camera;
	THR.controls = controls;
	THR.scene = scene;
};

THR.onStart = function () {
	controls.autoRotate = false;

	window.removeEventListener("keyup", THR.onStart);
	renderer.domElement.removeEventListener("click", THR.onStart);
	renderer.domElement.removeEventListener("touchstart", THR.onStart);
	renderer.domElement.removeEventListener("touchmove", THR.onStart);
	renderer.domElement.removeEventListener("touchend", THR.onStart);
};

THR.setSceneNew = function (group = new THREE.Group()) {
	scene.remove(group);

	group = new THREE.Group();

	THR.scene.add(group);

	return group;
};

THR.updateGroup = function () {
	THR.zoomObjectBoundingSphere(THR.group);

	RAY.intersectObjects = THR.group.children;

	RAY.addMouseMove();
};

THR.zoomObjectBoundingSphere = function (obj = group) {
	//console.log( "obj", obj );

	//console.log( "obj", obj );

	center = new THREE.Vector3(0, 0, 0);
	radius = 50;

	const bbox = new THREE.Box3().setFromObject(obj);
	//console.log( 'bbox', bbox );

	if (bbox.max.x !== Infinity) {
		const sphere = bbox.getBoundingSphere(new THREE.Sphere());

		center = sphere.center;
		radius = sphere.radius;
		//console.log( "sphere", sphere )
	}

	controls.target.copy(center); // needed because model may be far from origin
	controls.maxDistance = 50 * radius;

	delta = camera.position.clone().sub(controls.target).normalize();
	//console.log( 'delta', delta );

	position = controls.target.clone().add(delta.multiplyScalar(2 * radius));
	//console.log( 'position', position );

	distance = controls.target.distanceTo(camera.position);

	//camera.zoom = distance / (  * radius ) ;

	camera.position.copy(center.clone().add(new THREE.Vector3(-2 * radius, -2 * radius, 1.0 * radius)));
	camera.near = 0.001 * radius; //2 * camera.position.length();
	camera.far = 50 * radius; //2 * camera.position.length();
	camera.updateProjectionMatrix();

	axesHelper.position.copy(center);

	if (lightDirectional) {
		lightDirectional.position.copy(
			center.clone().add(new THREE.Vector3(-1.5 * radius, 1.5 * radius, 1.5 * radius))
		);
		lightDirectional.shadow.camera.scale.set(0.02 * radius, 0.02 * radius, 0.2 * radius);

		//targetObject.position.copy( center );

		scene.remove(cameraHelper);
		cameraHelper = new THREE.CameraHelper(lightDirectional.shadow.camera);
		scene.add(cameraHelper);
	}

	let event = new Event("onresetthree", { bubbles: true, cancelable: false, detail: true });

	//window.addEventListener( "onrresetthree", doThings, false );

	// listening: or-object-rotation-xx.js
	// listening: dss-display-scene-settings-xx.js

	window.dispatchEvent(event);
};

THR.addLights = function () {
	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	scene.add(new THREE.AmbientLight(0xaaaaaa));

	const pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.copy(camera.position);
	camera.add(pointLight);

	// lightDirectional = new THREE.DirectionalLight( 0xdffffff, 0 );
	// lightDirectional.position.set( -50, -200, 100 );
	// scene.add( lightDirectional );
};

THR.addLights = function () {
	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	scene.add(new THREE.AmbientLight(0x666666));

	const pointLight = new THREE.PointLight(0xffffff, 0.2);
	pointLight.position.copy(camera.position);
	pointLight.shadow.radius = 2;
	//pointLight.castShadow = true;
	camera.add(pointLight);

	lightDirectional = new THREE.DirectionalLight(0xdffffff, 0.5);
	lightDirectional.position.set(-50, -200, 100);
	lightDirectional.castShadow = true;
	lightDirectional.shadow.mapSize.width = 1024;
	lightDirectional.shadow.mapSize.height = 1024;

	var d = 100;
	lightDirectional.shadow.camera.left = -d;
	lightDirectional.shadow.camera.right = d;
	lightDirectional.shadow.camera.top = d;
	lightDirectional.shadow.camera.bottom = -d;
	lightDirectional.shadow.camera.far = 500;
	scene.add(lightDirectional);

	scene.add(new THREE.CameraHelper(lightDirectional.shadow.camera));
};

THR.addGround = function (position = new THREE.Vector3(0, 0, -25)) {
	const geometry = new THREE.PlaneBufferGeometry(2000, 2000);
	const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: 2 });
	THR.ground = new THREE.Mesh(geometry, material);
	THR.ground.position.copy(position);
	THR.ground.receiveShadow = true;

	scene.add(THR.ground);
};

THR.addMesh = function (size = 20) {
	// CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	// SphereGeometry( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	// TorusGeometry( radius, tube, radialSegments, tubularSegments, arc )

	const geometry = new THREE.BoxGeometry(size, size, size);

	// geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	// geometry.applyMatrix4( new THREE.Matrix4().makeScale( 1, 1, 1 ) );
	// geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );

	//const material = new THREE.MeshNormalMaterial();
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), specular: 0xffffff });
	mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;
	mesh.castShadow = true;

	//scene.add( mesh );

	return mesh;
};

THR.addMeshes = function (count = 100) {

	THR.group.add(
		...Array(count)
			.fill()
			.map(() => THR.addMesh())
	);

	THR.group.children.forEach(mesh => {
		mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100);
		mesh.rotation.set(0.2 * Math.random(), 0.2 * Math.random(), 0.2 * Math.random());
	});
};

THR.setStats = function () {
	const script = document.head.appendChild(document.createElement("script"));
	script.onload = () => {
		const stats = new Stats();
		const statsDom = document.body.appendChild(stats.dom);
		statsDom.style.left = "";
		statsDom.style.right = "0px";
		requestAnimationFrame(function loop() {
			stats.update();
			requestAnimationFrame(loop);
		});
	};

	script.src = "https://mrdoob.github.io/stats.js/build/stats.min.js";

	const render = renderer.info.render;

	detView.open = true;
	if (!window.divLog) {
		divLog = detView.body.appendChild(document.createElement("div"));
	}
	divLog.innerHTML = `
	Renderer<br>
	Calls: ${render.calls}<br>
	Triangles: ${render.triangles.toLocaleString()}<br>
	`;
};

THR.onWindowResize = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	//console.log( 'onWindowResize  window.innerWidth', window.innerWidth );
};

THR.animate = function () {
	requestAnimationFrame(THR.animate);
	renderer.render(scene, camera);
	controls.update();
};
