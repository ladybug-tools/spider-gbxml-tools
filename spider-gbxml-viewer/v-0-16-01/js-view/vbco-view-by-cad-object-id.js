// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, VBCOdet, VBCOselViewBySurfaces, VBCOspnCount */
/* jshint esversion: 6 */

const VBCO = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-08",
		"description": "View by CAD Object ID (VBCO) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbco-view-by-cad-object-id.md",
		"version": "0.16-01-2vbco",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",

	}

};



VBCO.getMenuViewByCadObjectId = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBCOdet.open = false; }, false );

	const help = `<button id="butVBCOsum" class="butHelp" onclick="POP.setPopupShowHide(butVBCOsum,VBCO.script.helpFile);" >?</button>`;

	const htm =

	`<details id="VBCOdet" ontoggle=VBCO.setViewOptions(); >

		<summary>CAD object id groups <span id="VBCOspnCount" ></span> ${ help }</summary>

		<p>
			View surfaces by groups of CAD object IDs. For individual CAD Object IDs see 'Surfaces'.
		</p>

		<p>
			<input id=VBCOinpSelectIndex oninput=VBCO.setSelectedIndex(this,VBCOselViewBySurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VBCOselViewBySurfaces oninput=VBCO.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple groups by pressing shift or control keys</p>

		<p>
			<button onclick=VBCO.setViewBySurfaceShowHide(this,VBCO.surfaces); >
				Show/hide by surfaces
			</button> <mark>What would be useful here?</mark>
		</p>

	</details>`;

	return htm;

};


VBCO.setViewOptions = function() {

	let color;

	const cadObjects = [];

	GBX.surfaces.forEach( (surface, index ) => {

		let text = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
		text = text ? text.pop() : "";
		text = text.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		text = text ? text[ 1 ].replace( /\[(.*)\]/, "") : "";
		//console.log( 'text', cadObjects.indexOf( text ) < 0 );

		if ( cadObjects.indexOf( text ) < 0 ) { cadObjects.push( text ); }

	} );
	// console.log( 'cadObjects', cadObjects );

	const options = cadObjects.map( item => {

		color = color === 'pink' ? '' : 'pink';
		return `<option style=background-color:${ color } value=${ item } >${ item }</option>`;

	} );

	VBCOselViewBySurfaces.innerHTML = options;
	VBCOspnCount.innerHTML = `: ${ cadObjects.length } found`;

	THR.controls.enableKeys = false;

	return options;

};



VBCO.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str && option ? option.index : -1;

};



VBCO.selectedSurfacesFocus = function( select ) {

	VBCO.surfaces = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const surfaces = GBX.surfacesIndexed.filter( surface => surface.includes( option.innerText ) );

		VBCO.surfaces.push( ...surfaces );

	} );

	GBX.sendSurfacesToThreeJs( VBCO.surfaces );

};



VBCO.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};