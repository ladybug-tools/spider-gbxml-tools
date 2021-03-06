// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, divPopupData */
/* jshint esversion: 6 */


const ISASD = { "release": "R10.4", "date": "2018-12-18" };

ISASD.twoSpaces = ['Air', 'InteriorWall', 'InteriorFloor', 'Ceiling' ];
ISASD.souce = "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/lib/isasd-issues-adjacent-space-duplicate.js";

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
					2018-12-10
					<ul>
						<li>Code cleanup</li>
						<li>Add spaceOtherShowHide button</li>
						<li>Add adjacentSpaceUpdate button - not working yet</li>

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

			ISASD.invalidAdjacentSpaceDuplicate.push( index );

		}

	} );

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASD.invalidAdjacentSpaceDuplicate ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;

	}

	ISASDselAdjacentSpaceDuplicate.innerHTML = htmOptions;

	ISASDspnCount.innerHTML = `: ${ ISASD.invalidAdjacentSpaceDuplicate.length.toLocaleString() } found`;

	ISASD.setSurfaceSCoordinates();

	ISASD.setSpacesData();

	//ISASD.setSurfaceInSpace();


	return ISASD.invalidAdjacentSpaceDuplicate.length;

};



ISASD.setSpacesData = function() {

	ISASD.spaces = [];

	GBX.spaces.forEach ( ( space, index ) => {

		id = space.match( 'id="(.*?)"' )[ 1 ];
		surfacesInSpace = [];

		GBX.surfaces.forEach( ( surface, index  ) => {

			if ( surface.includes( id ) ) {

				surfacesInSpace.push( index );

			}

		} );

		//console.log( index, 'surfacesInSpace', surfacesInSpace );

		ISASD.spaces.push( { id, index, surfacesInSpace } );

	} );
	//console.log( 'ISASD.spaces', ISASD.spaces );

}


ISASD.setSurfaceSCoordinates = function() {

	ISASD.surfaceCoordinates = [];

	GBX.surfaces.forEach( ( surface, index  ) => {

		const points = [];

		const planar = surface.match( /<PlanarGeometry>(.*)<\/PolyLoop>/ )[ 1 ];
		//console.log( 'planes', planes );

		const cartesian = planar.match( /<CartesianPoint>(.*?)<\/CartesianPoint>/g )
		//console.log( 'cartesian', cartesian );

		cartesian.forEach( item => {

			const coordinates = [];
			const coors = item.match( /<Coordinate>(.*?)<\/Coordinate>/g );

			coors.forEach( item => {

				it = item.match( /<Coordinate>(.*?)<\/Coordinate>/ )[ 1 ];
				coordinates.push( it );
				//console.log( '', it );

			} );

			points.push( coordinates )
			//console.log( '', coors );

		} );

		ISASD.surfaceCoordinates.push( points )

	} );
	//console.log( 'ISASD.surfaceCoordinates', ISASD.surfaceCoordinates );

}


ISASD.setSurfaceInSpace = function( surfaceId = 494 ) {

	for ( space of ISASD.spaces ) {

		for ( surfaceInSpaceId of space.surfacesInSpace ) {
			//console.log( 'surfaceInSpaceId', surfaceInSpaceId );

			if ( surfaceId === surfaceInSpaceId &&

				ISASD.surfaceCoordinates[ surfaceId ] === ISASD.surfaceCoordinates[ surfaceInSpaceId ]

			) {

				console.log( 'surfaceId', surfaceId, 'space', space );

				console.log( 'c1', ISASD.surfaceCoordinates[ surfaceId ] );

				console.log( 'c2', ISASD.surfaceCoordinates[ surfaceInSpaceId ] );

			}

		}

	}

};


ISASD.checkSurfaces = function( surfaceIndex ) {

	const coordinates = ISASD.surfaceCoordinates[ surfaceIndex ];
	//console.log( 'coordinates', coordinates );

	strings = coordinates.map( item => item.join() );
	console.log( 'strings', strings );

	ISASD.surfaceCoordinates.forEach (

		( surfaceCoordinates, index ) => {

			surfaceCoordinates.forEach( ( points, index2 ) => {

				if ( strings.includes( points.join() ) ) {

					//console.log( 'index', index );

					spaceIdRef = GBX.surfaces[ index ].match( /spaceIdRef="(.*?)"/gi );

					if ( spaceIdRef.length > 1 && spaceIdRef[ 0 ] !== spaceIdRef[ 1 ] ) {

						const spaceIds = spaceIdRef.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );


						console.log( 'spaceIds', spaceIds );

					}
				}

			} );


	} );

}


ISASD.getMenuAdjacentSpaceDuplicate = function() {

	// for testing
	document.body.addEventListener( 'onGbxParse', () => detMenuEdit.open = true , false );

	const htm =

	`<details id="ISASDdetAdjacentSpaceDuplicate" ontoggle=ISASD.getAdjacentSpaceDuplicateCheck(); >

		<summary>Adjacent Space Duplicate<span id="ISASDspnCount" ></span></summary>

		<p>
			Surfaces with two adjacent spaces that are identical
		</p>
		<p>
			<button onclick=ISASD.setAdjacentSpaceDuplicateShowHide(this,ISASD.invalidAdjacentSpaceDuplicate); >
				Show/hide Adjacent Space Duplicate surfaces
			</button>
		</p>
		<p>
			Select a surface:<br>
			<select id=ISASDselAdjacentSpaceDuplicate onchange=ISASD.selectSurfaceUpdate(this); style=width:100%; size=10 >
			</select>
		</p>

		<div id=ISASDdivAdjacentSpaceDuplicate ></div>

		<div>${ ISASD.currentStatus }</div>

	</details>`;

	return htm;

};



ISASD.setAdjacentSpaceDuplicateShowHide = function( button, surfaceArray ) {
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



ISASD.selectSurfaceUpdate = function( select ) {

	const surfaceId = select.selectedOptions[ 0 ].innerHTML;
	//console.log( 'id', id );

	surfaceIndex = select.selectedOptions[ 0 ].value;
	console.log( 'surfaceIndex', surfaceIndex );

	//ISASD.setSurfaceInSpace( surfaceIndex );

	ISASD.checkSurfaces( surfaceIndex )

	//const surfaceText = GBX.surfaces.find( item => item.includes( surfaceId ) );
	const surfaceText = GBX.surfaces[ surfaceIndex ];

	const adjacentSpaceArr = surfaceText.match( /spaceIdRef="(.*?)"/gi );
	//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

	const spaceIds = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );

	const options = GBX.spaces.reduce( ( text, item, index ) =>{
		spaceId = item.match( / id="(.*?)"/i )[ 1 ];

		return text + `<option value="${ spaceId }" >${ item.match( /<Name>(.*?)<\/Name>/gi ) }</option>` },

	'' );


	count = 1;
	htm = spaceIds.reduce( ( text, spaceId, index ) => {

		spaceText = GBX.spaces.find( space => space.includes( spaceId ) );
		spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i );

		return text +
		`
			<p>
				space #${ index + 1 }: <i>${ spaceName[ 1 ] }</i>:
			</p>
			<p>
				<button onclick=ISASD.spaceShowHide(this,"${ spaceId }"); >show/hide</button><br>
			<p>
				<select id=ISASDselSpaceNew${ count } style=width:100%; size=5 >${ options }</select>
			</p>
			<p>
				<button onclick=ISASD.spaceOtherShowHide(this,${ count }); >new space show/hide</button>

				<button onclick=ISASD.adjacentSpaceUpdate(this,"${ spaceId }",${ count++ }); value=${ index } >update reference</button><br>
			</p>
		` } ,
	"" );
	ISASDdivAdjacentSpaceDuplicate.innerHTML = htm;

	ISASD.selectedSurfaceFocus( select );

};



ISASD.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISASD.spaceShowHide = function( button, spaceId ) {

	button.classList.toggle( "active" );

	const surfaceIndex = ISASDselAdjacentSpaceDuplicate.value;

	const children =  GBX.surfaceGroup.children;

	children.forEach( child => child.visible = false );

	if ( button.classList.contains( 'active' ) ) {

		for ( let child of children )  {

			const id = child.userData.index;
			const surface = GBX.surfaces[ id ];
			const arr = surface.match( / spaceIdRef="(.*?)"/g );
			//console.log( 'arr', arr );

			if ( !arr ) { continue; }

			arr.forEach( item => child.visible = item.includes( spaceId ) ? true : child.visible );

		}

	} else {

		//GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		GBX.surfaceGroup.children[ surfaceIndex ].visible = true;

	}

};



ISASD.spaceOtherShowHide = function( button, id ) {

	select = ISASDdivAdjacentSpaceDuplicate.querySelectorAll( "#ISASDselSpaceNew" + id );
	console.log( 'select', select );

	space = select[ 0 ].value;
	console.log( 'space', space );

	if ( !space ) { alert( "First select a new space"); return; }

	//const surfaceId = ISASDselAdjacentSpaceDuplicate.selectedOptions[ 0 ].innerHTML;
	//console.log( 'id', id );

	//const surfaceTextCurrent = GBX.surfaces.find( item => item.includes( surfaceId ) );
	//console.log( 'surfaceText', surfaceTextCurrent );

	ISASD.spaceShowHide( button, space );

};



ISASD.adjacentSpaceUpdate = function( button, spaceId, id ) {

	select = ISASDdivAdjacentSpaceDuplicate.querySelectorAll( "#ISASDselSpaceNew" + id );
	console.log( 'select', select );

	spaceIdNew = select[ 0 ].value;
	console.log( 'spaceIdNew', spaceIdNew );

	if ( !spaceIdNew ) { alert( "First select a new space"); return; }

	const surfaceId = ISASDselAdjacentSpaceDuplicate.selectedOptions[ 0 ].innerHTML;
	console.log( 'surfaceId', surfaceId );

	const surfaceTextCurrent = GBX.surfaces.find( item => item.includes( surfaceId ) );
	console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	surfaceTextNew = surfaceTextCurrent.replace( /spaceIdRef="(.*?)"/, `spaceIdRef="${ spaceIdNew }"` )
	console.log( 'surfaceTextNew', surfaceTextNew );
	//ISASD.spaceShowHide( button, space );

};
