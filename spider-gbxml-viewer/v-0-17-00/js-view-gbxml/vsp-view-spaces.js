/* globals GBX, THR, POPX, VSPdetMenu, divDragMoveContent, VSPselSpace, VSPdivReportsLog, VSPselAttribute */
// jshint esversion: 6
// jshint loopfunc: true

const VSP = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-19",
		"description": "View the surfaces in a gbXML file by selecting one or more spaces from a list of all spaces",
		"helpFile": "../v-0-17-00/js-view-gbxml/vsp-view-spaces.md",
		"urlSourceCode":
	"https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxl/vsp-view-spaces.js",
		"version": "0.17-00-0vsp"

	}

};



VSP.getMenuViewSpaces = function() {

	document.body.addEventListener( 'onGbxParse', () => VSPdetMenu.open = false, false );

	const help = `<button id="butVSPsum" class="butHelp" onclick="POP.setPopupShowHide(butVSPsum,VSP.script.helpFile);" >?</button>`;

	const selectOptions = [ "id", "CADObjectId", "spaceType", "Name" ]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	const htm =
	`
		<details id=VSPdetMenu ontoggle=VSP.setViewSpacesOptions(); >

			<summary>Spaces ${ help }</summary>

			<p>Display surfaces by space. <span id="VSPspnCount" ></span></p>

			<p>
				<input type=search id=VSPinpAttribute oninput=VSP.setSelectedIndex(this,VSPselSpace) placeholder="Enter an attribute" >
			</p>

			<div id="VSPdivViewSpaces" >
				<select id=VSPselSpace onchange=VSP.selSpacesFocus(); multiple style=min-width:15rem; ></select
			</div>

			<p id="VSPdivReportsLog" ></p>

			<p>Attribute to show:
				<select id=VSPselAttribute oninput=VSP.setViewSpacesOptions(); >${ selectOptions }</select></p>

			<p>Select multiple spaces by pressing shift or control keys</p>

			<p><button onclick=VSP.setViewSurfaceShowHide(this,VSP.surfacesFilteredSpace); >Show/hide all spaces</button> </p>

		</details>
	`;

	return htm;
};



VSP.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	//console.log( 'option', option );

	select.selectedIndex =  str && option ? option.index : -1;

};



VSP.setViewSpacesOptions = function() {

	if ( VSPdetMenu.open === false ) { return; }

	VSPselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const attribute = VSPselAttribute.value;
	//console.log( 'attribute', attribute );

	VSPinpAttribute.value = "";

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

	VSPselSpace.innerHTML = options;

	VSPspnCount.innerHTML = `${ GBX.spaces.length } spaces found.`;

	THR.controls.enableKeys = false;

};





//////////

VSP.selSpacesFocus = function() {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	VSP.surfacesFilteredSpace = VSP.getSurfacesFilteredSpace();

	VSPdivReportsLog.innerHTML = GBXU.sendSurfacesToThreeJs( VSP.surfacesFilteredSpace );

	divDragMoveContent.innerHTML = POPX.getSpaceAttributes( VSPselSpace.value );

};



VSP.getSurfacesFilteredSpace = function(  ) {

	const spaceIds = VSPselSpace.selectedOptions;

	const surfacesFilteredSpace = [];

	for ( let spaceId of spaceIds ) {
		//console.log( 'spaceId', spaceId );

		const surfacesVisibleSpace = GBX.surfaces.filter( surface =>
				surface.includes( `spaceIdRef="${ spaceId.value }"`  ) );
		//console.log( 'surfacesVisibleSpace', surfacesVisibleSpace );

		surfacesFilteredSpace.push( ...surfacesVisibleSpace );

	}
	//console.log( 'surfacesFilteredSpace', surfacesFilteredSpace );

	return surfacesFilteredSpace;

};



VSP.setViewSpacesShowHide = function() {

	VSPselSpace.selectedIndex = -1;

	VSP.selSpacesFocus();

};



VSP.setViewSurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( VSPselSpace.selectedIndex === -1 ) { alert( "First, select a space from the list"); return; }

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	} else {

		GBXU.sendSurfacesToThreeJs( surfaceArray );

	}

};
