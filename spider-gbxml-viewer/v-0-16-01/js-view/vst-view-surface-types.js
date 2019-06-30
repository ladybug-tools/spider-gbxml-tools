/* globals VBS, GBX, VSTdivSurfaceType, VSTsecViewSurfaceType, VSTdivReportsLog, THRU, detReports, */
// jshint esversion: 6
// jshint loopfunc: true

const VST = {
	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",	"date": "2019-06-28",
		"date": "2019-06-28",
		"description": "Show or hide the surfaces (VST) in a gbXML file by surface type.",
		"helpFile": "../js-view/vst-view-surface-types.md",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vst-view-surface-types.js",
		"version": "0.16.01-1vst"

	}

};


VST.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "Roof", "Shade" ];



VST.getMenuViewSurfaceTypes = function() {

	document.body.addEventListener( 'onGbxParse', VST.resetMenu, false );

	//document.body.addEventListener( 'onGbxParse', function(){ VSTdet.open = false; }, false );

	const help = `<button id="butVSTsum" class="butHelp" onclick="POP.setPopupShowHide(butVSTsum,VST.script.helpFile);" >?</button>`;


	const htm =
	`
		<details id=VSTdet ontoggle=VST.onToggleSurfaceTypes(); >

			<summary>Surfaces by type ${ help }</summary>

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

	VSTdet.open = false;
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

	const buttonsActive = VSTdet.getElementsByClassName( "active" ); // collection

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

	const buttonsActive = VSTdet.getElementsByClassName( "active" ); // collection

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
