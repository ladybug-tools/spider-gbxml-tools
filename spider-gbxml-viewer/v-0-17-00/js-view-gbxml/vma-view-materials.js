/* globals GBX, POPX, ISCOR, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VMA = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-22",
		description: "View materials (VMA)",
		helpFile: "../v-0-17-00/js-view-gbxml/vma-view-materials.md",
		license: "MIT License",
		version: "0.17-00-1vma",

	}

};



VMA.getMenuViewMaterials = function() {

	const help = VGC.getHelpButton("VMAbutSum",VMA.script.helpFile);

	const selectOptions = ["id", "Name"]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`)

	const htm =

	`<details id="VMAdet" ontoggle=VMA.setViewMaterialsSelectOptions(); >

		<summary>Materials </summary>

		${ help }

		<p>
			View materials. <span id="VMAspnCount" ></span>
		</p>

		<p>
			<input type=search id=VMAinpSelectIndex oninput=VGC.setSelectedIndex(this,VMAselViewSurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VMAselViewSurfaces oninput=VMA.selMaterialsFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VMAselAttribute oninput=VMA.setViewMaterialsSelectOptions(); >${ selectOptions }</select></p>

		<p>TBD: viewing surfaces by material</p>

<!--
		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VMAselViewSurfaces,VMA.surfaces); >
				Show/hide by surfaces
			</button>
		</p>
-->

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

	VMAspnCount.innerHTML = `: ${ GBX.materials.length } materials found`;

};



VMA.selMaterialsFocus = function( select ) {

	VGC.setPopup

	divDragMoveContent.innerHTML = VMA.getMaterialsAttributes( select.value );

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