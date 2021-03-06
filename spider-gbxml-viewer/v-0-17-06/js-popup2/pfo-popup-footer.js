/* global THR, THRU, GBX, GBXU, GSA, PIN, divDragMoveContent */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


var PFO = {
	"copyright": "Copyright 2019 Ladybug Tools authors",
	"date": "2019-08-13",
	"description": "TooToo Menu (PFO ) generates standard HTML popup menu code and content and code that works on computers, tablets and phones",
	"helpFile": "js-popup/pfo-popup-footer.md",
		"license": "MIT License",
	"version": "0.17.02-1pfo",

};


PFO.footer =
	`
		<div id=POPdivFooter >

			<button  onclick=PFO.onClickZoomAll(); title="Show entire campus & display attributes" >🔍</button>

			<button class=PFObutIcon onclick="PFO.onToggleInteriorExterior(this)" title="Exterior or interior surfaces">☂️</button>
			<button class=PFObutIcon onclick="THRU.toggleEdges(GBX.meshGroup);" title="Display edges" >📏</button>
			<button class=PFObutIcon onclick="GBXU.toggleOpenings();" title="Display openings" >🚪</button>
			<button class=PFObutIcon onclick="PFO.setPanelSurfaceTypes();" title="Surface types" >👁️</button>

			<button class=PFObutIcon onclick="PFO.setScreen2();" title="Display parameters" >💡</button>
			<button class=PFObutIcon onclick="PFO.setScreen3();" title="Cut sections" >🔪</button>
			<button class=PFObutIcon onclick="PFO.setScreen4();" title="Exploded views" >🧨</button>
			<button class=PFObutIcon onclick="PIN.setIntersected();" title="Previously selected surface" >📌</button>

		</div>
	`;


PFO.onToggleInteriorExterior = function( button ) {

	THR.scene.remove( PIN.line, PIN.particle );

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



PFO.setScreen4 = function() {

	VEX.setDetExplodedViews( divDragMoveContent );

};



PFO.setScreen3 = function() {

	divDragMoveContent.innerHTML = CUT.getDetSectionViews();

	CUT.toggleSectionViewX();
};




PFO.setScreen2 = function() {

	divDragMoveContent.innerHTML = SET.getPanelSettings();

};





PFO.setPanelSurfaceTypes = function() {

	THR.scene.remove( PIN.line, PIN.particle );

	PFO.surfaceTypesInUse = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );
	//console.log( '', PFO.surfaceTypesInUse );

	let colors =  PFO.surfaceTypesInUse.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show


	const buttonSurfaceTypes = PFO.surfaceTypesInUse.map( ( type, index ) =>
		`
		<div style="margin: 0.5rem 0;" >
			<button class=butEye onclick=PFO.toggleThisSurfaceType("${ type}"); style=width:2rem; >👁️</button>
			&nbsp; <button id=but${ type } class=${ GBX.surfaceTypesActive.includes( type ) ? "active" : "" }
				onclick=PFO.toggleSurfaceByButtons(this); style="background-color:#${ colors[ index ] };width:10rem;" >
				${ type }
			</button>
		</div>
		`
	).join( "" );

	const options = GBX.storeysJson.map( storey => `<option value=${ storey.id } >${ storey.name }</option>` );

	divDragMoveContent.innerHTML =
		`
			<h4>Surface types and storeys</h4>

			<div id=PFOdivSurfaces >
				${ buttonSurfaceTypes }
			</div>

			<p>
				<button class=butEye onclick=PFO.setAllTypesVisible(); >all visible</button>

				<button class=highlight onclick=SET.toggleSpaceTitles(); >toggle space titles</button>
			</p>

			<p>
				<select id=selStorey oninput=PFO.selStorey(this); size=5 style=width:100%; multiple >
					${ options }
				</select>
			</p>
		`;

};



PFO.toggleThisSurfaceType = function( surfaceType ) {

	const buttonsActive = PFOdivSurfaces.getElementsByClassName( "active" ); // collection

	Array.from( buttonsActive ).forEach( button => button.classList.remove( "active" ) );

	const button = PFOdivSurfaces.querySelectorAll( `#but${surfaceType}` );

	PFO.toggleSurfaceByButtons( button[ 0 ] );

};



PFO.toggleSurfaceByButtons = function ( buttons ) {

	buttons.classList.toggle( "active" );

	const buttonsActive = divDragMoveContent.getElementsByClassName( "active" );

	GBX.surfaceTypesActive = Array.from( buttonsActive ).map( button => button.innerText );

	PFO.setVisible();

};



PFO.onClickZoomAll = function() {

	GBX.meshGroup.children.forEach( mesh => mesh.visible = true );

	GBX.placards.children.forEach( mesh => mesh.visible = false );

	GBX.surfaceTypesActive = GBX.surfaceTypes.slice( 0, -1 );

	GBX.storeyIdsActive = GBX.storeysJson.map( storey => storey.id );

	THRU.zoomObjectBoundingSphere();

	if ( window.detMenuViewGbxml ) MNU.toggleDetailsOpen( detMenuViewGbxml ); // resets all the panels

	const campusXml = PIN.parser.parseFromString( GBX.text, "application/xml").documentElement;

	PFO.campusXml = campusXml;

	const buildingXml = campusXml.getElementsByTagName( 'Building' )[ 0 ];

	divDragMoveContent.innerHTML=
	`
		<b>Campus Attributes</b>
		<div>${ GSA.getAttributesHtml( campusXml ) }</div>
		<br>
		<b>Building Attributes</b>
		<div>${ GSA.getAttributesHtml( buildingXml ) }</div>

	`;

};



PFO.setAllTypesVisible = function(){

	selStorey.selectedIndex= -1;

	const buttons = PFOdivSurfaces.querySelectorAll( `button` );

	Array.from( buttons ).forEach( button => {

		if ( !button.classList.contains( "butEye") ) { button.classList.add( "active" ); }

	} );

	GBX.surfaceTypesActive = GBX.surfaceTypes.slice( 0, -1 );

	GBX.storeyIdsActive = GBX.storeysJson.map( storey => storey.id );

	GBX.meshGroup.children.forEach( child => child.visible = true );

	GBX.placards.visible = true;

	GBX.placards.children
		.forEach( mesh => mesh.visible = true );

};



PFO.selStorey = function( select ) {

	GBX.storeyIdsActive = Array.from( select.selectedOptions ).map( option => option.value );

	PFO.setVisible();

	THR.controls.enableKeys = false;

};



PFO.setVisible = function() {

	GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

	GBX.meshGroup.children
		.filter( mesh => GBX.storeyIdsActive.includes( mesh.userData.storeyId ) || mesh.userData.surfaceType === "Shade" )
		.filter( mesh => GBX.surfaceTypesActive.includes( mesh.userData.surfaceType ) )
		.forEach( mesh => mesh.visible = true );

	GBX.placards.children.forEach( mesh => mesh.visible = false );

	GBX.placards.children
		.filter( mesh => GBX.storeyIdsActive.includes( mesh.userData.storeyId ) )
		.forEach( mesh => mesh.visible = true );

};