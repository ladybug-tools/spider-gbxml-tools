// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divReports */


const VBS = {"release": "R15.1", "date": "2019-02-01" };

VBS.description =
	`
		View the surfaces in a gbXML file by selecting one or more storeys from a list of all storeys
	`;

VBS.currentStatus =
	`
		<h3>Show/Hide by Storeys ${ VBS.release } ~ ${ VBS.date }</h3>

		<p>
			${ VBS.description }
		</p>

		<p>Notes
			<ul>
				<li>Select multiple storeys by pressing shift or control keys</li>
				<!-- <li></li> -->
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
				<li>2019-02-01 ~ Better interaction with currently visible surface types</li>
				<li>2019-01-30 ~ First commit ~ forked from repl-view-by-level.js</li>
				<li>See <a href="https://github.com/ladybug-tools/spider-gbxml-tools/issues/18" target="_blank">Issue 18</a></li>
				<li>Description and current status much updated</li>
				<!-- <li></li> -->
			</ul>
		</details>
	`;




VBS.getMenuViewByStoreys = function() {

	const htm =
	`
	<details id=detReports ontoggle=VBS.getReportByStoreys(); >

		<summary>Show/hide by storeys
			<a id=VBSHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(VBSHelp,VBS.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<div id="VBSdivViewByStoreys" ></div>

		<div id="divReportsLog" ></div>

		<div><p>Select multiple storeys by pressing shift or control keys</p></div>

	</details>
	`;

	return htm;
};



VBS.getReportByStoreys = function() {

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	GBX.storeys = GBX.text.match( reStoreys );
	GBX.storeys = Array.isArray( GBX.storeys ) ? GBX.storeys : [];
	//console.log( 'GBX.storeys', GBX.storeys );

	const optionsStorey = VBS.getStoreysOptions();

	const size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const htm =
	`
		<p>
			Show/hide by storey<br>
			<select id=selStorey onchange=VBS.selStoreys(); multiple size=${ size } style=min-width:15rem; > ${ optionsStorey } </select>
		</p>
	`;

	VBSdivViewByStoreys.innerHTML = htm

};



//////////

VBS.selStoreys = function() {

	if ( !GBX.spaces ) {

		const reSpaces = /<Space(.*?)<\/Space>/gi;
		GBX.spaces = GBX.text.match( reSpaces );
		//console.log( 'spaces', GBX.spaces );

	}

	const storeyIds = selStorey.selectedOptions;
	//console.log( 'storeyIds', storeyIds );

	GBX.surfacesFiltered = [];

	for ( let storeyId of storeyIds ) {

		spacesInStorey = GBX.spaces.filter ( space => space.includes( `buildingStoreyIdRef="${ storeyId.value }"` ) );
		//console.log( 'spacesInStorey', spacesInStorey );

		const spacesInStoreyIds = spacesInStorey.map( space => space.match( ' id="(.*?)"' )[ 1 ] );
		//console.log( 'spacesInStoreyIds', spacesInStoreyIds );

		const surfacesVisibleBySpace = spacesInStoreyIds.flatMap( spaceId =>
			GBX.surfacesIndexed.filter( surface => surface.includes( `spaceIdRef="${ spaceId }"`  ) )
		);
		//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );

		const current = document.getElementsByClassName( "active" );
		//console.log( 'current', current );

		let filterArr = Array.from( current ).map ( current => current.innerText );
		filterArr = filterArr.length > 0 ? filterArr : GBX.filtersDefault;

		const surfacesFiltered = filterArr.flatMap( filter =>

			surfacesVisibleBySpace.filter( surface => surface.includes( `${ filter }` ) )

		);

		GBX.surfacesFiltered.push( ...surfacesFiltered );
		//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	}

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );

};



VBS.getStoreysOptions = function() {
	//console.log( 'GBX.storeys', GBX.storeys );

	var storeyNames = GBX.storeys.map( storey => storey.match( '<Name>(.*?)</Name>' )[ 1 ] );
	//console.log( 'storeyNames', storeyNames);

	var storeyIds = GBX.storeys.map( storey => storey.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'storeyIds', storeyIds );

	// how to destructure or creae object so  can sort these two arrays?

	//console.log( 'storeyNames', storeyNames );

	const options = storeyNames.map( ( name, index ) => `<option value=${ storeyIds[ index ] }>${ name }</option>` );

	return options;

};


