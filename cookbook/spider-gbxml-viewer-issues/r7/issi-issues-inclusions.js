

const ISIN = { "release": "R7.1" };

ISIN.errorsFound = {};
ISIN.inclusions = [];

ISIN.cssText = "background-color: pink; font-style: italic; font-weight: bold;";


// https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
// https://github.com/substack/point-in-polygon
// https://stackoverflow.com/questions/17223806/how-to-check-if-point-is-in-polygon-in-javascript


ISIN.getMenuInclusions = function() {

	let htm =
	`
		<details id=ISINdetInclusions ontoggle=ISIN.getInclusionsInit(); >

			<summary>Inclusions</summary>

			<p>
				Show/hide surfaces:<br>

				<button onclick=ISIN.toggleSurfacesByAngles(this,["0","180"]); > horizontal </button>

				<button onclick=ISIN.toggleSurfacesByAngles(this,"90"); > vertical </button>

				<button onclick=ISIN.toggleSurfacesByAngles(this);> angled </button>
			</p>

			<div id=ISINdivAnglesTilt ></div>

			<p><button onclick=divInclusionsFound.innerHTML=ISIN.getInclusions(this,["0","180"]); >find inclusions horizontal</button> </p>

			<div id=divInclusionsFound ></div>

		</details>

	`;

	return htm;

};



ISIN.getInclusionsInit = function() {

	//ISIN.cleanUpScene();

	navMenu.scrollTop = ISINdetInclusions.offsetTop;

	ISIN.anglesTilt = [];
	ISIN.anglesTiltSurfaces = [];

	GBX.gbjson.Campus.Surface.forEach( surface => {

		const tilt = surface.RectangularGeometry.Tilt;

		if ( ISIN.anglesTilt.includes( tilt ) === false ) {

			ISIN.anglesTilt.push( tilt );
			ISIN.anglesTiltSurfaces.push( [ surface ] );

		} else {

			const index = ISIN.anglesTilt.indexOf( tilt );
			ISIN.anglesTiltSurfaces[ index ].push( surface );

		}

	} );

	const anglesHtml = ISIN.anglesTilt.map( item => Number( item ).toLocaleString() ).join( ', ' );

	ISINdivAnglesTilt.innerHTML =
	`
		<details>

		<summary>tilt angles</summary>

		<p>${ anglesHtml }</p>

		</details>
	`;

};



ISIN.toggleSurfacesByAngles = function( button, angles = [] ) {

	//console.log( 'anglesTilt', anglesTilt, anglesTiltSurfaces );

	ISIN.cleanUpScene();

	angles = Array.isArray( angles ) ? angles : [ angles ];

	angles = angles.length === 0 ? ISIN.anglesTilt.filter( angle => ["0", "90", "180"].includes( angle ) === false ) : angles;

	//console.log( 'angles', angles );

	let count = 0;

	if ( button.style.fontStyle !== 'italic' ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let angle of angles ) {

			let index = ISIN.anglesTilt.indexOf( angle );
			let surfaceMeshes = GBX.surfaceMeshes.children.filter( element => ISIN.anglesTiltSurfaces[ index ].find( item => item.id === element.userData.gbjson.id ) );
			surfaceMeshes.forEach( mesh => mesh.visible = true );

			count += surfaceMeshes.length;

		}

		detPointInPolygon.querySelectorAll( "button" ).forEach( button => 	button.style.cssText = "" );

		button.style.cssText = ISIN.cssText;

		button.title = `surfaces count: ${ count }`;


	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.cssText = "";

	}

};



ISIN.getInclusions = function( button, angles = [] ) {

	let htm;
	ISIN.inclusions = [];

	ISIN.timeStart = performance.now();

	angles = Array.isArray( angles ) ? angles : [ angles ];

	angles = angles.length === 0 ? ISIN.anglesTilt.filter( angle => ["0", "90", "180"].includes( angle ) === false ) : angles;

	for ( let angle of angles ) {

		let index = ISIN.anglesTilt.indexOf( angle );

		let surfaceMeshes = GBX.surfaceMeshes.children.filter( element => ISIN.anglesTiltSurfaces[ index ].find( item => item.id === element.userData.gbjson.id ) );
		//console.log( 'surfaceMeshes', surfaceMeshes );


		//let children = GBX.surfaceMeshes.children;

		surfaceMeshes2 = surfaceMeshes.slice();

		for ( let surface of surfaceMeshes ) {

			const box1 = new THREE.Box3().setFromObject ( surface );

			for ( let surfaceTest of surfaceMeshes2 ) {

				const box2 = new THREE.Box3().setFromObject ( surfaceTest );

				if ( box1.containsBox( box2 )
					&& surface.uuid !== surfaceTest.uuid
					//&& surface.userData.gbjson.surfaceType !== surfaceTest.userData.gbjson.surfaceType
				) {

					//surfaceMeshes2.pop();

					ISIN.inclusions.push ( {s1: surface, s2: surfaceTest } );

				}

			}

		}
	}

	let txt = '';


	for ( let inclusion of ISIN.inclusions ) {

		//const butts1 = ISIN.getButtonsSurfaceId( inclusion.s1.userData.data.id );
		//const butts2 = ISIN.getButtonsSurfaceId( inclusion.s2.userData.data.id );

		txt +=
		`
		<button onclick=ISIN.setIntersected(${inclusion.s1}); title="${inclusion.s1.userData.gbjson.surfaceType }" >${inclusion.s1.userData.gbjson.Name}</button><br>
		${inclusion.s2.userData.gbjson.Name} ${inclusion.s2.userData.gbjson.surfaceType }
		<hr>`;

	}

	const arr = ISIN.inclusions.map( ( inclusion, index ) => {

		return `
		<button onclick=ISIN.setIntersected(${index},"s1"); title="${inclusion.s1.userData.gbjson.surfaceType }" >${inclusion.s1.userData.gbjson.Name}</button><br>
		<button onclick=ISIN.setIntersected(${index},"s2"); title="${inclusion.s2.userData.gbjson.surfaceType }" >${inclusion.s2.userData.gbjson.Name}</button>
		<hr>`;

	} );



	//ISIN.setSelectedFocus( ISIN.inclusions );
	//txt = setInclusionsRed();

	htm =
	`<p>
		inclusions found: ${ ISIN.inclusions.length }<br>
		${ arr.join( '' ) }<br>
		time: ${ ( performance.now() - ISIN.timeStart ).toLocaleString() }ms
	`;

	return htm;

};



ISIN.setIntersected = function( index, element ){

	POP.intersected = ISIN.inclusions[ index ][ element ];
	console.log( 'POP.intersected', POP.intersected );
	divPopupData.innerHTML = POP.getIntersectedDataHtml();

	//POP.intersects = POP.intersects ? POP.intersects : ( ['23'] ).
	//POP.intersects[ 0 ].point.copy( POP.intersected.position )
	POP.getIntersectedVertexBufferGeometry( POP.intersected.position );

	POP.toggleSurfaceFocus();
};



ISIN.getVertices = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );
	return points;

};



function setInclusionsRed() {

	THR.scene.updateMatrixWorld();

	const raycaster = new THREE.Raycaster();

	const direction = new THREE.Vector3( 0, 0, 1 );

	ISIN.inclusions.forEach( child => { child.s1.visible = false; } );

	const intersects2 = [];

	for ( let surfaces of ISIN.inclusions ) {

		verticesS2 = ISIN.getVertices( surfaces.s2.userData.gbjson.PlanarGeometry.PolyLoop );

		for ( let vertex of verticesS2 ) {

			const vertexWorld = surfaces.s2.localToWorld( vertex.clone() );
			//console.log( 'vertex', vv );

			raycaster.set( vertexWorld, direction );

			const intersects = raycaster.intersectObject( surfaces.s1 );

			if ( intersects.length > 0 ) {

				surfaces.s1.visible = true;
				surfaces.s1.material.opacity = 0.1;

				//surfaces.s2.visible = true;

				//surfaces.s2.material = new THREE.MeshBasicMaterial( { color: 'green', side: 2 } );
				console.log( '', intersects );

				intersects2.push( intersects );

				const mesh = surfaces.s2;
				mesh.visible = true;
				//normalArray = mesh.geometry.attributes.normal.array.slice( 0, 3 );
				//mesh.position.add( new THREE.Vector3().fromArray( normalArray) );
				mesh.material.color.r = 1;

				const edgesGeometry = new THREE.WireframeGeometry( mesh.geometry );
				//console.log( '', edgesGeometry );
				const edgesMaterial = new THREE.LineBasicMaterial( { color: 'red', opacity: 0.85, transparent: true } );
				const edges = new THREE.LineSegments( edgesGeometry, edgesMaterial );
				THR.scene.add( edges );


			} else {

				surfaces.s1.visible = false;
				surfaces.s2.visible = false;

			}

		}

	}

	for ( let surfaces of ISIN.inclusions ) {

		if ( surfaces.s2.material.color.r !== 1 ) {

			//console.log( '', surfaces.s2 );

			surfaces.s1.visible = false;
			surfaces.s2.visible = false;
		}

	}

	return `<br>intersects2 ${ intersects2.length }`;

};



ISIN.setDoubleCheck = function() {

	THR.scene.updateMatrixWorld();

	var raycaster = new THREE.Raycaster();

	for ( surfaces of ISIN.inclusions ) {

		//const vertices = new THREE.Geometry().fromBufferGeometry( surfaces.s1.geometry ).vertices ;
		verticesS1 = ISIN.getVertices( surfaces.s1.userData.gbjson.PlanarGeometry.PolyLoop );
		//console.log( 'verticesS1', verticesS1 );

		const center = surfaces.s2.geometry.boundingSphere.center;
		//console.log( 'center', center );

		const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5 );
		const material = new THREE.MeshNormalMaterial();

		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy( center );
		THR.scene.add( mesh );

		for ( let vertex of verticesS1 ) {

			const direction = vertex.clone().sub( center ).normalize();
			console.log( 'direction', direction );

			const geometryLine = new THREE.Geometry();
			geometryLine.vertices = [ center, center.clone().add( direction ) ];
			const materialLine = new THREE.LineBasicMaterial( { color: 0x000000 } );
			const line = new THREE.Line( geometryLine, materialLine );
			THR.scene.add( line );

			raycaster.set( center, direction );

			var intersects = raycaster.intersectObject( surfaces.s1 );
			console.log( 'int', intersects.length );

		}

	}

};



ISIN.setSelectedFocus = function( surfaces ) {

	//console.log( 'select', select.value );

	const children = GBX.surfaceMeshes.children;

	children.forEach( child => child.visible = false );

	for ( let surface of surfaces) {

		//console.log( 'hh', surface);

		for ( child of children ) {

			if ( surface.s1.userData.gbjson.id === child.userData.gbjson.id ) { child.visible = true; }

			if ( surface.s2.userData.gbjson.id === child.userData.gbjson.id ) {

				const mesh = surface.s2;
				mesh.visible = true;
				normalArray = mesh.geometry.attributes.normal.array.slice( 0, 3 );
				//mesh.position.add( new THREE.Vector3().fromArray( normalArray) );
				//mesh.material.color.r = 1;

				const edgesGeometry = new THREE.WireframeGeometry( mesh.geometry );
				//console.log( '', edgesGeometry );
				const edgesMaterial = new THREE.LineBasicMaterial( { color: 'red', opacity: 0.85, transparent: true } );
				const edges = new THREE.LineSegments( edgesGeometry, edgesMaterial );
				//THR.scene.add( edges );

			}


		}

	}

};


ISIN.cleanUpScene = function() {

	THR.scene.remove( POP.line, POP.particle );
	//THR.scene.remove( ISPIP.helpers );

	//ISPIP.helpers = new THREE.Group();

	//THR.scene.add( ISPIP.helpers );

	GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	ISINdetInclusions.querySelectorAll( "button" ).forEach( button => 	button.style.cssText = "" );

};