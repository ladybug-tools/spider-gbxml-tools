// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const FXASE = { "release": "R1.0", "date": "2019-03-23" };


FXASE.description =
	`
		Checks for a surface type that is not one of the 15 valid gbXML surface types
	`;

FXASE.currentStatus = 'tbd';


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

	const options = invalidAdjacentSpaceExtra.map( index =>
		`<option value=${index } >${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }</option>` );
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
				${ invalidAdjacentSpaceExtra.length.toLocaleString() } found
			</p>

			<p>
				<select id=FXASEselAdjacentSpaceExtra onclick=FXASE.setSpaceExtraData(this); size=5 >${ options }</select>
			</p>

			<div id="FXASEdivSpaceExtraData" >Click a surface ID above to view its details and delete extra space.</div>

			<p>
				<button onclick=FXASEdivSpaceExtra.innerHTML=FXASE.getFixAdjacentSpaceExtra(); >Run check again</button>
			</p>

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

	const spaceIds = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );

	htm = spaceIds.reduce( ( text, id, index ) => text +
		`
			<p>
				space <i>${ id }</i>:<br>
				<button onclick=FXASE.adjacentSpaceDelete("${ id }"); value=${ index } >delete reference</button>
			</p>
		`,
	"" );

	FXASEdivSpaceExtraData.innerHTML = SGT.getSurfacesAttributesByIndex( select.value ) + htm;


};



FXASE.adjacentSpaceDelete = function( spaceId ) {

	//alert( `will delete space id ref ${ id }`)

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

	const text = SGT.text.replace( surfaceTextCurrent, surfaceTextNew );

	//const len = SGT.parseFile( text );
	//console.log( 'len', len );

	//FXASEspnCount.innerHTML = '';
	//FXASEbutAdjacentSpaceDuplicateShowHide.classList.remove( "active" );
	//FXASEdivAdjacentSpaceExtra.innerHTML = 'None found';

	//FXASEdetAdjacentSpaceExtra.open = false;

};