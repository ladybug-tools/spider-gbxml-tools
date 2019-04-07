//Copyright 2019 Ladybug Tools authors. MIT License
/* globals FIL, divContents, GGD, GCS, OCV, SGFh1FileName, */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const SGF = { release: "2.1.0", date: "2019-04-04" };

SGF.description = `Run basic checks on gbXML files and identify, report and fix issues`;


SGF.currentStatus =
	`
		<h3>Get Template(SGF) ${ SGF.release } status ${ SGF.date }</h3>

		<p>${ SGF.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/spider-gbxml-fixer-core.js" target="_blank">
			spider-gbxml-fixer-core.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li></li>
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-03 ~ D - Add pop-up help</li>
  				<li>2019-04-03 ~ F - First commit</li>
			</ul>
		</details>
	`;


SGF.divFixThings =
	`
		<br><br>

		<h2 id=SGFh1FileName >Check file: <script></script>decodeURI( FIL.name ) } </h2>

		<p>
			<button onclick=SGF.runAll(); >Run all checks</button>

			<button onclick=SGF.closeAll(); >Close all checks</button>

		</p>

		<p>
			<input type=checkbox id=SGFinpIgnoreAirSurfaceType > Ignore Air surface type
		</p>

		<div id=GGDdivGetGbxmlData ></div>

		<div id=GCSdivGetCheckStrings ></div>

		<div id=GCOdivGetCheckOffset ></div>

		<div id=OCVdivGetOpeningsCheckVertices ></div>

		<div id=FXAdivGetFixAttributes ></div>

		<div id=FXSTIdivGetSurfaceTypeInvalid ></div>

		<div id=FXDPCdivGetDuplicatePlanar ></div>

		<div id=FXASEdivSpaceExtra ></div>

		<div id=FXASDdivSpaceDuplicate ></div>

		<div id=FXCIMdivGetCadIdMissing ></div>

		<div id=SGFdivGetTemplate ></div>

	`;


SGF.colorsDefault = {

	InteriorWall: 0x008000,
	ExteriorWall: 0xFFB400,
	Roof: 0x800000,
	InteriorFloor: 0x80FFFF,
	ExposedFloor: 0x40B4FF,
	Shade: 0xFFCE9D,
	UndergroundWall: 0xA55200,
	UndergroundSlab: 0x804000,
	Ceiling: 0xFF8080,
	Air: 0xFFFF00,
	UndergroundCeiling: 0x408080,
	RaisedFloor: 0x4B417D,
	SlabOnGrade: 0x804000,
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,
	Undefined: 0x88888888

};

SGF.colors = Object.assign( {}, SGF.colorsDefault ); // create working copy of default colors

SGF.surfaceTypes = Object.keys( SGF.colors );


SGF.init = function() {

	divContents.innerHTML = SGF.divFixThings;

	//console.log( 'FIL.text', FIL.text );

	SGFh1FileName.innerHTML = `File: ${ decodeURI( FIL.name ) }`;

	GGD.getData( FIL.text );

	GGDdivGetGbxmlData.innerHTML = GGD.getGbxmlData( FIL.text );

	GCSdivGetCheckStrings.innerHTML = GCS.getCheckStrings();

	GCOdivGetCheckOffset.innerHTML = GCO.getCheckOffset();

	OCVdivGetOpeningsCheckVertices.innerHTML = OCV.getOpeningsCheckVertices();

	FXAdivGetFixAttributes.innerHTML = FXA.getFixAttributes();

	FXSTIdivGetSurfaceTypeInvalid.innerHTML = FXSTI.getSurfaceTypeInvalid();

	FXDPCdivGetDuplicatePlanar.innerHTML = FXDPC.getCheckDuplicatePlanarCoordinates();

	FXASEdivSpaceExtra.innerHTML = FXASE.getFixAdjacentSpaceExtra();

	FXASDdivSpaceDuplicate.innerHTML = FXASD.getFixAdjacentSpaceDuplicate();

	FXCIMdivGetCadIdMissing.innerHTML = FXCIM.getCadIdMissing();

	//SGFdivGetTemplate.innerHTML = SGF.getTemplate();

};



////////// utilities


SGF.runAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

	for ( let item of details ) { item.open = true; }

};


SGF.closeAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

};




SGF.getSurfacesAttributesByIndex = function( indexes, id = 1 ) {

	indexes = Array.isArray( indexes ) ? indexes : [ indexes ];
	//console.log( 'indexes', indexes );

	const parser = new DOMParser();

	const htmArray = indexes.map( ( index ) => {

		const surfaceXml = parser.parseFromString( SGF.surfaces[ index ], "application/xml").documentElement;
		//console.log( 'surfaceXml', surfaceXml );

		const htmAttributes = SGF.getSurfaceAttributes( surfaceXml, id );
		//console.log( 'htmAttributes', htmAttributes );

		return htmAttributes;


	} );

	return htmArray;

};



SGF.getSurfaceAttributes = function( surfaceXml, index ) {
	//console.log( 'surfaceXml', surfaceXml );

	const htmSurface = SGF.getAttributesHtml( surfaceXml );
	const htmAdjacentSpace = SGF.getAttributesAdjacentSpace( surfaceXml );
	const htmPlanarGeometry = SGF.getAttributesPlanarGeometry( surfaceXml );

	const rect = surfaceXml.getElementsByTagName( "RectangularGeometry" )[ 0 ];
	//console.log( '', rect );
	const htmRectangularGeometry = SGF.getAttributesHtml( rect );

	const htm =
	`
		<div><b>Selected Surface: ${ index }</b><br>Attributes:</div>

		${ htmSurface }

		<details>
			<summary> AdjacentSpace</summary>
			${ htmAdjacentSpace }
		</details>

		<details>
			<summary> Planar Geometry </summary>
			${ htmPlanarGeometry }
		</details>

		<details>
			<summary> Rectangular Geometry </summary>
			<div>${ htmRectangularGeometry } </div>
		</details>
	`;

	return htm;

};



SGF.getAttributesHtml = function( obj ) {
	//console.log( 'obj', obj );

	let htm ='';

	if ( !obj.attributes ) { return htm; }  //////////  make more forgiving

	for ( let attribute of obj.attributes ) {

		htm +=
		`<div>
			<span class=attributeTitle >${ attribute.name }</span>:
			<span class=attributeValue >${ attribute.value }</span>
		</div>`;

		if ( attribute.name === "constructionIdRef" ) {

			//console.log( 'attribute.value', attribute.value );

			//constructions = SGF.text.match( /<Construction(.*?)<\/Construction>/gi );

			// silly way of doing things, but it's a start
			const parser = new DOMParser();
			const campusXml = parser.parseFromString( SGF.text, "application/xml").documentElement;
			//SGF.campusXml = campusXml;
			//console.log( 'campusXml', campusXml.attributes );

			const constructions = Array.from( campusXml.getElementsByTagName( 'Construction' ) );
			const construction = constructions.find( item => item.id === attribute.value );
			//console.log( 'construction', construction);

			const xmlText = new XMLSerializer().serializeToString( construction );
			//console.log( 'xmlText', xmlText );

			htm += `<textarea style=height:5rem;width:100%; >${ xmlText }</textarea>`;


		}

	}

	const nodes = obj.childNodes;
	const numbers = ['Azimuth', 'Height', 'Tilt', 'Width' ];

	for ( let node of nodes ) {
		//console.log( 'node', node);

		if ( node.nodeName !== "#text" ) {
			//console.log( 'node', node.nodeName, node );

			if ( node.childElementCount > 0 ) {
				//console.log( 'node', node );

			} else if ( node.innerHTML ) {
				//console.log( 'node', node );

				const value = numbers.includes( node.nodeName ) ? Number( node.innerHTML ).toLocaleString() : node.innerHTML;

				htm +=

				`<div>
					<span class=attributeTitle >${ node.nodeName }</span>:
					<span class=attributeValue >${ value }</span>
				</div>`;

			}

		} else {

			//console.log( 'node', node );

		}

	}

	return htm;

};



SGF.getAttributesAdjacentSpace = function( surfaceXml ){

	const adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		SGF.adjacentSpaceIds = [];
		SGF.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const spaceId2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		const spaceText1 = SGF.spaces.find( item => item.includes( spaceId1 ) );
		//console.log( 'spaceText1', spaceText1 );
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		const spaceText2 = SGF.spaces.find( item => item.includes( spaceId2 ) );
		//console.log( 'spaceText2', spaceText2 );
		const spaceName2 = spaceText2.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		SGF.adjacentSpaceIds = [ spaceId1, spaceId2 ];

		SGF.setAttributesStoreyAndZone( spaceId2 );

		htm =
		`<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ spaceId1 } / ${ spaceName1 }</span>

			</div>
			<div>
				<span class=attributeTitle >spaceIdRef 2:</span>
				<span class=attributeValue >${ spaceId2 } / ${ spaceName2 }</span>
			</div>
		`;

	} else {
		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		SGF.adjacentSpaceIds = [ spaceId ];

		const spaceText1 = SGF.spaces.find( item => item.includes( spaceId ) );
		//console.log( 'spaceText1', spaceText1 );
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		SGF.setAttributesStoreyAndZone( spaceId );

		htm =
		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId } / ${ spaceName1 }</span>
		</div>`;

	}

	return htm;

};



SGF.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = SGF.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	const storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ );
	//console.log( 'storeyId', SGF.storeyId[ 1 ] );

	SGF.storeyId = storeyId ? storeyId[ 1 ] : [];
	//console.log( 'storeyId', SGF.storeyId[ 1 ] );

	const storeyText = SGF.storeys.find( item => item.includes( SGF.storeyId ) );
	//console.log( 'storeyText', storeyText );

	const storeyName = storeyText ? storeyText.match ( '<Name>(.*?)</Name>' ) : "";

	SGF.storeyName = storeyName ? storeyName[ 1 ] : "no storey name in file";
	//console.log( 'SGF.storeyName', SGF.storeyName );

	SGF.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ );

	if ( SGF.zoneId ) {

		SGF.zoneId = SGF.zoneId[ 1 ];
		//console.log( 'zoneId', SGF.zoneId[ 1 ] );

		const zoneText = SGF.zones.find( item => item.includes( SGF.zoneId ) );
		//console.log( 'storeyText', zoneText );

		SGF.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
		//console.log( 'SGF.zoneName', SGF.zoneName );

	} else {

		SGF.zoneName = "None";

	}


};




SGF.getAttributesPlanarGeometry = function( surfaceXml ) {

	const plane = surfaceXml.getElementsByTagName( 'PlanarGeometry' );

	const points = plane[ 0 ].getElementsByTagName( 'Coordinate' );
	//console.log( 'points', points );

	let htm = '';
	for ( let i = 0; i < points.length; ) {

		//console.log( 'points', points );

		htm +=
		`
			<div><span class=attributeTitle >CartesianPoint:</span></div>
			&nbsp;
			<span class=attributeTitle >x:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >y:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >z:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span><br>
		`;

	}

	return htm;

};


