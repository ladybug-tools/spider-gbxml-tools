/* globals GBX, PIN, ISCOR, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VMA = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View materials (VMA)",
		helpFile: "../v-0-17-01/js-view-gbxml/vma-view-materials.md",
		license: "MIT License",
		version: "0.17-01-0vma",

	}

};



VMA.getMenuViewMaterials = function() {

	const help = VGC.getHelpButton("VMAbutSum",VMA.script.helpFile);

	const selectOptions = ["id", "Name"]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`)

	const htm =

	`<details id="VMAdet" ontoggle=VMA.setViewMaterialsSelectOptions(); >

		<summary>VMA Materials </summary>

		${ help }

		<p>
			View materials. <span id="VMAspnCount" ></span>
		</p>

		<p>
			<input type=search id=VMAinpSelectIndex oninput=VGC.setSelectedIndex(this,VMAselViewMaterials) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VMAselViewMaterials oninput=VMA.selMaterialsFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VMAselAttribute oninput=VMA.setViewMaterialsSelectOptions(); >${ selectOptions }</select></p>

		<p>TBD: viewing surfaces by material</p>

<!--
		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VMAselViewMaterials,VMA.surfaces); >
				Show/hide by surfaces
			</button>
		</p>
-->

	</details>`;

	return htm;

};



VMA.setViewMaterialsSelectOptions = function() {

	if ( VMAdet.open === false ) { return; }

	VMAinpSelectIndex.value = "";

	VMAselViewMaterials.size = GBX.materials.length > 10 ? 10 : GBX.materials.length + 1;

	const attribute = VMAselAttribute.value;
	//console.log( 'attribute', attribute );

	let color, text;

	const htmOptions = GBX.materials.map( (surface, index ) => {

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

	VMAselViewMaterials.innerHTML = htmOptions;

	VMAspnCount.innerHTML = `${ GBX.materials.length } materials found`;

	THR.controls.enableKeys = false;

};



VMA.selMaterialsFocus = function( select ) {

	VGC.setPopupBlank();

	divDragMoveContent.innerHTML = VMA.getMaterialsAttributes( select.value );

};



VMA.getMaterialsAttributes = function( index ) {

	const typeTxt = GBX.materials[ index ];

	const typeId = typeTxt.match( ` id="(.*?)"` )[ 1 ];

	const typeXml = PIN.parser.parseFromString( typeTxt, "application/xml").documentElement;
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