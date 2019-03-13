

const SGT = {}

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
		<h3>General Check</h3>
	`;


	SGT.setSurfaces();

}


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

};




SGT.generalCheck = function() {

	let htm = ""

	if ( GBX.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16
			</p>
		`;
	}

	const area =  GBX.text.match( /<area>[0\s]<\/area>/gi );

	htm +=
	`
		<p>
			Area = 0: ${ area ? area.length : 0 } found
		</p>
	`;


	const vol = GBX.text.match( /<volume>[0\s]<\/volume>/gi )

	htm  +=
	`
		<p>
			Volume = 0: ${ vol? vol.length : 0 } found
		</p>
	`;

	const string = GBX.text.match( /""/gi )

	htm  +=
	`
		<p>
			String = "": ${ string? string.length : 0 } found
		</p>
	`;

	divContents.innerHTML += htm;

}



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

	for ( let attribute of Object.keys( metadataValues ) ){
		//console.log( 'attribute', attribute );

		if ( GBX.text.includes( attribute) ) {

			attributesProvided.push( attribute );

		} else {

			attributesMissing.push( attribute );

		}

	}

	divContents.innerHTML +=
	`
		<p>
			Attributes provided: ${ attributesProvided.length.toLocaleString() } found<br>
			Attributes missing: ${ attributesMissing.length.toLocaleString() } found<br>
		</p>
	`;


};




SGT.checkSurfaceTypeInvalid = function() {

	const surfaceTypeInvalid = [];

	for ( surface of GBX.surfaces ) {

		const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

		if ( GBX.surfaceTypes.includes( surfaceType ) === false ) {

			surfaceTypeInvalid.push( surface );

		}

	}

	divContents.innerHTML +=
	`
		<p>
			Surfaces with invalid surface type: ${ surfaceTypeInvalid.length.toLocaleString() } found
		</p>
	`;

}



SGT.checkDuplicatePlanarCoordinates = function() {

	const planes = [];

	for ( let surface of GBX.surfaces ) {

		const arr = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ );

		if ( arr ) { planes.push( arr[ 1 ] ) }

	}

	duplicates = [];

	planes.forEach( ( plane1, index1 ) => {

		const planesRemainder = planes.slice( index1 + 1 );

		planesRemainder.forEach( ( plane2, index2 ) => {

			if ( plane1 === plane2 ) {

				duplicates.push( index1, ( planes.length - planesRemainder.length ) );

			}

		} );

	} );

	divContents.innerHTML +=
	`
		<p>
			Surfaces with duplicate planar coordinates: ${ ( duplicates.length / 2 ).toLocaleString() } found
		</p>
	`;

};



SGT.checkAdjacentSpaceExtra = function() {


	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
		'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	invalidAdjacentSpaceExtra = [];

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

	divContents.innerHTML +=
	`
		<p>
			Surfaces with extra adjacent space: ${ invalidAdjacentSpaceExtra.length.toLocaleString() } found
		</p>
	`;

};



SGT.checkAdjacentSpaceDuplicate = function() {


	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	const invalidAdjacentSpaceDuplicate = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		spaceIdRef = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRef && spaceIdRef.length && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) {
			//console.log( 'spaceIdRef', spaceIdRef );

			surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			if ( twoSpaces.includes( surfaceType ) ) {

				invalidAdjacentSpaceDuplicate.push( index );

			} else {

				//console.log( 'surfaceType', surfaceType );

			}

		}

	} );

	divContents.innerHTML +=
	`
		<p>
			Surfaces with duplicate adjacent space: ${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found
		</p>
	`;
};



SGT.checkCadIdMissing = function() {

	let noId = 0;

	for ( let surface of GBX.surfaces ) {

		const cadId = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		if ( !cadId ){ noId ++; }

	}

	divContents.innerHTML +=
	`
		<p>
			Surfaces with no CAD Object ID: ${ noId.toLocaleString() } out of ${ GBX.surfaces.length.toLocaleString() }
		</p>
	`;

};





SGT.checkOffset = function() {

	const coords = FIL.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi );

	//console.log( 'coords', coords );

	let max = 0;

	const numbers = coords.forEach ( coord => {

		const numb = Number( coord.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );

		max = numb > max ? numb : max;

		return max;

	} );

	//console.log( 'numbers', max);

	divContents.innerHTML +=
	`
		<p>
			Largest coordinate found: ${ max.toLocaleString() }
		</p>
	`;



}