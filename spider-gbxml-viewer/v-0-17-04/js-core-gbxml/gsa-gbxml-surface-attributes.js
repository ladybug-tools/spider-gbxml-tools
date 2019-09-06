/* globals GBX, PIN, divDragMoveContent */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const GSA = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-07-15",
	"description": "Display all possible data for a surface",
	"helpFile": "https://www.ladybug.tools/spider-gbxml-fixer/r0-4-0/gsa-get-surface-attributes/README.md",
	"version": "0.17.03-0gsa"

};



GSA.getSurfacesAttributesByIndex = function ( indexes, id = 1 ) {

	indexes = Array.isArray( indexes ) ? indexes : [ indexes ];
	//console.log( 'indexes', indexes );

	GSA.selectedSurfacesFocus( indexes[ 0 ] );

	const parser = new DOMParser();

	const htmArray = indexes.map( ( index ) => {

		const surfaceXml = parser.parseFromString( GBX.surfaces[ index ], "application/xml" ).documentElement;
		//console.log( 'surfaceXml', surfaceXml );

		const htmAttributes = GSA.getSurfaceAttributes( surfaceXml, id, indexes[ 0 ] );
		//console.log( 'htmAttributes', htmAttributes );

		return htmAttributes;

	} );

	return htmArray;

};



GSA.selectedSurfacesFocus = function( index ) {
/*
	THR.scene.remove( PIN.line, PIN.particle );

	PIN.intersected = GBX.meshGroup.children[ index ];
	//console.log( 'PIN.intersected', PIN.intersected );

	divDragMoveContent.innerHTML = PIN.getIntersectedDataHtml();

	divDragMoveFooter.innerHTML = POPF.footer;

	navDragMove.hidden = false;
 */
	PIN.setIntersected( GBX.meshGroup.children[ index ] )

	const surface = GBX.surfaces[ index ];

	GBXU.sendSurfacesToThreeJs( [ surface ] );

};



GSA.getSurfaceAttributes = function( surfaceXml, id, index ) {
	//console.log( 'surfaceXml', surfaceXml, id, index );

	const htmSurface = GSA.getAttributesHtml( surfaceXml );
	const htmAdjacentSpace = GSA.getAttributesAdjacentSpace( surfaceXml );
	const htmPlanarGeometry = GSA.getAttributesPlanarGeometry( surfaceXml );

	const rect = surfaceXml.getElementsByTagName( "RectangularGeometry" )[ 0 ];
	//console.log( '', rect );

	const htmRectangularGeometry = GSA.getAttributesHtml( rect );

	GSA.htmConstruction = GSA.getAttributesConstruction( surfaceXml );

	const htmOpenings = GSA.getAttributesOpenings( surfaceXml );

	const htm =
	`
		<div><b>${ id } - Selected Surface Attributes</b></div>

		<p>
			${ htmSurface }
		</p>

		<details>
			<summary>Adjacent Spaces: ${ GSA.adjacentSpaceIds.length }x</summary>
			${ htmAdjacentSpace }
		</details>

		<details>
			<summary>Planar Geometry </summary>
			${ htmPlanarGeometry }
		</details>

		<details>
			<summary>Rectangular Geometry </summary>
			<div>${ htmRectangularGeometry } </div>
		</details>

		<details id=GSAdetOpenings >
			<summary>Openings: ${ GSA.openings.length }x</summary>
			<div>${ htmOpenings } </div>
		</details>

		<details>
			<summary>Construction (${ GSA.htmConstruction ? "yes" : "none" })</summary>
			<div>${ GSA.htmConstruction } </div>
		</details>

		<details>
			<summary>gbXML Text </summary>
			<textarea style=height:15rem;width:100%; >${ GBX.surfaces[ index ] }</textarea>
		</details>

	`;

	return htm;

};



GSA.getAttributesHtml = function( obj ) {
	//console.log( 'obj', obj );

	let htm = "";

	if ( !obj ) { return htm; }

	for ( let attribute of obj.attributes ) {
		//console.log( 'attribute', attribute );

		htm +=
		`<div>
			<span class=attributeTitle >${ attribute.name }</span>:
			<span class=attributeValue >${ attribute.value }</span>
		</div>`;

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



GSA.getAttributesAdjacentSpace = function ( surfaceXml ){

	const adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		GSA.adjacentSpaceIds = [];
		GSA.storey = '';
		GSA.spaceNames = [];

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const spaceId2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		const spaceText1 = GBX.spaces.find( item => item.includes( spaceId1 ) );
		//console.log( 'spaceText1', spaceText1 );
		if ( !spaceText1  ) { return ""; }

		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		const spaceText2 = GBX.spaces.find( item => item.includes( spaceId2 ) );
		if ( !spaceText2  ) { return ""; }

		//console.log( 'spaceText2', spaceText2 );
		const spaceName2 = spaceText2.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		GSA.adjacentSpaceIds = [ spaceId1, spaceId2 ];
		GSA.spaceNames = [ spaceName1, spaceName2 ];

		GSA.setAttributesStoreyAndZone( spaceId2 );

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
		GSA.adjacentSpaceIds = [ spaceId ];

		const spaceText1 = GBX.spaces.find( item => item.includes( spaceId ) );
		//console.log( 'spaceText1', spaceText1 );

		if ( !spaceText1  ) { return ""; }

		let spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i );
		spaceName1 = spaceName1 ? spaceName1[ 1 ] : "";

		GSA.spaceNames = [ spaceName1 ];
		GSA.setAttributesStoreyAndZone( spaceId );

		htm =
		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId } / ${ spaceName1 }</span>
		</div>`;

	}

	return htm;

};



GSA.setAttributesStoreyAndZone = function ( spaceId ) {

	const spaceText = GBX.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	const storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ );
	//console.log( 'storeyId', GSA.storeyId[ 1 ] );

	GSA.storeyId = storeyId ? storeyId[ 1 ] : [];
	//console.log( 'storeyId', GSA.storeyId[ 1 ] );

	const storeyText = GBX.storeys.find( item => item.includes( GSA.storeyId ) );
	//console.log( 'storeyText', storeyText );

	const storeyName = storeyText ? storeyText.match ( '<Name>(.*?)</Name>' ) : "";

	GSA.storeyName = storeyName ? storeyName[ 1 ] : "no storey name in file";
	//console.log( 'GSA.storeyName', GSA.storeyName );

	GSA.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ );

	if ( GSA.zoneId ) {

		GSA.zoneId = GSA.zoneId[ 1 ];
		//console.log( 'zoneId', GSA.zoneId[ 1 ] );

		const zoneText = GBX.zones.find( item => item.includes( GSA.zoneId ) );
		//console.log( 'storeyText', zoneText );

		GSA.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
		//console.log( 'GSA.zoneName', GSA.zoneName );

	} else {

		GSA.zoneName = "None";

	}

};



GSA.getAttributesPlanarGeometry = function ( surfaceXml ) {

	const plane = surfaceXml.getElementsByTagName( 'PlanarGeometry' );

	const points = plane[ 0 ].getElementsByTagName( 'Coordinate' );
	//console.log( 'points', points );

	let htm = '';
	for ( let i = 0; i < points.length; ) {

		//console.log( 'points', points );

		htm +=
		`
			<div>${ 1 + i / 3 }. <span class=attributeTitle >CartesianPoint:</span></div>
			&nbsp;
			<span class=attributeTitle >x:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >y:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >z:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span><br>
		`;

	}

	return htm;

};



GSA.getAttributesOpenings = function ( surfaceXml ) {

	GSA.openings = surfaceXml.getElementsByTagName( "Opening" );
	// console.log( 'openings', openings );

	let htm = ``;

	Array.from( GSA.openings ).forEach( (opening, index ) => {

		const rect = opening.getElementsByTagName( "RectangularGeometry" )[ 0 ];
		//console.log( '', rect );

		const htmRectangularGeometry = GSA.getAttributesHtml( rect );

		htm +=
		`<div id=GSAdivOpening${ index } >
			${ index + 1 } ${ GSA.getAttributesHtml( opening )} ${ htmRectangularGeometry }
		</div>`;

	} );

	return htm;

};



GSA.getAttributesConstruction = function ( surfaceXml ) {
	//console.log( 'surfaceXml', surfaceXml );

	const constructionId = surfaceXml.getAttribute( "constructionIdRef" );
	//console.log( 'constructionId', constructionId );

	// silly way of doing things, but it's a start
	const parser = new DOMParser();
	const campusXml = parser.parseFromString( GBX.text, "application/xml" ).documentElement;
	//console.log( 'campusXml', campusXml.attributes );

	const constructions = Array.from( campusXml.getElementsByTagName( 'Construction' ) );
	//console.log( 'constructions', constructions);

	const construction = constructions.find( item => item.id === constructionId );
	//console.log( 'construction', construction );

	const htm = GSA.getAttributesHtml( construction );

	return htm;

};