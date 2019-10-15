/* globals GBX, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true

const VOP = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-30",
		description: "View by openings (VOP) provides HTML and JavaScript to view individual openings.",
		helpFile: "js-view-gbxml/vop-view-opening.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vop-view-opening.js",
		version: "0.17-01-2vop"

	}

};



VOP.getMenuViewOpenings = function() {

	const source = `<a href=${ MNU.urlSourceCode + VOP.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VOPbutSum",VOP.script.helpFile, POP.footer, source);

	const selectOptions = [ "id", "openingType", "windowTypeIdRef", "CADObjectId", "Name" ]
	.map( option => `<option>${ option }</option>`);

	const htm =

	`<details id="VOPdetMenu" ontoggle=VOP.setViewOpeningsSelectOptions(); >

		<summary>VOP Openings</summary>

		${ help }

		<p>
			View by openings. Surfaces with multiple openings in pink. <span id="VOPspnCount" >.</span>
		</p>

		<p>
			<input type=search id=VOPinpSelectIndex oninput=VGC.setSelectedIndex(this,VOPselViewOpenings) placeholder="enter an attribute" >
		</p>

		<p>
			<select id=VOPselViewOpenings oninput=VOP.selectedOpeningsFocus(this);
				style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Attribute to show:
			<select id=VOPselAttribute oninput=VOP.setViewOpeningsSelectOptions(); >
				${ selectOptions }
			</select>
		</p>

		<p>Select multiple openings by pressing shift or control keys</p>

		<p>
			<button onclick=VGC.toggleViewSelectedMeshes(this,VOPselViewOpenings,VOP.surfacesVisible); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VOP.setViewOpeningsSelectOptions = function() {

	if ( VOPdetMenu.open === false ) { return; }

	//if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	VOPinpSelectIndex.value = "";

	VOPselViewOpenings.size = GBX.openingGroup.children.length > 10 ? 10 : GBX.surfaces.length + 1;

	const attribute = VOPselAttribute.value;

	VOPinpSelectIndex.value = "";

	let color;
	let htmOptions = '';
	VOP.openings = [];

	GBX.surfaces.forEach( (surface, surfaceIndex ) => {

		const surfaceId = surface.match( 'id="(.*?)"' )[ 1 ];

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		openings.forEach( ( opening, openingInSurface )  => {

			//console.log( '', openings  );

			color = color === 'pink' ? '' : 'pink';
			let openingId;

			if ( [ "id", "openingType", "windowTypeIdRef" ].includes( attribute ) ) {

				openingId = opening.match( `${ attribute }="(.*?)"` );

			} else if ( [ "Name", "CADObjectId" ].includes( attribute ) ) {

				openingId = opening.match( `<${ attribute }>(.*?)<\/${ attribute }>` );

			}
			openingId = openingId ? openingId[ 1 ] : "";

			VOP.openings.push( { surfaceId, surfaceIndex, openingId, "openingIndex": VOP.openings.length, openingInSurface } );

			htmOptions +=
				`<option style=background-color:${ color } value=${ VOP.openings.length - 1 } >${ openingId }</option>`;

		} );

	} );
	//console.log( 'VOP.openings', VOP.openings );

	VOPselViewOpenings.innerHTML = htmOptions;

	VOPspnCount.innerHTML = `${ VOP.openings.length } openings found`;

};



VOP.selectedOpeningsFocus = function( select ) {

	VGC.setPopupBlank();

	const opening = VOP.openings[ select.value ];
	//console.log( 'opening', opening );

	PIN.setIntersected( GBX.meshGroup.children[ opening.surfaceIndex ] )
	//divDragMoveContent.innerHTML = PIN.getIntersectedDataGbxml()

	const options = select.selectedOptions
	//console.log( 'options', options );

	const openingIndexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'openingIndexes', openingIndexes );

	openings = openingIndexes.map( index => VOP.openings[ index ] );
	//console.log( 'openings', openings );

	//VOP.surfacesWithOpenings = openings.map( opening => GBX.surfaces[ opening.surfaceIndex ] );

	VOP.surfacesVisible = openings.map( opening => opening.surfaceIndex );

	GBX.meshGroup.children.forEach( ( mesh, index ) => mesh.visible = VOP.surfacesVisible.includes( index ) ? true : false );

	VOP.setOpeningShowHide( select );

};



VOP.setOpeningShowHide = function( select ) {

	const index = select.value;

	const opening = VOP.openings[ index ];

	GBX.openingGroup.children.forEach( child => child.visible = false );

	GBX.openingGroup.children[ opening.openingIndex ].visible = true;

	GSAdetOpenings.open = true;

	const openingDivs = Array.from( GSAdetOpenings.querySelectorAll( "div" ) );
	//console.log( 'openingDivs', openingDivs );

	const theDiv = openingDivs.find( item => item.id === "GSAdivOpening" + opening.openingInSurface );

	theDiv.style.backgroundColor = 'pink';

};
