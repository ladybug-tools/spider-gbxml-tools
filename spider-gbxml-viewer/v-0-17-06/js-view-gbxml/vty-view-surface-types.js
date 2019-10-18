/* globals VBS, GBX, VTYdivSurfaceTypes, VTYsecViewSurfaceType, VSTdivReportsLog, THRU, detReports, */
// jshint esversion: 6
// jshint loopfunc: true

const VTY = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "Show or hide the surfaces (VTY) in a gbXML file by surface type.",
		helpFile: "js-view-gbxml/vty-view-surface-types.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vty-view-surface-types.js",
		version: "0.17.01-0vty"

	}

};


VTY.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "Roof", "Shade" ];



VTY.getMenuViewSurfaceTypes = function () {


	const source = `<a href=${ MNU.urlSourceCode + VTY.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VTYbutSum",VTY.script.helpFile,POP.footer,source);

	const htm =
	`
		<details id=VTYdet ontoggle=VTY.setSurfaceTypeOptions(); >

			<summary>VTY Surfaces by type</summary>

			${ help }

			<p>
				Show by surface type. <span id=VTYspnCount ></span>
			</p>

			<p id="VTYdivSurfaceTypes" ></p>

			<div id="VTYdivReportsLog" ></div>

			<p>
				<button class=butEye id=VTYbutShowAll onclick=VTY.setAllTypesVisible(this); >set all surface types visible </button>
			</p>


			<p>
				<button class=butEye onclick=VTY.onToggleInteriorExterior(this) >show/hide interior/exterior</button>
			</p>

			<p>
				<button class=butEye id=butExposed onclick=VTY.setSurfacesActiveByFilter(this,'exposedToSun="true"'); >show/hide 'exposedToSun' </button>
			</p>

			<p>
				<button class=butEye onclick=VTY.onToggleHorizontalVertical(this) >show/hide horizontal vertical</button>
			</p>


		</details>
	`;

	return htm;

};


VTY.setSurfaceTypeOptions = function () {

	VTY.surfaceTypesInUse = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

	let colors =  VTY.surfaceTypesInUse.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show

	const buttonSurfaceTypes = VTY.surfaceTypesInUse.map( ( type, index ) =>
		`
		<div style="margin: 0.5rem 0;" >
			<button class=butEye onclick=VTY.toggleThisSurfaceType("${ type }"); style=width:2rem; >👁️</button>
			&nbsp; <button id=but${ type } class=${ GBX.surfaceTypesActive.includes( type ) ? "active" : " " }
				onclick=console.log(23);VTY.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };width:10rem;" >
				${ type }
			</button>
		</div>
		`
	);

	VTYdivSurfaceTypes.innerHTML = buttonSurfaceTypes.join( "" );

	VTYspnCount.innerHTML = `${ VTY.surfaceTypesInUse.length} types, ${ VTY.surfaceTypesInUse.length } active.`;

};


VTY.toggleThisSurfaceType = function ( surfaceType ) {

	const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	const button = VTYdivSurfaceTypes.querySelectorAll( `#but${ surfaceType }` );

	VTY.toggleSurfaceByButtons( button[ 0 ] );

}


VTY.toggleSurfaceByButtons = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" );

	GBX.surfaceTypesActive = Array.from( buttonsActive ).map( button => button.innerText );

	VTY.setVisible();

	VTYspnCount.innerHTML = `${ VTY.surfaceTypesInUse.length} types, ${ GBX.surfaceTypesActive.length } active.`;

};


VTY.setAllTypesVisible = function(){

	const buttons = VTYdivSurfaceTypes.querySelectorAll( `button` );

	Array.from( buttons ).forEach( button => {

		if ( !button.classList.contains( "butEye") ) { button.classList.add( "active" ); }

	} );

	const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

	GBX.surfaceTypesActive = Array.from( buttonsActive ).map( button => button.innerText );

	GBX.meshGroup.children.forEach( child => child.visible = true );

	VTYspnCount.innerHTML = `${ VTY.surfaceTypesInUse.length} types, ${ GBX.surfaceTypesActive.length } active.`;

};


VTY.onToggleHorizontalVertical = function( button ) {

	const buttonsActive = VTYsecViewSurfaceTypes.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	GBX.surfaceTypesActive = button.classList.contains( "active" ) ?

		["Ceiling","ExposedFloor", "InteriorFloor","RaisedFloor", "Roof","SlabOnGrade","UndergroundCeiling", "UndergroundSlab"]
		:
		[ "ExteriorWall","InteriorWall","UndergroundWall" ];

	VTY.setVisible();

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

	VTYdivReportsLog.innerHTML = `<p> ${ GBXU.sendSurfacesToThreeJs( surfacesFiltered ) }`;

	const buttons = VTYdivSurfaceTypes.querySelectorAll( "button" );

	buttons.forEach( button => button.classList.remove( "active" ) );

	THRU.groundHelper.visible = false;

};



VTY.onToggleInteriorExterior = function( button ) {

	const buttonsActive = VTYdivSurfaceTypes.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	GBX.surfaceTypesActive = button.classList.contains( "active" ) ?

		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof", "Shade", "SlabOnGrade", "UndergroundSlab", "UndergroundWall" ]
		:
		[ "Ceiling","InteriorFloor", "InteriorWall", "UndergroundCeiling" ];

	VTY.setVisible();

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

	VTYdivReportsLog.innerHTML = `<div style="margin: 0 1rem;" >${ GBXU.sendSurfacesToThreeJs( surfacesFiltered ) }</dix>`;

	return VTYdivReportsLog.innerHTML;

};


VTY.setVisible = function() {

	GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

	GBX.meshGroup.children
		.filter( mesh => GBX.storeyIdsActive.includes( mesh.userData.storeyId ) || mesh.userData.surfaceType === "Shade" )
		.filter( mesh => GBX.surfaceTypesActive.includes( mesh.userData.surfaceType ) )
		.forEach( mesh => mesh.visible = true );

	GBX.placards.children.forEach( mesh => mesh.visible = false );

	GBX.placards.children
		.filter( mesh => GBX.storeyIdsActive.includes( mesh.userData.storeyId ) )
		.forEach( mesh => mesh.visible = true );

};
