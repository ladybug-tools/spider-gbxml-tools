//Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals FIL, divContents, SGTdivFixThings, SGTh1FileName, FXsumStats */
/* jshint loopfunc:true */

const SGT = { release: "1.4", date: "2019-03-18" };

SGT.description = `Run basic checks on gbXML files and identify & report errors`;

SGT.colorsDefault = {

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

SGT.colors = Object.assign( {}, SGT.colorsDefault ); // create working copy of default colors

SGT.surfaceTypes = Object.keys( SGT.colors );


SGT.init = function() {

	divContents.innerHTML = SGTdivFixThings.innerHTML;

	//console.log( 'FIL.text', FIL.text );

	SGTh1FileName.innerHTML = `File: ${ decodeURI( FIL.name ) }`;

	SGT.text = FIL.text.replace( /\r\n|\n/g, '' );
	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGT.surfaces', SGT.surfaces );

	SGT.getStats();

};



////////// utilities


SGT.runAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

	for ( let item of details ) { item.open = true; }

};



SGT.getStats = function() {

	const timeStart = performance.now();

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	SGT.spaces = SGT.text.match( reSpaces );
	//console.log( 'spaces', SGT.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	SGT.storeys = SGT.text.match( reStoreys );
	SGT.storeys = Array.isArray( SGT.storeys ) ? SGT.storeys : [];
	//console.log( 'SGT.storeys', SGT.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	SGT.zones = SGT.text.match( reZones );
	SGT.zones = Array.isArray( SGT.zones ) ? SGT.zones : [];
	//console.log( 'SGT.zones', SGT.zones );

	const verticesCount = SGT.surfaces.map( surfaces => getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	FXsumStats.innerHTML = `Show gbXML file statistics ~ ${ SGT.surfaces.length.toLocaleString() } surfaces`;

	const htm =
		`
			<p><i>gbXML elements statistics</i></p>
			<p>Spaces: ${ SGT.spaces.length.toLocaleString() } </p>
			<p>Storeys: ${ SGT.storeys.length.toLocaleString() } </p>
			<p>Zones: ${ SGT.zones.length.toLocaleString() } </p>
			<p>Surfaces: ${ SGT.surfaces.length.toLocaleString() } </p>
			<p>Coordinates in surfaces: ${ count.toLocaleString() } </p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return htm;


		function getVertices( surface ) {

			const re = /<coordinate(.*?)<\/coordinate>/gi;
			const coordinatesText = surface.match( re );
			const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
				.map( txt => Number( txt ) );

			return coordinates;

		}

};



SGT.getSurfacesAttributesByIndex = function( indexes, id = 1 ) {

	indexes = Array.isArray( indexes ) ? indexes : [ indexes ];
	//console.log( 'indexes', indexes );

	const parser = new DOMParser();

	const htmArray = indexes.map( ( index ) => {

		const surfaceXml = parser.parseFromString( SGT.surfaces[ index ], "application/xml").documentElement;
		//console.log( 'surfaceXml', surfaceXml );

		const htmAttributes = SGT.getSurfaceAttributes( surfaceXml, id );
		//console.log( 'htmAttributes', htmAttributes );

		return htmAttributes;


	} );

	return htmArray;

};



SGT.getSurfaceAttributes = function( surfaceXml, index ) {
	//console.log( 'surfaceXml', surfaceXml );

	const htmSurface = SGT.getAttributesHtml( surfaceXml );
	const htmAdjacentSpace = SGT.getAttributesAdjacentSpace( surfaceXml );
	const htmPlanarGeometry = SGT.getAttributesPlanarGeometry( surfaceXml );

	const rect = surfaceXml.getElementsByTagName( "RectangularGeometry" )[ 0 ];
	//console.log( '', rect );
	const htmRectangularGeometry = SGT.getAttributesHtml( rect );

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



SGT.getAttributesHtml = function( obj ) {
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

			//constructions = SGT.text.match( /<Construction(.*?)<\/Construction>/gi );

			// silly way of doing things, but it's a start
			const parser = new DOMParser();
			const campusXml = parser.parseFromString( SGT.text, "application/xml").documentElement;
			//SGT.campusXml = campusXml;
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



SGT.getAttributesAdjacentSpace = function( surfaceXml ){

	const adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		SGT.adjacentSpaceIds = [];
		SGT.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const spaceId2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		const spaceText1 = SGT.spaces.find( item => item.includes( spaceId1 ) );
		//console.log( 'spaceText1', spaceText1 );
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		const spaceText2 = SGT.spaces.find( item => item.includes( spaceId2 ) );
		//console.log( 'spaceText2', spaceText2 );
		const spaceName2 = spaceText2.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		SGT.adjacentSpaceIds = [ spaceId1, spaceId2 ];

		SGT.setAttributesStoreyAndZone( spaceId2 );

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
		SGT.adjacentSpaceIds = [ spaceId ];

		const spaceText1 = SGT.spaces.find( item => item.includes( spaceId ) );
		//console.log( 'spaceText1', spaceText1 );
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		SGT.setAttributesStoreyAndZone( spaceId );

		htm =
		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId } / ${ spaceName1 }</span>
		</div>`;

	}

	return htm;

};



SGT.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = SGT.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	const storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ );
	//console.log( 'storeyId', SGT.storeyId[ 1 ] );

	SGT.storeyId = storeyId ? storeyId[ 1 ] : [];
	//console.log( 'storeyId', SGT.storeyId[ 1 ] );

	const storeyText = SGT.storeys.find( item => item.includes( SGT.storeyId ) );
	//console.log( 'storeyText', storeyText );

	const storeyName = storeyText ? storeyText.match ( '<Name>(.*?)</Name>' ) : "";

	SGT.storeyName = storeyName ? storeyName[ 1 ] : "no storey name in file";
	//console.log( 'SGT.storeyName', SGT.storeyName );

	SGT.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ );

	if ( SGT.zoneId ) {

		SGT.zoneId = SGT.zoneId[ 1 ];
		//console.log( 'zoneId', SGT.zoneId[ 1 ] );

		const zoneText = SGT.zones.find( item => item.includes( SGT.zoneId ) );
		//console.log( 'storeyText', zoneText );

		SGT.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
		//console.log( 'SGT.zoneName', SGT.zoneName );

	} else {

		SGT.zoneName = "None";

	}


};




SGT.getAttributesPlanarGeometry = function( surfaceXml ) {

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


