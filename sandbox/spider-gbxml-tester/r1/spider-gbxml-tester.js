//Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals FIL, divContents */

const SGT = {};

let GBX = {};

GBX.colorsDefault = {

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

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // create working copy of default colors

GBX.surfaceTypes = Object.keys( GBX.colors );


SGT.setGeneralCheck = function() {

	divContents.innerHTML =
	`
	<br><br>

		<h3>Check: ${ FIL.name } </h3>
	`;


	SGT.setSurfaces();

};



SGT.setSurfaces = function() {

	GBX.text = FIL.text.replace( /\r\n|\n/g, '' );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'GBX.surfaces', GBX.surfaces );

	SGT.generalCheck();

	SGT.checkMetaData();

	SGT.checkSurfaceTypeInvalid();

	SGT.checkDuplicatePlanarCoordinates();

	SGT.checkAdjacentSpaceExtra();

	SGT.checkAdjacentSpaceDuplicate();

	SGT.checkCadIdMissing();

	SGT.checkOffset();

	divContents.innerHTML +=

	`<div id=divFooter >
		See also <a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html" target="_blank">Schema GreenBuildingXML_Ver6.01.xsd </a>
	</div>`;

};





SGT.generalCheck = function() {

	let htm = "";

	if ( GBX.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16
			</p>
		`;
	}

	const area =  GBX.text.match( /<Area(> <|><|>0<?)\/Area>/gi );

	console.log( 'area', area );
	htm +=
	`
		<p>
			Area = 0: ${ area ? area.length : 0 } found
		</p>
	`;


	const vol = GBX.text.match( /<volume(> <|><|>0<?)\/volume>/gi );

	htm  +=
	`
		<p>
			Volume = 0: ${ vol? vol.length : 0 } found
		</p>
	`;

	const string = GBX.text.match( /""/gi );

	htm  +=
	`
		<p>
			String = "": ${ string? string.length : 0 } found
		</p>
	`;

	//divContents.innerHTML += htm;

	SGT.addItem( {
		summary: `General Check`,
		description: ``,
		contents: `${ htm }`
	} );

};



SGT.checkMetaData = function() {

	const metadataValues = {

		'areaUnit': 'SquareMeters',
		'lengthUnit': 'Meters',
		'temperatureUnit': 'C',
		'useSIUnitsForResults': 'true',
		'version': '0.37',
		'volumeUnit': 'CubicMeters',
		'xmlns': 'http://www.gbxml.org/schema'
	};


	const attributesProvided = [];
	const attributesMissing = [];
	const keys = Object.keys( metadataValues );

	for ( let attribute of keys ){
		//console.log( 'attribute', attribute );

		if ( GBX.text.includes( attribute) ) {

			attributesProvided.push( attribute );

		} else {

			attributesMissing.push( attribute );

		}

	}

	SGT.addItem( {
		summary: `Invalid Metadata`,
		description: `Seven types of attributes are required: ${ keys.join( ', ' ) }`,
		contents:
		`
		Attributes provided: ${ attributesProvided.length.toLocaleString() } found<br>
		Attributes missing: ${ attributesMissing.length.toLocaleString() } found<br>
		`
	} );

};




SGT.checkSurfaceTypeInvalid = function() {

	const surfaceTypeInvalid = [];

	for ( let surface of GBX.surfaces ) {

		const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

		if ( GBX.surfaceTypes.includes( surfaceType ) === false ) {

			surfaceTypeInvalid.push( surface );

		}

	}

	SGT.addItem( {
		summary: `Surfaces with Invalid Surface Type`,
		description: `A surface type was supplied that is not one of the following: ${ GBX.surfaceTypes.join( ', ' ) }`,
		contents: `${ surfaceTypeInvalid.length.toLocaleString() } found`
	} );

};



SGT.checkDuplicatePlanarCoordinates = function() {

	const planes = [];

	for ( let surface of GBX.surfaces ) {

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

	SGT.addItem( {
		summary: `Surfaces with Duplicate Planar Coordinates`,
		description: `Two surfaces with identical vertex coordinates for their planar geometry`,
		contents: `${ ( duplicates.length / 2 ).toLocaleString() } found`
	} );


};



SGT.checkAdjacentSpaceExtra = function() {

	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
		'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	const invalidAdjacentSpaceExtra = [];

	const surfaces = GBX.surfaces;

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

	SGT.addItem( {
		summary: `Surfaces with a Extra Adjacent Space`,
		description: `Exterior surfaces that normally take a single adjacent space that are found to have two`,
		contents: `${ invalidAdjacentSpaceExtra.length.toLocaleString() } found`
	} );

};



SGT.checkAdjacentSpaceDuplicate = function() {

	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	const invalidAdjacentSpaceDuplicate = [];

	GBX.surfaces.forEach( ( surface, index ) => {

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


	SGT.addItem( {
		summary: `Surfaces with Duplicate Adjacent Spaces`,
		description: `Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space`,
		contents: `${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found`
	} );

};



SGT.checkCadIdMissing = function() {

	let noId = 0;

	for ( let surface of GBX.surfaces ) {

		const cadId = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		if ( !cadId ){ noId ++; }

	}

	SGT.addItem( {
		summary: "Missing CAD Object ID",
		description: `The CADObjectId Element is used to map unique CAD object identifiers to gbXML elements. Allows CAD/BIM tools to read results from a gbXML file and map them to their CAD objects.`,
		contents: `Surfaces with no CAD Object ID: ${ noId.toLocaleString() } out of ${ GBX.surfaces.length.toLocaleString() }`
	} );

};



SGT.checkOffset = function() {

	let max = 0;

	FIL.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );

	SGT.addItem( {
		summary: "Offset from Origin", description: "Largest distance - x, y, or x - from 0, 0, 0",
		contents: `Largest coordinate found: ${ max.toLocaleString() }`
	} );

};



SGT.addItem = function( item ) {

	divContents.innerHTML +=
	`
		<details open >

			<summary>${ item.summary }</summary>

			<div><i>${ item.description }</i></div>

			<p>${ item.contents }</p>

			<hr>

		</details>
	`;

};



/*

	SGT.addItem( {
		summary: ``,
		description: ``,
		contents: `${ .toLocaleString() } out of ${ .length.toLocaleString() }`
	} );

*/