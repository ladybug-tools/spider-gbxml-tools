//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FETS = { "release": "2.1.0", "date": "2019-04-02" };


FETS.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];

FETS.exposedTypes = [ "ExteriorWall", "Roof", "ExposedFloor", "Shade", "RaisedFloor" ];

FETS.description =
	`
		type 2 Checks for a surface type that is not one of the 15 valid gbXML surface types
	`;

FETS.currentStatus =
	`
		<h3>Fix Surface Type Invalid (FETS) R${ FETS.release } ~ ${ FETS.date }</h3>

		<p>
			${ FETS.description }.
		</p>

		<p>
			Most likely this type of error is quite rare. It occurs when a user types in a non-valid surface type in the originating CAD application.
		</p>

		<p>
			Wish List / To do:<br>
			<ul>

			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;




FETS.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details ontoggle="FXSTIdivSurfaceType.innerHTML=FETS.getSurfaceType();" >

			<summary id=FXSTIsumSurfaceType class=sumHeader >Fix surfaces with invalid surface type
				<a id=FXSTISum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXSTISum,FETS.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id=FXSTIdivSurfaceType ></div>

			</details>

		`;

	return htm;

};



FETS.getSurfaceType = function() {

	const timeStart = performance.now();

	FETS.errors = [];

	FETS.surfaceTypes = SGF.surfaces.map( surface => {


		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let exposedToSun= surface.match( /exposedToSun="(.*?)"/i );
		exposedToSun = exposedToSun ? exposedToSun[ 1 ] === "true" : false;

		//console.log( 'exposedToSun', exposedToSun );

		if ( exposedToSun && FETS.exposedTypes.includes( typeSource ) === false ) {

				id = surface.match( / id="(.*?)"/i )[ 1 ];

				FETS.errors.push( {id, typeSource, exposedToSun } );

		} else if ( exposedToSun === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			id = surface.match( / id="(.*?)"/i )[ 1 ];

			FETS.errors.push( {id, typeSource, exposedToSun} );

		}


	} )

	console.log( 'FETS.errors', FETS.errors );
	//console.log( 'FETS.surfaceTypes', FETS.surfaceTypes );

	errors = FETS.errors.map( item => `id: ${ item.id } current surface type: ${ item.typeSource } ${ item.exposedToSun }` );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FETS.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceType.innerHTML =
		`Surface types ~ ${ FETS.surfaceTypes.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGF.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FETS.surfaceTypes.length.toLocaleString() } surface types found.</p>

		${ errors.join("<br>") }

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};


FETS.setTypeInvalidData = function( select ) {

	const invalidData = SGF.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText );

	const options = SGF.surfaceTypes.map( ( type, index ) => {

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
				<button onclick=FETS.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FETS.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FETS.setSurfaceType = function( index ) {
	//console.log( 'index',FETS.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGF.surfaces[ FETS.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text =  SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FETS.showSurfaceGbxml = function( index ) {

	const surfaceText = SGF.surfaces[ FETS.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FXSTIdivSelecteSurfaceTGbxml.innerText = surfaceText;

};
