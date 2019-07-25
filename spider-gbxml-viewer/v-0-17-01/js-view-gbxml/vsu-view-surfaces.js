/* globals THR, GBX, POPX, divDragMoveContent, VSUdet, VSUselAttribute, VBSUselViewBySurfaces, VBSUspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VSU = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-22",
		description: "View Surfaces (VSU) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "../v-0-17-00/js-view-gbxml/vsu-view-surfaces.md",
		license: "MIT License",
		version: "0.17.00-1vsu"
	}

};



VSU.getMenuViewSurfaces = function() {

	const help = VGC.getHelpButton("VSUbutSum",VSU.script.helpFile);

	const selectOptions = [ "id", "CADObjectId", "constructionIdRef", "Name" ]
		.map( option => `<option>${ option }</option>`);

	const htm =

	`<details id="VSUdet" ontoggle=VSU.setViewSurfacesSelectOptions(); >

		<summary>Surfaces</summary>

		${ help }

		<p>
			View gbXMLsurfaces one at a time. <span id="VSUspnCount" ></span>
		</p>

		<p>
			<input type=search id=VSUinpSelectIndex oninput=VGC.setSelectedIndex(this,VSUselViewSurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VSUselViewSurfaces oninput=VSU.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
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

	const attribute = VSUselAttribute.value;
	//console.log( 'attribute', attribute );

	VSUinpSelectIndex.value = "";

	let color, text;

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



VSU.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex = str && option ? option.index : -1;

};



VSU.selectedSurfacesFocus = function( select ) {

	POPX.intersected = GBX.meshGroup.children[ select.value ];

	POPX.setIntersected( POPX.intersected );

	const options = select.selectedOptions;
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	VSU.surfaces = indexes.map( index => GBX.surfaces[ index ] );

	GBXU.sendSurfacesToThreeJs( VSU.surfaces );

};



VSU.setViewSurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( VSUselViewSurfaces.selectedIndex === -1 ) { alert( "First, select a surface from the list"); return; }

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBXU.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.meshGroup.children.forEach( element => element.visible = true );

	}

};