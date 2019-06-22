// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POPX, ISCOR, POPdivPopupData*/
/* jshint esversion: 6 */


const VBO = { "version": ".0.16.01-1", "date": "2019-06-21" };

VBO.description =
	`
		View by Surfaces (VBO) provides HTML and JavaScript to view individual openings.

	`;



VBO.getMenuViewByOpenings = function() {

	const htm =

	`<details id="VBOdet" ontoggle=VBO.getViewByOpeningsSelectOptions(); >

		<summary>Show/hide by openings <span id="VBOspnCount" ></span>
			<a id=VBOsumHelp class=helpItem href="JavaScript:POP.setPopupShowHide(VBOsumHelp,VBO.description);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			View by openings
		</p>

		<p>
			<input id=VBOinpSelectIndex oninput=VBO.setSelectedIndex(this,VBOselViewByOpenings) placeholder="enter an id" >
		</p>

		<p>
			<select id=VBOselViewByOpenings oninput=VBO.selectedOpeningsFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple openings by pressing shift or control keys</p>

		<p>
			<button onclick=VBO.setViewByOpeningsShowHide(this,VBO.openings); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VBO.getViewByOpeningsSelectOptions = function() {

	if ( VBOdet.open === false && ISCOR.runAll === false ) { return; }

	//if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	let color;
	let htmOptions = '';
	let indexSurface = 0;
	VBO.openings = []; //GBX.surfaces.slice();

	for ( let surface of GBX.surfaces ) {

		const id = surface.match( 'id="(.*?)"' )[ 1 ];

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		color = openings.length > 1 ? 'pink' : '';

		openings.forEach( ( opening, index )  => {

			//console.log( '', openings  );

			idOpening = opening.match( 'id="(.*?)"' )[ 1 ];

			VBO.openings.push( { "idSurface": id, "idOpening": idOpening, "indexOpening": index } );

			htmOptions +=
				`<option style=background-color:${ color } value=${ indexSurface} >surf:${ id + " / open:" + idOpening }</option>`;

		} );

		indexSurface ++;

	}
	//console.log( 'VBO.openings', VBO.openings );

	VBOselViewByOpenings.innerHTML = htmOptions;
	VBOspnCount.innerHTML = `: ${ VBO.openings.length } found`;

	THR.controls.enableKeys = false;

	return VBO.openings.length;

};



VBO.setSelectedIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.includes( str ) );
	//console.log( 'option', option );

	select.value = option ? option.value : "";
	
	if ( option ) { VBO.selectedOpeningsFocus( select ); }

};



VBO.selectedOpeningsFocus = function( select ) {

	POPX.intersected = GBX.surfaceGroup.children[ select.value ];

	POPdivPopupData.innerHTML = POPX.getIntersectedDataHtml();
	//console.log( 'sel', select.value );

	const options = select.selectedOptions
	//console.log( 'option', options );

	const indexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'indexes', indexes );

	VBO.openings = GBX.surfacesIndexed.filter( ( surface, index ) => indexes.includes( index  ) );

	GBX.sendSurfacesToThreeJs( VBO.openings );

};



VBO.setViewByOpeningsShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};