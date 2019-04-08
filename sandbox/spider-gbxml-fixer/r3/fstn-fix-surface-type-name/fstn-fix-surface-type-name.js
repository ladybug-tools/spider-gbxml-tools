//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FSTN = { "release": "2.1.0", "date": "2019-04-02" };


FSTN.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];

FSTN.description =
	`
		type 2 Checks for a surface type that is not one of the 15 valid gbXML surface types
	`;

FSTN.currentStatus =
	`
		<h3>Fix Surface Type Invalid (FSTN) R${ FSTN.release } ~ ${ FSTN.date }</h3>

		<p>
			${ FSTN.description }.
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




FSTN.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details ontoggle="FXSTIdivSurfaceType.innerHTML=FSTN.getSurfaceType();" >

			<summary id=FXSTIsumSurfaceType class=sumHeader >Fix surfaces with invalid surface type
				<a id=FXSTISum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXSTISum,FSTN.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id=FXSTIdivSurfaceType ></div>

			</details>

		`;

	return htm;

};



FSTN.getSurfaceType = function() {

	const timeStart = performance.now();

	FSTN.errors = [];

	FSTN.surfaceTypes = SGF.surfaces.map( surface => {

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";

		if ( FSTN.types.includes( typeSource ) === false ) {

				id = surface.match( / id="(.*?)"/i )[ 1 ];

				FSTN.errors.push( {id, typeSource } );

		}

	} )

	console.log( 'FSTN.errors', FSTN.errors );
	//console.log( 'FSTN.surfaceTypes', FSTN.surfaceTypes );

	errors = FSTN.errors.map( item => `id: ${ item.id } current surface type: ${ item.typeSource }` );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FSTN.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceType.innerHTML =
		`Surface types ~ ${ FSTN.surfaceTypes.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGF.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FSTN.surfaceTypes.length.toLocaleString() } surface types found.</p>

		${ errors.join("<br>") }

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};


FSTN.setTypeInvalidData = function( select ) {

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
				<button onclick=FSTN.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FSTN.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FSTN.setSurfaceType = function( index ) {
	//console.log( 'index',FSTN.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGF.surfaces[ FSTN.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text =  SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FSTN.showSurfaceGbxml = function( index ) {

	const surfaceText = SGF.surfaces[ FSTN.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FXSTIdivSelecteSurfaceTGbxml.innerText = surfaceText;

};
