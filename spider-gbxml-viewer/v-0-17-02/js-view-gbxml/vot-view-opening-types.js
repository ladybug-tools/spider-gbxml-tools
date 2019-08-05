/* globals GBX, GBXU, THR, PIN, VGC, VOTdetMenu, divDragMoveContent, VOTselSpace, VOTinpAttribute, VOTspnCount, VOTdivReportsLog, VOTselAttribute */
// jshint esversion: 6
// jshint loopfunc: true

const VOT = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-31",
		description: "View the opening types",
		helpFile: "js-view-gbxml/vot-view-opening-types.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vot-view-opening-types.js",
		version: "0.17-01-0vot"

	}

};



VOT.getMenuViewOpeningTypes = function() {

	const source = `<a href=${ MNU.urlSourceCode + VOT.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VOTbutSum",VOT.script.helpFile,POP.footer,source);

	const htm =
	`
		<details id=VOTdetMenu ontoggle=VOT.setViewOpeningTypesOptions(); >

			<summary>VOT OpeningTypes </summary>

			${ help }

			<p>Display openings by opening type. <span id="VOTspnCount" ></span></p>

			<div id="VOTdivViewOpeningTypes" >
				<select id=VOTselOpeningTypes onchange=VOT.selOpeningTypesFocus(this); multiple style=min-width:15rem; ></select
			</div>

			<p id="VOTdivReportsLog" ></p>


			<p>Select multiple opening types by pressing shift or control keys</p>

			<p>
				<button onclick=VGC.toggleViewSelectedOrAll(this,VOTselOpeningTypes,VOT.surfacesWithOpenings); >
					Show/hide all opening types
				</button>
			</p>

		</details>
	`;

	return htm;
};



VOT.setViewOpeningTypesOptions = function(  ) {

	if ( VOTdetMenu.open === false ) { return; }

	let types = GBX.openings.map( opening => opening.match( / openingType="(.*?)"/i )[ 1 ] );

	VOT.types = [ ... new Set( types ) ].sort();

	const options = VOT.types.map( ( type, index ) =>

		`<option style=background-color:${ index * 2 ? "pink" : "" } >${ type }</option>`

	);

	VOTselOpeningTypes.innerHTML = options;

};



VOT.selOpeningTypesFocus = function( select ) {

	VGC.setPopupBlank();

	GBX.openingGroup.children.forEach( opening => opening.visible = false );

	VOT.surfacesWithOpenings = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const type = option.innerText;

		const surfacesWithOpenings = GBX.surfaces.filter( opening => opening.includes( type ) );

		VOT.surfacesWithOpenings.push( ...surfacesWithOpenings );

		GBX.openings.filter( opening => opening.includes( type ) )
			.map( item => GBX.openings.indexOf( item ) )
			.forEach( index => GBX.openingGroup.children[ index ].visible = true );

	} );

	GBXU.sendSurfacesToThreeJs( VOT.surfacesWithOpenings );

};