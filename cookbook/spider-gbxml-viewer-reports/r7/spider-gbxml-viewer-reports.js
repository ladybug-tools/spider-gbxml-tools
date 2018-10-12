// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, detSurfacesByType, divSurfacesByType, butAllVisible, butExposeToSun */
/* jshint esversion: 6 */


const REP = {};

REP.cssText = 'background-color: ' + REP.colorButtonToggle + ' !important; font-style: italic; font-weight: bold';

REP.colorButtonToggle = 'pink';



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

			<p>Very work-in-progress</p>

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

}



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


///// Surfaces by Type

REP.getMenuPanelSurfacesByType = function( target ) {

	const surfaces = GBX.gbjson.Campus.Surface;
	const types = [];
	const typesCount = [];

	for ( let surface of surfaces ) {

		const index = types.indexOf( surface.surfaceType );

		if ( index < 0 ) {

			types.push( surface.surfaceType );
			typesCount[ types.length - 1 ] = 1;

		} else {

			typesCount[ index ] ++;

		}

	}

	// do we want to sort types?

	let txt = `<p>${ types.length } surface types found</p>`;

	for ( let i = 0; i < types.length; i++ ) {

		let color =  GBX.colorsDefault[types[ i ]] ? GBX.colorsDefault[types[ i ]].toString( 16 ) : '';
		color = color.length > 4 ? color : '00' + color;
		//console.log( 'col', color );

		txt +=
		`
			<button class=toggleView onclick=REP.setSurfaceTypeInvisible(this);REP.toggleButtonColor(this);
				value=${ types[ i ] } ><img src="./eye.png" height=18>
			</button>

			<button class=toggle onclick=REP.setSurfaceTypeVisible(this.innerText);
				style="width:12rem;background-color:#${ color } !important;" >
				${ types[ i ] } </button>
					${ typesCount[ i ] }/${ surfaces.length }
		<br>`;

	}

	return txt;

};



REP.initButtons = function() {

	if ( detSurfacesByType.open === true ) REP.toggleAllVisible( butAllVisible );

};



REP.toggleButtonColor = function( button ) {

	if ( button.style.backgroundColor !== REP.colorButtonToggle ) {

		button.style.cssText = REP.cssText;

		return true;

	} else {

		button.style.cssText = '';

		return false;

	}

};



REP.toggleAllVisible = function( button ) {

	const visible = REP.toggleButtonColor( button );
	const butts = Array.from( divSurfacesByType.getElementsByClassName( "toggleView" ) );

	butExposeToSun.style.cssText = '';

	if ( visible === true ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		butts.forEach( butt => butt.style.cssText = REP.cssText );

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );

		butts.forEach( butt  => butt.style.cssText = '' );

	}

};



REP.toggleExposedToSunVisible = function( button ) {

	const visible = REP.toggleButtonColor( button );

	butAllVisible.style.cssText = '';

	REP.setSurfaceGroupsVisible();

	if ( visible === true ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = element.userData.gbjson.exposedToSun === "true" ? true : false );

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	}

};



//////////

REP.getMenuPanelCadObjectsByType = function( target ) {

	const surfaces = GBX.gbjson.Campus.Surface;
	const cadIds = [];

	for ( let surface of surfaces ) {

		if ( !surface.CADObjectId || typeof surface.CADObjectId !== 'string' ) {

			continue;

		}

		const id = surface.CADObjectId.replace( / \[(.*?)\]/gi, '' ).trim();

		if ( !cadIds.includes( id ) ) {

			cadIds.push( id );

		}

	}
	//console.log( 'cadIds', cadIds );

	cadIds.sort();

	let htm = '';

	for ( let id of cadIds ){

		htm += '<option>' + id + '</option>';

	}

	return htm;

};



REP.setCadObjectTypeVisible = function( CADObjectGroup ) {

	REP.setSurfaceGroupsVisible();

	for ( let child of GBX.surfaceMeshes.children ) {

		child.visible = false;

	}


	for ( let option of CADObjectGroup.selectedOptions ) {

		const cadId = option.value.trim();
		//console.log( 'cadId', cadId );

		for ( let child of GBX.surfaceMeshes.children ) {

			if ( !child.userData.gbjson.CADObjectId || typeof child.userData.gbjson.CADObjectId !== 'string' ) { continue; }

			const id = child.userData.gbjson.CADObjectId.replace( /\[(.*?)\]/gi, '' ).trim() ;

			if ( id === cadId ) { child.visible = true; }

		}

	}

};



////////// various toggles


REP.setSurfaceTypeVisible = function( type ) {

	REP.setSurfaceGroupsVisible();

	GBX.surfaceMeshes.children.forEach( element => element.visible = element.userData.gbjson.surfaceType === type? true : false );

	/*
	let txt = '';

	//for ( let i = 0; i < types.length; i++ ) {
	for ( let i = 0; i < GBX.surfaceTypes.length; i++ ) {

		txt += `<option>${GBX.surfaceTypes[i]}</option>`;

	}
	*/
};



REP.setSurfaceTypeInvisible = function( button ) {

	for ( let child of GBX.surfaceMeshes.children ) {

		if ( !child.userData.gbjson ) { continue; }

		if ( child.userData.gbjson.surfaceType === button.value && button.style.backgroundColor === REP.colorButtonToggle ) {

			child.visible = false;

		} else if ( child.userData.gbjson.surfaceType === button.value ) {

			child.visible = true;

		}

	}

};


// needed?? wanted??
REP.setSurfaceGroupsVisible = function( meshesVis = true, edgesVis = true, openingsVis = false ) {

	GBX.surfaceMeshes.visible = meshesVis;
	GBX.surfaceEdges.visible = edgesVis;
	GBX.surfaceOpenings.visible = openingsVis;

};

REP.ZZZsetSurfaceVisibleToggle = function( id ) {

	GBX.surfaceMeshes.visible = true;

	const surfaceMesh = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === id );

	surfaceMesh.visible = !surfaceMesh.visible;

};


//////////

REP.setGbjsonAttributes = function( obj, target, title ) {
	//console.log( 'obj', obj );
	//console.log( 'target', target );

	let attributes = '';

	for ( let property in obj ) {

		if ( obj[ property ] !== null && typeof( obj[ property ] ) === 'object' ) {

			if ( title === 'Construction') {

				//console.log( 'property', obj[ property ] );

				attributes +=
				`<div>
					<p class=attributeTitle >${obj[ property ].id }:</p>`;

				const construction = obj[ property ];

				keys = Object.keys( construction );

				for ( key of keys ) {

					//console.log( key, construction[ key ] );

					if ( key === "LayerId" ) {

						for ( item of Array.from( construction.LayerId ) ) {

							//console.log( 'item', item );
							attributes += `LayerId: ${ item.layerIdRef }<br>`;
						}

					} else {

						attributes += `${ key }: ${ construction[ key ] } <br>`;

					}

				}

				attributes += '</div><br>';

			}

		} else {

			attributes +=
			`<div>
				<span class=attributeTitle >${property}:</span>
				<span class=attributeValue >${obj[ property ]}</span>
			</div>`;

		}

	}
	//console.log( 'attributes', attributes );

	return attributes;

};



//////////

REP.getGoogleMap = function() {

	const locate = GBX.gbjson.Campus.Location;  // remember that location is a reserved word in your browser
	let linkToMap;

	if ( locate && locate.Latitude && locate.Longitude ) {

		const link = 'https://www.google.com/maps/@' + locate.Latitude + ',' + locate.Longitude + ',17z';

		linkToMap = '<a href="'+ link + '" target=_blank > Google Maps</a>';

	} else {

		linkToMap = '';

	}

	return '<span title="Use context menu to open a Google Map in a new tab" >' + linkToMap + '<span>';

};



REP.getWolframAlpha = function() {

	const locate = GBX.gbjson.Campus.Location;  // remember that location is a reserved word in your browser
	let linkToMap;

	if ( locate && locate.Latitude && locate.Longitude ) {

		const link = 'http://www.wolframalpha.com/input/?i=' + locate.Latitude + '+degrees,+' + locate.Longitude + '+degrees';

		linkToMap = '<a href="'+ link + '"  target=_blank > Wolfram info </a>';

	} else {

		linkToMap = '';

	}

	return '<span title="Use context menu to open a Wolfram Alpha in a new tab" >' + linkToMap + '<span>';

};


REP.getMore = function() {

	const mapLink = REP.getGoogleMap();

	const wolframAlphaLink = REP.getWolframAlpha();

	return `${ mapLink } <br> ${ wolframAlphaLink }`;

}