// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const ISSTI = { "release": "R10.1", "date": "2018-12-10" };


ISSTI.currentStatus =
`
	<aside>

		<details>

			<summary><a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/lib/issti-issues-surface-type-invalid.js" title="source code" >ISSTI ${ ISSTI.release}</a>
				status ${ ISSTI.date }</summary>

			<p>
				This module is new but is ready for light testing.
			</p>

			<p>
				To do:<br>
				<ul>
					<li>Edit multiple selected surfaces in select box with single button click</li>
				</ul>
			</p>
			<p>
				Most likely this type of error is quite rare. It occurs when a CAP user types in a non-valid surface type.
			</p>
			<p>
				2018-12-10
				<ul>
					<li>Update current status / add link</li>
					<li>code refactor /cleanup / minor bug fixes</li>
				</ul>
			</p>

			<!--

				2018-12-06 ~ Adds ability to run in 'check all issues'.<br>
				2018-12-05 ~ Adds ability to select new surface type from list of buttons.

			-->

			</details>

	</aside>

	<hr>
`;



ISSTI.getSurfaceTypeInvalidCheck = function() {

	if ( ISSTIdetSurfaceTypeInvalid.open === false && ISCOR.runAll === false ) { return; }

	ISSTI.SurfaceTypeInvalid = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce? how??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

		if ( GBX.surfaceTypes.includes( surfaceType ) === false ) {

			ISSTI.SurfaceTypeInvalid.push( i );

		}

	}
	//console.log( 'ISSTI.SurfaceTypeInvalid', ISSTI.SurfaceTypeInvalid );

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISSTI.SurfaceTypeInvalid ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions += `<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;

	}

	ISTIselSurfaceTypeInvalid.innerHTML = htmOptions;
	ISSTIspnCount.innerHTML = `: ${ ISSTI.SurfaceTypeInvalid.length } found`;

	return ISSTI.SurfaceTypeInvalid.length;

};



ISSTI.getMenuSurfaceTypeInvalid = function() {


	ISSTI.buttonsSurfaceType = GBX.surfaceTypes.reduce(
		( arr, item ) => arr + `<button onclick=ISSTI.setSurfaceType("${item}"); >${ item }</button><br>`,
		''
	);

	const htm =
	`
		<details id="ISSTIdetSurfaceTypeInvalid" ontoggle=ISSTI.getSurfaceTypeInvalidCheck(); >

			<summary>Surface Type Invalid<span id=ISSTIspnCount ></span> </summary>

			<p>
				Surfaces with an invalid surface type assignment.
			</p>

			<p>
				<button id=butSurfaceTypeInvalidShowHide
					onclick=ISSTI.setSurfaceTypeInvalidShowHide(); >
					show / hide all invalid surface types
				</button>
			</p>
			<p>
				Select a surface:<br>
				<select id=ISTIselSurfaceTypeInvalid onchange=ISSTI.selectedSurfaceFocus(); style=width:100%; size=10 ></select>
			</p>
			<p>
				<button onclick=ISSTI.setSurfaceTypeInvalidShowHide(ISTIselSurfaceTypeInvalid.value); >show / hide selected surface </button>
			</p>
			<p>
			Select new type for surface:<br>
				${ ISSTI.buttonsSurfaceType }
			</p>

			<div${ ISSTI.currentStatus }</div>

		</details>
	`;

	return htm;

};



ISSTI.setSurfaceTypeInvalidShowHide = function( button, surfaceArray ) {

	surfaceArray = surfaceArray || ISSTI.SurfaceTypeInvalid;

	console.log( 'surfaceArray', surfaceArray );
	//THR.scene.remove( POP.line, POP.particle );

	butSurfaceTypeInvalidShowHide.classList.toggle( "active" );

	if ( butSurfaceTypeInvalidShowHide.classList.contains( 'active' ) ) {

		if ( surfaceArray.length > 0 ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			surfaceArray.forEach( surfaceId =>
				GBX.surfaceGroup.children[ surfaceId ].visible = true
			);

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISSTI.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISTIselSurfaceTypeInvalid.value ];

	POP.intersected.visible = true;

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};



ISSTI.setSurfaceType = function( type ) {
	//console.log( 'type', type );

	if ( !ISTIselSurfaceTypeInvalid.value ) { alert( "First select a surface"); return; }

	const surfaceTextCurrent = GBX.surfaces[ ISTIselSurfaceTypeInvalid.value ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	const surfaceText =  GBX.text.replace( surfaceTextCurrent, surfaceTextNew )
	//console.log( 'surfaceText', surfaceText );

	const len = GBX.parseFile( surfaceText );
	//console.log( '', len );

	butSurfaceTypeInvalidShowHide.classList.remove( "active" );
	ISSTIspnCount.innerHTML = '';
	ISSTIdetSurfaceTypeInvalid.open = false;

};

