/* globals GBX, POPX, ISCOR, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VLA = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-22",
		description: "View by layers (VLA) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "../v-0-17-00/js-view-gbxml/vla-view-layers.md",
		license: "MIT License",
		version: "0.17-00-1vla"
	}

};



VLA.getMenuViewLayers = function() {

	const help = VGC.getHelpButton("VLAbutSum",VLA.script.helpFile);

	const htm =

	`<details id="VLAdet" ontoggle=VLA.setViewLayersSelectOptions(); >

		<summary>Layers </summary>

		${ help }

		<p>
			View layers. <span id="VLAspnCount" ></span>
		</p>

		<p>
			<input type=search id=VLAinpSelectIndex oninput=VGC.setSelectedIndex(this,VLAselViewLayers) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VLAselViewLayers oninput=VLA.selLayersFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

	</details>`;

	return htm;

};



VLA.setViewLayersSelectOptions = function() { // needs cleanup!!

	if ( VLAdet.open === false ) { return; }

	const attribute = "id"; //VLAselAttribute.value;
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

	VLAspnCount.innerHTML = `${ GBX.layers.length } layers found`;

};



VLA.selLayersFocus = function( select ) {

	VGC.setPopup();

	divDragMoveContent.innerHTML = VLA.getLayersAttributes( select.value );

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