/* globals divContents, FASA, FASD, FASE, FASST, FCIM, FDPC, FETS, FIL, FSTN, FXA,
	GF3
, GCO, GCS, GGD, GSS, OCV, GBXFh1FileName, */
// jshint esversion: 6
// jshint loopfunc: true


const GF3 = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-08-20",
		description: "Fixer menu and utility scripts",
		helpFile: "js-fixer-3d/gf3-gbxml-fixer-3d.md",
		license: "MIT License",
		version: "0.17.00-0gbfx",

	}

};



// at top so to be easier to edit


GF3.getMenuFixer3d = function() {

	const htm =
	`
		${ GF3.getHelpButton( "GBXFbutHelp", GF3.script.helpFile ) }

		<p>
			<button onclick=GF3
		.runAll(); >Run all checks</button>

			<button onclick=GF3
		.openAllNonZero(); >Open all non-zero</button>

			<button onclick=GF3
		.closeAll(); >Close all</button>

			<br>

			To do: a 'fix all' button

		</p>

		<p>
			<input type=checkbox id=GBXinpIgnoreAirSurfaceType > Ignore Air surface type
		</p>

		<div id=FIOEHdivInteriorOnExteriorHorizontal ></div>

	`;

	return htm;

};



GF3.colorsDefault = {

	InteriorWall: 0x008000,
	ExteriorWall: 0xFFB400,
	Roof: 0x800000,
	InteriorFloor: 0x80FFFF,
	ExposedFloor: 0x40B4FF,
	Shade: 0xFFCE9D,
	UndergroundWall: 0xA55200,
	UndergroundSlab: 0x804000,
	Ceiling: 0xFF8080,
	Air: 0xFFFF00,
	UndergroundCeiling: 0x408080,
	RaisedFloor: 0x4B417D,
	SlabOnGrade: 0x804000,
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,
	Undefined: 0x88888888

};

GF3.cadIdsDefault = {

	InteriorWall: "Basic Wall: SIM_INT_SLD SpiderFix [000000]",
	ExteriorWall: "Basic Wall: SIM_EXT_SLD SpiderFix [000000]",
	Roof: "Basic Roof: SIM_EXT_SLD SpiderFix [000000]",
	InteriorFloor: "Floor: SIM_INT_SLD SpiderFix [000000]",
	ExposedFloor: "Floor: SIM_EXT_SLD SpiderFix [000000]",
	Shade: "Basic Roof: SIM_EXT_SHD_Roof SpiderFix [000000] ",
	UndergroundWall: "Basic Wall: SIM_EXT_GRD SpiderFix [000000]",
	UndergroundSlab: "Floor: SIM_EXT_GRD SpiderFix [000000]",
	Ceiling: "Compound Ceiling: SIM_INT_SLD SpiderFix [000000]",
	Air: "Basic Wall: SIM_INT_AIR SpiderFix [000000]", // could be Wall or Floor: SIM_INT_AIR SpiderFix [000000]
	UndergroundCeiling: "Floor: SIM_INT_SLD_Parking SpiderFix [000000]",
	RaisedFloor: "Floor: SIM_EXT_SLD SpiderFix [000000]",
	SlabOnGrade: "Floor: SIM_EXT_GRD SpiderFix [000000]",
	FreestandingColumn: "Column: SIM_STR_F SpiderFix [000000]",
	EmbeddedColumn: "Column: SIM_STR_E SpiderFix [000000]",
	Undefined: "Undefined SpiderFix [000000]"

};

GF3.colors = Object.assign( {}, GF3
.colorsDefault ); // create working copy of default colors

GF3.surfaceTypes = Object.keys( GF3
.colors );


GF3.init = function( target = GF3divFixer3d ) {

	GF3divFixer3d.innerHTML = GF3.getMenuFixer3d();

	GF3.setUp( GBX.text );

		//change to custom event with data passing via event details
		FOB.xhr.addEventListener( 'load', GF3.onXhrResponse, false );
		FOB.reader.addEventListener( 'load', GF3.onReaderResult, false );
		document.body.addEventListener( 'onZipFileParse', GF3.onFileZipLoad, false );

	};


// why not FOB always send FOB.text??
GF3.onXhrResponse = function( event ) { GF3.setUp( event.target.response ); };

GF3.onReaderResult = function() { GF3.setUp( FOB.reader.result ); };

GF3.onFileZipLoad = function() { GF3.setUp( FOB.text ); };

GF3.getHelpButton = ( id, file ) => `<button id="${ id }" class="butHelp" onclick="POP.setPopupShowHide(${id},'${file}');" >
	? </button>`;



GF3.setUp = function( text ) { // build a fresh menu any time a new file is loaded

	//GBXFh1FileName.innerHTML = `File: ${ decodeURI( FOB.name ) }`;

	FIOEHdivInteriorOnExteriorHorizontal.innerHTML = FIOEH.getMenuInteriorOnExteriorHorizontal();



};



////////// utilities


GF3.runAll = function( target = divFixer ){

	const details = target.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

	for ( let item of details ) { item.open = true; }

	for ( let item of details ) { item.open = false; }

};



GF3.closeAll = function( target = divFixer ){

	const details = target.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

};



GF3.openAllNonZero = function( target = divFixer ){

	const details = target.querySelectorAll( 'details' );

	for ( let item of details ) {

		if ( item.innerText.includes( "~" ) && item.innerText.includes( "~ 0 " ) === false ) {

			item.open = true;

		}

	}

};