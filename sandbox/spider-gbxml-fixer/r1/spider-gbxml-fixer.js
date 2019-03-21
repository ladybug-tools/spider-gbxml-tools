//Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals FIL, divContents */

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

	SGT.text = FIL.text.replace( /\r\n|\n/g, '' );
	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGT.surfaces', SGT.surfaces );

	SGT.setChecks();

};



SGT.setChecks = function() {

	divContents.innerHTML =
		`
			<br><br>

			<h3>Check file: ${ decodeURI( FIL.name ) } </h3>

			<div>${ SGT.getStats() }</div>

			<div>${ SGT.getCheckGeneral() }</div>

			<div>${ SGT.getCheckOffset() }</div>

			<div id=FXMdivMetaData >${ FXM.checkMetaData() }</div>

			<div id=FXSTIdivTypeInvalid>${ FXSTI.getCheckSurfaceTypeInvalid() }</div>

		`;


	SGT.checkDuplicatePlanarCoordinates();

	SGT.checkAdjacentSpaceExtra();

	SGT.checkAdjacentSpaceDuplicate();

	SGT.checkCadIdMissing();

	divContents.innerHTML +=

	`<div id=divFooter >
		See also <a href="http://SGTml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html" target="_blank">Schema GreenBuildingXML_Ver6.01.xsd </a>
	</div>`;

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

	const htm =
	`
		<div>Spaces: ${ SGT.spaces.length.toLocaleString() } </div>
		<div>Storeys: ${ SGT.storeys.length.toLocaleString() } </div>
		<div>Zones: ${ SGT.zones.length.toLocaleString() } </div>
		<div>Surfaces: ${ SGT.surfaces.length.toLocaleString() } </div>
		<div>Coordinates in surfaces: ${ count.toLocaleString() } </div>
	`;


	statsHtm = SGT.getItemHtm( {
		summary: `File Statistics`,
		description: `SGTML elements statistics`,
		contents: `${ htm }`,
		timeStart: timeStart
	} );


	function getVertices( surface ) {

		const re = /<coordinate(.*?)<\/coordinate>/gi;
		const coordinatesText = surface.match( re );
		const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
			.map( txt => Number( txt ) );

		return coordinates;

	};

	return statsHtm;
};



SGT.getCheckGeneral = function() {

	const timeStart = performance.now();
	let htm = "";

	if ( SGT.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16 and supports double byte characters.
				The file is twice the size of a utf-8 file. This may be unnecessary.
			</p>

		`;
	}

	let area =  SGT.text.match( /<Area(> <|><|>0<?)\/Area>/gi );
	area ? area.length : 0;
	//console.log( 'area', area );

	htm +=
	`
		<p>
			Area = 0: ${ area } found
		</p>
	`;


	let vol = SGT.text.match( /<volume(> <|><|>0<?)\/volume>/gi );
	vol = vol ? vol.length : 0;

	htm  +=
	`
		<p>
			Volume = 0: ${ vol } found
		</p>
	`;

	let string = SGT.text.match( /""/gi );
	string = string ? string.length : 0;

	htm  +=
	`
		<p>
			String = "": ${ string } found
		</p>
	`;

	//divContents.innerHTML += htm;

	const errors = area + vol + string;

	generalHtm = SGT.getItemHtm( {
		open: errors > 0 ? "open" : "",
		summary: `General Check - ${ errors } found`,
		description: `check for elements with no values`,
		contents: `${ htm }`,
		timeStart: timeStart
	} );

	return generalHtm;
};



SGT.getCheckOffset = function() {

	const timeStart = performance.now();
	let max = 0;

	FIL.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );



	offsetHtm = SGT.getItemHtm( {
		open: max > 100000 ? "open" : "",
		summary: `Maximum offset from Origin - ${ max.toLocaleString() }`,
		 description: "Largest distance - x, y, or x - from 0, 0, 0",
		contents: `Largest coordinate found: ${ max.toLocaleString() }`,
		timeStart: timeStart
	} );

	return offsetHtm

};





SGT.vvvvgetCheckSurfaceTypeInvalid = function() {

	const timeStart = performance.now();

	const surfacesTypeInvalid = SGT.surfaces.filter( surface => {

			const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

			return SGT.surfaceTypes.includes( surfaceType ) === false;

		} )
		.map( surface => SGT.surfaces.indexOf( surface ) );

	//console.log( 'surfacesTypeInvalid', surfacesTypeInvalid);

/*
	let tilt;

	surfacesTypeInvalid.forEach( surface => {

		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

		htm += `id: ${ id } - Name: ${ name } - CADObjectId: ${ cadId }<br>
		tilt: ${ tilt }<br>
		surface type provided: ${ surfaceType }`;

	} )

	if ( tilt &&  tilt === "180" ) {

		selectedIndex = 3;

	}
*/
	let selectedIndex = 0;
	const options = SGT.surfaceTypes.map( ( type, index ) => {

		const selected = index === selectedIndex ? "selected" : "";
		return `<option ${ selected } >${ type }</option>`;

	} ).join( "" );

	const sel = `Select new surface type <select id=selSurfaceType >${ options }</select> <button onclick=alert("Coming-soon"); >update</button>`;

	const invalidTypeHtm = SGT.getItemHtm( {

		open: surfacesTypeInvalid.length > 0 ? "open" : "",
		summary: `Surfaces with Invalid Surface Type - ${ surfacesTypeInvalid.length} found`,
		description:
		`
			A surface type was supplied that is not one of the following: ${ SGT.surfaceTypes.join( ', ' ) }`,
			contents: `${ surfacesTypeInvalid.length.toLocaleString() } invalid surface types found<br>
			${ SGT.getSurfacesAttributesByIndex( surfacesTypeInvalid ) }
			${ sel }<br>
		`,
		timeStart: timeStart

	} );

	return invalidTypeHtm;

};



SGT.checkDuplicatePlanarCoordinates = function() {

	const timeStart = performance.now();
	const planes = [];

	for ( let surface of SGT.surfaces ) {

		const arr = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ );

		if ( arr ) { planes.push( arr[ 1 ] ); }

	}

	const duplicates = [];

	planes.forEach( ( plane1, index1 ) => {

		const planesRemainder = planes.slice( index1 + 1 );

		planesRemainder.forEach( ( plane2, index2 ) => {

			if ( plane1 === plane2 ) {

				duplicates.push( index1, ( planes.length - planesRemainder.length ) );

			}

		} );

	} );
	//console.log( 'duplicates', duplicates );

	duplicatesData = SGT.getSurfacesAttributesByIndex( duplicates );

	//console.log( 'duplicatesData', duplicatesData );

	htm = duplicatesData.map( ( item, index ) =>  {

		return item + `<button onclick=confirm("coming-soon"); >delete</button>${ ( ( index + 1 ) % 2 === 0 ? "<hr>" : "<br>" ) }`;

	} ).join( "");

	SGT.addItem( {
		open: duplicates.length > 0 ? "open" : "",
		summary: `Surfaces with Duplicate Planar Coordinates - ${ duplicates.length} found`,
		description: `Two surfaces with identical vertex coordinates for their planar geometry`,
		contents:
		`
			${ ( duplicates.length / 2 ).toLocaleString() } sets found<br>
			${ htm }
		`,
		timeStart: timeStart
	} );

};



SGT.checkAdjacentSpaceExtra = function() {

	const timeStart = performance.now();
	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
		'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	const invalidAdjacentSpaceExtra = [];

	const surfaces = SGT.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		const surfaceType = surface.match ( /surfaceType="(.*?)"/ )[ 1 ];
		const adjacentSpaceArr = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( oneSpace.includes( surfaceType ) && adjacentSpaceArr && adjacentSpaceArr.length > 1 ) {

			//const spaces = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
			//console.log( 'spaces', spaces );

			invalidAdjacentSpaceExtra.push( i );

		} else if ( surfaceType === "Shade" && adjacentSpaceArr > 0 ) {

			//console.log( 'Shade with adjacent space found', 23 );

			invalidAdjacentSpaceExtra.push( i );

		}

	}

	htm = SGT.getSurfacesAttributesByIndex( invalidAdjacentSpaceExtra ).map( item => {

		return item + `<button onclick=confirm("coming-soon"); >delete extra adjacent space</button><hr>`;

	} ).join( "" );

	SGT.addItem( {
		open: invalidAdjacentSpaceExtra.length > 0 ? "open" : "",
		summary: `Surfaces with a Extra Adjacent Space - ${ invalidAdjacentSpaceExtra.length } found`,
		description: `Exterior surfaces that normally take a single adjacent space that are found to have two`,
		contents:
			`
			${ invalidAdjacentSpaceExtra.length.toLocaleString() } found
			${ htm }
			`,
		timeStart: timeStart
	} );

};



SGT.checkAdjacentSpaceDuplicate = function() {

	const timeStart = performance.now();
	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	const invalidAdjacentSpaceDuplicate = [];

	SGT.surfaces.forEach( ( surface, index ) => {

		const spaceIdRef = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRef && spaceIdRef.length && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) {
			//console.log( 'spaceIdRef', spaceIdRef );

			const surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			if ( twoSpaces.includes( surfaceType ) ) {

				invalidAdjacentSpaceDuplicate.push( index );

			}

		}

	} );


	const htm = SGT.getSurfacesAttributesByIndex( invalidAdjacentSpaceDuplicate ).map( item => {

		return item + `<button onclick=confirm("coming-soon"); >fix adjacent space</button><hr>`;

	} ).join( "" );

	SGT.addItem( {
		open: invalidAdjacentSpaceDuplicate.length > 0 ? "open" : "",
		summary: `Surfaces with Duplicate Adjacent Spaces - ${ invalidAdjacentSpaceDuplicate.length} found`,
		description: `Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space`,
		contents:
		`
			${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found<br>
			${ htm }
		`,
		timeStart: timeStart
	} );

};



SGT.checkCadIdMissing = function() {

	const timeStart = performance.now();
	let noId = [];

	SGT.surfaces.forEach( ( surface, index ) => {

		const cadId = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		if ( !cadId ){ noId.push( index ) }

	} );


	htm = SGT.getSurfacesAttributesByIndex( noId ).map( item => {

		return `<br>${ item }
			CAD Object ID <input style=width:30rem; > <button onclick=alert("Coming-soon"); >update</button>`;

	} );

	SGT.addItem( {
		open: noId.length > 0 ? "open" : "",
		summary: `Missing CAD Object ID - ${ noId.length} found`,
		description: `The CADObjectId Element is used to map unique CAD object identifiers to SGTML elements. Allows CAD/BIM tools to read results from a SGTML file and map them to their CAD objects.`,
		contents:
		`
			Surfaces with no CAD Object ID: ${ noId.length.toLocaleString() }<br>
				${ htm.join( "" ) }
		`,
		timeStart: timeStart
	} );

};




////////// utilities

SGT.getSurfacesAttributesByIndex = function( indexes ) {

	const htmArray = indexes.map( index => {

		const surface = SGT.surfaces[ index ];
		const id = surface.match( /id="(.*?)"/i )[ 1 ];
		const name = surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
		const cadIdMatch = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/i )
		const cadId = cadIdMatch ? cadIdMatch[ 1 ] : "none";
		const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];
		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

		return `
				id: ${ id }<br>
				Name: ${ name }<br>
				CADObjectId: ${ cadId }<br>
				Surface type: ${ surfaceType }<br>
				tilt: ${ tilt }<br>
		`;

	} );

	return htmArray;

};


SGT.getSurfacesAttributesByIndex = function( indexes ) {

	const parser = new DOMParser();

	const htmArray = indexes.map( ( index, count ) => {

		const surfaceXml = parser.parseFromString( SGT.surfaces[ index ], "application/xml").documentElement;
		//console.log( 'surfaceXml', surfaceXml );

		const htmAttributes = SGT.getSurfaceAttributes( surfaceXml, count );
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
		<div><b>Selected Surface #${ index + 1 }</b><br>Attributes:</div>
		${ htmSurface }

		<details>
			<summary> AdjacentSpace</summary>
			<p> ${ htmAdjacentSpace }
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
			parser = new DOMParser();
			const campusXml = parser.parseFromString( SGT.text, "application/xml").documentElement;
			//SGT.campusXml = campusXml;
			//console.log( 'campusXml', campusXml.attributes );

			constructions = Array.from( campusXml.getElementsByTagName( 'Construction' ) );
			construction = constructions.find( item => item.id === attribute.value )
			//console.log( 'construction', construction);

			xmlText = new XMLSerializer().serializeToString( construction );
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

		SGT.adjacentSpaceId = [];
		SGT.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const space1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const space2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		SGT.adjacentSpaceId = [ space1, space2 ];

		SGT.setAttributesStoreyAndZone( space2 );

		htm =
		`
			<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ space1 }</span>
			</div>
			<div>
				<span class=attributeTitle >spaceIdRef 2:</span>
				<span class=attributeValue >${ space2 }</span>
			</div>
		`;

	} else {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		SGT.adjacentSpaceId = [ spaceId];

		SGT.setAttributesStoreyAndZone( spaceId );

		htm =

		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId }</span>
		</div>`;

	}

	return htm;

};

SGT.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = SGT.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ )
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



SGT.addItem = function( item ) {

	divContents.innerHTML +=
	`
		<details ${ item.open } >

			<summary class=sumHeader>${ item.summary }</summary>

			<div><i>${ item.description }</i></div>

			<p>${ item.contents }</p>

			<p>Time to check: ${ ( performance.now() - item.timeStart ).toLocaleString() }</p>

			<hr>

		</details>
	`;

};


SGT.getItemHtm = function( item ) {

	htm =
	`
		<details ${ item.open } >

			<summary class=sumHeader>${ item.summary }</summary>

			<div><i>${ item.description }</i></div>

			<p>${ item.contents }</p>

			<p>Time to check: ${ ( performance.now() - item.timeStart ).toLocaleString() }</p>

			<hr>

		</details>
	`;

	return htm;

};


/*

	SGT.addItem( {
		summary: ``,
		description: ``,
		contents: `${ .toLocaleString() } out of ${ .length.toLocaleString() }`
	} );

*/