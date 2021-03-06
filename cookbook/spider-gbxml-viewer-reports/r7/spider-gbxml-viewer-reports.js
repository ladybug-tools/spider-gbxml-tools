// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, detSurfacesByType, divSurfacesByType, butAllVisible, butExposeToSun */
/* jshint esversion: 6 */


const REP = {};

REP.colorButtonToggle = 'pink';
REP.cssText = `background-color: ${ REP.colorButtonToggle } !important; font-style: italic; font-weight: bold`;




REP.getMenuItems = function() {

	const htm  =
	`
		<br>

		<details id=detSurfacesByType ontoggle=divSurfacesByType.innerHTML=REP.getMenuPanelSurfacesByType();REP.initButtons(); >

			<summary >Surfaces by Type </summary>

			<div id=divSurfacesByType ></div>

			<p>
				<button id=butAllVisible class=toggle onclick=REP.toggleAllVisible(this); >all visible</button>
				<button id=butExposeToSun class=toggle onclick=REP.toggleExposedToSunVisible(this); >Exposed to Sun</button>
			</p>

		</details>


		<details ontoggle=REPselCadIdGroups.innerHTML=REP.getMenuPanelCadObjectsByType(); >

			<summary >CAD Objects by Type</summary>

			<p>Select one or more types using the shift or control/command keys</p>

			<p>
			<select id = "REPselCadIdGroups"
			onchange=REP.setCadObjectTypeVisible(this); size=10 multiple >
			</select>
			</p>

		</details>


		<details onToggle="" >

			<summary>Openings</summary>

			<div id=divOpenings>Coming soon</div>

			<hr>

		</details>


		<details ontoggle=REP.setOptions(); >

			<summary>Select Report by Item</summary>

			<p>Very work-in-progress. Only Surfaces update.</p>

			<div>
				<select id=REPselReport onclick=REP.setPanelReportResults();
					onchange=REP.setPanelReportResults(); size=6 >

					<option selected >Surface</option>
					<option>Space</option>
					<option>Storey</option>
					<option>Zone</option>
					<option>Opening</option>
				</select>
			</div>

			<div>
				<select id=REPselReportType size=1;>
					<option selected>ID</option>
					<option>Name</option>
					<option>CAD ID</option>
				</select>
			</div>

			<div id=REPdivReport ></div>

			<div>
				<select id=REPselReportResults onchange=REP.setSelectedFocus(this); size=10; multiple></select>
			</div>

			<div id=REPdivInteract ></div>

			<hr>

		</details>



		<details onToggle=divCampus.innerHTML=REP.setGbjsonAttributes(GBX.gbjson.Campus); >

			<summary>Campus</summary>

			<div id=divCampus ></div>

			<hr>

		</details>


		<details onToggle=divCampusLocation.innerHTML=REP.setGbjsonAttributes(GBX.gbjson.Campus.Location); >

			<summary>Campus Location</summary>

			<div id=divCampusLocation ></div>

			<hr>

		</details>


		<details onToggle=divBuilding.innerHTML=REP.setGbjsonAttributes(GBX.gbjson.Campus.Building); >

			<summary>Building</summary>

			<div id=divBuilding ></div>

			<hr>

		</details>

		<details onToggle=divConstruction.innerHTML=REP.setGbjsonAttributes(GBX.gbjson.Construction); >

			<summary>Construction</summary>

			<div id=divConstruction ></div>

			<hr>

		</details>

		<details onToggle=divMore.innerHTML=REP.getMore() >

			<summary>More</summary>

			<div id=divMore ></div>

			<hr>

		</details>

		<p>
			<small><i>Need reports on more gbXML elements? <br>
			<a href="https://github.com/ladybug-tools/spider/issues" >Just shout</a> and they will be made to appear.</i></small>
		</p>

		<br>
	`;

	return htm;

};


REP.setSelectedFocus = function( select ) {

	//console.log( 'select', select.value );

	REP.setSurfaceGroupsVisible();

	for ( let child of GBX.surfaceMeshes.children ) {

		child.visible = false;

	}


	for ( let id of select.selectedOptions ) {

		console.log( 'hh', id );

		for ( let child of GBX.surfaceMeshes.children ) {

			//if ( !child.userData.gbjson.CADObjectId || typeof child.userData.gbjson.CADObjectId !== 'string' ) { continue; }

			//const id = child.userData.gbjson.CADObjectId.replace( /\[(.*?)\]/gi, '' ).trim() ;

			if ( id.value === child.userData.gbjson.id ) { child.visible = true; }

		}

	}

};


REP.setOptions = function(){

	REP.reportTypes = [];

	REP.setPanelSelectOptions( REPselReport, GBX.gbjson.Campus.Surface, 'Surface' );

	REP.setPanelSelectOptions( REPselReport, GBX.gbjson.Campus.Building.Space, 'Space' );

	REP.setPanelSelectOptions( REPselReport, GBX.gbjson.Campus.Building.BuildingStorey, 'Storey' );

	REP.setPanelSelectOptions( REPselReport, GBX.gbjson.Zone, 'Zone' );

	//console.log( 'REP.reportTypes', REP.reportTypes );

	REP.setPanelReportResults();

};



REP.setPanelSelectOptions = function( target, parent, element ) {

	//const obj = Array.isArray( parent ) ? parent[ 0 ] : parent;

	let options = '';

	const item = {};

	//item.attribute = property;
	item.divAttributes = 'REPdivElementAttributes';
	item.parent = parent;
	item.element = element;

	item.placeholder = element;
	item.selItem = 'REPselReportType';

	REP.reportTypes.push( item );

	options += '<option >' + element + '</option>';

	//target.innerHTML += options;

};



REP.setPanelReportResults = function() {

	let item = REP.reportTypes[ REPselReport.selectedIndex ];
	//console.log( 'item', item );
	//+ ' &raquo; ' + ( item.parent.length ? item.parent.length : 1 ) + `


	REPdivReport.innerHTML =

	`<div>

		<p><b>Type: ${ REPselReport.value } - Items: ${ GBX.gbjson.Campus[ REPselReport.value ].length } </b><br></p>

		<div id=REPdivElements ></div>

	</div>`;

	let arr = Array.isArray( item.parent ) ? item.parent : [ item.parent ];
	item.name = 'itemReportResults';
	//item.optionValues = arr.map( element => [ element[ item.attribute ], element.id ] );

	item.optionValues = arr.map( item => [ item.id, item.Name, item.CADObjectId, '' ] );

	item.optionValues.sort( ( a, b ) => {
		if ( a[ 0 ] === b[ 0 ] ) { return 0; } else { return ( a[ 0 ] < b[ 0 ] ) ? -1 : 1; }
	} );
	//console.log( 'item.optionValues', item.optionValues );

	let options = '';

	item.optionValues.forEach( option =>
		options += '<option value=' + option[ 0 ] + ' title="id: ' + option[ 0 ] + '" style="background-color:' + option[ 3 ] + ';" >' + option[ 1 ] + '</option>'
	);

	item.divTarget = document.getElementById( 'REPdivElements' );
	//console.log( 'item', item );

	//SEL.itemReportResults = SEL.getElementPanel( item );

	REPselReportResults.innerHTML = options;

	REPselReportType.selectedIndex = 0;
	//REPselReportType.oninput();


};




////////// various toggles





REP.ZZZsetSurfaceVisibleToggle = function( id ) {

	GBX.surfaceMeshes.visible = true;

	const surfaceMesh = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === id );

	surfaceMesh.visible = !surfaceMesh.visible;

};



//////////
