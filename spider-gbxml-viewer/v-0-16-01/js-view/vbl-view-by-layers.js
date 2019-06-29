// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POPX, ISCOR, POPdivPopupData*/
/* jshint esversion: 6 */

const VBL = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "View by layers (VBL) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbl-view-by-layers.md",
		"version": "0.16-01-1vbl",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbl-view-by-layers.js",

	}

};



VBL.getMenuViewByLayers = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBLdet.open = false; }, false );

	const help = `<button id="butVBLsum" class="butHelp" onclick="POP.setPopupShowHide(butVBLsum,VBL.script.helpFile);" >?</button>`;

	const selectOptions = ["id" ].map( option => `<option>${ option }</option>`)

	const htm =

	`<details id="VBLdet" ontoggle=VBL.setViewByLayersSelectOptions(); >

		<summary>Layers ${ help }</summary>

		<p>
			View layers. <span id="VBLspnCount" ></span>
		</p>

		<p>
			<input id=VBLinpSelectIndex oninput=VBL.setSelectedIndex(this,VBLselViewBySurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VBLselViewByLayers oninput=VBL.selLayersFocus(this); style=width:100%; size=10 multiple >
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



VBL.setViewByLayersSelectOptions = function() {

	if ( VBLdet.open === false ) { return; }

	const attribute = VBLselAttribute.value;
	//console.log( 'attribute', attribute );

	let color, text;

	htmOptions = GBX.layers.map( (layer, index ) => {

		color = color === 'pink' ? '' : 'pink';

		if ( [ "id", "constructionIdRef" ].includes( attribute ) ) {

			text = layer.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( attribute === "Name" ) {

			text = layer.match( /<Name>(.*?)<\/Name>/i );
			//console.log( 'text', text );
			text = text ? text[ 1 ] : "";

		} else if ( attribute === "CADObjectId" ) {

			text = layer.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
			//console.log( 'text', text );
			text = text ? text.pop() : "";

		}

		return `<option style=background-color:${ color } value=${ index } >${ text }</option>`;

	} );

	VBLselViewByLayers.innerHTML = htmOptions;
	VBLspnCount.innerHTML = `: ${ GBX.layers.length } found`;

	THR.controls.enableKeys = false;

};



VBL.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.value =  option ? option.value : "";

};




VBL.selLayersFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	POPdivPopupData.innerHTML = VBL.getLayersAttributes( select.value );

	//VBL.surfacesFilteredBySpace = VBL.getSurfacesFilteredBySpace();

	//VBLdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBL.surfacesFilteredBySpace );


};



VBL.getLayersAttributes = function( index ) {

	const typeTxt = GBX.layers[ index ];

	const typeId = typeTxt.match( ` id="(.*?)"` )[ 1 ];

	const typeXml = POPX.parser.parseFromString( typeTxt, "application/xml").documentElement;
	//console.log( 'typeXml ', typeXml );

	const htmType = GSA.getAttributesHtml( typeXml );

	const htm =
	`
		<b>${ typeId } Attributes</b>

		<p>${ htmType }</p>

		<details open >

			<summary>gbXML data</summary>

			<textarea style=height:10rem;width:100%; >${ typeTxt }</textarea>

		</details>
	`;

	return htm;

};



VBL.getSurfacesFilteredBySpace = function(  ) {

	const spaceIds = VBLselSpace.selectedOptions;

	const surfacesFilteredBySpace = [];

	for ( let spaceId of spaceIds ) {
		//console.log( 'spaceId', spaceId );

		const surfacesVisibleBySpace = GBX.surfacesIndexed.filter( surface =>
				surface.includes( `spaceIdRef="${ spaceId.value }"`  ) );
		//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );

		surfacesFilteredBySpace.push( ...surfacesVisibleBySpace );

	}
	//console.log( 'surfacesFilteredBySpace', surfacesFilteredBySpace );

	return surfacesFilteredBySpace;

};



VBL.setViewSpacesShowHide = function() {

	VBLselSpace.selectedIndex = -1;

	VBL.selSpacesFocus();

};



VBL.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	}

};
