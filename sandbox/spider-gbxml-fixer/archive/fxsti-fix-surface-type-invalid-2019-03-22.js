// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const FXSTI = { "release": "R1.1", "date": "2019-03-21" };


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
			To do:<br>
			<ul>
				<li>2019-03-19 ~ Pre-select the correct surface type in the select type list box</li>
			</ul>
		</p>
		<p>
			Most likely this type of error is quite rare. It occurs when a user types in a non-valid surface type in the originating CAD application.
		</p>
		<p>
			<ul>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</p>
	`;


FXSTI.getCheckSurfaceTypeInvalid = function() {

	const timeStart = performance.now();

	FXSTI.surfaceTypeInvalids = SGT.surfaces.filter( surface => {

			const surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

			return SGT.surfaceTypes.includes( surfaceType ) === false;

		} )
		.map( surface => SGT.surfaces.indexOf( surface ) );
	//console.log( 'FXSTI.surfaceTypeInvalids', FXSTI.surfaceTypeInvalids );


	const items = FXSTI.surfaceTypeInvalids.map( index =>
		`<option value=${index } >${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }</option>` );
	//console.log( 'items', items );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	/*
	const htm = SGT.getItemHtm( {

		open: FXSTI.surfaceTypeInvalids.length > 0 ? "open" : "",
		summary: `Surfaces with Invalid Surface Type - ${ FXSTI.surfaceTypeInvalids.length} found ${ help }`,
		description:
		`
			A surface type was supplied that is not one of the following: ${ SGT.surfaceTypes.join( ', ' ) }`,
			contents:
			`
			<p>${ FXSTI.surfaceTypeInvalids.length.toLocaleString() } invalid surface types found</p>

			<p>
				<select onclick=FXSTI.setTypeInvalidData(this); size=5 >${ items }</select>
			</p>

			<div id="FXSTIdivTypeInvalidData" >Click a surface ID above to view its details and update its surface type</div>

			<p>
				<button onclick=FXSTIdivTypeInvalid.innerHTML=FXSTI.getCheckSurfaceTypeInvalid(); >Run check again</button>
			</p>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>
		`,
		timeStart: timeStart

	} );
	*/

	htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGT.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FXSTI.surfaceTypeInvalids.length.toLocaleString() } invalid surface types found</p>

		<p>
			<select onclick=FXSTI.setTypeInvalidData(this); size=5 style=min-width:8rem; >${ items }</select>
		</p>

		<div id="FXSTIdivTypeInvalidData" >Click a surface ID above to view its details and update its surface type</div>

		<p>
			<button onclick=FXSTIdivTypeInvalid.innerHTML=FXSTI.getCheckSurfaceTypeInvalid(); >Run check again</button>
		</p>

		<p>
			Click 'Save file' button in File menu to save changes to a file.
		</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;



	return htm;




	/*
	invalidsData = SGT.getSurfacesAttributesByIndex( FXSTI.surfaceTypeInvalids );


	let selectedIndex = 0;

	const options = SGT.surfaceTypes.map( ( type, index ) => {

		const selected = index === selectedIndex ? "selected" : "";
		return `<option ${ selected } >${ type }</option>`;

	} ).join( "" );

	const sel =
		`
		<p>
			Select new surface type <select id=selSurfaceType >${ options }</select>
			<button onclick=FXSTI.setSurfaceType(this); >update</button>
		</P
		`;

	htm = invalidsData.map( ( item, index ) =>  {

		return item +
		`
		<p>
			Select new surface type <select id=selSurfaceType${ index } >${ options }</select>
			<button onclick=FXSTI.setSurfaceType(${ index }); >update data in memory</button>
			<button onclick=FXSTI.showSurfaceGbxml(this,${ index }); >view gbXML text</button>
			<div id=divSurfaceType${ index } ></div>

		</P>
		`;

	} ).join( "");

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	const invalidTypeHtm = SGT.getItemHtm( {

		open: FXSTI.surfaceTypeInvalids.length > 0 ? "open" : "",
		summary: `Surfaces with Invalid Surface Type - ${ FXSTI.surfaceTypeInvalids.length} found ${ help }`,
		description:
		`
			A surface type was supplied that is not one of the following: ${ SGT.surfaceTypes.join( ', ' ) }`,
			contents: `${ FXSTI.surfaceTypeInvalids.length.toLocaleString() } invalid surface types found<br>

			${ htm }<br>

			<p>

				<button onclick=FXSTIdivTypeInvalid.innerHTML=FXSTI.getCheckSurfaceTypeInvalid(); >Run check again</button>

			</p>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>
		`,
		timeStart: timeStart

	} );

	return invalidTypeHtm;

	*/


};


FXSTI.setTypeInvalidData = function( select ) {

	const invalidData = SGT.getSurfacesAttributesByIndex(select.value );

	const options = SGT.surfaceTypes.map( ( type, index ) => {

		const selected = ""; //index === selectedIndex ? "selected" : "";
		return `<option ${ selected } >${ type }</option>`;

	} ).join( "" );

	index = 0;

	const htm =
		`
			<p>
				${ invalidData }
			</p>

			<p>
				Select new surface type <select id=selSurfaceType${ index } >${ options }</select>
				<button onclick=FXSTI.setSurfaceType(${ index }); >update data in memory</button>
				<button onclick=FXSTI.showSurfaceGbxml(this,${ index }); >view gbXML text</button>
				<div id=divSurfaceType${ index } ></div>

			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FXSTI.setSurfaceType = function( index ) {
	//console.log( 'index',FXSTI.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGT.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGT.text =  SGT.text.replace( surfaceTextCurrent, surfaceTextNew )

	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FXSTI.showSurfaceGbxml = function( button, index ) {

	const surfaceText = SGT.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];

	div = document.body.querySelector( `#divSurfaceType${ index }` );

	div.innerText = surfaceText;

};