// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POPX, VCIOdet, VCIOselViewGroup, VCIOspnCount */
/* jshint esversion: 6 */

const VCIO = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-21",
		"description": "View by CAD Object ID open (VCIO) provides HTML and JavaScript to view openings by their CAD Object ID group.",
		"helpFile": "../js-view-gbxml/vco-view-by-cad-object-id.md",
		"version": "0.17.00-0vco",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxml",

	}

};



VCIO.getMenuViewCadObjectIdOpen = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VCIOdet.open = false; }, false );

	const help = `<button id="butVCIOsum" class="butHelp" onclick="POP.setPopupShowHide(butVCIOsum,VCIO.script.helpFile);" >?</button>`;

	const htm =

	`<details id="VCIOdet" ontoggle=VCIO.setViewOptions(); >

		<summary>CAD object id opening groups ${ help }</summary>

		<p>
			View openings by groups of CAD object IDs.
			For individual CAD Object ID openings see 'Openings'.
			<span id="VCIOspnCount" ></span>
		</p>

		<p>
			<input id=VCIOinpSelectIndex oninput=VCIO.setSelectedIndex(this,VCIOselViewGroup) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VCIOselViewGroup oninput=VCIO.selectedGroupFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple groups by pressing shift or control keys</p>

		<p>
			<button onclick=VCIO.setViewSurfaceShowHide(this,VCIO.openings); >
				Show/hide by openings
			</button>
		</p>

	</details>`;

	return htm;

};



VCIO.setViewOptions = function() {

	if ( VCIOdet.open === false ) { return; }

	let color;

	VCIO.cadObjects = [];

	GBX.openings.forEach( (opening, index ) => {

		let text = opening.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
		text = text ? text.pop() : "";
		text = text.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		text = text ? text[ 1 ].replace( /\[(.*)\]/, "") : "";
		//console.log( 'text', VCIO.cadObjects.indexOf( text ) < 0 );

		if ( VCIO.cadObjects.indexOf( text ) < 0 ) { VCIO.cadObjects.push( text ); }

	} );
	// console.log( 'VCIO.cadObjects', VCIO.cadObjects );

	const options = VCIO.cadObjects.map( item => {

		color = color === 'pink' ? '' : 'pink';
		return `<option style=background-color:${ color } value=${ item } >${ item }</option>`;

	} );

	VCIOselViewGroup.innerHTML = options;
	VCIOspnCount.innerHTML = `${ VCIO.cadObjects.length } found`;

	THR.controls.enableKeys = false;

};



VCIO.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str && option ? option.index : -1;

};



VCIO.selectedGroupFocus = function( select ) {

	POPX.intersected = null;

	divDragMoveFooter.innerHTML = POPF.footer;

	navDragMove.hidden = false;

	THR.scene.remove( POPX.line, POPX.particle );

	GBX.openingGroup.children.forEach( opening => opening.visible = false );

	VCIO.surfacesWithOpenings = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const cadId = option.innerText;

		const surfacesWithOpenings = GBX.surfaces.filter( opening => opening.includes( cadId ) );

		VCIO.surfacesWithOpenings.push( ...surfacesWithOpenings );

		GBX.openings.filter( opening => opening.includes( cadId ) )
			.map( item => GBX.openings.indexOf( item ) )
			.forEach( index => GBX.openingGroup.children[ index ].visible = true );

	} );

	GBXU.sendSurfacesToThreeJs( VCIO.surfacesWithOpenings );

};



VCIO.setViewSurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};