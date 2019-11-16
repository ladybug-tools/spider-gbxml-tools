
const SSC = {};

let texture, video;

//video.src = "../../images/The-Pull-Heatmap-Follow-the-Pumpkin.webm";
url = "https://jaanga.github.io/cookbook-threejs/textures/movie.mp4";


SSC.setExposureMaterial = function () {

	const colorsExposure = {

		InteriorWall: 0xff8080,
		ExteriorWall: 0x80ff80,
		Roof: 0x80ff80,
		InteriorFloor: 0xff8080,
		ExposedFloor: 0x80ff80,
		Shade: 0xffb480 ,
		UndergroundWall: 0xd06800,
		UndergroundSlab: 0xd06800,
		Ceiling: 0xff8080,
		Air: 0xffff80,
		UndergroundCeiling: 0xff8080,
		RaisedFloor: 0xff8080,
		SlabOnGrade: 0xd06800,
		FreestandingColumn: 0xff8080,
		EmbeddedColumn: 0xff8080,
		Undefined: 0x888888

	};




	GBX.meshGroup.children.forEach(surface =>

		surface.material =
			new THREE.MeshPhongMaterial({
				color: colorsExposure[surface.userData.surfaceType], side: 2,
				opacity: 0.85, transparent: true
		} )

	);

}



SSC.setPhongDefaultMaterial = function() {

	GBX.meshGroup.children.forEach(surface =>

		surface.material = new THREE.MeshPhongMaterial( {
				side: 2,
				transparent: true
			} )

	);

};



SSC.setNormalMaterial = function() {

	GBX.meshGroup.children.forEach(surface =>

		surface.material = new THREE.MeshNormalMaterial( {
			side: 2,
			transparent: true
		})

	);

};


SSC.setRandomMaterial = function() {

	GBX.meshGroup.children.forEach(surface =>

		surface.material = new THREE.MeshPhongMaterial({
			color: 0xffffff * Math.random(),
			polygonOffset: false,
			polygonOffsetFactor: 10, // positive value pushes polygon further away
			polygonOffsetUnits: 1,
			side: 2,
			transparent: true
		} )

	);

};


SSC.setImageTexture = function () {

	const url = "http://i.imgur.com/RPv6ofy.jpg";

	loader = new THREE.TextureLoader();
	loader.crossOrigin = 'anonymous';
	loader.load( url, callback );

	function callback( txt ) {
		texture = txt;

		console.log( 'texture', texture );

		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		// texture.minFilter = THREE.NearestFilter;
		// texture.magFilter = THREE.NearestFilter;

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		// //texture.repeat.set( 1 / 64, 1 / 64 );
		// //texture.repeat.set( 1, 1);
		texture.needsUpdate = true;

		GBX.meshGroup.children.forEach(surface => {

			surface.material = new THREE.MeshBasicMaterial({
				side: 2,
				map: texture
			});

			surface.material.needsUpdate = true;
			surface.geometry = new THREE.Geometry().fromBufferGeometry(surface.geometry.clone() );

			const geometry = surface.geometry;

			geometry.verticesNeedUpdate = true;
			geometry.elementsNeedUpdate = true;
			geometry.morphTargetsNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			geometry.normalsNeedUpdate = true;
			geometry.colorsNeedUpdate = true;
			geometry.tangentsNeedUpdate = true;

		} )


	}


},



SSC.setVideoTexture = function () {

	// //const texture = new THREE.TextureLoader().load("http://i.imgur.com/RPv6ofy.jpg");


	// texture = new THREE.VideoTexture( video );
	// texture.minFilter = THREE.LinearFilter;
	// texture.magFilter = THREE.LinearFilter;
	// //texture.minFilter = THREE.NearestFilter;
	// //texture.magFilter = THREE.NearestFilter;

	// //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	// //texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
	// //texture.repeat.set( 1 / 64, 1 / 64 );
	// //texture.repeat.set( 1, 1);
	// //texture.offset.x = 0.5;
	// //texture.offset.y = 0.5;
	// //material = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );


	if ( !video ) {
		video = document.createElement( 'video' );
	}

	video.crossOrigin = "anonymous";
	video.pause = true;

	//mesh.material.map = "";
	//mesh.material.needsUpdate = true;

	video.src = url;
	video.load(); // must call after setting/changing source
	video.volume = 0;
	video.loop = true;

	video.oncanplaythrough = (event) => {

		console.log('Video can start, but not sure it will play through.');

		if ( texture ) { texture.dispose(); }

		texture = new THREE.VideoTexture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		//texture.wrapS = THREE.RepeatWrapping;
		//texture.wrapT = THREE.RepeatWrapping;
		//texture.format = THREE.RGBFormat;
		//texture.repeat.set( 2, 2 ); // not
		//texture.offset = new THREE.Vector2( - 0.5, - 0.5 );// works but kind of useless without repeat or loop
		//texture.transformUv = new THREE.Vector2( -2, 0.5 );


		GBX.meshGroup.children.forEach(surface => {

			surface.material = new THREE.MeshBasicMaterial({
				side: 2,
				map: texture,
				transparent: true
			});

			texture.needsUpdate = true;
			surface.material.needsUpdate = true;

			//surface.geometry = new THREE.Geometry().fromBufferGeometry(surface.geometry.clone() );

		} )

		video.volume = 0;
		video.play();

	};

	video.onerror = () => console.log("Error " + video.error.code + "; details: " + video.error.message);


};



SSC.setDefaultMaterial = function () {

	GBX.meshGroup.children.forEach(surface =>

		surface.material =
		new THREE.MeshPhongMaterial({
			color: GBX.colors[surface.userData.surfaceType], side: 2, opacity: 0.85, transparent: true
		} )

	);

};


SSC.toggleWireframe = function() {

	GBX.meshGroup.children.forEach(surface =>

		surface.material.wireframe = !surface.material.wireframe

	);

};


SSC.updateOpacitySurfaces = function() {

	const opacity = parseInt( rngOpacitySurfaces.value, 10 );

	outOpacitySurfaces.value = opacity + '%';

	GBX.meshGroup.children.forEach(surface =>

		surface.material.opacity = opacity / 100

	);


};

