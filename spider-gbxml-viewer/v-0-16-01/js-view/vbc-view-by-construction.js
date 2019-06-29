/* globals THR, GBX, POPX, GSA, VBCdetMenu, VBCselViewByConstruction, POPdivPopupData*/
// jshint esversion: 6
/* jshint loopfunc: true */

const VBC = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-28",
	"description": "View by construction (VBC) provides HTML and JavaScript to view individual construction details.",
	"helpFile": "../js-view/vbc-view-by-construction.md",
	"version": "0.16-01-2vbc",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbc-view-by-construction.js",

};



VBC.getMenuViewByConstruction = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBCdetMenu.open = false; }, false );

	const foot = `v${ VBC.version} - ${ VBC.date }`;

	const help = `<button id="butVBCsum" class="butHelp" onclick="POP.setPopupShowHide(butVBCsum,VBC.helpFile,'${foot}');" >?</button>`;

	const selectOptions = [ "id", "layerIdRef", "Name" ]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	const htm =

	`<details id="VBCdetMenu" ontoggle=VBC.getViewByConstructionSelectOptions(); >

		<summary>Construction  ${ help }</summary>

		<p>
			View by construction. <span id="VBCspnCount" ></span>
		</p>

		<p>
			<input id=VBCinpSelectIndex oninput=VBC.setSelectIndex(this,VBCselViewByConstruction) placeholder="enter an id" >
		</p>

		<p>
			<select id=VBCselViewByConstruction oninput=VBC.selectedConstructionFocus(this);
				style=width:100%; size=10 multiple >p
			</select>
		</p>

		<p>Attribute to show:
			<select id=VBCselAttribute oninput=VBC.getViewByConstructionSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple Constructions by pressing shift or control keys</p>
<!--
		<p>
			<button onclick=VBC.setViewByConstructionShowHide(this,VBC.surfaceWithConstruction); >
				Show/hide by construction
			</button>
		</p>
-->
	</details>`;

	return htm;

};




VBC.getViewByConstructionSelectOptions = function() {

	//VBO.constructions = []; //GBX.surfaces.slice();

	if ( VBCdetMenu.open === false ) { return; }

	//VBCselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const attribute = VBCselAttribute.value;
	//console.log( 'attribute', attribute );

	let constructionRefs = GBX.surfaces.map( (surface, surfaceIndex ) => {

		const construction = surface.match( /constructionIdRef="(.*?)"/i )|| [];

		return construction.length > 0 ? construction[ 1 ] : "";

	} );

	constructionRefs = [...new Set( constructionRefs )];
	VBC.constructionRefs = constructionRefs.sort();
	//console.log( '', VBC.constructionRefs );

	let color;

	const htmOptions = VBC.constructionRefs.map( ( constructionRef, index ) => {

		color = color === 'pink' ? '' : 'pink';

		construction = GBX.constructions.find( construction => construction.includes( constructionRef ) );

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


		return `<option style=background-color:${ color } value=${ constructionRef } >${ constructionText }</option>`;

	} );

	VBCselViewByConstruction.innerHTML = htmOptions;

};



VBC.setSelectIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );
	console.log( 'option', option.value );

	select.selectedIndex =  str && option ? option.value : -1;

};



VBC.selectedConstructionFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	const constructionId = select.value;
	//console.log( 'constructionId', constructionId );

	const surfaces = GBX.surfacesIndexed.filter( (surface, surfaceIndex ) => {

		return surface.includes( constructionId );

	} );

	GBX.sendSurfacesToThreeJs( surfaces );

	VBC.getConstruction( constructionId );

};



VBC.getConstruction = function( constructionId ) {

	VBC.constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi );

	//console.log( 'VBC.constructions', VBC.constructions );

	const construction = VBC.constructions.find( construction => construction.includes( constructionId ) );

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

	POPdivPopupData.innerHTML = attributesHTM;


};