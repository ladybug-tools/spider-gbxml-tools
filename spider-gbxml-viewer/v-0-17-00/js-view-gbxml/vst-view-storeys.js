/* globals GBX, VST, THREE, THR, POPX, divDragMoveContent, VSTdetMenu, VSTselStorey, VSTdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
// jshint loopfunc: true

const VST = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-22",
		description: "View the surfaces in a gbXML file by selecting one or more storeys from a list of all storeys",
		helpFile: "../v-0-17-00/js-view-gbxml/vst-view-storeys.md",
		license: "MIT License",
		version: "0.17.00-2vst"

	}

};



VST.getMenuViewStoreys = function() {

	const help = VGC.getHelpButton("VSTbutSum",VST.script.helpFile);

	const selectOptions = [ "id", "Level", "Name" ].map( option => `<option ${ option === "Name" ? "selected" : "" }>${ option }</option>`);

	const htm =
	`
		<details id=VSTdetMenu ontoggle=VST.setViewStoreysOptions(); >

			<summary>Storeys</summary>

			${help }

			<p>
				Display surfaces by storey. Default is all storeys visible.
				Operates in conjunction with surface type settings.
				<span id=VSTspnCount ></span>
			</p>

			<p>
				<input type=search id=VSTinpAttribute oninput=VGC.setSelectedIndex(this,VSTselStorey) placeholder="Enter an attribute" >
			</p>

			<div id="VSTdivViewStoreys" >
				<select id=VSTselStorey onchange=VST.selStoreys(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VSTdivReportsLog" ></div>

			<p>Attribute to show:
				<select id=VSTselAttribute oninput=VST.setViewStoreysOptions(); >${ selectOptions }</select></p>

			<p>
				<button onclick=VGC.toggleViewSelectedOrAll(this,VSTselStorey,VST.surfacesFilteredStorey); >
					show/hide all storeys
				</button>

				<button onclick=VST.setSurfaceTypesShowHide(this,VST.surfacesFilteredStorey); >show/hide all surface types</button>

			</p>

			<p>Select multiple storeys by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VST.setViewStoreysOptions = function() {

	VSTselStorey.size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const attribute = VSTselAttribute.value;
	//console.log( 'attribute', attribute );

	VSTinpAttribute.value = "";

	const storeyIds = GBX.storeys.map( storey => storey.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'storeyIds', storeyIds );

	const storeyLevels = GBX.storeys.map( storey => storey.match( '<Level>(.*?)</Level>' )[ 1 ] );
	//console.log( 'storeyLevels', storeyLevels);

	const storeyLevelsSorted = storeyLevels.slice().sort( (a, b) => a - b );
	//console.log( 'storeyLevelsSorted', storeyLevelsSorted );

	const storeyNames = GBX.storeys.map( storey => {

		if ( [ "id" ].includes( attribute ) ) {

			text = storey.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( [ "Name", "Level" ].includes( attribute ) ) {

			text = storey.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		}

		const storeyName = text ? text : "no storey name in file";

		return storeyName;

	} );
	//console.log( 'storeyNames', storeyNames);

	const options = storeyLevelsSorted.map( level => {
		//console.log( 'level', level );

		const index = storeyLevels.indexOf( level );
		//console.log( 'indexUnsorted', indexUnsorted );

		return `<option value=${ storeyIds[ index ] }>${ storeyNames[ index ] }</option>`;

	} );

	VSTselStorey.innerHTML = options;

	VSTspnCount.innerHTML = `${ GBX.storeys.length } storeys found.`;

};



//////////

VST.selStoreys = function() {

	VGC.setPopup();

	VST.surfacesFilteredStorey = VST.setSurfacesFilteredStorey();

	VSTdivReportsLog.innerHTML = `<p>${ GBXU.sendSurfacesToThreeJs( VST.surfacesFilteredStorey ) }</p>`;

	divDragMoveContent.innerHTML = POPX.getStoreyAttributes( VSTselStorey.value );

};



VST.setSurfacesFilteredStorey = function( surfaces ) {

	const storeyIds = VSTselStorey.selectedOptions;
	//console.log( 'storeyIds', storeyIds );

	if ( storeyIds.length === 0 ) { // works with VTY

		const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

		let filterArray = Array.from( buttonsActive ).map( button => button.innerText );

		filterArray = filterArray.length > 0 ? filterArray : VST.filtersDefault;
		//console.log( 'filterArray', filterArray );

		surfaces = filterArray.flatMap( filter =>

			GBX.surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

		);

	}

	const surfacesFilteredStory = surfaces ? surfaces : [];

	for ( let storeyId of storeyIds ) {

		const spacesInStorey = GBX.spaces.filter( space => space.includes( `buildingStoreyIdRef="${ storeyId.value }"` ) );
		//console.log( 'spacesInStorey', spacesInStorey );

		const spacesInStoreyIds = spacesInStorey.map( space => space.match( ' id="(.*?)"' )[ 1 ] );
		//console.log( 'spacesInStoreyIds', spacesInStoreyIds );

		const surfacesVisibleSpace = spacesInStoreyIds.flatMap( spaceId =>

			GBX.surfaces.filter( surface => {
				const adjacentSpaceIds = surface.match( /spaceIdRef="(.*?)"/gi );
				let spaceIdRef = adjacentSpaceIds ? adjacentSpaceIds.pop().slice( 12, -1 ) : "";
				return spaceIdRef === spaceId;
			} )
		);
		//console.log( 'surfacesVisibleSpace', surfacesVisibleSpace );

		const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

		let filterArr = Array.from( buttonsActive ).map( button => button.innerText );

		filterArr = filterArr.length > 0 ? filterArr : VTY.filtersDefault;

		const surfacesFiltered = filterArr.flatMap( filter =>

			surfacesVisibleSpace.filter( surface => surface.includes( `"${ filter }"` ) )

		);

		surfacesFilteredStory.push( ...surfacesFiltered );
		//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	}

	return surfacesFilteredStory;

};



VST.setSurfaceTypesShowHide = function( button, surfaceArray ) {

	button.classList.toggle( "active" );

	if ( VSTselStorey.selectedIndex === -1 ) { alert( "First, select a storey from the list"); return; }

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		const storeyIds = VSTselStorey.selectedOptions;

		const surfacesFilteredStory = [];

		for ( let storeyId of storeyIds ) {

			const spacesInStorey = GBX.spaces.filter ( space => space.includes( `buildingStoreyIdRef="${ storeyId.value }"` ) );
			//console.log( 'spacesInStorey', spacesInStorey );

			const spacesInStoreyIds = spacesInStorey.map( space => space.match( ' id="(.*?)"' )[ 1 ] );
			//console.log( 'spacesInStoreyIds', spacesInStoreyIds );

			const surfacesVisibleSpace = spacesInStoreyIds.flatMap( spaceId =>
				GBX.surfaces.filter( surface => surface.includes( `spaceIdRef="${ spaceId }"`  ) )
			);
			//console.log( 'surfacesVisibleSpace', surfacesVisibleSpace );

			const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

			let filterArr = Array.from( buttonsActive ).map( button => button.innerText );

			filterArr = filterArr.length > 0 ? filterArr : VTY.filtersDefault;

			const surfacesFiltered = filterArr.flatMap( filter =>

				surfacesVisibleSpace.filter( surface => surface.includes( `"${ filter }"` ) )

			);

			surfacesFilteredStory.push( ...surfacesVisibleSpace );
			//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

			GBXU.sendSurfacesToThreeJs( surfacesFilteredStory );

		}
	} else {

		GBXU.sendSurfacesToThreeJs( surfaceArray );

	}

};