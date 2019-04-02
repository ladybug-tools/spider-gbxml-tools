// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGT, FXSTIsumSurfaceTypeInvalid, FXSTIdivTypeInvalidData, FXSTIdivSelecteSurfaceTGbxml */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const FXSTI = { "release": "1.3", "date": "2019-03-29" };


FXSTI.description =
	`
		Checks for a surface type that is not one of the 15 valid gbXML surface types
	`;

FXSTI.currentStatus =
	`
		<h3>Fix Surface Type Invalid (FXSTI) R${ FXSTI.release } ~ ${ FXSTI.date }</h3>

		<p>
			${ FXSTI.description }.
		</p>

		<p>
			Most likely this type of error is quite rare. It occurs when a user types in a non-valid surface type in the originating CAD application.
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
				<li>2019-03-29 ~ Add - FXDPC.showSelectedSurfaceGbxml() / Pass through jsHint</li>
				<li>2019-03-25 ~ List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-23 ~ Add help pop-up. Fix 'run again'</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;


FXSTI.getCheckSurfaceTypeInvalid = function() {

	const timeStart = performance.now();

	FXSTI.surfaceTypeInvalids = SGT.surfaces.filter( surface => {

			const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

			return SGT.surfaceTypes.includes( surfaceType ) === false;

		} )
		.map( surface => SGT.surfaces.indexOf( surface ) );
	//console.log( 'FXSTI.surfaceTypeInvalids', FXSTI.surfaceTypeInvalids );

	const options = FXSTI.surfaceTypeInvalids.map( index => {

		const surface = SGT.surfaces[ index ];
		//console.log( 'sf', surface );
		return `<option value=${index } title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceTypeInvalid.innerHTML =
		`Fix surfaces with invalid surface type ~ ${ FXSTI.surfaceTypeInvalids.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGT.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FXSTI.surfaceTypeInvalids.length.toLocaleString() } invalid surface types found. See tool tips for surface ID.</p>

		<p>
			<select onclick=FXSTI.setTypeInvalidData(this); size=5 style=min-width:8rem; >${ options }</select>
		</p>

		<div id="FXSTIdivTypeInvalidData" >Click a surface in the list above to view its details and update its surface type</div>

		<p>
			<button onclick=FXSTIdivSurfaceTypeInvalid.innerHTML=FXSTI.getCheckSurfaceTypeInvalid(); >Run check again</button>
		</p>

		<div id=FXSTIdivSelecteSurfaceTGbxml ></div>

		<p>
			Click 'Save file' button in File Menu to save changes to a file.
		</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};


FXSTI.setTypeInvalidData = function( select ) {

	const invalidData = SGT.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText );

	const options = SGT.surfaceTypes.map( ( type, index ) => {

		const selected = ""; //index === selectedIndex ? "selected" : "";
		return `<option ${ selected } >${ type }</option>`;

	} ).join( "" );

	let index = 0;

	const htm =
		`
			<p>
				${ invalidData }
			</p>

			<p>
				Select new surface type <select id=selSurfaceType${ index } >${ options }</select>
				<button onclick=FXSTI.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FXSTI.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FXSTI.setSurfaceType = function( index ) {
	//console.log( 'index',FXSTI.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGT.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGT.text =  SGT.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FXSTI.showSurfaceGbxml = function( index ) {

	const surfaceText = SGT.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FXSTIdivSelecteSurfaceTGbxml.innerText = surfaceText;

};
