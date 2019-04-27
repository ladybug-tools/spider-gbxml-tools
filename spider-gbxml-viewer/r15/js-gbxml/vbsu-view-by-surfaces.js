// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const VBSU = { "release": "R15.0.0", "date": "2019-04-24" };

VBSU.description =
	`
		View by Surfaces (VBSU) provides HTML and JavaScript to view individual surfaces.

	`;

VBSU.currentStatus =
	`

		<summary>View by Surfaces VBSU ${ VBSU.release} ~ ${ VBSU.date }</summary>

		<p>
			${ VBSU.description }
		</p>
		<details>
			<summary>Concept</summary>
			<ul>
			</ul>
		</details>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/VBSU-view-by-surfaces.js: target="_blank" >
				View by Surfaces source code
			</a>
		</p>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-24 ~ F - first commit</li>
			</ul>
		</details>
	`;


VBSU.getMenuViewBySurfaces = function() {

	const htm =

	`<details id="VBSUdet" ontoggle=VBSU.getViewBySurfacesCheck(); >

		<summary>Show/hide by surfaces<span id="VBSUspnCount" ></span>
			<a id=VBSUsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(VBSUsumHelp,VBSU.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			View by surfaces text
		</p>

		<p>
			<input id=VBSUinpSelectIndex oninput=VBSU.setSelectedIndex() >
		</p>

		<p>
			<select id=VBSUselViewBySurfaces oninput=VBSU.selectedSurfacesFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			<button onclick=VBSU.setViewBySurfacesShowHide(this,VBSU.invalidTemplate); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VBSU.getViewBySurfacesCheck = function() {
	//console.log( 'VBSUdetTemplate.open', VBSUdetTemplate.open );

	if ( VBSUdet.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	VBSU.surfaces = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		// bogus code - admits all surfaces
		const invalidTemplate = GBX.surfaces.find( element => GBX.surfaceTypes.indexOf( surfaceId ) < 0 );
		//console.log( 'invalidTemplate', invalidTemplate );

		//if ( invalidTemplate ) {

			VBSU.surfaces.push( i );

		//}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of VBSU.surfaces ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	VBSUselViewBySurfaces.innerHTML = htmOptions;
	VBSUspnCount.innerHTML = `: ${ VBSU.surfaces.length } found`;

	return VBSU.surfaces.length;

};



VBSU.setViewBySurfaceShowHide = function( button, surfaceArray ) {
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



VBSU.selectedSurfacesFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	//POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const surfaces = GBX.surfacesIndexed[ select.value ]

	GBX.sendSurfacesToThreeJs( [ surfaces] );

};


VBSU.setSelectedIndex = function( input, select ) {

	const str = VBSUinpSelectIndex.value.toLowerCase();

	// try using find
	for ( let option of VBSUselViewBySurfaces.options ) {

		if ( option.innerHTML.toLowerCase().includes( str ) ) {

			VBSUselViewBySurfaces.value = option.value;

			return;

		}

	}

};