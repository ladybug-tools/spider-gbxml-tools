/* globals GBX, GBXU, THR, PIN, VGC, VSPdetMenu, divDragMoveContent, VSPselSpace, VSPinpAttribute, VSPspnCount, VSPdivReportsLog, VSPselAttribute */
// jshint esversion: 6
// jshint loopfunc: true

const VSP = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View the surfaces in a gbXML file by selecting one or more spaces from a list of all spaces",
		helpFile: "../v-0-17-01/js-view-gbxml/vsp-view-spaces.md",
		license: "MIT License",
		version: "0.17-01-1vsp"

	}

};



VSP.getMenuViewSpaces = function() {


	const help = VGC.getHelpButton("VSPbutSum",VSP.script.helpFile);

	const selectOptions = [ "id", "CADObjectId", "spaceType", "Name" ]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	const htm =
	`
		<details id=VSPdetMenu ontoggle=VSP.setViewSpacesOptions(); >

			<summary>VSP Spaces </summary>

			${ help }

			<p>Display surfaces by space. <span id="VSPspnCount" ></span></p>

			<p>
				<input type=search id=VSPinpAttribute oninput=VGC.setSelectedIndex(this,VSPselSpace) placeholder="Enter an attribute" >
			</p>

			<div id="VSPdivViewSpaces" >
				<select id=VSPselSpace onchange=VSP.selSpacesFocus(); multiple style=min-width:15rem; ></select
			</div>

			<p id="VSPdivReportsLog" ></p>

			<p>Attribute to show:
				<select id=VSPselAttribute oninput=VSP.setViewSpacesOptions(); >${ selectOptions }</select></p>

			<p>Select multiple spaces by pressing shift or control keys</p>

			<p>
				<button onclick=VGC.toggleViewSelectedOrAll(this,VSPselSpace,VSP.surfacesFilteredSpace); >
					Show/hide all spaces
				</button>
			</p>

		</details>
	`;

	return htm;
};



VSP.setViewSpacesOptions = function() {

	if ( VSPdetMenu.open === false ) { return; }

	VSPinpAttribute.value = "";

	VSPselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const attribute = VSPselAttribute.value;
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

	VSPselSpace.innerHTML = options;

	VSPspnCount.innerHTML = `${ GBX.spaces.length } spaces found.`;

};



VSP.selSpacesFocus = function() {

	VGC.setPopup();

	VSP.surfacesFilteredSpace = VSP.getSurfacesFilteredSpace();

	VSPdivReportsLog.innerHTML = GBXU.sendSurfacesToThreeJs( VSP.surfacesFilteredSpace );

	divDragMoveContent.innerHTML = PCO.getSpaceAttributes( VSPselSpace.value );

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