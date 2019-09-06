"use strict";

/* globals MNU, VGC, POP, navDragMove, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true


const CNH = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-08-23",
		"description": "",
		"helpFile": "js-fixer-3d/cnh-check-normals-horizontal/cnh-check-normals-horizontal.md",
		"license": "MIT License",
		"sourceCode": "js-fixer-3d/cnh-check-normals-horizontal/cnh-check-normals-horizontal.js",
		"version": "0.17.03-0CNH",

	}

};


CNH.description =
	`
		Check for horizontal normals that point the wrong way
	`;


CNH.getMenuCheckNormalsHorizontal = function() {

	const source =
	`<a href=${ MNU.urlSourceCode + CNH.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help =
		VGC.getHelpButton('CNHsumHelp',CNH.script.helpFile,POP.footer,source);

	const htm =

	`<details id="CNHdetAirOrInteriorOnExterior" ontoggle=CNH.getInteriorOnExteriorCheckHorizontal(); >

		<summary>Check for incorrect horizontal normals <span id="CNHspnCount" ></span></summary>

		${ help }
		<p>
			${ CNH.description }
		</p>

		<p>
			1. <button onclick=GF3.addNormals(this,CNH.meshesHorizontal); >
				Add normals to horizontal surfaces
			</button>
		</p>

		<p>
			2. <button onclick=CNH.getDirections(this); >
				Get direction normals
			</button>
		</p>

		<p>
			3. <button onclick=CNH.setSurfacesShowHide(this,CNH.surfaceIssues,CNH.meshesExterior); title="Starting to work!" >
			Show/hide horizontal surfaces with issues
			</button>
		</p>

		<p>
			<select id=CNHselAirOrInteriorOnExterior
				onchange=GF3.selectedSurfaceFocus(this);
				style=width:100%; multiple size=10 >
			</select>
		</p>

		<p>
			<button onclick=CNH.showHideSelected(this,CNHselAirOrInteriorOnExterior); >
				Show/hide selected surfaces</button>
		</p>

		<p id=CNHfixes ></p>

		<p>
			Update surface(s) type to:
			<button onclick=CNH.setNewSurfaceType(this); style="background-color:#800000;" >Roof</button><br>
		</p>

	</details>`;

	return htm;

};


CNH.getInteriorOnExteriorCheckHorizontal = function() {

	const typesHorizontal =  [ "Air", "Ceiling", "ExposedFloor", "InteriorFloor", "RaisedFloor",
		"Roof", "Shade", "SlabOnGrade", "UndergroundCeiling", "UndergroundSlab" ];
	CNH.meshesHorizontal = GBX.meshGroup.children.filter( mesh => typesHorizontal.includes( mesh.userData.surfaceType ) )

};


CNH.getDirections = function( button ) {

	if ( !THRU.helperNormalsFaces ) { alert("first add the normals"); return; }

	button.classList.add( "active" );

	CNH.meshesHorizontal.forEach( mesh => mesh.visible = true );

	const typesFloor =  [ "ExposedFloor", "InteriorFloor", "RaisedFloor", "SlabOnGrade",
		"UndergroundCeiling", "UndergroundSlab" ];

	const typesUp =  [ "Ceiling", "Roof", "Shade" ];

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	const normals = THRU.helperNormalsFaces.children;

	const arr = [];
	let raysCastCount = 0;

	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			const mesh = GBX.meshGroup.children[ normal.userData.index ]

			if ( Math.abs( direction.z ) < 0.1 ) {

				mesh.visible = false;

				normal.visible = false;

			} else if ( typesFloor.includes( mesh.userData.surfaceType ) && direction.z >= 0  ) {

				arr.push( mesh.userData.index );
				mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
				mesh.material.needsUpdate = true;

			} else if ( typesUp.includes( mesh.userData.surfaceType ) && direction.z <= 0  ) {

				mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
				mesh.material.needsUpdate = true;

				arr.push( mesh.userData.index );

			}

			raysCastCount ++;

		}

	}

	CNH.surfaceIssues = [ ...new Set( arr ) ];

	CNHfixes.innerHTML =
	`
		Surfaces: ${ CNH.meshesHorizontal.length.toLocaleString() }<br>
		Normals created: ${ raysCastCount.toLocaleString() }<br>

		<p>Select multiple surfaces by pressing shift or control keys.</p>

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

	`;

	CNHselAirOrInteriorOnExterior.innerHTML =
		CNH.getSelectOptionsIndexes( CNH.surfaceIssues );

};



CNH.getSelectOptionsIndexes = function( surfaceIndexes ) {

	let htmOptions = '';
	let count = 1;

	for ( let index of surfaceIndexes ) {

		// Switch to mesh.userData?
		const surfaceText = GBX.surfaces[ index ];
		//console.log( 'surfaceText', surfaceText );

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		const cadIdMatch = surfaceText.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		const cadId = cadIdMatch ? cadIdMatch[ 1 ] : "";

		const type = surfaceText.match( 'surfaceType="(.*?)"' )[ 1 ];

		let color = GBX.colors[ type ].toString( 16 );
		color = color.length > 4 ? color : '00' + color; // otherwise greens no show

		htmOptions +=
			`<option style=background-color:#${ color } value=${ index } title="${ cadId }" >${ count ++ } - ${ id }</option>`;

	}

	return htmOptions;

};


CNH.setSurfacesShowHide = function( button, surfaceIndexes = [] ) {

	if ( !THRU.helperNormalsFaces ) { alert("first: 1. add normals and 2. locate intersections"); return; }

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) ) {

		if ( surfaceIndexes.length > 0 ) {

			GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

			surfaceIndexes.forEach( index => GBX.meshGroup.children[ Number( index ) ].visible = true );

			THRU.helperNormalsFaces.visible = false;

			//THRU.groundHelper.visible = false;

		} else {

			alert( "No surfaces with issues identified");

		}

	} else {

		// if ( CNH.meshesExterior.length > 0 ) {

		// 	CNH.meshesExterior.forEach( mesh => mesh.visible = true );

		// } else {

			GBX.meshGroup.children.forEach( element => element.visible = true );

		//}

	}



};



CNH.showHideSelected = function ( button, select ) {

	const selectedIndices = Array.from( select.selectedOptions ).map( option => option.value );

	CNH.setSurfacesShowHide( button, selectedIndices );

}