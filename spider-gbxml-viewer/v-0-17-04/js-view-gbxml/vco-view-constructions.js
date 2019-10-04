/* globals THR, GBX, PIN, GSA, VCOdetMenu, VCOselViewConstruction, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VCO = {

	script: {
		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-29",
		description: "View by construction (VCO) provides HTML and JavaScript to view individual construction details.",
		helpFile: "js-view-gbxml/vco-view-constructions.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vco-view-constructions.js",
		version: "0.17.01-1vco"
	}
};



VCO.getMenuViewConstructions = function() {

	const source = `<a href=${ MNU.urlSourceCode + VCO.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VCObutSum",VCO.script.helpFile, POP.footer, source);

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

		<!--
		<p>Select multiple Constructions by pressing shift or control keys</p>
		-->
		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VCOselViewConstructions,VCO.visible); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VCO.getViewConstructionsSelectOptions = function() {

	if ( VCOdetMenu.open === false ) { return; }

	VCOinpSelectIndex.value = "";

	VCOselViewConstructions.size = GBX.constructions.length > 10 ? 10 : GBX.constructions.length + 1;

	const attribute = VCOselAttribute.value;

	let options = GBX.constructions.map( ( surface, index ) => {

		let text;

		if ( [ "id", "constructionIdRef" ].includes( attribute ) ) {

			text = surface.match( `${ attribute }="(.*?)"` );

		} else if ( [ "Name", "LayerId" ].includes( attribute ) ) {

			text = surface.match( `<${ attribute }>(.*?)<\/${ attribute }>` );

		}

		text = text ? text[ 1 ] : "";

		return text;

	} );


	options = options.sort();
	//console.log( 'options', options );

	let color;

	const htmOptions = options.map( ( option, index ) => {

		color = color === 'pink' ? '' : 'pink';

		const construction = GBX.constructions.find( construction => construction.includes( option ) );

		if ( !construction ) { return; }

		const id = construction.match( / id="(.*?)"/i )[ 1 ];

		let text;

		if ( [ "id", "layerIdRef" ].includes( attribute ) ) {

			text = construction.match( `${ attribute }="(.*?)"` );

		} else if ( [ "Name" ].includes( attribute ) ) {

			text = construction.match( `<${ attribute }>(.*?)<\/${ attribute }>` );

		}
		text = text ? text[ 1 ] : "";

		const constructionText = text ? text : "no space name in file";

		return `<option style=background-color:${ color } value=${ id } >${ option }</option>`;

	} );

	VCOselViewConstructions.innerHTML = htmOptions;

};



VCO.selectedConstructionsFocus = function( select ) {

	VGC.setPopupBlank()

	const constructionId = select.value;

	VCO.visible = GBX.surfaces.filter( surface => surface.includes( constructionId ) )
		.map( surface => GBX.surfaces.indexOf( surface ) );

	GBX.meshGroup.children.forEach( ( mesh, index ) => mesh.visible = VCO.visible.includes( index ) ? true: false )

	divDragMoveContent.innerHTML = VCO.getConstruction( constructionId );

	THR.controls.enableKeys = false;

};



VCO.getConstruction = function( constructionId ) {

	const construction = GBX.constructions.find( construction => construction.includes( constructionId ) );

	const parser = new DOMParser();

	const constructionXml = parser.parseFromString( construction, "application/xml" ).documentElement;

	const attributes = GSA.getAttributesHtml( constructionXml );

	const attributesHTM =
	`
		<b>${ constructionId } construction</b>

		<p>${ attributes }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=width:100%; >${ construction }</textarea>

		</details>

	`;

	return attributesHTM;

};