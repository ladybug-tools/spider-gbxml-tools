// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POPX, ISCOR, POPdivMain*/
/* jshint esversion: 6 */

const VBW = {

	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "View by Surfaces (VBW) provides HTML and JavaScript to view individual surfaces.",
		"helpFile": "../js-view/vbw-view-by-window-types.md",
		"version": "0.16-01-2vbw",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbw-view-by-window-types.js",

	}

};



VBW.getMenuViewByWindowTypes = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBWdet.open = false; }, false );

	const help = `<button id="butVBWsum" class="butHelp" onclick="POP.setPopupShowHide(butVBWsum,VBW.script.helpFile);" >?</button>`;

	const selectOptions = [ "id", "Name", "Description", "U-value", "SolarHeatGainCoeff", "Transmittance" ].map( option => `<option>${ option }</option>`)

	const htm =

	`<details id="VBWdet" ontoggle=VBW.setViewBySurfacesSelectOptions(); >

		<summary>Window types ${ help }</summary>

		<p>
			View surfaces one at a time. <span id="VBWspnCount" ></span>
		</p>

		<p>
			<input id=VBWinpSelectIndex oninput=VBW.setSelectedIndex(this,VBWselViewByWindowTypes) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VBWselViewByWindowTypes oninput=VBW.selWindowTypesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show: <select id=VBWselAttribute oninput=VBW.setViewBySurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple surfaces by pressing shift or control keys</p>

		<p>
			<button onclick=VBW.setViewBySurfaceShowHide(this,VBW.surfaces); >
				Show/hide surfaces
			</button>
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

	VBWselViewByWindowTypes.innerHTML = htmOptions;
	VBWspnCount.innerHTML = `${ GBX.windowTypes.length } types found`;

	THR.controls.enableKeys = false;

};



VBW.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.toLowerCase().includes( str ) );

	select.selectedIndex =  str && option ? option.value : -1;

};



VBW.selWindowTypesFocus = function( select ) {

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	POPdivMain.innerHTML = VBW.getWindowTypesAttributes( VBWselViewByWindowTypes.value );

	VBW.surfacesFilteredByWindowType = VBW.getSurfacesFilteredByWindowType();

	//VBWdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBW.surfacesFilteredByWindowType );


};



VBW.getWindowTypesAttributes = function( index ) {

	const typeTxt = GBX.windowTypes[ index ];

	const typeId = typeTxt.match( ` id="(.*?)"` )[ 1 ];

	const typeXml = POPX.parser.parseFromString( typeTxt, "application/xml").documentElement;
	//console.log( 'typeXml ', typeXml );

	const htmType = GSA.getAttributesHtml( typeXml );

	const htm =
	`
		<b>${ typeId } Attributes</b>

		<p>${ htmType }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=width:100%; >${ typeTxt }</textarea>

		</details>
	`;

	return htm;

};


VBW.getSurfacesFilteredByWindowType = function(  ) {

	const options = VBWselViewByWindowTypes.selectedOptions;

	VBW.setOpenings();

	for ( let option of options ) {
		console.log( 'option', option );

		const typeTxt = GBX.windowTypes[ Number( option.value ) ];

		const typeId = typeTxt.match( ` id="(.*?)"` )[ 1 ];
		//console.log( 'typeId', typeId );

		VBW.openings.forEach( ( opening, index ) => {

			let windowTypeIdRef = opening.match( / windowTypeIdRef="(.*?)"/ )
			windowTypeIdRef = windowTypeIdRef ? windowTypeIdRef[ 1 ] : "";

			GBX.surfaceOpenings.children[ index ].visible = windowTypeIdRef === typeId ? true : false;

		} );

	}


//	return surfacesFilteredByWindowTypes;

};




VBW.setOpenings = function() {

	VBW.openings = [];

	GBX.surfaces.forEach( surface => {

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		openings.forEach( opening  => VBW.openings.push(  opening ) );

	} );

}



//console.log( 'VBO.openings', VBO.openings );
//////////

VBW.cccccselectedSurfacesFocus = function( select ) {


	POPX.intersected = GBX.surfaceGroup.children[ select.value ];

	POPdivMain.innerHTML = POPX.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const options = select.selectedOptions
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	VBW.surfaces = GBX.surfacesIndexed.filter( ( surface, index ) => indexes.includes( index  ) );

	GBX.sendSurfacesToThreeJs( VBW.surfaces );

};



VBW.setViewBySurfaceShowHide = function( button ) {

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = false );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};