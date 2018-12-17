// Copyright 2018 Ladybug Tools authors. MIT License

/* global THR, THREE, GBX */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const ISDC = { "release": "R10.1", "date": "2018-12-15"  }



ISDC.currentStatus =
`
	<aside>

		<details>

			<summary>ISDC ${ ISDC.release} status ${ ISDC.date }</summary>

			<p>

			 Issue Duplicate Planar Coordinates (ISDC) module is ready for light testing.
			</p>

			<p>
				<ul>

					<!-- <li></li> -->
				</ul>
			</p>

		</details>

	</aside>

	<hr>
`;



ISDC.getDuplicateCoordinatesCheck = function() {

	if ( ISDCdetDuplicateCoordinates.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > 10000 ) {

		ISDCpIntro.innerHTML +=
		`
			</p>There are greater than 10,000 surfaces in this model, therefore the check is not run automatically</p>
		`
		return '999999999';

	}

	timeStart = performance.now();

	ISDC.duplicates = [];

	const surfaces = GBX.surfaces;

	planes = surfaces.map( surface => surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ] );


	planes.forEach( ( plane1, index1 ) => {

		const planesRemainder = planes.slice( index1 + 1 );

		planesRemainder.forEach( ( plane2, index2 ) => {

			if ( plane2 === plane1 ) {

				ISDC.duplicates.push( index1, ( index1 + index2 ) );
			}

		} );

		if ( index1 % 100 === 0 ) {

			console.log( 'index1', index1, ( performance.now() - timeStart ).toLocaleString() );
			pLog.innerHTML = `index: ${ index1 }`;

		 }

	} );

/*
	surfaces.forEach( ( surface, index1 ) => {

		const plane1 = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

		const surfacesRemainder = surfaces.slice( index1 + 1 );

		surfacesRemainder.forEach( ( surface2, index2 ) => {

			plane2 = surface2.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

			if ( plane2 === plane1 ) {

				ISDC.duplicates.push( index1, ( index1 + index2 ) );
			}

		} );

		if ( index1 % 100 === 0 ) { console.log( 'index1', index1, ( performance.now - timeStart ).toLocaleString() ) }

	} );

*/

/*
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface1 = surfaces[ i ];

		const plane1 = surface1.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

		for ( let j = 0; j < surfaces.length; j++ ) {

			const surface2 = surfaces[ j ];

			plane2 = surface2.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

			if ( i !== j && plane1 === plane2 ) {

				//console.log( 'surface', plane1 );

				ISDC.duplicates.push( i );

			}

		}

	}
 */


	//console.log( 'duplicates', ISDC.duplicates );
	let color;
	let htmOptions = '';
	let count = 0;

	for ( surfaceIndex of ISDC.duplicates ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
		`
		<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>
		`;
	}

	ISDCselDuplicate.innerHTML = htmOptions;
	ISDCspnCount.innerHTML = `: ${ ( ISDC.duplicates.length / 2 ).toLocaleString() } found`;

	return ISDC.duplicates.length / 2;

};



ISDC.getMenuDuplicateCoordinates= function( target ) {

	const htm =

	`<details id="ISDCdetDuplicateCoordinates" ontoggle=ISDC.getDuplicateCoordinatesCheck(); >

		<summary>Duplicate Planar Coordinates<span id="ISDCspnCount" ></span></summary>

		<p id=ISDCpIntro >
			Identify and edit surfaces with the identical vertices in their
			<a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link176" target="_blank">planar geometry</a>
		</p>

		<p>
			<button id=butDuplicateCoordinates onclick=ISDC.setSurfaceArrayShowHide(); >
				show/hide all duplicates
			</button>
		</p>

		<p>
			<select id=ISDCselDuplicate onchange=ISDC.selectedSurfaceFocus(); style=width:100%; size=10>
			</select>
		</p>


		<div id=divDuplicateAttributes ></div>
		<p>
			<button onclick=ISDC.selectedSurfaceDelete(); title="Starting to work!" >
				delete selected surface
			</button>
		</p>

		<p id=pLog ></p>

		<div${ ISDC.currentStatus }</div>

	</details>`;

	return htm;

};


ISDC.setSurfaceArrayShowHide = function() {

	butDuplicateCoordinates.classList.toggle( "active" );

	if ( butDuplicateCoordinates.classList.contains( 'active' ) ) {

		if ( ISDC.duplicates.length ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			for ( let surface of ISDC.duplicates ) {

				const surfaceMesh = GBX.surfaceGroup.children.find( element => Number( element.userData.index ) === surface );
				//console.log( 'surfaceMesh', surfaceMesh  );

				surfaceMesh.visible = true;

			}

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISDC.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISDCselDuplicate.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISDC.selectedSurfaceDelete = function() {
	//console.log( 'val', that.value );

	surfaceText = GBX.surfaces[ ISDCselDuplicate.value ];

	text = GBX.text.replace( surfaceText, '' );

	const len = GBX.parseFile( text );

	// console.log( 'len', len );

};

