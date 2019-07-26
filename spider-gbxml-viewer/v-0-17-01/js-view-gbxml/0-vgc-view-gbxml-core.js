/* globals THR, GBX, PIN, VCIOdet, VCIOselViewGroup, VCIOspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VGC = {

	script: {
		copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
		date: "2019-07-25",
		description: "utilities",
		helpFile: "../v-0-17-01/js-view-gbxml/vgc-view-gbxml-core.md",
		license: "MIT License",
		version: "0.17.01-0vgc"

	}

};


//document.body.addEventListener( 'onGbxParse', function(){ VCIOdet.open = false; }, false );



VGC.getHelpButton = ( id, file, footer, link ) => `<button id="${ id }" class="butHelp"
	onclick="POP.setPopupShowHide(${id},'${file}',POP.footer,'${ link }');" >
	? </button>`;



VGC.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str && option ? option.index : -1;
	
	navDragMove.hidden = false;

};



VGC.setPopupBlank = function( intersected = null ) {

	PIN.intersected = intersected;

	THR.scene.remove( PIN.line, PIN.particle );

	divDragMoveContent.innerHTML = "";

	divDragMoveFooter.innerHTML = PFO.footer;

	navDragMove.hidden = false;

	THR.controls.enableKeys = false;

};



VGC.toggleViewSelectedOrAll = function( button, select, surfaces ) {
	//console.log( 'surfaces', surfaces );

	if ( select.selectedIndex === -1 ) { alert( "First, select a surface from the list"); return; }

	if ( button.classList.contains( 'active' ) && surfaces.length ) {

		GBXU.sendSurfacesToThreeJs( surfaces );

	} else {

		GBX.meshGroup.children.forEach( element => element.visible = true );

	}

	button.classList.toggle( "active" );

};