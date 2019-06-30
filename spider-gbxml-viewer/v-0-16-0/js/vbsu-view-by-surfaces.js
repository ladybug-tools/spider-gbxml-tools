// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, MNUdivPopupData */
/* jshint esversion: 6 */


const VBSU = { "release": "R15.0.0-1", "date": "2019-06-05" };

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

	`<details id="VBSUdet" ontoggle=VBSU.getViewBySurfacesSelectOptions(); >

		<summary>Show/hide by surfaces<span id="VBSUspnCount" ></span>
			<a id=VBSUsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(VBSUsumHelp,VBSU.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			View by surfaces text
		</p>

		<p>
			<input id=VBSUinpSelectIndex oninput=VBSU.setSelectedIndex(this,VBSUselViewBySurfaces) >
		</p>

		<p>
			<select id=VBSUselViewBySurfaces oninput=VBSU.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VBSU.setViewBySurfaceShowHide(this,VBSU.surfaces); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VBSU.getViewBySurfacesSelectOptions = function() {
	//console.log( 'VBSUdetTemplate.open', VBSUdetTemplate.open );

	if ( VBSUdet.open === false && ISCOR.runAll === false ) { return; }

	//if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	let color;
	let htmOptions = '';
	let index = 0;
	VBSU.surfaces = GBX.surfaces.slice();

	for ( let surface of GBX.surfaces ) {

		color = color === 'pink' ? '' : 'pink';;

		const id = surface.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ index++ } >${ id }</option>`;

	}

	VBSUselViewBySurfaces.innerHTML = htmOptions;
	VBSUspnCount.innerHTML = `: ${ GBX.surfaces.length } found`;

	THR.controls.enableKeys = false;

	return GBX.surfaces.length;

};



VBSU.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.includes( str ) );
	//console.log( 'option', option );

	if ( option ) {

		select.value = option.value;

		VBSU.selectedSurfacesFocus( select );

	} else {

		select.value = "";
	}

};



VBSU.selectedSurfacesFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	MNUdivPopupData.innerHTML = POP.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const options = select.selectedOptions
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	VBSU.surfaces = GBX.surfacesIndexed.filter( ( surface, index ) => indexes.includes( index  ) );

	GBX.sendSurfacesToThreeJs( VBSU.surfaces );

};



VBSU.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};