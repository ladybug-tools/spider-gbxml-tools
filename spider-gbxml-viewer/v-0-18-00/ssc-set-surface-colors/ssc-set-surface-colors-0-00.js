
const SSC = {};

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