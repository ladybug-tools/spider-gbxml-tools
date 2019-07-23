/* globals VBS, GBX, VTYdivSurfaceTypes, VTYsecViewSurfaceType, VSTdivReportsLog, THRU, detReports, */
// jshint esversion: 6
// jshint loopfunc: true

const VTY = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-22",
		description: "Show or hide the surfaces (VTY) in a gbXML file by surface type.",
		helpFile: "../v-0-17-00/js-view-gbxml/vst-view-surface-types.md",
		license: "MIT License",
		version: "0.17.00-1vst"

	}

};


VTY.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "Roof", "Shade" ];



VTY.getMenuViewSurfaceTypes = function() {


	const help = VGC.getHelpButton("VTYbutSum",VTY.script.helpFile);

	const htm =
	`
		<details id=VTYdet ontoggle=VTY.onToggleSurfaceTypes(); >

			<summary>Surfaces by type</summary>

			${ help }

			<p>
				Show by surface type. Default is exterior surfaces only.
			</p>

			<p id="VTYdivSurfaceTypes" ></p>

			<div id="VTYdivReportsLog" ></div>

			<p>
				<button onclick=VTY.onToggleInteriorExterior(this) >show/hide interior/exterior</button>

				<button id=butExposed onclick=VTY.setSurfacesActiveByFilter(this,'exposedToSun="true"'); >show/hide 'exposedToSun' </button>
			</p>

			<p>
				<button onclick=VTY.onToggleHorizontalVertical(this) >show/hide horizontal vertical</button>
			</p>

			<p>
				<button id=VTYbutShowAll onclick=VTY.setShowAll(this); >show/hide all surfaces</button>
			</p>

		</details>
	`;

	return htm;

};



VTY.onToggleSurfaceTypes = function() {

	if ( VTYdivSurfaceTypes.innerHTML === '' ) {

		const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

		let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
		colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
		//console.log( 'col', colors );

		const buttonSurfaceTypes = types.map( ( type, index ) =>
			`
			<button onclick=VTY.toggleThisSurface("${ type}"); style=min-width:1.5rem;>o</button>
			<button onclick=VTY.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };width:10rem;" > ${ type } </button>`
		);

		VTYdivSurfaceTypes.innerHTML = buttonSurfaceTypes.join( '<br>' );

		//VTY.setSurfacesActiveByDefaults();

		VTY.setShowAll(VTYbutShowAll);

	}

};



VTY.setSurfacesActiveByDefaults = function() {

	const buttons = VTYdivSurfaceTypes.querySelectorAll( "button" );

	buttons.forEach( button => VTY.filtersDefault.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	VTY.sendSurfacesToThreeJs( VTY.filtersDefault );

};



VTY.toggleThisSurface = function( type ) {

	const buttonsActive = VTYdet.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	VTY.sendSurfacesToThreeJs ( [ type ] );

};



VTY.toggleSurfaceByButtons = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

	const filterArray = Array.from( buttonsActive ).map( button => button.innerText );

	VTY.sendSurfacesToThreeJs ( filterArray );

};



VTY.setSurfacesActiveByFilter = function( button, filter ) {
	// console.log( 'filter', filter );

	const buttonsActive = VTYsecViewSurfaceTypes.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	let surfacesFiltered;

	if ( button.classList.contains( "active" ) ) {

		surfacesFiltered = GBX.surfaces.filter( surface => surface.includes( `${ filter }` ) );
		//console.log( 'surfacesFiltered', surfacesFiltered );

	} else {

		surfacesFiltered = GBX.surfaces.filter( surface => surface.includes( `${ filter }` ) === false );
		//console.log( 'surfacesFiltered', surfacesFiltered );
	}

	VTYdivReportsLog.innerHTML = GBXU.sendSurfacesToThreeJs( surfacesFiltered );

	const buttons = VTYdivSurfaceTypes.querySelectorAll( "button" );

	buttons.forEach( button => button.classList.remove( "active" ) );

	THRU.groundHelper.visible = false;

};



VTY.onToggleInteriorExterior = function( button ) {

	const buttonsActive = VTYdet.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof", "Shade", "SlabOnGrade", "UndergroundSlab", "UndergroundWall" ]
		:
		[ "Ceiling","InteriorFloor", "InteriorWall", "UndergroundCeiling" ];

	VTY.sendSurfacesToThreeJs( array );

};



VTY.onToggleHorizontalVertical = function( button ) {

	const buttonsActive = VTYsecViewSurfaceTypes.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		["Ceiling","ExposedFloor", "InteriorFloor","RaisedFloor", "Roof","SlabOnGrade","UndergroundCeiling", "UndergroundSlab"]
		:
		[ "ExteriorWall","InteriorWall","UndergroundWall" ];

	VTY.sendSurfacesToThreeJs( array );

};



VTY.setShowAll = function( button ) {

	const buttons = VTYdivSurfaceTypes.querySelectorAll( "button" );
	let surfacesFiltered;

	button.classList.toggle( "active" );

	if ( button.classList.contains( "active" ) ) {

		buttons.forEach( button => button.classList.add( "active" ) );
		surfacesFiltered = GBX.surfaces;

	} else {

		buttons.forEach( button => button.classList.remove( "active" ) );
		surfacesFiltered = [];

	}

	VTYdivReportsLog.innerHTML = GBXU.sendSurfacesToThreeJs( surfacesFiltered );

};



VTY.sendSurfacesToThreeJs = function( filters ) {

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	const buttons = VTYdivSurfaceTypes.querySelectorAll( "button" );

	buttons.forEach( button => filters.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	VST.surfacesFilteredStorey = VST.setSurfacesFilteredStorey();

	const surfaces = VST.surfacesFilteredStorey ? VST.surfacesFilteredStorey : GBX.surfaces;
	//console.log( 'surfaces', surfaces.length  );

	const surfacesFiltered = filters.flatMap( filter =>

		surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	VTYdivReportsLog.innerHTML = GBXU.sendSurfacesToThreeJs( surfacesFiltered );

	return VTYdivReportsLog.innerHTML;

};
