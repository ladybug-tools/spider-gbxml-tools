/* globals THR, GBX, POPX, GSA, VCOdetMenu, VCOselViewConstruction, divDragMoveContent*/
// jshint esversion: 6
/* jshint loopfunc: true */

const VCO = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-07-20",
	"description": "View by construction (VCO) provides HTML and JavaScript to view individual construction details.",
	"helpFile": "../js-view-gbxml/vco-view7-constructions.md",
	"version": "0.17.00-0vco",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxml/vco-view-constructions.js",

};



VCO.getMenuViewConstructions = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VCOdetMenu.open = false; }, false );

	const foot = `v${ VCO.version} - ${ VCO.date }`;

	const help = `<button id="butVCOsum" class="butHelp" onclick="POP.setPopupShowHide(butVCOsum,VCO.helpFile,'${foot}');" >?</button>`;

	const selectOptions = [ "id", "layerIdRef", "Name" ]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	const htm =

	`<details id="VCOdetMenu" ontoggle=VCO.getViewConstructionsSelectOptions(); >

		<summary>Constructions  ${ help }</summary>

		<p>
			View by constructions. <span id="VCOspnCount" ></span>
		</p>

		<p>
			<input type=search id=VCOinpSelectIndex oninput=VCO.setSelectIndex(this,VCOselViewConstructions) placeholder="enter an id" >
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
			<button onclick=VCO.setViewConstructionsShowHide(this,VCO.surfaceWithConstructions); >
				Show/hide by constructions
			</button>
		</p>
-->
	</details>`;

	return htm;

};



VCO.setSelectIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	console.log( 'option', option.value );

	select.selectedIndex =  str && option ? option.index : -1;

};



VCO.getViewConstructionsSelectOptions = function() {

	//VBO.constructions = []; //GBX.surfaces.slice();

	if ( VCOdetMenu.open === false ) { return; }

	//VCOselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const attribute = VCOselAttribute.value;
	//console.log( 'attribute', attribute );

	VCOinpSelectIndex.value = "";

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

	

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	const constructionId = select.value;
	//console.log( 'constructionId', constructionId );

	const surfaces = GBX.surfaces.filter( (surface, surfaceIndex ) => {

		return surface.includes( constructionId );

	} );

	GBXU.sendSurfacesToThreeJs( surfaces );

	divDragMoveContent.innerHTML = VCO.getConstruction( constructionId );

	divDragMoveFooter.innerHTML = POPF.footer;

	navDragMove.hidden = false;

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