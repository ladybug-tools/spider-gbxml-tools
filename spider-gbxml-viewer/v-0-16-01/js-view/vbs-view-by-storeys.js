/* globals GBX, VST, THREE, THR, POPX, divDragMoveContent, VBSdetMenu, VBSselStorey, VBSdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
// jshint loopfunc: true

const VBS = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "View the surfaces in a gbXML file by selecting one or more storeys from a list of all storeys",
		"helpFile": "../js-view/vbs-view-by-storeys.md",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",
		"version": "0.16-01-2vbs"

	}

};



VBS.getMenuViewByStoreys = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBSdetMenu.open = false; }, false );

	const help = `<button id="butVBSsum" class="butHelp" onclick="POP.setPopupShowHide(butVBSsum,VBS.script.helpFile);" >?</button>`;

	const selectOptions = [ "id", "Level", "Name" ].map( option => `<option ${ option === "Name" ? "selected" : "" }>${ option }</option>`);

	const htm =
	`
		<details id=VBSdetMenu ontoggle=VBS.setViewByStoreysOptions(); >

			<summary>Storeys ${help } </summary>

			<p>Display surfaces by storey. Default is all storeys visible. Operates in conjunction with surface type settings.</p>

			<p>
				<input id=VBSinpAttribute oninput=VBS.setSelectedIndex(this,VBSselStorey) placeholder="Enter an attribute" >
			</p>

			<div id="VBSdivViewByStoreys" >
				<select id=VBSselStorey onchange=VBS.selStoreys(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VBSdivReportsLog" ></div>

			<p>Attribute to show:
				<select id=VBSselAttribute oninput=VBS.setViewByStoreysOptions(); >${ selectOptions }</select></p>

			<p><button onclick=VBS.setStoreyShowHide(this,VBS.surfacesFilteredByStorey); >show/hide all storeys</button> </p>

			<p>Select multiple storeys by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VBS.setViewByStoreysOptions = function() {

	VBSselStorey.size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const attribute = VBSselAttribute.value;
	//console.log( 'attribute', attribute );

	VBSinpAttribute.value = "";

	const storeyIds = GBX.storeys.map( storey => storey.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'storeyIds', storeyIds );

	const storeyLevels = GBX.storeys.map( storey => storey.match( '<Level>(.*?)</Level>' )[ 1 ] );
	//console.log( 'storeyLevels', storeyLevels);

	const storeyLevelsSorted = storeyLevels.slice().sort( (a, b) => b - a );
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

	VBSselStorey.innerHTML = options;

};



VBS.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();
	\\console.log( 'str', str );

	option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	\\console.log( 'option', option );

	select.selectedIndex =  str && option ? option.index : -1;

};



//////////

VBS.selStoreys = function() {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	// show storey data in POPX-up

	//POPelementAttributes.innerHTML=POPX.toggleStoreyVisible(this,"aim0250");

	THR.scene.remove( POPX.line, POPX.particle );

	VBS.surfacesFilteredByStorey = VBS.setSurfacesFilteredByStorey();

	VBSdivReportsLog.innerHTML = `<p>${ GBX.sendSurfacesToThreeJs( VBS.surfacesFilteredByStorey ) }</p>`;

	divDragMoveContent.innerHTML = POPX.getStoreyAttributes( VBSselStorey.value );

};



VBS.setSurfacesFilteredByStorey = function( surfaces ) {

	const storeyIds = VBSselStorey.selectedOptions;
	//console.log( 'storeyIds', storeyIds );

	if ( storeyIds.length === 0 ) {

		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArray = Array.from( buttonsActive ).map( button => button.innerText );

		filterArray = filterArray.length > 0 ? filterArray : VST.filtersDefault;
		//console.log( 'filterArray', filterArray );

		surfaces = filterArray.flatMap( filter =>

			GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

		);

	}

	const surfacesFilteredByStory = surfaces ? surfaces : [];

	for ( let storeyId of storeyIds ) {

		const spacesInStorey = GBX.spaces.filter ( space => space.includes( `buildingStoreyIdRef="${ storeyId.value }"` ) );
		//console.log( 'spacesInStorey', spacesInStorey );

		const spacesInStoreyIds = spacesInStorey.map( space => space.match( ' id="(.*?)"' )[ 1 ] );
		//console.log( 'spacesInStoreyIds', spacesInStoreyIds );

		const surfacesVisibleBySpace = spacesInStoreyIds.flatMap( spaceId =>
			GBX.surfacesIndexed.filter( surface => surface.includes( `spaceIdRef="${ spaceId }"`  ) )
		);
		//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );

		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArr = Array.from( buttonsActive ).map( button => button.innerText );

		filterArr = filterArr.length > 0 ? filterArr : VST.filtersDefault;

		const surfacesFiltered = filterArr.flatMap( filter =>

			surfacesVisibleBySpace.filter( surface => surface.includes( `"${ filter }"` ) )

		);

		surfacesFilteredByStory.push( ...surfacesFiltered );
		//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	}

	return surfacesFilteredByStory;

};




VBS.setStoreyShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	}

};