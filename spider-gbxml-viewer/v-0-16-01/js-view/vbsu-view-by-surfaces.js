/* globals THR, GBX, POPX, POPdivPopupData, VBSUdet, VBSUselAttribute, VBSUselViewBySurfaces, VBSUspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VBSU = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "View by Surfaces (VBSU) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbsu-view-by-surfaces.md",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",
		"version": "0.16-01-3vbsu"

	}

};



VBSU.getMenuViewBySurfaces = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBSUdet.open = false; }, false );

	const help = `<button id="butVBSUsum" class="butHelp" onclick="POP.setPopupShowHide(butVBSUsum,VBSU.script.helpFile);" >?</button>`;

	const selectOptions = [ "id", "CADObjectId", "constructionIdRef", "Name" ]
		.map( option => `<option>${ option }</option>`);

	const htm =

	`<details id="VBSUdet" ontoggle=VBSU.setViewBySurfacesSelectOptions(); >

		<summary>Surfaces individually<span id="VBSUspnCount" ></span> ${ help }</summary>

		<p>
			View surfaces one at a time.
		</p>

		<p>
			<input id=VBSUinpSelectIndex oninput=VBSU.setSelectedIndex(this,VBSUselViewBySurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VBSUselViewBySurfaces oninput=VBSU.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show:
			<select id=VBSUselAttribute oninput=VBSU.setViewBySurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VBSU.setViewBySurfaceShowHide(this,VBSU.surfaces); >
				Show/hide by surfaces
			</button> <mark>What would be useful here?</mark>
		</p>

	</details>`;

	return htm;

};



VBSU.setViewBySurfacesSelectOptions = function() {

	if ( VBSUdet.open === false ) { return; }

	const attribute = VBSUselAttribute.value;
	//console.log( 'attribute', attribute );

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

	VBSUselViewBySurfaces.innerHTML = htmOptions;
	VBSUspnCount.innerHTML = `: ${ GBX.surfaces.length } found`;

	THR.controls.enableKeys = false;

};



VBSU.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str ? option.value : -1;

};



VBSU.selectedSurfacesFocus = function( select ) {

	POPX.intersected = GBX.surfaceGroup.children[ select.value ];

	POPdivPopupData.innerHTML = POPX.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const options = select.selectedOptions;
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	//VBSU.surfaces = GBX.surfacesIndexed.filter( ( surface, index ) => indexes.includes( index  ) );

	VBSU.surfaces = indexes.map( index => GBX.surfacesIndexed[ index ] );

	GBX.sendSurfacesToThreeJs( VBSU.surfaces );

};



VBSU.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};