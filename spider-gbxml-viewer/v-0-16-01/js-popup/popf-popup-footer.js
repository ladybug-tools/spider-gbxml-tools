/* global Stats, POPbutRateLimits, navPopup, POPdivMain, main, showdown */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const POPF = {
	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-26",
	"description": "TooToo Menu (POP) generates standard HTML popup menu code and content and code that works on computers, tablets and phones",
	"helpFile": "js-popup/pop-popup.md",
	"version": "0.16.01-2popx",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up"
};


POPX.footer =
	`
		<p style=text-align:right; >
			<button onclick=POPX.onClickZoomAll(); title="Show entire campus & display attributes" >zoom all +</button>
			<button onclick=POPF.setScreen1(); style=background:#fdd; title="show/hide" >surfaces</button>
			<button onclick=POPF.setScreen2(); title="show/hide" >display</button>
			<button onclick=POPX.setPrevious(); style=background:yellow; >previous</button>
		</p>
	`;


POPF.setScreen2 = function() {

	POPdivMain.innerHTML = SET.getSettingsMenu();

};


POPF.setScreen1 = function() {

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	const buttonSurfaceTypes = types.map( ( type, index ) =>
		`
		<button onclick=POPF.toggleThisSurface("${ type}");  style=min-width:1.5rem;width:1rem;>o</button>
		<button onclick=POPF.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };width:8rem;" > ${ type } </button> `
	);


	POPdivMain.innerHTML =
		`<table><tr>
		<td>${ buttonSurfaceTypes.join( '<br>' ) }</td>
		<td><button onclick=POPF.toggleInteriorExterior(this); style="width:8rem;" >interior/exterior</button></td>
		</tr></table>
		`;
}


POPF.toggleThisSurface = function( type ) {

	const buttonsActive = POPdivMain.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	POPF.sendSurfacesToThreeJs ( [ type ] );

};



POPF.toggleSurfaceByButtons = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = POPdivMain.getElementsByClassName( "active" ); // collection

	const filterArray = Array.from( buttonsActive ).map( button => button.innerText );

	POPF.sendSurfacesToThreeJs ( filterArray );

};



POPF.sendSurfacesToThreeJs = function( filters ) {

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	//VBS.surfacesFilteredByStorey = VBS.setSurfacesFilteredByStorey();

	const surfaces = GBX.surfacesIndexed;
	//console.log( 'surfaces', surfaces.length  );

	const surfacesFiltered = filters.flatMap( filter =>

		surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	GBX.sendSurfacesToThreeJs( surfacesFiltered );

	//return POPFdivReportsLog.innerHTML;

};



//////////


POPF.toggleInteriorExterior = function( button ) {

	const buttonsActive = POPdivMain.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof" ]
		:
		[ "Ceiling","InteriorFloor", "InteriorWall", "SlabOnGrade", "UndergroundCeiling", "UndergroundSlab", "UndergroundWall" ];

	POPF.sendSurfacesToThreeJs( array );

};