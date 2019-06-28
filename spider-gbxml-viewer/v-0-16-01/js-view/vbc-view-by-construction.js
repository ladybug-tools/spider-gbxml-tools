/* globals GBX */
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

	constructions = GBX.surfaces.map( (surface, surfaceIndex ) => {

		construction = surface.match( /constructionIdRef="(.*?)"/i )|| [];

		return construction.length > 0 ? construction[ 1 ] : "";

	} )

	constructions = [...new Set( constructions )];
	VBC.constructionRefs = constructions.sort();
	console.log( '', VBC.constructionRefs );

	let color;

	htmOptions = VBC.constructionRefs.map( construction => {

		color = color === 'pink' ? '' : 'pink';

		return `<option style=background-color:${ color }  >${ construction }</option>`;

	} )

	VBCselViewByConstruction.innerHTML = htmOptions;

};



VBC.selectedConstructionFocus = function( button ) {

	THR.controls.enableKeys = false;

	//POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	constructionId = button.value;
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

	construction = VBC.constructions.find( construction => construction.includes( constructionId ) );

	const parser = new DOMParser();
	const constructionXml = parser.parseFromString( construction, "application/xml" ).documentElement;

	const atts = GSA.getAttributesHtml( constructionXml );
	attributesHTM =
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