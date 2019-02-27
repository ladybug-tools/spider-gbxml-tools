// Copyright 2018 Ladybug Tools authors. MIT License

/* global THR, THREE, GBX */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const ISDC = { "release": "R15.0", "date": "2019-02-26"  }


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
					<li>2019-02-26 ~ R15.0 ~ Allow for no planar geometry</li>
					<li>2018-12-16 ~ Much better performance on very large files</li>
					<li>2018-12-16 ~ If greater than 10K surfaces, then run manually only</li>
					<!-- <li></li> -->
				</ul>
			</p>
			<p>
				<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/lib/isasd-issues-adjacent-space-duplicate.js" target="_blank">
				ISDC module source code</a>
			</p>
		</details>

	</aside>

	<hr>
`;



ISDC.getDuplicateCoordinatesCheckInit = function() {

	if ( ISDCdetDuplicateCoordinates.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) {

		ISDCpIntroExtra.innerHTML =
		`
			</p>
				There are greater than 10,000 surfaces in this model,
				therefore the check is not run automatically.
			</p>

			<p>
				<button onclick=ISDC.getDuplicateCoordinatesCheck(); >Check for duplicate coordinates</button>
			</p>
			<p>
				Open the JavaScript console in order to view a readout of the progress of the check.
			</p>
			`;

		return;

	}

	ISDC.getDuplicateCoordinatesCheck();

}



ISDC.getDuplicateCoordinatesCheck = function() {

	const timeStart = performance.now();
	const surfaces = GBX.surfaces;

	ISDC.duplicates = [];

	planes = [];

	for ( surface of surfaces ) {

		arr = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ );

		if ( arr ) { planes.push( arr[ 1 ] ) }

	}
	//console.log( 'planes', planes );

	planes.forEach( ( plane1, index1 ) => {

		const planesRemainder = planes.slice( index1 + 1 );

		planesRemainder.forEach( ( plane2, index2 ) => {

			if ( plane1 === plane2 ) {

				//ISDC.duplicates.push( index1, ( index1 + index2 ) );
				ISDC.duplicates.push( index1, ( planes.length - planesRemainder.length ) );

			}

		} );

		if ( index1 % 100 === 0 && planes.length > ISCOR.surfaceCheckLimit ) {

			console.log( 'surfaces checked', index1, ( performance.now() - timeStart ).toLocaleString() );
			pLog.innerHTML = `index: ${ index1 }`;

		 }

	} );
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

};



ISDC.getMenuDuplicateCoordinates= function( target ) {

	const htm =

	`<details id="ISDCdetDuplicateCoordinates" ontoggle=ISDC.getDuplicateCoordinatesCheckInit(); >

		<summary>Duplicate Planar Coordinates<span id="ISDCspnCount" ></span></summary>

		<p id=ISDCpIntro >
			Identify and edit surfaces with the identical vertices in their
			<a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link176" target="_blank">planar geometry</a>.
		</p>

		<p id=ISDCpIntroExtra ></p>

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

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};



ISDC.selectedSurfaceDelete = function() {
	//console.log( 'val', that.value );

	surfaceText = GBX.surfaces[ ISDCselDuplicate.value ];

	text = GBX.text.replace( surfaceText, '' );

	const len = GBX.parseFile( text );

	// console.log( 'len', len );

};

