// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const ISSTI = { "release": "R9.2", "date": "2018-12-05" };


ISSTI.currentStatus =
`
	<aside>

		<details>

			<summary>ISSTI ${ ISSTI.release} status ${ ISSTI.date }</summary>

			<p>This module is new but is ready for light testing.</p>

			<p>2018-12-05 ~ Adds ability to select new surface type from list of buttons.</p>

			<p>
				To do:<br>
				<ul>
					<li>Edit multiple selected surfaces in select box with single button click</li>
				</ul>
			</p>

			<p>Most likely this type of error is quite rare. It occurs when a CAP user types in a non-valid surface type.</p>
		</details>

	</aside>

	<hr>
`;



ISSTI.getSurfaceTypeInvalidCheck = function() {

	if ( ISSTIdetSurfaceTypeInvalid.open === false ) { return; }

	ISSTI.SurfaceTypeInvalid = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

		surfaceTypeInvalid = GBX.surfaces.find( element => GBX.surfaceTypes.indexOf( surfaceType ) < 0 );
		//console.log( 'surfaceTypeInvalid', surfaceTypeInvalid );

		if ( surfaceTypeInvalid ) {

			ISSTI.SurfaceTypeInvalid.push( i );

		}

	}
	//console.log( 'ISSTI.SurfaceTypeInvalid', ISSTI.SurfaceTypeInvalid );

	let color;
	let htmOptions = '';
	let count = 0;

	for ( surfaceIndex of ISSTI.SurfaceTypeInvalid ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
		`
			<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>
		`;
	}

	ISTIselSurfaceTypeInvalid.innerHTML = htmOptions;
	ISCORspnCount.innerHTML = `: ${ ISSTI.SurfaceTypeInvalid.length } found`;

};



ISSTI.getDivSurfaceTypeInvalid = function() {

	ISSTI.buttonsSurfaceType = GBX.surfaceTypes.reduce(
		( arr, item ) => arr + `<button onclick=ISSTI.setSurfaceType("${item}"); >${ item }</button><br>`,
		''
	);

	const htm =
	`
		<details id="ISSTIdetSurfaceTypeInvalid" ontoggle=ISSTI.getSurfaceTypeInvalidCheck(); >

			<summary>Surface Type Invalid<span id=ISCORspnCount ></span> </summary>

			<p>
				Surfaces with an invalid surface type assignment.
			</p>

			<p>
				<button id=butSurfaceTypeInvalidShowHide
					onclick=ISSTI.setSurfaceTypeInvalidShowHide(); >
					show/hide invalid surface types
				</button>
			</p>

			<p>
				Select a surface:<br>
				<select id=ISTIselSurfaceTypeInvalid onchange=ISSTI.selectedSurfaceFocus(); style=width:100%; size=10 ></select>
			</p>

			<!--
			<p>

				<button onclick=ISSTI.selectedSurfaceEdit(); title="will work soon!" >
					edit selected surface type
				</button>
			</p>
			-->

			<p>
			Select new type for surface:<br>
				${ ISSTI.buttonsSurfaceType }
			</p>

			<div${ ISSTI.currentStatus }</div>

		</details>
	`;

	return htm;

};



ISSTI.setSurfaceTypeInvalidShowHide = function( button, surfaceArray = [] ) {

	//THR.scene.remove( POP.line, POP.particle );

	butSurfaceTypeInvalidShowHide.classList.toggle( "active" );

	if ( butSurfaceTypeInvalidShowHide.classList.contains( 'active' ) ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( ISSTI.SurfaceTypeInvalid.length ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			for ( let surfaceId of ISSTI.SurfaceTypeInvalid ) {

				const surfaceMesh = GBX.surfaceGroup.children[ surfaceId ];
				//console.log( 'surfaceMesh', surfaceMesh  );

				surfaceMesh.visible = true;

			}

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISSTI.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISTIselSurfaceTypeInvalid.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISSTI.setSurfaceType = function( type ) {
	//console.log( 'type', type );

	let surfaceTextCurrent = GBX.surfaces[ ISTIselSurfaceTypeInvalid.value ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	surfaceText =  GBX.text.replace( surfaceTextCurrent, surfaceTextNew )
	//console.log( 'surfaceText', surfaceText );

	const len = GBX.parseFile( surfaceText );

	console.log( '', len );
	ISTIselSurfaceTypeInvalid.selectedOptions[ 0 ].innerHTML += " - updated"
	console.log( 'selec',  );
	ISTIselSurfaceTypeInvalid.selectedOptions
	detMenuEdit.open = false;

};

