// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FXASEselAdjacentSpaceExtra, FXASEsumSpaceExtra, FXASEdivSpaceExtraData, FXASEdivSpaceExtra  */
/* jshint esversion: 6 */
/* jshint loopfunc: true */



const FXASE = { "release": "2.0.0", "date": "2019-04-03" };


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
				<li>2019-04-02 ~ B - Validate and fix with jsHint</li>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface type in the select type list box</li>
			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-03 ~ First commit</li>
			</ul>
		</details>
	`;




FXASE.getFixAdjacentSpaceExtra = function() {

	const htm =
		`
			<details ontoggle="FXASEdivAdjacentSpaceExtra.innerHTML=FXASE.getAdjacentSpaceExtra();" >

			<summary id=FXASEsumAdjacentSpaceExtra class=sumHeader >Fix surfaces with an extra adjacent space
				<a id=FXASESum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXASESum,FXASE.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id=FXASEdivAdjacentSpaceExtra ></div>

			</details>

		`;

	return htm;

};



FXASE.getAdjacentSpaceExtra = function() {

	const timeStart = performance.now();
	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
		'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	const invalidAdjacentSpaceExtra = [];

	const surfaces = SGF.surfaces;

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

		const surface = SGF.surfaces[ index ];
		//console.log( 'sf', surface );
		return `<option value=${ index } title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const help = `<a id=fxaseHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxaseHelp,FXASE.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXASEsumAdjacentSpaceExtra.innerHTML =
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

			<div id="FXASEdivSpaceExtraData" >Click a surface name above to view its details and delete extra space. Tool tip shows the ID of the surface.</div>

			<div id=FXASEdivSelectedSurfaceGbXML ></div>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return aseHtm;

};



FXASE.setSpaceExtraData = function( select ) {
	//console.log( 'select.value', select.value );

	const surfaceText = SGF.surfaces[ select.value ];
	//console.log( 'surfaceText', surfaceText );

	const adjacentSpaceArr = surfaceText.match( /spaceIdRef="(.*?)"/gi );
	//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

	const spaceId = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] )[ 0 ];
	//console.log( 'spaceId', spaceId );

	const htm =
		`
			<p>
				space <i>${ spaceId }</i>:<br>

				<button onclick=FXASE.adjacentSpaceDelete("${ spaceId }"); >Delete reference</button>

				<button onclick=FXASE.showSelectedSurfaceGbxml(${ select.value },FXASEdivSelectedSurfaceGbXML); >View gbXML text</button>

			</p>
		`;

	FXASEdivSpaceExtraData.innerHTML = SGF.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText ) + htm;

	const det = FXASEdivSpaceExtraData.querySelectorAll( 'details');
	det[0 ].open = true;
};



FXASE.adjacentSpaceDelete = function( spaceId ) {
	console.log( 'spaceId', spaceId );

	const result = confirm( `OK to delete space id ref ${ spaceId }?` );

	if ( result !== true ) { return; }

	const surfaceIndex = FXASEselAdjacentSpaceExtra.value;
	//console.log( 'surfaceIndex', surfaceIndex );

	const surfaceTextCurrent = SGF.surfaces[ surfaceIndex ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const regex = new RegExp( `<AdjacentSpaceId spaceIdRef="(.*?)"\/>`, "gi" );
	const matches = surfaceTextCurrent.match ( regex );
	//console.log( 'matches', matches );

	const surfaceTextNew = surfaceTextCurrent.replace( matches[ 0 ], '' );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text = SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

	FXASEdivSpaceExtra.innerHTML = FXASE.getFixAdjacentSpaceExtra();

};



FXASE.showSelectedSurfaceGbxml = function( index, target ) {

	target.innerText = SGF.surfaces[ index ];

};