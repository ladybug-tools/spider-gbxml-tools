/* globals GBX, POPX, ISCOR, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VMA = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-20",
		"description": "View materials (VMA)",
		"helpFile": "../js-view-gbxml/vma-view-materials.md",
		"version": "0.17-00-0vma",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxml/vma-view-materials.js",

	}

};



VMA.getMenuViewMaterials = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VMAdet.open = false; }, false );

	const help = `<button id="butVMAsum" class="butHelp" onclick="POP.setPopupShowHide(butVMAsum,VMA.script.helpFile);" >?</button>`;

	const selectOptions = ["id", "Name"]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`)

	const htm =

	`<details id="VMAdet" ontoggle=VMA.setViewMaterialsSelectOptions(); >

		<summary>Materials ${ help }</summary>

		<p>
			View materials. <span id="VMAspnCount" ></span>
		</p>

		<p>
			<input type=search id=VMAinpSelectIndex oninput=VMA.setSelectedIndex(this,VMAselViewSurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VMAselViewSurfaces oninput=VMA.selMaterialsFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VMAselAttribute oninput=VMA.setViewMaterialsSelectOptions(); >${ selectOptions }</select></p>

		<p>TBD: viewing surfaces by material</p>

		<p>
			<button onclick=VMA.setViewSurfaceShowHide(this,VMA.surfaces); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};


VMA.setViewMaterialsSelectOptions = function() {

	if ( VMAdet.open === false ) { return; }

	const attribute = VMAselAttribute.value;
	//console.log( 'attribute', attribute );

	VMAinpSelectIndex.value = ""

	let color, text;

	htmOptions = GBX.materials.map( (surface, index ) => {

		color = color === 'pink' ? '' : 'pink';

		if ( [ "id" ].includes( attribute ) ) {

			text = surface.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( attribute === "Name" ) {

			text = surface.match( /<Name>(.*?)<\/Name>/i );
			//console.log( 'text', text );
			text = text ? text[ 1 ] : "";

		}

		return `<option style=background-color:${ color } value=${ index } >${ text }</option>`;

	} );

	VMAselViewSurfaces.innerHTML = htmOptions;
	VMAspnCount.innerHTML = `: ${ GBX.materials.length } found`;

	THR.controls.enableKeys = false;

};



VMA.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.value =  option ? option.index : "";

};



VMA.selMaterialsFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	divDragMoveContent.innerHTML = VMA.getMaterialsAttributes( select.value );

	//VMA.surfacesFilteredSpace = VMA.getSurfacesFilteredSpace();

	//VMAdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VMA.surfacesFilteredSpace );

	divDragMoveFooter.innerHTML = POPF.footer;

	navDragMove.hidden = false;


};



VMA.getMaterialsAttributes = function( index ) {

	const typeTxt = GBX.materials[ index ];

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