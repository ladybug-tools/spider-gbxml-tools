// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POPX, VBCOOdet, VBCOOselViewByGroup, VBCOOspnCount */
/* jshint esversion: 6 */

const VBCOO = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-08",
		"description": "View by CAD Object ID open (VBCOO) provides HTML and JavaScript to view openings by their CAD Object ID group.",
		"helpFile": "../js-view/vbcoo-view-by-cad-object-id.md",
		"version": "0.16-01-0vbcoo",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",

	}

};



VBCOO.getMenuViewByCadObjectIdOpen = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBCOOdet.open = false; }, false );

	const help = `<button id="butVBCOOsum" class="butHelp" onclick="POP.setPopupShowHide(butVBCOOsum,VBCOO.script.helpFile);" >?</button>`;

	const htm =

	`<details id="VBCOOdet" ontoggle=VBCOO.setViewOptions(); >

		<summary>CAD object id opening groups ${ help }</summary>

		<p>
			View openings by groups of CAD object IDs.
			For individual CAD Object ID openings see 'Openings'.
			<span id="VBCOOspnCount" ></span>
		</p>

		<p>
			<input id=VBCOOinpSelectIndex oninput=VBCOO.setSelectedIndex(this,VBCOOselViewByGroup) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VBCOOselViewByGroup oninput=VBCOO.selectedGroupFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple groups by pressing shift or control keys</p>

		<p>
			<button onclick=VBCOO.setViewBySurfaceShowHide(this,VBCOO.openings); >
				Show/hide by openings
			</button>
		</p>

	</details>`;

	return htm;

};



VBCOO.setViewOptions = function() {

	if ( VBCOOdet.open === false ) { return; }

	let color;

	VBCOO.cadObjects = [];

	GBX.openings.forEach( (opening, index ) => {

		let text = opening.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
		text = text ? text.pop() : "";
		text = text.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		text = text ? text[ 1 ].replace( /\[(.*)\]/, "") : "";
		//console.log( 'text', VBCOO.cadObjects.indexOf( text ) < 0 );

		if ( VBCOO.cadObjects.indexOf( text ) < 0 ) { VBCOO.cadObjects.push( text ); }

	} );
	// console.log( 'VBCOO.cadObjects', VBCOO.cadObjects );

	const options = VBCOO.cadObjects.map( item => {

		color = color === 'pink' ? '' : 'pink';
		return `<option style=background-color:${ color } value=${ item } >${ item }</option>`;

	} );

	VBCOOselViewByGroup.innerHTML = options;
	VBCOOspnCount.innerHTML = `${ VBCOO.cadObjects.length } found`;

	THR.controls.enableKeys = false;

};



VBCOO.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str && option ? option.index : -1;

};



VBCOO.selectedGroupFocus = function( select ) {

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	GBX.surfaceOpenings.children.forEach( opening => opening.visible = false );

	VBCOO.surfacesWithOpenings = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const cadId = option.innerText;

		const surfacesWithOpenings = GBX.surfacesIndexed.filter( opening => opening.includes( cadId ) );

		VBCOO.surfacesWithOpenings.push( ...surfacesWithOpenings );

		GBX.openings.filter( opening => opening.includes( cadId ) )
			.map( item => GBX.openings.indexOf( item ) )
			.forEach( index => GBX.surfaceOpenings.children[ index ].visible = true );

	} );

	GBX.sendSurfacesToThreeJs( VBCOO.surfacesWithOpenings );

};



VBCOO.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};