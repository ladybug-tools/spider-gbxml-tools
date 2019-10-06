/* globals GBX, PIN, ISCOR, divDragMoveContent*/
// jshint esversion: 6
// jshint loopfunc: true

const VWT = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-29",
		description: "View by Surfaces (VWT) provides HTML and JavaScript to view individual window types",
		helpFile: "js-view-gbxml/vwt-view-window-types.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vwt-view-window-types.js",
		version: "0.17.01-2vwt"

	}

};



VWT.getMenuViewWindowTypes = function() {

	const source = `<a href=${ MNU.urlSourceCode + VWT.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VWTbutSum",VWT.script.helpFile, POP.footer,source);

	const selectOptions = [ "id", "Name", "Description", "U-value", "SolarHeatGainCoeff", "Transmittance" ].map( option => `<option>${ option }</option>`)

	const htm =

	`<details id="VWTdet" ontoggle=VWT.setViewSurfacesSelectOptions(); >

		<summary>VWT Window types</summary>

		${ help }

		<p>
			View types one at a time. <span id="VWTspnCount" ></span>
		</p>

		<p>
			<input type=search id=VWTinpSelectIndex oninput=VGC.setSelectedIndex(this,VWTselViewWindowTypes) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VWTselViewWindowTypes oninput=VWT.selWindowTypesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p id=VWTdivReportsLog ></p>

		<p>Attribute to show: <select id=VWTselAttribute oninput=VWT.setViewSurfacesSelectOptions(); >${ selectOptions }</select></p>

		<p>Select multiple types by pressing shift or control keys</p>

		<p>
			<button onclick=PFO.onClickZoomAll(); >
				Reset view
			</button>
		</p>

	</details>`;

	return htm;

};



VWT.setViewSurfacesSelectOptions = function() {

	if ( VWTdet.open === false ) { return; }

	VWTinpSelectIndex.value = "";

	VWTselViewWindowTypes.size = GBX.windowTypes.length > 10 ? 10 : GBX.windowTypes.length + 1;

	const attribute = VWTselAttribute.value;

	let color;

	const htmOptions = GBX.windowTypes.map( ( type, index ) => {

		let text;

		color = color === 'pink' ? '' : 'pink';

		if ( [ "id" ].includes( attribute ) ) {

			text = type.match( `${ attribute }="(.*?)"` );
			text = text ? text[ 1 ] : "";

		} else if ( [ "Name", "Description" ].includes( attribute )   ) {

			text = type.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
			text = text ? text[ 1 ] : "";

		} else if ( [ "U-value", "SolarHeatGainCoeff", "Transmittance" ].includes( attribute ) ) {

			text = type.match( `<${ attribute }(.*?)>(.*?)<\/${ attribute }>` );
			text = text ? text[ 2 ] : "";

		}

		return `<option style=background-color:${ color } value=${ index } >${ text }</option>`;

	} );

	VWTselViewWindowTypes.innerHTML = htmOptions;

	VWTspnCount.innerHTML = `${ GBX.windowTypes.length } types found`;

	THR.controls.enableKeys = false;

};



VWT.selWindowTypesFocus = function( select ) {

	VGC.setPopupBlank();

	divDragMoveContent.innerHTML = VWT.getWindowTypesAttributes( VWTselViewWindowTypes.value );

	VWT.surfacesFilteredWindowType = VWT.getSurfacesFilteredWindowType();

	VWTdivReportsLog.innerHTML = GBXU.sendSurfacesToThreeJs( VWT.surfacesFilteredWindowType );


};



VWT.getWindowTypesAttributes = function( index ) {

	const typeTxt = GBX.windowTypes[ index ];

	const typeId = typeTxt.match( ` id="(.*?)"` )[ 1 ];

	const typeXml = PIN.parser.parseFromString( typeTxt, "application/xml").documentElement;
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



VWT.getSurfacesFilteredWindowType = function(  ) {

	const options = VWTselViewWindowTypes.selectedOptions;

	GBX.meshGroup.children.forEach( element => element.visible = false );

	THRU.edgeGroup.children.forEach( child =>	child.visible = false );

	VWT.setOpenings();

	for ( let option of options ) {
		//console.log( 'option', option );

		const typeTxt = GBX.windowTypes[ Number( option.value ) ];

		const typeId = typeTxt.match( ` id="(.*?)"` )[ 1 ];
		//console.log( 'typeId', typeId );

		VWT.openings.forEach( ( opening, index ) => {

			let windowTypeIdRef = opening.match( / windowTypeIdRef="(.*?)"/ )
			windowTypeIdRef = windowTypeIdRef ? windowTypeIdRef[ 1 ] : "";

			GBX.openingGroup.children[ index ].visible = windowTypeIdRef === typeId ? true : false;

		} );

	}

};



VWT.setOpenings = function() {

	VWT.openings = [];

	GBX.surfaces.forEach( surface => {

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		openings.forEach( opening  => VWT.openings.push(  opening ) );

	} );

}