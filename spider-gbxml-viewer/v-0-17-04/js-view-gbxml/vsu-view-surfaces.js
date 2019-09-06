"use strict";

/* globals THR, GBX, PIN, divDragMoveContent, VSUdet, VSUselAttribute, VBSUselViewBySurfaces, VBSUspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VSU = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-26",
		description: "View Surfaces (VSU) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "s-view-gbxml/vsu-view-surfaces.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vsu-view-surfaces.js",
		version: "0.17.01-1vsu"
		
	}

};


VSU.colorsHex = {

	InteriorWall: "#008000",
	ExteriorWall: "#FFB400",
	Roof: "#800000",
	InteriorFloor: "#80FFFF",
	ExposedFloor: "#40B4FF",
	Shade: "#FFCE9D",
	UndergroundWall: "#A55200",
	UndergroundSlab: "#804000",
	Ceiling: "#FF8080",
	Air: "#FFFF00",
	UndergroundCeiling: "#408080",
	RaisedFloor: "#4B417D",
	SlabOnGrade: "#804000",
	FreestandingColumn: "#808080",
	EmbeddedColumn: "#80806E",
	Undefined: "#88888888"

};


VSU.getMenuViewSurfaces = function() {

	const source = `<a href=${ MNU.urlSourceCode + VSU.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VSUbutSum",VSU.script.helpFile,POP.footer,source);

	const selectOptions = [ "id", "CADObjectId", "constructionIdRef", "Name" ]
		.map( option => `<option>${ option }</option>`);

	const htm =

	`<details id="VSUdet" ontoggle=VSU.setViewSurfacesSelectOptions(); >

		<summary>VSU Surfaces</summary>

		${ help }

		<p>
			View gbXMLsurfaces one at a time. <span id="VSUspnCount" ></span>
		</p>

		<p>
			<input type=search id=VSUinpSelectIndex oninput=VGC.setSelectedIndex(this,VSUselViewSurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VSUselViewSurfaces onclick=VSU.selectedSurfacesFocus(this); oninput=VSU.selectedSurfacesFocus(this); style=width:100%; multiple >
			</select>
		</p>

		<p>Attribute to show:
			<select id=VSUselAttribute oninput=VSU.setViewSurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VGC.toggleViewSelectedMeshes(this,VSUselViewSurfaces,VSU.indexes); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VSU.setViewSurfacesSelectOptions = function() {

	if ( VSUdet.open === false ) { return; }

	VSUinpSelectIndex.value = "";

	VSUselViewSurfaces.size = GBX.surfaces.length > 10 ? 10 : GBX.surfaces.length + 1;

	const attribute = VSUselAttribute.value;

	const options = GBX.surfaces.map( ( surface, index ) => {

		let text;

		if ( [ "id", "constructionIdRef" ].includes( attribute ) ) {

			text = surface.match( `${ attribute }="(.*?)"` );

		} else if ( [ "Name", "CADObjectId" ].includes( attribute ) ) {

			text = surface.match( `<${ attribute }>(.*?)<\/${ attribute }>` );

		}

		text = text ? text[ 1 ] : "";

		return { text, index };

	} );

	options.sort();

	const htmOptions = options.map( option => {

		const data = GBX.meshGroup.children[ option.index ].userData;

		const color = VSU.colorsHex[ data.surfaceType ];

		return `<option style=color:#ff0;background-color:${ color } value=${ option.index } title="id: ${ data.surfaceId }" >${ option.text }</option>`;

	} );

	VSUselViewSurfaces.innerHTML = htmOptions;

	VSUspnCount.innerHTML = `${ GBX.surfaces.length } surfaces found.`;

	THR.controls.enableKeys = false;

};



VSU.selectedSurfacesFocus = function( select ) {

	PIN.intersected = GBX.meshGroup.children[ select.value ];

	PIN.setIntersected( PIN.intersected );

	VSU.indexes = Array.from( select.selectedOptions ).map( option => Number( option.value ) );

	GBX.meshGroup.children.forEach( mesh => mesh.visible = VSU.indexes.includes( mesh.userData.index ) ? true : false );

};