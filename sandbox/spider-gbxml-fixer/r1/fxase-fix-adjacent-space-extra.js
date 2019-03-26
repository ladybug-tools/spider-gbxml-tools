// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const FXASE = { "release": "1.1", "date": "2019-03-25" };


FXASE.description =
	`
		Checks for a surface with more adjacent spaces and required
	`;

FXASE.currentStatus =
	`
		<h3>Fix Surface Adjacent Space Extra (FXASE) R${ FXASE.release } ~ ${ FXASE.date }</h3>

		<p>
			${ FXASE.description }.
		</p>

		<p>
			Wish List / To do:<br>
			<ul>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface type in the select type list box</li>
			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-25 ~ F - Adjacent space is deleted as expected / Upon deletion, repeats check</li>
				<li>2019-03-25 ~ F - List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;


FXASE.getFixAdjacentSpaceExtra = function() {

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

	const options = invalidAdjacentSpaceExtra.map( index => {

		const surface = SGT.surfaces[ index ];
		//console.log( 'sf', surface );
		return `<option value=${index } title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const help = `<a id=fxaseHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxaseHelp,FXASE.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXASEsumSpaceExtra.innerHTML =
		`Fix surfaces with an extra adjacent space ~ ${ invalidAdjacentSpaceExtra.length.toLocaleString() } found
			${ help }
		`;

	const aseHtm =
		`
			<p><i>Exterior surfaces that normally take a single adjacent space that are found to have two adjacent spaces.</i></p>

			<p>
				${ invalidAdjacentSpaceExtra.length.toLocaleString() } surface(s) with extra spaces found. See tool tips for surface ID.
			</p>

			<p>
				<select id=FXASEselAdjacentSpaceExtra onclick=FXASE.setSpaceExtraData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<div id="FXASEdivSpaceExtraData" >Click a surface ID above to view its details and delete extra space.</div>

			<!--
			<p>
				<button onclick=FXASEdivSpaceExtra.innerHTML=FXASE.getFixAdjacentSpaceExtra(); >Run check again</button>
			</p>
			-->

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return aseHtm;

};



FXASE.setSpaceExtraData = function( select ) {

	const surfaceId = select.selectedOptions[ 0 ].innerHTML;
	//console.log( 'id', id );

	const surfaceText = SGT.surfaces.find( item => item.includes( surfaceId ) );
	//console.log( 'surfaceIndex', surfaceIndex );

	const adjacentSpaceArr = surfaceText.match( /spaceIdRef="(.*?)"/gi );
	//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

	const spaceId = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] )[ 0 ];
	//console.log( 'spaceId', spaceId );

	/*
	const htm = spaceIds.reduce( ( text, id, index ) => text +
		`
			<p>
				space <i>${ id }</i>:<br>
				<button onclick=FXASE.adjacentSpaceDelete("${ id }"); value=${ index } >delete reference</button>
			</p>
		`,
	"" );
	*/

	const htm =
		`
			<p>
				space <i>${ spaceId }</i>:<br>
				<button onclick=FXASE.adjacentSpaceDelete("${ spaceId }"); >delete reference</button>
			</p>
		`;

	FXASEdivSpaceExtraData.innerHTML = SGT.getSurfacesAttributesByIndex( select.value ) + htm;

	const detAdjSpace = FXASEdivSpaceExtraData.querySelectorAll( "details" )[ 0 ].open = true;
	//console.log( 'detAdjSpace', detAdjSpace );

};



FXASE.adjacentSpaceDelete = function( spaceId ) {

	result = confirm( `OK to delete space id ref ${ spaceId }` );

	if ( result !== true ) { return; }

	const surfaceIndex = FXASEselAdjacentSpaceExtra.value;

	const surfaceTextCurrent = SGT.surfaces[ surfaceIndex ];
	//console.log( 'surfaceText', surfaceText );

	//const adjacentSpaceId = surfaceTextCurrent.match( /<AdjacentSpaceId(.*?)>/gi );
	//console.log( 'adjacentSpaceId', adjacentSpaceId);

	const regex = new RegExp( `<AdjacentSpaceId spaceIdRef="${ spaceId }"\/>`, "gi" );
	const matches = surfaceTextCurrent.match ( regex );
	//console.log( 'matches', matches[ 0 ] );

	const surfaceTextNew = surfaceTextCurrent.replace( matches[ 0 ], '' );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	//const adjacentSpaceId = surfaceTextNew.match( /<AdjacentSpaceId(.*?)>/gi );
	//console.log( 'adjacentSpaceId', adjacentSpaceId);

	SGT.text = SGT.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );

	FXASEdivSpaceExtra.innerHTML = FXASE.getFixAdjacentSpaceExtra();

};