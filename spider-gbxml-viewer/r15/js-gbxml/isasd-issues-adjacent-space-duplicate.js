// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, divPopUpData */
/* jshint esversion: 6 */


const ISASD = { "release": "R15.9", "date": "2018-12-26" };

ISASD.twoSpaces = ['Air', 'InteriorWall', 'InteriorFloor', 'Ceiling' ];
ISASD.source = "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/lib/isasd-issues-adjacent-space-duplicate.js";

ISASD.currentStatus =
	`
		<aside>

			<details>

				<summary>ISASD ${ ISASD.release} status ${ ISASD.date }</summary>

				<p>This module is new / in progress.</p>

				<p>
					<a href="${ ISASD.source }" >source code</a>
				</p>
				<p>

					<ul>
						<li>2019-02-26 ~ r15.0 ~ Allow for no planar geometry</li>
						<li>2018-12-10 ~ Code cleanup</li>
						<li> button</li>
						<li>Add gbxmlUpdateAdjacentSpace button - not working yet</li>

				</p>

				<!--

				2018-12-09 ~ Add more functions
				2018-12-05 ~ Add more functions

				-->
			</details>

		</aside>

		<hr>
	`;



ISASD.getAdjacentSpaceDuplicateCheck = function() {

	if ( ISASDdetAdjacentSpaceDuplicate.open === false && ISCOR.runAll === false ) { return; }

	ISASD.invalidAdjacentSpaceDuplicate = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		spaceIdRef = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRef && spaceIdRef.length && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) {
			//console.log( 'spaceIdRef', spaceIdRef );

			surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			if ( ISASD.twoSpaces.includes( surfaceType ) ) {

				ISASD.invalidAdjacentSpaceDuplicate.push( index );

			} else {

				//console.log( 'surfaceType', surfaceType );
			}

		}

	} );

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASD.invalidAdjacentSpaceDuplicate ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions += `<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;

	}

	ISASDselAdjacentSpaceDuplicate.innerHTML = htmOptions;

	ISASDspnCount.innerHTML = `: ${ ISASD.invalidAdjacentSpaceDuplicate.length.toLocaleString() } found`;

	ISASD.surfaceCoordinates = ISASD.getSurfacesCoordinates();

	ISASD.surfacesInSpaces = ISASD.getSurfacesInSpaces();

	return ISASD.invalidAdjacentSpaceDuplicate.length;

};



ISASD.getSurfacesCoordinates = function() {

	surfaceCoordinates = [];

	GBX.surfaces.forEach( ( surface, index  ) => {

		const points = [];

		const planar = surface.match( /<PlanarGeometry>(.*)<\/PolyLoop>/ );
		//console.log( 'planes', planes );

		if ( !planar ) { return }

		const cartesian = planar[ 1 ].match( /<CartesianPoint>(.*?)<\/CartesianPoint>/g )
		//console.log( 'cartesian', cartesian );

		cartesian.forEach( item => {

			const coordinates = [];
			const coors = item.match( /<Coordinate>(.*?)<\/Coordinate>/g );

			coors.forEach( coordinate => {

				number = coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/ )[ 1 ];
				coordinates.push( number );
				//console.log( 'number', number );

			} );

			points.push( coordinates )
			//console.log( '', coors );

		} );

		surfaceCoordinates.push( points )

	} );
	//console.log( 'ISASD.surfaceCoordinates', ISASD.surfaceCoordinates );

	return surfaceCoordinates;

};



ISASD.getSurfacesInSpaces = function() {

	surfacesInSpaces = [];

	GBX.spaces.forEach ( ( space, index ) => {

		id = space.match( 'id="(.*?)"' )[ 1 ];
		surfacesInSpace = [];

		GBX.surfaces.forEach( ( surface, index  ) => {

			if ( surface.includes( id ) ) {

				surfacesInSpace.push( index );

			}

		} );

		//console.log( index, 'surfacesInSpace', surfacesInSpace );

		surfacesInSpaces.push( { id, index, surfacesInSpace } );

	} );
	//console.log( 'ISASD.surfacesInSpaces', ISASD.surfacesInSpaces );

	return surfacesInSpaces

};



ISASD.getMenuAdjacentSpaceDuplicate = function() {

	// for testing
	//document.body.addEventListener( 'onGbxParse', () => detMenuEdit.open = true , false );

	const htm =
	`<details id="ISASDdetAdjacentSpaceDuplicate" ontoggle=ISASD.getAdjacentSpaceDuplicateCheck(); >

		<summary>Adjacent Space Duplicate<span id="ISASDspnCount" ></span></summary>

		<p>
			Surfaces with two adjacent spaces that are identical
		</p>

		<p>
			<button onclick=ISASD.surfaceArrayShowHide(this,ISASD.invalidAdjacentSpaceDuplicate); >
				Show/hide adjacent space duplicate surfaces
			</button>
		</p>
		<p>
			Select a surface:<br>
			<select id=ISASDselAdjacentSpaceDuplicate onchange=ISASD.selectSurfaceUpdate(this); style=width:100%; size=10 >
			</select>
		</p>

		<div id=ISASDdivAdjacentSpaceDuplicate ></div>

		<p id=ISASDtestCandidates </p>

		<div>${ ISASD.currentStatus }</div>

	</details>`;

	return htm;

};



ISASD.selectSurfaceUpdate = function( select ) {

	//const surfaceId = select.selectedOptions[ 0 ].innerHTML;
	//console.log( 'id', id );

	surfaceIndex = select.selectedOptions[ 0 ].value;
	ISASD.surfaceIndex = select.selectedOptions[ 0 ].value;

	//console.log( 'surfaceIndex', surfaceIndex );

	//const surfaceText = GBX.surfaces.find( item => item.includes( surfaceId ) );
	const surfaceText = GBX.surfaces[ ISASD.surfaceIndex ];

	const adjacentSpaceArr = surfaceText.match( /spaceIdRef="(.*?)"/gi );
	//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

	const spaceIds = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );

	const options = GBX.spaces.reduce( ( text, item, index ) =>{

		const spaceId = item.match( / id="(.*?)"/i )[ 1 ];

		const selected = spaceId === spaceIds[ 0 ] ? 'selected' : '';
		//const selected = spaceId === candidates[ 2 ] ? 'selected' : '';

		return text + `<option value="${ spaceId }" ${ selected } >${ item.match( /<Name>(.*?)<\/Name>/gi ) }</option>` },

	'' );


	count = 1;
	htm = spaceIds.reduce( ( text, spaceId, index ) => {

		spaceText = GBX.spaces.find( space => space.includes( spaceId ) );
		spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i );

		return text +
		`
			<aside>
			<p>
				space #${ index + 1 }:<br><i>${ spaceName[ 1 ] }</i>
			</p>
			<p>
				<button onclick=ISASD.surfacesInSpaceShowHide(this,"${ spaceId }",${ ISASD.surfaceIndex }); >show/hide</button><br>
			<p>
				<select id=ISASDselSpaceNew${ count } style=width:100%; size=5 >${ options }</select>
			</p>
			<p>
				<button onclick=ISASD.spaceShowHide(this); value=${ count } >selected space show/hide</button>

				<button onclick=ISASD.gbxmlUpdateAdjacentSpace(this,"${ spaceId }",${ ISASD.surfaceIndex }); value=${ count++ } >update reference</button>
			</p>
			</aside>
		` } ,
	"" );

	ISASDdivAdjacentSpaceDuplicate.innerHTML = htm;

	GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

	ISASD.selectedSurfaceFocus( ISASD.surfaceIndex );

	ISASD.findSurfacesAdjacent();

};



ISASD.findSurfacesAdjacent = function() {

	const surfaceCoordinates = ISASD.surfaceCoordinates[ ISASD.surfaceIndex ];
	//console.log( 'surfaceCoordinates', surfaceCoordinates );

	const surfaceStrings = surfaceCoordinates.map( item => item.join() );
	//console.log( 'strings', strings );

	ISASD.candidates = [];

	ISASD.surfaceCoordinates.forEach ( ( surfaceCoordinates, index ) => {

		surfaceCoordinates.forEach( ( points, index2 ) => {

			if ( surfaceStrings.includes( points.join() ) ) {
				//console.log( 'index', index );

				spaceIdRef = GBX.surfaces[ index ].match( /spaceIdRef="(.*?)"/gi );

				if ( spaceIdRef && spaceIdRef.length > 1 && spaceIdRef[ 0 ] !== spaceIdRef[ 1 ] ) {

					const spaceIds = spaceIdRef.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
					//console.log( 'spaceIds', spaceIds );

					ISASD.candidates.push( spaceIds );

				}

			}

		} );

	} );
	//console.log( 'ISASD.candidates', ISASD.candidates );

	ISASD.setUICandidates();

};



ISASD.setUICandidates = function() {

	const candidatesFlatMap = ISASD.candidates.flatMap( item => item );
	//console.log( 'candidatesFlatMap', candidatesFlatMap );

	const uniques = [];

	candidatesFlatMap.forEach( item => {

		if ( !uniques.includes( item ) ) { uniques.push( item ); }

	} );
	//console.log( 'uniques', uniques );



	const uniquesCount = [];

	for ( let unique of uniques ) {

		count = candidatesFlatMap.filter( item => item === unique ).length;
		//console.log( 'count', count );

		uniquesCount.push( count );

	}
	//console.log( 'uniquesCount', uniquesCount );

	const max = Math.max(...uniquesCount );

	//const surfaceIndex = ISASDselAdjacentSpaceDuplicate.selectedOptions[ 0 ].value;

	let htm = 'Suggested alternatives<br>';
	let spaceIndex;

	for ( let unique of uniques ) {
		//console.log( 'unique', unique );

		//spaceIndex = GBX.spaces.indexOf( space => space.includes( unique ) === true );

		GBX.spaces.forEach( ( space, index ) => {

			if ( space.includes ( unique ) ) { spaceIndex = index; }

		} );
		//console.log( 'spaceIndex', spaceIndex );

		const count = candidatesFlatMap.filter( item => item === unique ).length;

		if ( count === max ) {

			htm += `<button onclick=ISASD.buttonClick(this,"${ unique }"); value=${ spaceIndex }>${ unique }</button> ${ count }<br>`;

		}

	}

	ISASDtestCandidates.innerHTML = htm;

};



ISASD.buttonClick = function( button ){

	button.classList.toggle( "active" );

	ISASDselSpaceNew2.selectedIndex = button.value;

	buttons = ISASDtestCandidates.querySelectorAll( 'button ');
	//console.log( 'buttons', buttons );

	surfacesIndexes = [];

	buttons.forEach( button => {

		if ( button.classList.contains( 'active' ) ) {
			//console.log( 'button.value', button.value );

			surfacesIndexes.push( ...ISASD.surfacesInSpaces[ button.value ].surfacesInSpace )

		}

	} );
	//console.log( 'surfacesIndexes', surfacesIndexes  );

	GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

	if ( surfacesIndexes.length > 0 ) {

		surfacesIndexes.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		ISASD.selectedSurfaceFocus( ISASD.surfaceIndex );

	}

};



ISASD.surfaceArrayShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISASD.spaceShowHide = function( button ) {

	const select = ISASDdivAdjacentSpaceDuplicate.querySelectorAll( "#ISASDselSpaceNew" + button.value );
	//console.log( 'select', select );

	const spaceId = select[ 0 ].value;
	//console.log( 'spaceId', spaceId );

	if ( !spaceId ) { alert( "First select a new space"); return; }

	ISASD.surfacesInSpaceShowHide( button, spaceId );

};



ISASD.surfacesInSpaceShowHide = function( button, spaceId ) {

	button.classList.toggle( "active" );

	const children =  GBX.surfaceGroup.children;

	children.forEach( child => child.visible = false );

	if ( button.classList.contains( 'active' ) ) {

		for ( let mesh of children )  {

			const id = mesh.userData.index;
			const surface = GBX.surfaces[ id ];
			const spaces = surface.match( / spaceIdRef="(.*?)"/g );
			//console.log( 'spaces', spaces );

			if ( !spaces ) { continue; }

			spaces.forEach( item => mesh.visible = item.includes( spaceId ) ? true : mesh.visible );

		}

	} else {

		//GBX.surfaceGroup.children[ surfaceIndex ].visible = true;

		ISASD.selectedSurfaceFocus();
	}

};


ISASD.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISASD.surfaceIndex ];

	POP.intersected.visible = true;

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};



ISASD.gbxmlUpdateAdjacentSpace = function( button, spaceId ) {

	select = ISASDdivAdjacentSpaceDuplicate.querySelectorAll( "#ISASDselSpaceNew" + button.value );
	console.log( 'select', select );

	spaceIdNew = select[ 0 ].value;
	console.log( 'spaceIdNew', spaceIdNew );

	if ( !spaceIdNew ) { alert( "First select a new space"); return; }

	const surfaceId = ISASDselAdjacentSpaceDuplicate.selectedOptions[ 0 ].innerHTML;
	console.log( 'surfaceId', surfaceId );

	const surfaceTextCurrent = GBX.surfaces.find( item => item.includes( surfaceId ) );
	console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	surfaceTextNew = surfaceTextCurrent.replace( /spaceIdRef="(.*?)"/, `spaceIdRef="${ spaceIdNew }"` )

	alert( 'coming soon\n\nsurfaceTextNew\n\n' + surfaceTextNew );

};
