// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POPX, ISCOR, POPdivPopupData*/
/* jshint esversion: 6 */

const VBL = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-27",
		"description": "View by Surfaces (VBL) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbsu-view-by-surfaces.md",
		"version": "0.16-01-2vbsu",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",

	}

};



VBL.getMenuViewByLayers = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBLdet.open = false; }, false );

	const help = `<button id="butVBLsum" class="butHelp" onclick="POP.setPopupShowHide(butVBLsum,VBL.script.helpFile);" >?</button>`;

	const selectOptions = ["id", "CADObjectId", "constructionIdRef", "Name"].map( option => `<option>${ option }</option>`)

	const htm =

	`<details id="VBLdet" ontoggle=VBL.setViewBySurfacesSelectOptions(); >

		<summary>Layers<span id="VBLspnCount" ></span> ${ help }</summary>

		<p>
			View layers
		</p>

		<p>
			<input id=VBLinpSelectIndex oninput=VBL.setSelectedIndex(this,VBLselViewBySurfaces) placeholder="Enter an attribute" >

		</p>

		<p>
			<select id=VBLselViewBySurfaces oninput=VBL.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VBLselAttribute oninput=VBL.setViewBySurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VBL.setViewBySurfaceShowHide(this,VBL.surfaces); >
				Show/hide by surfaces
			</button> <mark>What would be useful here?</mark>
		</p>

	</details>`;

	return htm;

};


VBL.setViewBySurfacesSelectOptions = function() {

	if ( VBLdet.open === false ) { return; }

	const attribute = VBLselAttribute.value;
	//console.log( 'attribute', attribute );

	let color, text;

	htmOptions = GBX.surfaces.map( (surface, index ) => {

		color = color === 'pink' ? '' : 'pink';

		if ( [ "id", "constructionIdRef" ].includes( attribute ) ) {

			text = surface.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( attribute === "Name" ) {

			text = surface.match( /<Name>(.*?)<\/Name>/i );
			//console.log( 'text', text );
			text = text ? text[ 1 ] : "";

		} else if ( attribute === "CADObjectId" ) {

			text = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
			//console.log( 'text', text );
			text = text ? text.pop() : "";

		}

		return `<option style=background-color:${ color } value=${ index } >${ text }</option>`;

	} );

	VBLselViewBySurfaces.innerHTML = htmOptions;
	VBLspnCount.innerHTML = `: ${ GBX.surfaces.length } found`;

	THR.controls.enableKeys = false;

};



VBL.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.value =  option ? option.value : "";

};



VBL.selectedSurfacesFocus = function( select ) {

	alert( "coming soon")

	return;

	POPX.intersected = GBX.surfaceGroup.children[ select.value ];

	POPdivPopupData.innerHTML = POPX.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const options = select.selectedOptions
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	VBL.surfaces = GBX.surfacesIndexed.filter( ( surface, index ) => indexes.includes( index  ) );

	GBX.sendSurfacesToThreeJs( VBL.surfaces );

};



VBL.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};