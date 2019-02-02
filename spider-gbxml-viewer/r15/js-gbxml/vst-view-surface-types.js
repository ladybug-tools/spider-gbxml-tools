// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, REPL, GBX */


const VST = { "release": "R15.0", "date": "2019-02-01" };

VST.description =
	`
		Show or hide the surfaces in a gbXML by surface type.
	`;

VST.currentStatus =
	`
		<h3>${ VST.date } ~ Reports ${ VST.release }</h3>

		<p>
			${ VST.description }
		</p>



		<p>Concept
			<ul>

				<li>View selected surfaces in a gbXML file</li>
				<li>View various reports about the file</li>
				<!-- <li></li> -->
			</ul>
		</p>

		<p>Wish list
			<ul>
				<li>faster operations on very large files</li>
				<li>layer buttons updated when hor/ver buttons pressed</li>
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
				<li>2019-02-01 ~ First commit, Fork from vwsrf-view-surface-types.js. Big cleanup. </li>

				<!-- <li></li> -->
			</ul>
		</details>
	`;



//VST.filtersDefault = [ "Roof", "ExteriorWall", "ExposedFloor", "Air", "Shade" ];
VST.filtersDefault = GBX.filtersDefault;

VST.getStats = function() {

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
		<div>time to parse: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
		<div>spaces: ${ GBX.spaces.length.toLocaleString() } </div>
		<div>storeys: ${ GBX.storeys.length.toLocaleString() } </div>
		<div>zones: ${ GBX.zones.length.toLocaleString() } </div>
		<div>surfaces: ${ GBX.surfaces.length.toLocaleString() } </div>
		<div>coordinates: ${ count.toLocaleString() } </div>
	`;

	return htm;

};



VST.onToggle = function() {

	if ( REPdivSurfaceType.innerHTML === '' ) {

		const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

		let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
		colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
		//console.log( 'col', colors );

		/// class=butSurfaceType
		const buttonSurfaceTypes = types.map( ( type, index ) =>
			`<button onclick=VST.toggleSurfaceFiltered(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
		);

		REPdivSurfaceType.innerHTML = buttonSurfaceTypes.join( '<br>' );

		divReportCurrentStatus.innerHTML = VST.getStats();

		divReportByFilters.innerHTML = VST.getReportByFilters();

		VST.setSurfacesActiveByDefaults();

	}


};



VST.getMenuViewSurfaceTypes = function() {

	const htm =
	`
	<details id=detReports ontoggle=VST.onToggle(); >

		<summary>Show/hide by surface type
		<a id=vstHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(vstHelp,VST.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<div>
		<p>
			Show by surface type
		</p>
		</div>

		<div id='REPdivSurfaceType' ></div>

		<p id="divReportCurrentStatus" > </p>

		<p id="divReportByFilters" ></p>

		<div id="divReportsLog" ></div>

	</details>
	`

	return htm;

};



VST.getReportByFilters = function() {

	const htm =
	`
		<div id=REPdivReportByFilters >

			<p>
				<button id=butExterior onclick=VST.setSurfacesActiveByDefaults(this); >exterior surfaces</button>

				<button id=butExposed onclick=VST.setSurfacesFiltered(this,'exposedToSun="true"'); >exposed to sun</button>
			</p>

			<p>
				<button onclick=VST.setSurfaceTypesVisible(["Ceiling","InteriorFloor","SlabOnGrade","Roof","UndergroundSlab"],this); >horizontal</button>

				<button onclick=VST.setSurfaceTypesVisible(["ExteriorWall","InteriorWall","UndergroundWall"],this); >vertical</button>
			</p>

		</div>

	`;

	return htm;

};



VST.toggleSurfaceFiltered = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = REPdivSurfaceType.getElementsByClassName( "active" ); // collection

	const filterArray = Array.from( buttonsActive ).map( button => button.innerText );

	VST.setSurfaceTypesVisible ( filterArray );

};



VST.setSurfaceTypesVisible = function ( typesArray ) {
	//console.log( 'typesArray', typesArray );

	GBX.surfacesFiltered = typesArray.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



VST.setSurfacesFiltered = function( button, filters ) {

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	GBX.surfacesFiltered = filters.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `${ filter }` ) )

	);

	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



VST.setSurfacesActiveByDefaults = function() {

	//if ( REPdivSurfaceType ) {

		const buttons = REPdivSurfaceType.querySelectorAll( "button" );

		buttons.forEach( button => VST.filtersDefault.includes( button.innerText ) ?
			button.classList.add( "active" ) : button.classList.remove( "active" )
		);

	//}

	VST.setSurfaceTypesVisible( VST.filtersDefault );

};
