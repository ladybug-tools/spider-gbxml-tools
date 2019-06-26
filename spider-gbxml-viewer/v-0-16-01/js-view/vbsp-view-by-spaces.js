// Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals GBX, VST, THREE, THR, POPX, VBSPdetMenu, POPdivPopupData, VBSPselSpace, VBSPdivReportsLog, VSTdivSurfaceType */


const VBSP = {"release": "R15.0.1", "date": "2019-06-05" };

VBSP.description =
	`
		View the surfaces in a gbXML file by selecting one or more spaces from a list of all spaces
	`;


VBSP.currentStatus =
	`
		<h3>View by Spaces (VBSP) ${ VBSP.release } ~ ${ VBSP.date }</h3>

		<p>
			${ VBSP.description }
		</p>

		<p>Notes
			<ul>
				<li>Select multiple Spaces by pressing shift or control keys</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/r15/js-gbxml/vbsP-view-by-spaces" target="_blank" >
				VBSP View by Spaces Source
			</a>
		</p>

		<details>
			<summary>Wish list</summary>
			<ul>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-15 ~ F ~ R15.0.0 - first commit</li>
			</ul>
		</details>
	`;




VBSP.getMenuViewBySpaces = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBSPdetMenu.open = false; }, false );

	const htm =
	`
		<details id=VBSPdetMenu ontoggle=VBSP.getSpacesOptions(); >

			<summary>Show/hide by spaces
				<a id=VBSPHelp class=helpItem href="JavaScript:POP.setPopupShowHide(VBSPHelp,VBSP.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p>Display surfaces by space. Default is all spaces visible.</p>

			<p>
				<input oninput=VBSP.setSelectedIndex(this,VBSPselSpace) >
			</p>

			<div id="VBSPdivViewBySpaces" >
				<select id=VBSPselSpace onchange=VBSP.selSpaces(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VBSPdivReportsLog" ></div>

			<p><button onclick=VBSP.setViewBySurfaceShowHide(this,VBSP.surfacesFilteredBySpace); >Show/hide all spaces</button> </p>

			<p>Select multiple spaces by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VBSP.getSpacesOptions = function() {

	VBSPselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const spaceIds = GBX.spaces.map( space => space.match( 'id="(.*?)"' )[ 1 ] );
	//console.log( 'spaceIds', spaceIds );

	const spaceNames = GBX.spaces.map( space => {

		const spaceArr = space.match( '<Name>(.*?)</Name>' );

		const spaceName = spaceArr ? spaceArr[ 1 ] : "no space name in file";

		return spaceName;

	} );
	//console.log( 'spaceNames', spaceNames);

	const spacesSorted = spaceNames.slice().sort( (a, b) => b - a );
	//console.log( 'spacesSorted', spacesSorted );

	const options = spacesSorted.map( space => {
		//console.log( 'level', level );

		const index = spaceNames.indexOf( space );
		//console.log( 'indexUnsorted', indexUnsorted );

		//console.log( 'spaceIds[ index ]', spaceIds[ index ]  );
		return `<option value=${ spaceIds[ index ] } title="${ spaceIds[ index ] }" >${ spaceNames[ index ] }</option>`;

	} );

	VBSPselSpace.innerHTML = options;

};



VBSP.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	//console.log( 'option', option );

	if ( option ) {

		select.value = option.value;

		VBSP.selSpaces();

	} else {

		select.value = "";

	}

};



//////////

VBSP.selSpaces = function() {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	VBSP.surfacesFilteredBySpace = VBSP.getSurfacesFilteredBySpace();

	VBSPdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBSP.surfacesFilteredBySpace );

	POPdivPopupData.innerHTML = POPX.getSpaceAttributes( VBSPselSpace.value );

};



VBSP.getSurfacesFilteredBySpace = function(  ) {

	const spaceIds = VBSPselSpace.selectedOptions;

	const surfacesFilteredBySpace = [];

	for ( let spaceId of spaceIds ) {
		//console.log( 'spaceId', spaceId );

		surfacesVisibleBySpace = GBX.surfacesIndexed.filter( surface => surface.includes( `spaceIdRef="${ spaceId.value }"`  ) )
		//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );

		surfacesFilteredBySpace.push( ...surfacesVisibleBySpace );

	}
	//console.log( 'surfacesFilteredBySpace', surfacesFilteredBySpace );

	return surfacesFilteredBySpace;

};



VBSP.setViewSpacesShowHide = function() {

	VBSPselSpace.selectedIndex = -1;

	VBSP.selSpaces();

};



VBSP.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	}

};
