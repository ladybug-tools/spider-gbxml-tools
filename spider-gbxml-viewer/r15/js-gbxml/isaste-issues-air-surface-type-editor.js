// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISASTE = { "release": "R15.0", "date": "2019-02-12" };

ISASTE.description =
	`
		Air Surface Type Editor (ISASTE) allows you display all or some Air surfaces, update the surface type and identify Air surfaces that may be at the exterior of the model.

	`;

ISASTE.currentStatus =
	`

		<summary>Air Surface Type Editor (ISASTE) ${ ISASTE.release} ~ ${ ISASTE.date }</summary>

		<p>
			${ ISASTE.description }
		</p>
		<p>
			Proposed methodology:<br>
			Create a Three.js 'ray' for each side of an Air surface type.
			The ray follows the normal for that surface at the center point of the surface.
			If one of the rays finds no intersections on one side then we know that the surface must be on the exterior.
			If both rays find intersections then we know the surface must be inside the model.
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/ISASTE-issues-air-surface-tpe-editor.js: target="_blank" >
			Air Surface Type Editor source code
			</a>
		</p>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-02-12 ~ first commit</li>
				<!-- <li></li>
				-->
			</ul>
		</details>
	`;


	ISASTE.getMenuAirOnExterior = function() {

		const htm =

		`<details id="ISASTEdetAirOnExterior" ontoggle=ISASTE.getAirOnExteriorCheck(); >

			<summary>Air Surface Type Editor<span id="ISASTEspnCount" ></span>
			<a id=ISASTEsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISASTEsumHelp,ISASTE.currentStatus);" >&nbsp; ? &nbsp;</a>

			</summary>

			<p>
				${ ISASTE.description }
			</p>

			<p>
				<button id=ISASTEbutViewAll onclick=ISASTE.setAirOnExteriorShowHide(this,ISASTE.surfaceAirIndices); >
					Show/hide all air type surfaces
				</button>
			</p>

			<p>
				<select id=ISASTEselAirOnExterior onchange=ISASTE.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
				</select>
			</p>

			<p>
				<button id=ISASTEbutViewSelected onclick=ISASTE.selectedSurfaceShowHide(this,ISASTEselAirOnExterior); title="" >
					show/hide selected air surfaces
				</button>
			</p>

			<p>
			<button onclick=ISASTE.setNewSurfaceType(this); >Identify possible Air surfaces on exterior</button><br>
			</p>
			<p>
				Update surface(s) type to:
				<button onclick=ISASTE.setNewSurfaceType(this); >ExposedFloor</button><br>
				<button onclick=ISASTE.setNewSurfaceType(this) >ExteriorWall</button><br>
				<button onclick=ISASTE.setNewSurfaceType(this) >Roof</button><br>
				<button onclick=ISASTE.setNewSurfaceType(this) >Shade</button><br>
				<button onclick=ISASTE.setNewSurfaceType(this) >SlabOnGrade</button><br>
				<button onclick=ISASTE.setNewSurfaceType(this) >UndergroundWall</button><br>
				<button onclick=ISASTE.setNewSurfaceType(this) >UndergroundSlab</button><br>
			</p>

		</details>`;

		return htm;

	};



ISASTE.setNewSurfaceType = function( that ) {

	alert( "coming soon!" );

};



ISASTE.getAirOnExteriorCheck = function() {
	//console.log( 'ISASTEdetAirOnExterior.open', ISASTEdetAirOnExterior.open );

	if ( ISASTEdetAirOnExterior.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	ISASTE.surfaceAirIndices = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		//console.log( 'surface', surface );
		const surfaceMatch = surface.match( /surfaceType="Air"/ );
		//console.log( 'surfaceMatch', surfaceMatch );

		if ( surfaceMatch ) {

			ISASTE.surfaceAirIndices.push( i );

		}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASTE.surfaceAirIndices ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	ISASTEselAirOnExterior.innerHTML = htmOptions;
	ISASTEspnCount.innerHTML = `: ${ ISASTE.surfaceAirIndices.length } found`;

	return ISASTE.surfaceAirIndices.length;

};



ISASTE.setAirOnExteriorShowHide = function( button, surfaceArray ) {

	button.classList.toggle( "active" );

	ISASTEbutViewSelected.classList.remove( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISASTE.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};


ISASTE.selectedSurfaceShowHide = function( button, select ) {

	options = Array.from( select.selectedOptions );
	//console.log( 'options', options );

	button.classList.toggle( "active" );

	ISASTEbutViewAll.classList.remove( "active" );

	if ( button.classList.contains( 'active' ) && options.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		options.forEach( option => GBX.surfaceGroup.children[ option.value ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}


}

