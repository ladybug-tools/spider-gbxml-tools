// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISCOD = { "release": "R9.0", "date": "2018-12-05" };


ISCOD.currentStatus =
	`
		<aside>

			<details>

				<summary>ISCOD ${ ISCOD.release} status ${ ISCOD.date }</summary>

				<p>This new module is almost ready for light testing. CAD object IDs not yet being actually added to selected surface</p>

			</details>

		</aside>

		<hr>
	`;



ISCOD.getCadObjectIdCheck = function() {
	//console.log( 'ISCODdetCadObjectId.open', ISCODdetCadObjectId.open );

	if ( ISCODdetCadObjectId.open === false && ISCOR.runAll === false ) { return; }

	ISCOD.invalidCadObjectId = [];
	ISCOD.cadIdTypes = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const cadId = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);
		//const cadId = surface.includes( 'CADObjectId' );
		//console.log( 'casId', cadId );

		if ( !cadId ) {

			ISCOD.invalidCadObjectId.push( i );

		} else {

			const type = cadId[ 1 ].replace( / \[(.*?)\]/gi, '' ).trim();

			if ( !ISCOD.cadIdTypes.includes( type ) ) {

				ISCOD.cadIdTypes.push( type );

			}

		}

	}
	//console.log( 'ISCOD.invalidCadObjectId', ISCOD.invalidCadObjectId );
	//console.log( 'ISCOD.cadIdTypes', ISCOD.cadIdTypes );

	ISCOD.buttonsCadObjectType = ISCOD.cadIdTypes.reduce(
		( arr, item, index ) => arr + `<button onclick="ISCOD.setCadObjectType('${item}');" >${ item }</button><br>`,
		''
	);

	let color;
	let htmOptions = '';
	let count = 0;

	for ( surfaceIndex of ISCOD.invalidCadObjectId ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
		`
			<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>
		`;
	}


	ISCODselCadObjectId.innerHTML = htmOptions;
	ISCODdivCADTypes.innerHTML = ISCOD.buttonsCadObjectType;
	ISCODspnCount.innerHTML = `: ${ ISCOD.invalidCadObjectId.length } found`;

	return ISCOD.invalidCadObjectId.length;

};



ISCOD.getMenuCadObjectId = function( target ) {

	const htm =

	`<details id="ISCODdetCadObjectId" ontoggle=ISCOD.getCadObjectIdCheck(); >

		<summary>CAD Object ID Missing<span id="ISCODspnCount" ></span></summary>

		<p>
			Surface without a CAD object ID
		</p>

		<p>
			<button id=butCadObjectId
				onclick=ISCOD.setSurfaceArrayShowHide(this,ISCOD.invalidCadObjectId); >
				Show/hide suraces with missing CAD object ID
			</button>
		</p>

		<p>
			<select id=ISCODselCadObjectId onchange=ISCOD.selectedSurfaceFocus(ISCODselCadObjectId); style=width:100%; size=10>
			</select>
		</p>

		<!--
		<p>
			<button onclick=ISCOD.selectedSurfaceDelete(); title="Starting to work!" >
				CadObjectId
			</button>
		</p>
		-->

		<p>
			Select new  CAD Object type for surface:<br>
			<div id="ISCODdivCADTypes" ></div>
		</p>

		<div>${ ISCOD.currentStatus }</div>

	</details>`;

	return htm;

};




ISCOD.setSurfaceArrayShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) ) {

		if ( surfaceArray.length ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			for ( let surfaceId of surfaceArray ) {

				const surfaceMesh = GBX.surfaceGroup.children[ surfaceId ];
				//console.log( 'surfaceMesh', surfaceMesh  );

				surfaceMesh.visible = true;

			}

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};


ISCOD.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};




ISCOD.setCadObjectType = function( type ) {
	console.log( 'type', type );

	/*
	let surfaceTextCurrent = GBX.surfaces[ ISCODselSurfaceTypeInvalid.value ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	surfaceText =  GBX.text.replace( surfaceTextCurrent, surfaceTextNew )
	//console.log( 'surfaceText', surfaceText );

	const len = GBX.parseFile( surfaceText );

	console.log( '', len );
	ISCODselSurfaceTypeInvalid.selectedOptions[ 0 ].innerHTML += " - updated"
	console.log( 'selec',  );
	ISCODselSurfaceTypeInvalid.selectedOptions
	detMenuEdit.open = false;
	*/


};

