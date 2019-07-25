/* globals THR, GBX, PIN, GSA, VCOdetMenu, VCOselViewConstruction, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VCO = {

	script: {
		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-07-25",
		"description": "View by construction (VCO) provides HTML and JavaScript to view individual construction details.",
		"helpFile": "../v-0-17-01/js-view-gbxml/vco-view-constructions.md",
		license: "MIT License",
		"version": "0.17.01-0vco"
	}
};



VCO.getMenuViewConstructions = function() {

	const help = VGC.getHelpButton("VCObutSum",VCO.script.helpFile);

	const selectOptions = [ "id", "layerIdRef", "Name" ]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	const htm =

	`<details id="VCOdetMenu" ontoggle=VCO.getViewConstructionsSelectOptions(); >

		<summary>VCO Constructions  </summary>

		${ help }

		<p>
			View by constructions. <span id="VCOspnCount" ></span>
		</p>

		<p>
			<input type=search id=VCOinpSelectIndex oninput=VGC.setSelectedIndex(this,VCOselViewConstructions) placeholder="enter an attribute" >
		</p>

		<p>
			<select id=VCOselViewConstructions oninput=VCO.selectedConstructionsFocus(this);
				style=width:100%; size=10 multiple >p
			</select>
		</p>

		<p>Attribute to show:
			<select id=VCOselAttribute oninput=VCO.getViewConstructionsSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple Constructions by pressing shift or control keys</p>
<!--
		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VCOselViewConstructions,VCIselViewSurfaces,VCI.surfaces); >
				Show/hide by surfaces
			</button>
		</p>
-->
	</details>`;

	return htm;

};



VCO.getViewConstructionsSelectOptions = function() {

	if ( VCOdetMenu.open === false ) { return; }

	VCOinpSelectIndex.value = "";

	VCOselViewConstructions.size = GBX.constructions.length > 10 ? 10 : GBX.constructions.length + 1;

	const attribute = VCOselAttribute.value;
	//console.log( 'attribute', attribute );

	let constructionsRefs = GBX.surfaces.map( (surface, surfaceIndex ) => {

		const constructions = surface.match( /constructionIdRef="(.*?)"/i )|| [];

		return constructions.length > 0 ? constructions[ 1 ] : "";

	} );

	constructionsRefs = [...new Set( constructionsRefs )];

	VCO.constructionsRefs = constructionsRefs.sort();
	//console.log( '', VCO.constructionsRefs );

	let color;

	const htmOptions = VCO.constructionsRefs.map( ( constructionsRef, index ) => {

		color = color === 'pink' ? '' : 'pink';

		const construction = GBX.constructions.find( construction => construction.includes( constructionsRef ) );

		if ( !construction ) { return; }

		let text;

		if ( [ "id", "layerIdRef" ].includes( attribute ) ) {

			text = construction.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( [ "Name" ].includes( attribute ) ) {

			text = construction.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		}

		const constructionText = text ? text : "no space name in file";

		return `<option style=background-color:${ color } value=${ constructionsRef } >${ constructionText }</option>`;

	} );

	VCOselViewConstructions.innerHTML = htmOptions;

};



VCO.selectedConstructionsFocus = function( select ) {

	VGC.setPopup()

	const constructionId = select.value;
	//console.log( 'constructionId', constructionId );

	const surfaces = GBX.surfaces.filter( (surface, surfaceIndex ) => {

		return surface.includes( constructionId );

	} );

	GBXU.sendSurfacesToThreeJs( surfaces );

	divDragMoveContent.innerHTML = VCO.getConstruction( constructionId );

};



VCO.getConstruction = function( constructionId ) {

	VCO.constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi );

	//console.log( 'VCO.constructions', VCO.constructions );

	const construction = VCO.constructions.find( construction => construction.includes( constructionId ) );

	const parser = new DOMParser();

	const constructionXml = parser.parseFromString( construction, "application/xml" ).documentElement;

	const atts = GSA.getAttributesHtml( constructionXml );

	const attributesHTM =
	`
		<b>${ constructionId } construction</b>

		<p>${ atts }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=width:100%; >${ construction }</textarea>

		</details>

	`;

	//console.log( 'attributesHTM', attributesHTM );

	return attributesHTM;


};