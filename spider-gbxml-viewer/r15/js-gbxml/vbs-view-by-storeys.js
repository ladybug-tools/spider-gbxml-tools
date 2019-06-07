// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals GBX, VST, THREE, THR, POP, divPopUpData, VBSdetMenu, VBSselStorey, VBSdivReportsLog, VSTdivSurfaceType */


const VBS = {
	"release": "R15.8",
	"date": "2019-06-06"
};

VBS.description =
	`
		View the surfaces in a gbXML file by selecting one or more storeys from a list of all storeys
	`;


VBS.currentStatus =
	`
		<h3>View by Storeys (VBS) ${ VBS.release } ~ ${ VBS.date }</h3>

		<p>
			${ VBS.description }
		</p>

		<p>Notes
			<ul>
				<li>Select multiple storeys by pressing shift or control keys</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/r15/js-gbxml/vbs-view-by-storeys" target="_blank" >
				VBS View by Storeys Source
			</a>
		</p>

		<details>
			<summary>Wish list</summary>
			<ul>
				<li>2019-01-30 ~ Better interaction with edges and openings</li>
				<li>2019-01-15 ~ Theo ~ faster operations on very large files</li>

			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-02-26 ~ R15.6 ~ Add check for no storey name</li>
				<li>2019-02-20 ~ Add display storey level names in elevation order </li>
				<li>2019-02-13 ~ Close menu when new file loaded</li>
				<li>2019-02-11 ~ Update text content. Code cleanup.</li>
				<li>2019-02-11 ~ Better types/storeys integration on show all storeys</li>
				<li>2019-02-08 ~ Working on types/storeys integration</li>
				<li>2019-02-07 ~ Update pop-up text</li>
				<li>2019-02-01 ~ Better interaction with currently visible surface types</li>
				<li>2019-01-30 ~ First commit ~ forked from repl-view-by-level.js</li>
				<li>See <a href="https://github.com/ladybug-tools/spider-gbxml-tools/issues/18" target="_blank">Issue 18</a></li>
				<li>Description and current status much updated</li>
				<!-- <li></li>
				-->
			</ul>
		</details>
	`;




VBS.getMenuViewByStoreys = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBSdetMenu.open = false; }, false );

	const htm =
	`
		<details id=VBSdetMenu ontoggle=VBS.getStoreysOptions(); >

			<summary>Show/hide by storeys
				<a id=VBSHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(VBSHelp,VBS.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p>Display surfaces by storey. Default is all storeys visible.</p>

			<p>
				<input oninput=VBS.setSelectedIndex(this,VBSselStorey) >
			</p>

			<div id="VBSdivViewByStoreys" >
				<select id=VBSselStorey onchange=VBS.selStoreys(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VBSdivReportsLog" ></div>

			<p><button onclick=VBS.setStoreyShowHide(this,VBS.surfacesFilteredByStorey); >show/hide all storeys</button> </p>

			<p>Select multiple storeys by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VBS.getStoreysOptions = function() {

	VBSselStorey.size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const storeyIds = GBX.storeys.map( storey => storey.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'storeyIds', storeyIds );

	const storeyLevels = GBX.storeys.map( storey => storey.match( '<Level>(.*?)</Level>' )[ 1 ] );
	//console.log( 'storeyLevels', storeyLevels);

	const storeyLevelsSorted = storeyLevels.slice().sort( (a, b) => b - a );
	//console.log( 'storeyLevelsSorted', storeyLevelsSorted );

	const storeyNames = GBX.storeys.map( storey => {

		const storeyArr = storey.match( '<Name>(.*?)</Name>' );

		const storeyName = storeyArr ? storeyArr[ 1 ] : "no storey name in file";

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

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	//console.log( 'option', option );

	if ( option ) {

		select.value = option.value;

		VBS.selStoreys();

	} else {

		select.value = "";

	}

};



//////////

VBS.selStoreys = function() {

	THR.controls.enableKeys = false;

	POP.intersected = null;

	divPopUpData.innerHTML = '';

	// show storey data in pop-up

	//POPelementAttributes.innerHTML=POP.toggleStoreyVisible(this,"aim0250");

	THR.scene.remove( POP.line, POP.particle );

	VBS.surfacesFilteredByStorey = VBS.setSurfacesFilteredByStorey();

	VBSdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBS.surfacesFilteredByStorey );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );

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