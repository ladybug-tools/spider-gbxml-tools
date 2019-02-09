// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISCOD = { "release": "R9.1", "date": "2018-12-06" };


ISCOD.currentStatus =
	`
		<aside>

			<details>

				<summary>ISCOD ${ ISCOD.release} status ${ ISCOD.date }</summary>

				<p>This new module is almost ready for light testing.</p>

				<p>
					2018-12-06 ~ Adds ability to run in 'check all issues'.<br>
					2018-12-06 ~ Adds ability to select new CAD object type from list of buttons.
				</p>

				<p>
					To do:<br>
					<ul>
						<li>Edit multiple selected surfaces in select box with single button click</li>
					</ul>
				</p>

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

	for ( let surfaceIndex of ISCOD.invalidCadObjectId ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;

	}


	ISCODselCadObjectId.innerHTML = htmOptions;
	ISCODdivCADTypes.innerHTML = ISCOD.buttonsCadObjectType;
	ISCODspnCount.innerHTML = `: ${ ISCOD.invalidCadObjectId.length.toLocaleString() } found`;

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
			First select a surface here:
			<select id=ISCODselCadObjectId onchange=ISCOD.selectedSurfaceFocus(ISCODselCadObjectId); style=width:100%; size=10>
			</select>
		</p>

		<p>
			Second select new CAD Object type for selected surface:<br>
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

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};


ISCOD.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};




ISCOD.setCadObjectType = function( type ) {
	//console.log( 'type', type );

	const surfaceTextCurrent = GBX.surfaces[ ISCODselCadObjectId.value ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const surfaceTextNew = surfaceTextCurrent.replace( /<\/Surface>/,
		`<CADObjectId>${ type }<\CADObjectId></Surface>` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	const surfaceText =  GBX.text.replace( surfaceTextCurrent, surfaceTextNew )
	//console.log( 'surfaceText', surfaceText );

	const len = GBX.parseFile( surfaceText );
	console.log( '', len );

	ISCODselCadObjectId.selectedOptions[ 0 ].innerHTML += " - add: ${ type }"

	detMenuEdit.open = false;

};

