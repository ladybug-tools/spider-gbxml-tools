// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POPX, ISCOR, divDragMoveContent*/
/* jshint esversion: 6 */

const VLA = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-20",
		"description": "View by layers (VLA) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../v-0-17-00/js-view-gbxml/vla-view-layers.md",
		"version": "0.17-00-0vla",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxml/vla-view-layers.js",

	}

};



VLA.getMenuViewLayers = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VLAdet.open = false; }, false );

	const help = `<button id="butVLAsum" class="butHelp" onclick="POP.setPopupShowHide(butVLAsum,VLA.script.helpFile);" >?</button>`;

	const selectOptions = ["id" ].map( option => `<option>${ option }</option>`)

	const htm =

	`<details id="VLAdet" ontoggle=VLA.setViewLayersSelectOptions(); >

		<summary>Layers ${ help }</summary>

		<p>
			View layers. <span id="VLAspnCount" ></span>
		</p>
<!--
		<p>
			<input id=VLAinpSelectIndex oninput=VLA.setSelectedIndex(this,VLAselViewSurfaces) placeholder="Enter an attribute" >
		</p>
-->
		<p>
			<select id=VLAselViewLayers oninput=VLA.selLayersFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>


		<p>Attribute to show: <select id=VLAselAttribute oninput=VLA.setViewSurfacesSelectOptions(); >${ selectOptions }</select></p>
<!--
		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VLA.setViewSurfaceShowHide(this,VLA.surfaces); >
				Show/hide by surfaces
			</button> <mark>What would be useful here?</mark>
		</p>
-->

	</details>`;

	return htm;

};



VLA.setViewLayersSelectOptions = function() {

	if ( VLAdet.open === false ) { return; }

	const attribute = VLAselAttribute.value;
	//console.log( 'attribute', attribute );

	//VLAinpSelectIndex.value = "";

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

	VLAselViewLayers.innerHTML = htmOptions;
	VLAspnCount.innerHTML = `: ${ GBX.layers.length } found`;

	THR.controls.enableKeys = false;

};



VLA.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.value =  option ? option.index : "";

};




VLA.selLayersFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	divDragMoveFooter.innerHTML = POPF.footer;

	navDragMove.hidden = false;

	THR.scene.remove( POPX.line, POPX.particle );

	divDragMoveContent.innerHTML = VLA.getLayersAttributes( select.value );

	//VLA.surfacesFilteredSpace = VLA.getSurfacesFilteredSpace();

	//VLAdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VLA.surfacesFilteredSpace );


};



VLA.getLayersAttributes = function( index ) {

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



VLA.getSurfacesFilteredSpace = function(  ) {

	const spaceIds = VLAselSpace.selectedOptions;

	const surfacesFilteredSpace = [];

	for ( let spaceId of spaceIds ) {
		//console.log( 'spaceId', spaceId );

		const surfacesVisibleSpace = GBX.surfacesIndexed.filter( surface =>
				surface.includes( `spaceIdRef="${ spaceId.value }"`  ) );
		//console.log( 'surfacesVisibleSpace', surfacesVisibleSpace );

		surfacesFilteredSpace.push( ...surfacesVisibleSpace );

	}
	//console.log( 'surfacesFilteredSpace', surfacesFilteredSpace );

	return surfacesFilteredSpace;

};



VLA.setViewSpacesShowHide = function() {

	VLAselSpace.selectedIndex = -1;

	VLA.selSpacesFocus();

};



VLA.setViewSurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	}

};
