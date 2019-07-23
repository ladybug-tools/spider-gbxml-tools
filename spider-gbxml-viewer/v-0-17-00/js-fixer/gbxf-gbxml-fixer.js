/* globals divContents, FASA, FASD, FASE, FASST, FCIM, FDPC, FETS, FIL, FSTN, FXA,
	GBXFifr, GCO, GCS, GGD, GSS, OCV, GBXFh1FileName, */
// jshint esversion: 6
// jshint loopfunc: true


const GBXF = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Fixer menu and utility scripts",
		helpFile: "../v-0-17-00/js-fixer/gbxf-gbxml-fixer.md",
		license: "MIT License",
		version: "0.17.00-0gbfx",

	}

};



// at top so to be easier to edit


GBXF.getMenuFixer = function() {

	const htm =
	`
		${ GBXF.getHelpButton( "GBXFbutHelp", GBXF.script.helpFile ) }

		<p>
			<button onclick=GBXF.runAll(); >Run all checks</button>

			<button onclick=GBXF.openAllNonZero(); >Open all non-zero</button>

			<button onclick=GBXF.closeAll(); >Close all</button>

			<br>

			To do: a 'fix all' button

		</p>

		<p>
			<input type=checkbox id=GBXinpIgnoreAirSurfaceType > Ignore Air surface type
		</p>

		<div id=GGDdivGetGbxmlData ></div>

		<div id=GSSdivGetSurfaceStatistics ></div>

		<div id=GCSdivGetCheckStrings ></div>

		<div id=GCOdivGetCheckOffset ></div>

		<div id=OCVdivGetOpeningsCheckVertices ></div>

		<div id=OCSdivGetOpeningsCheckSize ></div>

		<div id=GWVdivGetWatertightVertices ></div>

		<div id=GWSdivGetWatertightSpaces ></div>

		<div id=FXAdivFixXmlAttributes ></div>

		<div id=FXSTIdivGetSurfaceTypeInvalid ></div>

		<div id=FSTNdivGetSurfaceTypeName ></div>

		<div id=FETSdivGetFixExposedToSun ></div>

		<div id=FDPCdivGetDuplicatePlanar ></div>

		<div id=FASSTdivSpacesWrongType ></div>

		<div id=FASEdivSpaceExtra ></div>

		<div id=FASDdivSpaceDuplicate ></div>

		<div id=FASAdivFixAirSingleAdjacent ></div>

		<div id=FCIMdivGetCadIdMissing ></div>

		<div id=TMPdivTemplate ></div>

	`;

	return htm;

};



GBXF.colorsDefault = {

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

GBXF.cadIdsDefault = {

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

GBXF.colors = Object.assign( {}, GBXF.colorsDefault ); // create working copy of default colors

GBXF.surfaceTypes = Object.keys( GBXF.colors );


GBXF.init = function( target = divFixer ) {

	target.innerHTML = GBXF.getMenuFixer();

	GBXF.setUp( GBX.text );

	//change to custom event with data passing via event details
	FOB.xhr.addEventListener( 'load', GBXF.onXhrResponse, false );
	FOB.reader.addEventListener( 'load', GBXF.onReaderResult, false );
	document.body.addEventListener( 'onZipFileParse', GBXF.onFileZipLoad, false );

};


// why not FOB always send FOB.text??
GBXF.onXhrResponse = function( event ) { GBXF.setUp( event.target.response ); };

GBXF.onReaderResult = function() { GBXF.setUp( FOB.reader.result ); };

GBXF.onFileZipLoad = function() { GBXF.setUp( FOB.text ); };

GBXF.getHelpButton = ( id, file ) => `<button id="${ id }" class="butHelp" onclick="POP.setPopupShowHide(${id},'${file}');" >
	? </button>`;



GBXF.setUp = function( text ) { // build a fresh menu any time a new file is loaded

	//GBXFh1FileName.innerHTML = `File: ${ decodeURI( FOB.name ) }`;

	GGD.getData( text );

	GGDdivGetGbxmlData.innerHTML = GGD.getGbxmlData( FOB.text );

	GSSdivGetSurfaceStatistics.innerHTML = GSS.getMenuSurfaceStatistics();

	GCSdivGetCheckStrings.innerHTML = GCS.getCheckStrings();

	GCOdivGetCheckOffset.innerHTML = GCO.getCheckOffset();

	OCVdivGetOpeningsCheckVertices.innerHTML = OCV.getOpeningsCheckVertices();

	OCSdivGetOpeningsCheckSize.innerHTML = OCS.getMenuOpeningsCheckSize();

	GWVdivGetWatertightVertices.innerHTML = GWV.getMenuWatertightVertices();

	GWSdivGetWatertightSpaces.innerHTML = GWS.getMenuWatertightSpaces()

	FXAdivFixXmlAttributes.innerHTML = FXA.getMenuFixXmlAttributes();

	FSTNdivGetSurfaceTypeName.innerHTML = FSTN.getMenuSurfaceTypeName();

	FETSdivGetFixExposedToSun.innerHTML = FETS.getMenuSurfaceExposedToSun();

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getMenuDuplicatePlanarCoordinates();

	FASSTdivSpacesWrongType.innerHTML = FASST.getMenuFASST();

	//FASEdivSpaceExtra.innerHTML = FASE.getMenuAdjacentSpaceExtra();

	FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

	FASAdivFixAirSingleAdjacent.innerHTML = FASA.getMenuAirSingleAdjacent();

	FCIMdivGetCadIdMissing.innerHTML = FCIM.getCadIdMissing();

	//TMPdivTemplate.innerHTML = TMP.getMenuTemplate();

};



////////// utilities


GBXF.runAll = function( target = divFixer ){

	const details = target.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

	for ( let item of details ) { item.open = true; }

	for ( let item of details ) { item.open = false; }

};



GBXF.closeAll = function( target = divFixer ){

	const details = target.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

};



GBXF.openAllNonZero = function( target = divFixer ){

	const details = target.querySelectorAll( 'details' );

	for ( let item of details ) {

		if ( item.innerText.includes( "~" ) && item.innerText.includes( "~ 0 " ) === false ) {

			item.open = true;

		}

	}

};