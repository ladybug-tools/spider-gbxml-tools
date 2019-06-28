/* globals GBX, THR, POPX, VBSPdetMenu, POPdivPopupData, VBSPselSpace, VBSPdivReportsLog, VBSPselAttribute */
// jshint esversion: 6
// jshint loopfunc: true

const VBSP = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "View the surfaces in a gbXML file by selecting one or more spaces from a list of all spaces",
		"helpFile": "../js-view/vbsp-view-by-spaces.md",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbsp-view-by-spaces.js",
		"version": "0.16-01-1vbsp"

	}

};




VBSP.getMenuViewBySpaces = function() {

	document.body.addEventListener( 'onGbxParse', () => VBSPdetMenu.open = false, false );

	const help = `<button id="butVBSPsum" class="butHelp" onclick="POP.setPopupShowHide(butVBSPsum,VBSP.script.helpFile);" >?</button>`;

	const selectOptions = [ "id", "CADObjectId", "spaceType", "Name" ].map( option => `<option>${ option }</option>`);

	const htm =
	`
		<details id=VBSPdetMenu ontoggle=VBSP.setViewBySpacesOptions(); >

			<summary>Spaces ${ help }</summary>

			<p>Display surfaces by space. Default is all spaces visible.</p>

			<p>
				<input oninput=VBSP.setSelectedIndex(this,VBSPselSpace) placeholder="Enter an attribute" >
			</p>

			<div id="VBSPdivViewBySpaces" >
				<select id=VBSPselSpace onchange=VBSP.selSpacesFocus(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VBSPdivReportsLog" ></div>

			<p>Attribute to show:
				<select id=VBSPselAttribute oninput=VBSP.setViewBySpacesOptions(); >${ selectOptions }</select></p>

			<p>Select multiple spaces by pressing shift or control keys</p>

			<p><button onclick=VBSP.setViewBySurfaceShowHide(this,VBSP.surfacesFilteredBySpace); >Show/hide all spaces</button> </p>


		</details>
	`;

	return htm;
};



VBSP.setViewBySpacesOptions = function() {

	if ( VBSPdetMenu.open === false ) { return; }

	VBSPselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const attribute = VBSPselAttribute.value;
	//console.log( 'attribute', attribute );

	const spaceIds = GBX.spaces.map( space => space.match( 'id="(.*?)"' )[ 1 ] );
	//console.log( 'spaceIds', spaceIds );

	let text;

	const spaceNames = GBX.spaces.map( space => {


		if ( [ "id", "spaceType" ].includes( attribute ) ) {

			text = space.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( [ "Name", "CADObjectId" ].includes( attribute ) ) {

			text = space.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		}

		const spaceName = text ? text : "no space name in file";

		return spaceName;

	} );
	//console.log( 'spaceNames', spaceNames);

	let color;

	const spacesSorted = spaceNames.slice().sort( (a, b) => b - a );
	//console.log( 'spacesSorted', spacesSorted );

	const options = spacesSorted.map( space => {
		//console.log( 'level', level );

		color = color === 'pink' ? '' : 'pink';

		const index = spaceNames.indexOf( space );
		//console.log( 'indexUnsorted', indexUnsorted );

		//console.log( 'spaceIds[ index ]', spaceIds[ index ]  );
		return `<option style=background-color:${ color } value=${ spaceIds[ index ] } title="${ spaceIds[ index ] }" >${ spaceNames[ index ] }</option>`;

	} );

	VBSPselSpace.innerHTML = options;

};



VBSP.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	//console.log( 'option', option );

	select.selectedIndex =  str && option ? option.value : -1;

};



//////////

VBSP.selSpacesFocus = function() {

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

		const surfacesVisibleBySpace = GBX.surfacesIndexed.filter( surface =>
				surface.includes( `spaceIdRef="${ spaceId.value }"`  ) );
		//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );

		surfacesFilteredBySpace.push( ...surfacesVisibleBySpace );

	}
	//console.log( 'surfacesFilteredBySpace', surfacesFilteredBySpace );

	return surfacesFilteredBySpace;

};



VBSP.setViewSpacesShowHide = function() {

	VBSPselSpace.selectedIndex = -1;

	VBSP.selSpacesFocus();

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
