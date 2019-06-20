// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals VBS, GBX, VSTdivSurfaceType, VSTsecViewSurfaceType, VSTdivReportsLog, THRU, detReports, */


const VST = {
	"release": "R15.5.1",
	"date": "2019-06-05"
};

VST.description =
	`
		Show or hide the surfaces in a gbXML file by surface type.
	`;

VST.currentStatus =
	`
		<h3> View Surface Type (VST) ${ VST.release } ~ ${ VST.date }</h3>

		<p>
			${ VST.description }
		</p>

		<p>Concept
			<ul>
				<li>View selected surfaces in a gbXML file using a variety of filters</li>
			</ul>
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/vst-view-surface-types.js" target="_blank" >
				View Surface Type Source code
			</a>
		</p>

		<p>
			Issues
		</p>

		<details>
			<summary>Wish list</summary>
			<ul>

				<li>2019-02-07 ~ Better interaction with openings</li>
				<li>Faster operations on very large files</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-18 ~ 15.5 ~ New features on all the buttons</li>
				<li>2019-02-25 ~ 15.4 ~ Fixes 'exposed to sun; button</li>
				<li>2019-02-13 ~ Close menu when new file loaded. Reset vars</li>
				<li>2019-02-11 ~ Pass through jsHint.com and make repairs</li>
				<li>2019-02-11 ~ Code cleanup. Drop 'reset surfaces' button/code as being redundant</li>
				<li>2019-02-11 ~ Add log of surfaces currently visible</li>
				<li>2019-02-08 ~ Working on types/storeys integration</li>
				<li>2019-02-07 ~ Refactor/simplify code a lot. Improve filtering for roof/shade etc. Add 'reset surfaces' and 'Show all' buttons. Add surface types and storeys connections. </li>
				<li>2019-02-07 ~ Update pop-up text / variable names. Reposition stats.</li>
				<li>buttons updated when hor/ver buttons pressed</li>
				<li>2019-02-01 ~ First commit, Fork from vwsrf-view-surface-types.js. Big cleanup. </li>
			</ul>
		</details>
	`;



VST.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "Roof", "Shade" ];



VST.getMenuViewSurfaceTypes = function() {

	document.body.addEventListener( 'onGbxParse', VST.resetMenu, false );

	const htm =
	`
		<details id=detReports ontoggle=VST.onToggleSurfaceTypes(); >

			<summary>Show/hide by surface type
				<a id=vstHelp class=helpItem href="JavaScript:POP.setPopupShowHide(vstHelp,VST.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p>
				Show by surface type. Default is exterior surfaces only.
			</p>

			<div id="VSTdivSurfaceType" ></div>

			<p>
				<button onclick=VST.onToggleInteriorExterior(this) >show/hide interior/exterior</button>

				<button id=butExposed onclick=VST.setSurfacesActiveByFilter(this,'exposedToSun="true"'); >show/hide 'exposedToSun' </button>
			</p>

			<p>
				<button onclick=VST.onToggleHorizontalVertical(this) >show/hide horizontal vertical</button>
			</p>

			<p>
				<button id=but onclick=VST.setShowAll(this); >show/hide all surfaces</button>
			</p>

			<div id="VSTdivReportsLog" ></div>

			<p id="VSTdivViewCurrentStats" > </p>

		</details>
	`;

	return htm;

};



VST.resetMenu = function() {

	detReports.open = false;
	VSTdivSurfaceType.innerHTML = "";

};



VST.onToggleSurfaceTypes = function() {

	if ( VSTdivSurfaceType.innerHTML === '' ) {

		const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

		let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
		colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
		//console.log( 'col', colors );

		const buttonSurfaceTypes = types.map( ( type, index ) =>
			`
			<button onclick=VST.toggleThisSurface("${ type}");  style=min-width:1.5rem;width:1rem;>o</button>
			<button onclick=VST.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
		);

		VSTdivSurfaceType.innerHTML = buttonSurfaceTypes.join( '<br>' );

		//VSTdivViewCurrentStats.innerHTML = VST.getViewStats();

		VST.setSurfacesActiveByDefaults();

	}

};



VST.setSurfacesActiveByDefaults = function() {

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );

	buttons.forEach( button => VST.filtersDefault.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	VST.sendSurfacesToThreeJs( VST.filtersDefault );

};



VST.toggleThisSurface = function( type ) {

	const buttonsActive = VSTsecViewSurfaceType.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	VST.sendSurfacesToThreeJs ( [ type ] );

};



VST.toggleSurfaceByButtons = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

	const filterArray = Array.from( buttonsActive ).map( button => button.innerText );

	VST.sendSurfacesToThreeJs ( filterArray );

};



VST.setSurfacesActiveByFilter = function( button, filter ) {
	// console.log( 'filter', filter );

	const buttonsActive = VSTsecViewSurfaceType.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	let surfacesFiltered;

	if ( button.classList.contains( "active" ) ) {

		surfacesFiltered = GBX.surfacesIndexed.filter( surface => surface.includes( `${ filter }` ) );
		//console.log( 'surfacesFiltered', surfacesFiltered );

	} else {

		surfacesFiltered = GBX.surfacesIndexed.filter( surface => surface.includes( `${ filter }` ) === false );
		//console.log( 'surfacesFiltered', surfacesFiltered );
	}

	VSTdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( surfacesFiltered );

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );

	buttons.forEach( button => button.classList.remove( "active" ) );

	THRU.groundHelper.visible = false;

};



VST.onToggleInteriorExterior = function( button ) {

	const buttonsActive = VSTsecViewSurfaceType.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof" ]
		:
		[ "Ceiling","InteriorFloor", "InteriorWall", "SlabOnGrade", "UndergroundCeiling", "UndergroundSlab", "UndergroundWall" ];

	VST.sendSurfacesToThreeJs( array );

};



VST.onToggleHorizontalVertical = function( button ) {

	const buttonsActive = VSTsecViewSurfaceType.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		["Ceiling","ExposedFloor", "InteriorFloor","RaisedFloor", "Roof","SlabOnGrade","UndergroundCeiling", "UndergroundSlab"]
		:
		[ "ExteriorWall","InteriorWall","UndergroundWall" ];

	VST.sendSurfacesToThreeJs( array );

};



VST.setShowAll = function( button ) {

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );
	let surfacesFiltered;

	button.classList.toggle( "active" );

	if ( button.classList.contains( "active" ) ) {

		buttons.forEach( button => button.classList.add( "active" ) );
		surfacesFiltered = GBX.surfacesIndexed;

	} else {

		buttons.forEach( button => button.classList.remove( "active" ) );
		surfacesFiltered = [];

	}

	VSTdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( surfacesFiltered );

};



VST.sendSurfacesToThreeJs = function( filters ) {

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );

	buttons.forEach( button => filters.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	VBS.surfacesFilteredByStorey = VBS.setSurfacesFilteredByStorey();

	const surfaces = VBS.surfacesFilteredByStorey ? VBS.surfacesFilteredByStorey : GBX.surfacesIndexed;
	//console.log( 'surfaces', surfaces.length  );

	const surfacesFiltered = filters.flatMap( filter =>

		surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	VSTdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( surfacesFiltered );

	return VSTdivReportsLog.innerHTML;

};
