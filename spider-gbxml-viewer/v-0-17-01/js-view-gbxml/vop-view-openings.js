/* globals GBX, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true

const VOP = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View by openings (VOP) provides HTML and JavaScript to view individual openings.",
		helpFile: "../v-0-17-01/js-view-gbxml/vbo-view-opening.md",
		license: "MIT License",
		version: "0.16-01-2vbo"

	}

};



VOP.getMenuViewOpenings = function() {


	const help = VGC.getHelpButton("VOPbutSum",VOP.script.helpFile);

	const selectOptions = [ "id", "openingType", "windowTypeIdRef", "CADObjectId", "Name" ]
	.map( option => `<option>${ option }</option>`);

	const htm =

	`<details id="VOPdetMenu" ontoggle=VOP.setViewOpeningsSelectOptions(); >

		<summary>Openings</summary>

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
			<button onclick=VGC.toggleViewSelectedOrAll(this,VOPselViewOpenings,VOP.surfaceWithOpenings); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VOP.setViewOpeningsSelectOptions = function() {

	if ( VOPdetMenu.open === false ) { return; }

	//if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	const attribute = VOPselAttribute.value;
	//console.log( 'attribute', attribute );

	VOPinpSelectIndex.value = "";

	let color;
	let htmOptions = '';
	let indexSurface = 0;
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
				openingId = openingId ? openingId[ 1 ] : "";
				//console.log( 'openingId', openingId );

			} else if ( [ "Name", "CADObjectId" ].includes( attribute ) ) {

				openingId = opening.match( `<${ attribute }>(.*?)<\/${ attribute }>` );
				openingId = openingId ? openingId[ 1 ] : "";
				//console.log( 'openingId', openingId );

			}

			//openingId = opening.match( 'id="(.*?)"' )[ 1 ];

			VOP.openings.push( { surfaceId, surfaceIndex, openingId, "openingIndex": VOP.openings.length, openingInSurface } );

			htmOptions +=
				`<option style=background-color:${ color } value=${ VOP.openings.length - 1 } >${ openingId }</option>`;

		} );

		indexSurface ++;

	} );
	//console.log( 'VOP.openings', VOP.openings );

	VOPselViewOpenings.innerHTML = htmOptions;

	VOPspnCount.innerHTML = `${ VOP.openings.length } openings found`;

};



VOP.selectedOpeningsFocus = function( select ) {

	VGC.setPopup();

	const opening = VOP.openings[ select.value ];
	//console.log( 'opening', opening );

	PIN.intersected = GBX.meshGroup.children[ opening.surfaceIndex ];

	divDragMoveContent.innerHTML = PIN.getIntersectedDataHtml();

	const options = select.selectedOptions
	//console.log( 'options', options );

	const openingIndexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'openingIndexes', openingIndexes );

	openings = openingIndexes.map( index => VOP.openings[ index ] );
	//console.log( 'openings', openings );

	VOP.surfaceWithOpenings = openings.map( opening => GBX.surfaces[ opening.surfaceIndex ] );

	GBXU.sendSurfacesToThreeJs( VOP.surfaceWithOpenings );

	VOP.setOpeningShowHide( select );

};



VOP.setOpeningShowHide = function( select ) {

	const index = select.value;

	const opening = VOP.openings[ index ];
	//console.log( '', opening );

	GBX.openingGroup.children.forEach( child => child.visible = false );

	GBX.openingGroup.children[ opening.openingIndex ].visible = true;

	GSAdetOpenings.open = true;

	const openingDivs = Array.from( GSAdetOpenings.querySelectorAll( "div" ) );
	//console.log( 'openingDivs', openingDivs );

	const theDiv = openingDivs.find( item => item.id === "GSAdivOpening" + opening.openingInSurface );

	theDiv.style.backgroundColor = 'pink';

};



VOP.setViewOpeningsShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( VOPselViewOpenings.selectedIndex === -1 ) { alert( "First, select an opening from the list"); return; }

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBXU.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.meshGroup.children.forEach( element => element.visible = true );

	}

};