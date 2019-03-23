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

	divContents.innerHTML = thing.innerHTML;

	SGTh1FileName.innerHTML = `File: ${ decodeURI( FIL.name ) }`;
	
	SGT.text = FIL.text.replace( /\r\n|\n/g, '' );
	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGT.surfaces', SGT.surfaces );


	//SGT.setFixes();

};


SGT.setFixes = function() {

	divContents.innerHTML =
		`
			<br><br>

			<h3>Check file: ${ decodeURI( FIL.name ) } </h3>

			<!--
			<div>${ SGT.getStats() }</div>

			<div>${ SGT.getCheckGeneral() }</div>

			<div id=FXdivCheckOffset >${ SGT.getCheckOffset() }</div>

			<div id=FXMdivMetaData >${ FXM.checkMetaData() }</div>

			<div id=FXSTIdivTypeInvalid>${ FXSTI.getCheckSurfaceTypeInvalid() }</div>

			<div id=FXDPCdivDuplicatePlanar >${ SGT.getCheckDuplicatePlanarCoordinates() }</div>

			<div id=FXASEdivSpaceExtra >${ SGT.getFixAdjacentSpaceExtra() }</div>

			<div id=FXASDdivSpaceDuplicate >${ SGT.getFixAdjacentSpaceDuplicate() }</div>

			<div id=FXCIMdivIdMissing >${ SGT.getFixCadIdMissing() }</div>
			-->

			<br>

			<h1 onclick=navMenu.scrollTop=0; style=cursor:pointer;text-align:center; title="go to top of menu" >
				<img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=18 >
			</h1>
		`;

		console.log( '', 23 );
};



////////// utilities

SGT.xxxgetSurfacesAttributesByIndex = function( indexes ) {

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

	indexes = Array.isArray( indexes ) ? indexes : [ indexes ];

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