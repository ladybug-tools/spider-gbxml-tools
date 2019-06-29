/* globals GBX, POPX, ISCOR, POPdivPopupData*/
// jshint esversion: 6
// jshint loopfunc: true

const VBM = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "View by materials (VBM)",
		"helpFile": "../js-view/vbm-view-by-materials.md",
		"version": "0.16-01-1vbm",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbm-view-by-materials.js",

	}

};



VBM.getMenuViewByMaterials = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBMdet.open = false; }, false );

	const help = `<button id="butVBMsum" class="butHelp" onclick="POP.setPopupShowHide(butVBMsum,VBM.script.helpFile);" >?</button>`;

	const selectOptions = ["id", "Name"]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`)

	const htm =

	`<details id="VBMdet" ontoggle=VBM.setViewByMaterialsSelectOptions(); >

		<summary>Materials ${ help }</summary>

		<p>
			View materials. <span id="VBMspnCount" ></span>
		</p>

		<p>
			<input id=VBMinpSelectIndex oninput=VBM.setSelectedIndex(this,VBMselViewBySurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VBMselViewBySurfaces oninput=VBM.selMaterialsFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VBMselAttribute oninput=VBM.setViewByMaterialsSelectOptions(); >${ selectOptions }</select></p>

		<p>TBD: viewing surfaces by material</p>

		<p>
			<button onclick=VBM.setViewBySurfaceShowHide(this,VBM.surfaces); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};


VBM.setViewByMaterialsSelectOptions = function() {

	if ( VBMdet.open === false ) { return; }

	const attribute = VBMselAttribute.value;
	//console.log( 'attribute', attribute );

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

	VBMselViewBySurfaces.innerHTML = htmOptions;
	VBMspnCount.innerHTML = `: ${ GBX.materials.length } found`;

	THR.controls.enableKeys = false;

};



VBM.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.value =  option ? option.value : "";

};


VBM.selMaterialsFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	POPdivPopupData.innerHTML = VBM.getMaterialsAttributes( select.value );

	//VBM.surfacesFilteredBySpace = VBM.getSurfacesFilteredBySpace();

	//VBMdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBM.surfacesFilteredBySpace );


};



VBM.getMaterialsAttributes = function( index ) {

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