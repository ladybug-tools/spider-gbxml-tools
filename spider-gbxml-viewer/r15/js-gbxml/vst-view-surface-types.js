// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, REPL, GBX */


const VST = { "release": "R15.2", "date": "2019-02-08" };

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
				<li>View selected surfaces in a gbXML file</li>
				<li>View various reports about the file</li>
			</ul>
		</p>

		<p>Wish list
			<ul>
				<li>2019-02-07 ~ Better interaction with openings</li>
				<li>faster operations on very large files</li>
				<li>buttons updated when hor/ver buttons pressed</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/vst-view-surface-types.js" target="_blank" >
				View Surface Type Source code
			</a>
		</p>
		<details>

			<summary>Change log</summary>
			<ul>
				<li>2019-02-08 ~ Working on types/storeys integration</li>
				<li>2019-02-07 ~ Refactor/simplify code a lot. Improve filtering for roof/shade etc. Add 'reset surfaces' and 'Show all' buttons. Add surface types and storeys connections. </li>
				<li>2019-02-07 ~ Update pop-up text / variable names. Reposition stats.</li>
				<li>2019-02-01 ~ First commit, Fork from vwsrf-view-surface-types.js. Big cleanup. </li>

				<!-- <li></li>
				-->
			</ul>
		</details>
	`;



VST.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "Roof", "Shade" ];



VST.getMenuViewSurfaceTypes = function() {

	const htm =
	`
	<details id=detReports ontoggle=VST.onToggle(); >

		<summary>Show/hide by surface type
			<a id=vstHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(vstHelp,VST.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			Show by surface type
		</p>

		<div id="VSTdivSurfaceType" ></div>

		<p id="VSTdivViewByFilters" ></p>

		<p id="VSTdivViewCurrentStats" > </p>

	</details>
	`;

	return htm;

};



VST.onToggle = function() {

	if ( VSTdivSurfaceType.innerHTML === '' ) {

		const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

		let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
		colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
		//console.log( 'col', colors );

		const buttonSurfaceTypes = types.map( ( type, index ) =>
			`<button onclick=VST.toggleSurfaceFiltered(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
		);

		VSTdivSurfaceType.innerHTML = buttonSurfaceTypes.join( '<br>' );

		VSTdivViewByFilters.innerHTML = VST.getViewByFilters();

		VSTdivViewCurrentStats.innerHTML = VST.getViewStats();

		VST.setSurfacesActiveByDefaults();

	}

};



VST.getViewByFilters = function() {

	const htm =
	`
		<div id=REPdivReportByFilters >

			<p>
				<button id=butExterior onclick=VST.setSurfacesActiveByDefaults(this); >exterior surfaces</button>

				<button id=butExposed onclick=VST.sendSurfacesToThreeJs('exposedToSun="true"'); title="Does not update the buttons" >exposed to sun</button>
			</p>

			<p>
				<button onclick=VST.sendSurfacesToThreeJs(["Ceiling","InteriorFloor","SlabOnGrade","Roof","UndergroundSlab"],this); >horizontal</button>

				<button onclick=VST.sendSurfacesToThreeJs(["ExteriorWall","InteriorWall","UndergroundWall"],this); >vertical</button>
			</p>

			<p>
				<button id=but onclick=VST.setSurfacesReset(); >reset surfaces</button>

				<button id=but onclick=VST.setShowAll(); >show all surfaces</button>
			</p>
		</div>

	`;

	return htm;

};


VST.getViewStats = function() {

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	GBX.spaces = GBX.text.match( reSpaces );
	//console.log( 'spaces', GBX.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	GBX.storeys = GBX.text.match( reStoreys );
	GBX.storeys = Array.isArray( GBX.storeys ) ? GBX.storeys : [];
	//console.log( 'GBX.storeys', GBX.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	GBX.zones = GBX.text.match( reZones );
	GBX.zones = Array.isArray( GBX.zones ) ? GBX.zones : [];
	//console.log( 'GBX.zones', GBX.zones );

	const verticesCount = GBX.surfaces.map( surfaces => GBX.getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );
	const timeToLoad = performance.now() - GBX.timeStart;

	const htm =
	`
		Statistics:
		<div>time to parse: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
		<div>spaces: ${ GBX.spaces.length.toLocaleString() } </div>
		<div>storeys: ${ GBX.storeys.length.toLocaleString() } </div>
		<div>zones: ${ GBX.zones.length.toLocaleString() } </div>
		<div>surfaces: ${ GBX.surfaces.length.toLocaleString() } </div>
		<div>coordinates: ${ count.toLocaleString() } </div>
	`;

	return htm;

};



VST.setSurfacesActiveByDefaults = function() {

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );

	buttons.forEach( button => VST.filtersDefault.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	VST.sendSurfacesToThreeJs( VST.filtersDefault );

};



VST.toggleSurfaceFiltered = function( button ) {

	VBS.surfacesFiltered = GBX.surfacesIndexed;

	button.classList.toggle( "active" );

	const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

	const filterArray = Array.from( buttonsActive ).map( button => button.innerText );

	VST.sendSurfacesToThreeJs ( filterArray );

};



VST.setSurfacesReset = function() {

	VBS.surfacesFiltered = GBX.surfacesIndexed;

	VST.setSurfacesActiveByDefaults()

};



VST.setShowAll = function() {

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );

	buttons.forEach( button => button.classList.add( "active" ) );

	VBS.surfacesFiltered = GBX.surfacesIndexed;

	GBX.sendSurfacesToThreeJs( GBX.surfacesIndexed );

};



VST.sendSurfacesToThreeJs = function( filters ) {

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	const buttons = VSTdivSurfaceType.querySelectorAll( "button" );

	buttons.forEach( button => filters.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	VBS.surfacesFiltered = VBS.setSurfacesFilteredByStorey();

	const surfaces = VBS.surfacesFiltered ? VBS.surfacesFiltered : GBX.surfacesIndexed;



	console.log( 'surfaces', surfaces.length  );

	const surfacesFiltered = filters.flatMap( filter =>

		surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	GBX.sendSurfacesToThreeJs( surfacesFiltered );

};
