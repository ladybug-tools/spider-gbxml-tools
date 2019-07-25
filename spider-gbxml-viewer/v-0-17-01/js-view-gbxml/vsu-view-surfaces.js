/* globals THR, GBX, PIN, divDragMoveContent, VSUdet, VSUselAttribute, VBSUselViewBySurfaces, VBSUspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VSU = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View Surfaces (VSU) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "../v-0-17-01/js-view-gbxml/vsu-view-surfaces.md",
		license: "MIT License",
		version: "0.17.01-0vsu"
	}

};



VSU.getMenuViewSurfaces = function() {

	const help = VGC.getHelpButton("VSUbutSum",VSU.script.helpFile);

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
			<select id=VSUselViewSurfaces oninput=VSU.selectedSurfacesFocus(this); style=width:100%; multiple >
			</select>
		</p>

		<p>Attribute to show:
			<select id=VSUselAttribute oninput=VSU.setViewSurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VSUselViewSurfaces,VSU.surfaces); >
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

	let color, text;

	const attribute = VSUselAttribute.value;
	//console.log( 'attribute', attribute );

	const htmOptions = GBX.surfaces.map( (surface, index ) => {

		color = color === 'pink' ? '' : 'pink';

		if ( [ "id", "constructionIdRef" ].includes( attribute ) ) {

			text = surface.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( [ "Name", "CADObjectId" ].includes( attribute ) ) {

			text = surface.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		}

		return `<option style=background-color:${ color } value=${ index } >${ text }</option>`;

	} );

	VSUselViewSurfaces.innerHTML = htmOptions;

	VSUspnCount.innerHTML = `${ GBX.surfaces.length } surfaces found.`;

	THR.controls.enableKeys = false;

};



VSU.selectedSurfacesFocus = function( select ) {

	PIN.intersected = GBX.meshGroup.children[ select.value ];

	PIN.setIntersected( PIN.intersected );

	const indexes = Array.from( select.selectedOptions ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	GBX.meshGroup.children.forEach( mesh => mesh.visible = indexes.includes( mesh.userData.index ) ? true : false );


};