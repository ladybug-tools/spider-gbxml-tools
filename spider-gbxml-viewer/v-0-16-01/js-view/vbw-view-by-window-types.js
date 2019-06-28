// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POPX, ISCOR, POPdivPopupData*/
/* jshint esversion: 6 */

const VBW = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-27",
		"description": "View by Surfaces (VBW) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbsu-view-by-surfaces.md",
		"version": "0.16-01-2vbsu",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-view",

	}

};



VBW.getMenuViewByWindowTypes = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBWdet.open = false; }, false );

	const help = `<button id="butVBWsum" class="butHelp" onclick="POP.setPopupShowHide(butVBWsum,VBW.script.helpFile);" >?</button>`;

	const selectOptions = ["id", "Name", "Description", "U-value", "SolarHeatGainCoeff ", "Transmittance" ].map( option => `<option>${ option }</option>`)

	const htm =

	`<details id="VBWdet" ontoggle=VBW.setViewBySurfacesSelectOptions(); >

		<summary>Window Types<span id="VBWspnCount" ></span> ${ help }</summary>

		<p>
			View surfaces one at a time
		</p>

		<p>
			<input id=VBWinpSelectIndex oninput=VBW.setSelectedIndex(this,VBWselViewBySurfaces) placeholder="Enter an attribute" >

		</p>

		<p>
			<select id=VBWselViewBySurfaces oninput=VBW.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VBWselAttribute oninput=VBW.setViewBySurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VBW.setViewBySurfaceShowHide(this,VBW.surfaces); >
				Show/hide by surfaces
			</button> <mark>What would be useful here?</mark>
		</p>

	</details>`;

	return htm;

};


VBW.setViewBySurfacesSelectOptions = function() {

	if ( VBWdet.open === false ) { return; }

	const attribute = VBWselAttribute.value;
	//console.log( 'attribute', attribute );

	let color, text;

	if ( !GBX.windowTypes ){

		GBX.windowTypes = GBX.text.filter( text => {

			types = GBX.text.match( /<WindowTypes(.*?)<\/WindowTypes>/gi );
			return Array.isArray( GBX.zones ) ? GBX.zones : [];

		} );

	}
	//console.log( 'GBX.windowTypes', GBX.windowTypes );


	htmOptions = GBX.windowTypes.map( ( type, index ) => {

		color = color === 'pink' ? '' : 'pink';

		if ( [ "id" ].includes( attribute ) ) {

			text = type.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";
			//console.log( 'text', text );

		} else if ( [ "Name", "Description" ].includes( attribute )   ) {

			text = type.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
			//console.log( 'text', text );
			text = text ? text[ 1 ] : "";

		} else if ( [ "U-value", "SolarHeatGainCoeff", "Transmittance" ].includes( attribute ) ) {

			text = type.match( `<${ attribute }(.*?)>(.*?)<\/${ attribute }>` );
			//console.log( 'text', text );
			text = text ? text[ 2 ] : "";

		}

		return `<option style=background-color:${ color } value=${ index } >${ text }</option>`;

	} );

	VBWselViewBySurfaces.innerHTML = htmOptions;
	VBWspnCount.innerHTML = `: ${ GBX.windowTypes.length } found`;

	THR.controls.enableKeys = false;

};



VBW.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.value =  option ? option.value : "";

};



VBW.selectedSurfacesFocus = function( select ) {

	alert( "coming soon")

	return;

	POPX.intersected = GBX.surfaceGroup.children[ select.value ];

	POPdivPopupData.innerHTML = POPX.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const options = select.selectedOptions
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	VBW.surfaces = GBX.surfacesIndexed.filter( ( surface, index ) => indexes.includes( index  ) );

	GBX.sendSurfacesToThreeJs( VBW.surfaces );

};



VBW.setViewBySurfaceShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};