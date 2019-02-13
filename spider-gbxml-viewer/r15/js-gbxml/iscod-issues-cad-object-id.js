// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISCOD = { "release": "R15.0", "date": "2019-02-11" };


ISCOD.description =
	`
		CAD Object ID Missing (ISCOD) checks if a surface is missing an ID ans allows you to assign an existing ID if wanted.
	`;

ISCOD.currentStatus =
	`
			<h3>ISCOD ${ ISCOD.release} status ${ ISCOD.date }</h3>

			<p>
				${ ISCOD.description }
			</p>
				Notes
				<ul>
					<li>Spider Team wants confirmation that missing CAD IDs is actually an issue that occurs frequently in projects</li>
				</ul>
			</p>
			<p>
				To do:<br>
				<ul>
					<li>Edit multiple selected surfaces in select box with single button click.
					It looks like this feature could be easy to add.
					Please let Spider Team know if this could be a priority for a project you are working on.</li>
				</ul>
			</p>

			<p>
			Change log
			<ul>
				<li>2019-02-11 ~ Add description. Update currentStatus text and move to popup</li>
				<li>2019-02-11 ~ Add checkbox to ignore surfaces of type 'Air'. Set default to ignore</li>
				<li>2018-12-06 ~ Adds ability to run in 'check all issues'.</li>
				<li>2018-12-06 ~ Adds ability to select new CAD object type from list of buttons.</li>
				<!-- <li></li>
					-->
			</ul>
		</p>

	`;



ISCOD.getMenuCadObjectId = function( target ) {

	const htm =

	`<details id="ISCODdetCadObjectId" ontoggle=ISCOD.getCadObjectIdCheck(); >

		<summary>CAD Object ID Missing<span id="ISCODspnCount" ></span>
			<a id=iscodHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(iscodHelp,ISCOD.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>
		<p>
			Surfaces without a CAD object ID
		</p>

		<p>
			<input type=checkbox id="ISCODchkTypeAir" checked > ignore surfaces of type 'Air'
		</p>

		<p>
			<button id=butCadObjectId
				onclick=ISCOD.setSurfaceArrayShowHide(this,ISCOD.invalidCadObjectId); >
				Show/hide suraces with missing CAD object ID
			</button>
		</p>

		<p>
			First select a surface here:
			<select id=ISCODselCadObjectId onchange=ISCOD.selectedSurfaceFocus(ISCODselCadObjectId); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			Second select new CAD Object type for selected surface:<br>
			<div id="ISCODdivCADTypes" ></div>
		</p>


	</details>`;

	return htm;

};



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

		const surfaceType = surface.match( /surfaceType="Air"/);
		//console.log( 'surfaceType', surfaceType );

		if ( !surfaceType && ISCODchkTypeAir.checked ) {

			break;

		} else if ( !cadId ) {

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

