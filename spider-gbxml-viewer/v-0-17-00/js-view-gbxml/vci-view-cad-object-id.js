// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, VCIdet, VCIselViewSurfaces, VCIspnCount */
/* jshint esversion: 6 */

const VCI = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-08",
		"description": "View by CAD Object ID (VCI) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbco-view-by-cad-object-id.md",
		"version": "0.16-01-2vbco",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",

	}

};



VCI.getMenuViewCadObjectId = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VCIdet.open = false; }, false );

	const help = `<button id="butVCIsum" class="butHelp" onclick="POP.setPopupShowHide(butVCIsum,VCI.script.helpFile);" >?</button>`;

	const htm =

	`<details id="VCIdet" ontoggle=VCI.setViewOptions(); >

		<summary>CAD object id groups <span id="VCIspnCount" ></span> ${ help }</summary>

		<p>
			View surfaces by groups of CAD object IDs. For individual CAD Object IDs see 'Surfaces'.
		</p>

		<p>
			<input id=VCIinpSelectIndex oninput=VCI.setSelectedIndex(this,VCIselViewSurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VCIselViewSurfaces oninput=VCI.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple groups by pressing shift or control keys</p>

		<p>
			<button onclick=VCI.setViewSurfaceShowHide(this,VCI.surfaces); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};


VCI.setViewOptions = function() {

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

	VCIselViewSurfaces.innerHTML = options;

	VCIspnCount.innerHTML = `: ${ cadObjects.length } found`;

	THR.controls.enableKeys = false;

	return options;

};



VCI.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str && option ? option.index : -1;

};



VCI.selectedSurfacesFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	divDragMoveFooter.innerHTML = POPF.footer;

	navDragMove.hidden = false;

	VCI.surfaces = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const surfaces = GBX.surfaces.filter( surface => surface.includes( option.innerText ) );

		VCI.surfaces.push( ...surfaces );

	} );

	GBXU.sendSurfacesToThreeJs( VCI.surfaces );

};



VCI.setViewSurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};