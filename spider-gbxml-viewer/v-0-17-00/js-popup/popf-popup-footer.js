/* global Stats, POPbutRateLimits, navPopup, divDragMoveContent, main, showdown */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const POPF = {
	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-07-15",
	"description": "TooToo Menu (POP) generates standard HTML popup menu code and content and code that works on computers, tablets and phones",
	"helpFile": "js-popup/pop-popup.md",
	"version": "0.17.00-0popf",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up",

	page: 0
};


POPF.footer =
	`
		<div>

			<button  onclick=POPX.onClickZoomAll(); title="Show entire campus & display attributes" >🔍</button>

			<button class=POPFbutIcon onclick="POPF.onToggleInteriorExterior(this)" title="Exterior or interior surfaces">☂️</button>
			<button class=POPFbutIcon onclick="THRU.toggleEdges();" title="Display edges" >📏</button>
			<button class=POPFbutIcon onclick="GBXU.toggleOpenings();" title="Display openings" >🚪</button>
			<button class=POPFbutIcon onclick="POPF.setPanelSurfaceTypes();" title="Surface types" >💡</button>

			<button class=POPFbutIcon onclick="POPF.setScreen2();" title="Display parameters" >👁️</button>
			<button class=POPFbutIcon onclick="POPF.setScreen3();" title="Cut sections" >🔪</button>
			<button class=POPFbutIcon onclick="POPF.setScreen4();" title="Exploded views" >🧨</button>
			<button class=POPFbutIcon onclick="POPX.setIntersected();" title="Previously selected surface" >📌</button>


		</div>
	`;


POPF.onToggleInteriorExterior = function( button ) {

	THR.scene.remove( POPX.line, POPX.particle );

	button.classList.toggle( "active" );

	const array = button.classList.contains( "active" ) ?

		[ "Ceiling","InteriorFloor", "InteriorWall", "UndergroundCeiling" ]
		:
		[ "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof", "Shade", "SlabOnGrade", "UndergroundSlab", "UndergroundWall" ]
	;

		const surfaces = GBX.surfaces;

		const surfacesFiltered = array.flatMap( filter =>

			surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

		);

	GBXU.sendSurfacesToThreeJs( surfacesFiltered );

};



POPF.setScreen4 = function() {

	VEX.setDetExplodedViews( divDragMoveContent );

};



POPF.setScreen3 = function() {

	divDragMoveContent.innerHTML = CUT.getDetSectionViews();

	CUT.toggleSectionViewX();
};




POPF.setScreen2 = function() {

	divDragMoveContent.innerHTML = SET.getPanelSettings();

};



POPF.setPanelSurfaceTypes = function() {

	THR.scene.remove( POPX.line, POPX.particle );



	const typesInUse = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

	POPF.surfaceTypesActive = !POPF.surfaceTypesActive ? typesInUse : POPF.surfaceTypesActive;

	let colors =  typesInUse.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	const buttonSurfaceTypes = typesInUse.map( ( type, index ) =>
		`
		<div style=margin:0.5rem 0; >
		<button onclick=POPF.toggleThisSurfaceType("${ type}");  style=min-width:2rem;width:1rem;>👁️</button>
		<button class=${ POPF.surfaceTypesActive.includes( type ) ? "active" : "" } onclick=POPF.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };width:10rem;" >
			${ type } </button>
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



POPF.toggleThisSurfaceType = function( surfaceType ) {

	const buttonsActive = divDragMoveContent.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	POPF.sendSurfaceTypesToThreeJs ( [ surfaceType ] );

};



POPF.toggleSurfaceByButtons = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = divDragMoveContent.getElementsByClassName( "active" ); // collection

	POPF.surfaceTypesActive = Array.from( buttonsActive ).map( button => button.innerText );

	POPF.sendSurfaceTypesToThreeJs ( POPF.surfaceTypesActive );

};



POPF.sendSurfaceTypesToThreeJs = function( surfaceTypes ) {
	//console.log( 'surfaceTypes', surfaceTypes );

	const surfacesFiltered = surfaceTypes.flatMap( filter =>

		GBX.surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	POPF.surfaceTypesActive = surfaceTypes;

	POPF.surfacesFilteredByType = surfacesFiltered;

	GBXU.sendSurfacesToThreeJs( surfacesFiltered );

};