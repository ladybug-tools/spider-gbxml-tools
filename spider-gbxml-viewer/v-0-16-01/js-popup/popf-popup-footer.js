/* global Stats, POPbutRateLimits, navPopup, divDragMoveContent, main, showdown */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const POPF = {
	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-29",
	"description": "TooToo Menu (POP) generates standard HTML popup menu code and content and code that works on computers, tablets and phones",
	"helpFile": "js-popup/pop-popup.md",
	"version": "0.16.01-3popx",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up",

	page: 0
};


POPX.footer =
	`
	<div style=text-align:right; >

		<button onclick=POPX.onClickZoomAll(); title="Show entire campus & display attributes" >🔍</button>

		<button onclick="POPF.onToggleInteriorExterior(this)" title="Exterior or interior surfaces">☂️</button>
		<button onclick="SET.toggleEdgesThreejs();" title="Display edges" >📏</button>
		<button onclick="SET.toggleOpenings();" title="Display openings" >🚪</button>
		<button onclick="POPF.setScreen1();" title="Surface types" >🥪</button>

		<button onclick="POPF.setScreen2();" title="Sisplay parameters" >💡</button>
		<button onclick="POPF.setScreen3();" title="Cut sections" >🔪</button>
		<button onclick="POPF.setScreen4();" title="Exploded views" >🧨</button>
		<button onclick="POPX.setPrevious();" title="Previously selected surface" >📌</button>


	</div>
	`;


POPF.setNextPopup = function( x = 1 ){

	let url;

	if ( x === 0 ) {

		POPX.setPrevious();

	} else {

		const pages = [ POPF.setScreen2, POPF.setScreen1, POPF.setScreen3, POPF.setScreen4 ];
		POPF.page += x;
		POPF.page = POPF.page >= pages.length ? 0 : POPF.page;
		POPF.page = POPF.page < 0 ? pages.length - 1 : POPF.page;

		pages[ POPF.page ]();

	}

};


POPF.onToggleInteriorExterior = function( button ) {


	THR.scene.remove( POPX.line, POPX.particle );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		[ "Ceiling","InteriorFloor", "InteriorWall", "UndergroundCeiling" ]
		:
		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof", "Shade", "SlabOnGrade", "UndergroundSlab", "UndergroundWall" ]
	;


		const surfaces = GBX.surfacesIndexed;

		const surfacesFiltered = array.flatMap( filter =>

			surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

		);

	GBX.sendSurfacesToThreeJs( surfacesFiltered );

};

POPF.setScreen4 = function() {

	VEX.setDetExplodedViews( divDragMoveContent );

};



POPF.setScreen3 = function() {

	divDragMoveContent.innerHTML = CUT.getDetSectionViews();

	CUT.toggleSectionViewX();
};




POPF.setScreen2 = function() {

	divDragMoveContent.innerHTML = SET.getSettingsMenu();

};



POPF.setScreen1 = function() {

	THR.scene.remove( POPX.line, POPX.particle );

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	const buttonSurfaceTypes = types.map( ( type, index ) =>
		`
		<div style=margin:0.5rem 0; >
		<button onclick=POPF.toggleThisSurface("${ type}");  style=min-width:2rem;width:1rem;>o</button>
		<button onclick=POPF.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };width:10rem;" > ${ type } </button>
		</div>
		`
	);


	divDragMoveContent.innerHTML =
		`
			<h4>Show or hide surface types</h4>
			${ buttonSurfaceTypes.join( '' ) }
			<p><button onclick="GBX.surfaceGroup.children.forEach(it=>it.visible=true);" >all visible</button></p>
		`;
};



POPF.toggleThisSurface = function( type ) {

	const buttonsActive = divDragMoveContent.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	POPF.sendSurfacesToThreeJs ( [ type ] );

};



POPF.toggleSurfaceByButtons = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = divDragMoveContent.getElementsByClassName( "active" ); // collection

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

	const buttonsActive = divDragMoveContent.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( butt => { if ( butt !== button ) ( butt.classList.remove( "active" ) ); } );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof" ]
		:
		[ "Ceiling","InteriorFloor", "InteriorWall", "SlabOnGrade", "UndergroundCeiling", "UndergroundSlab", "UndergroundWall" ];

	POPF.sendSurfacesToThreeJs( array );

};