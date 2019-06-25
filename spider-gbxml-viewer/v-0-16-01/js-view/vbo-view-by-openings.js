/* globals GBX */
// jshint esversion: 6
/* jshint loopfunc: true */

const VBO = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-24",
	"description": "View by Surfaces (VBO) provides HTML and JavaScript to view individual openings.",
	"helpFile": "../js-view/vbo-view-by-opening.md",
	"version": "0.16-01-1vbo",
	"urlSourceCode": "https://github.com/pushme-pullyou/tootoo14/blob/master/js-14-2/fob-file-open-basic/fob-file-open-basic.js",

};



VBO.getMenuViewByOpenings = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBOdetMenu.open = false; }, false );

	const foot = `v${ VBO.version} - ${ VBO.date }`;

	const help = `<button id="butVBOsum" class="butHelp" onclick="POP.setPopupShowHide(butVBOsum,VBO.helpFile,'${foot}');" >?</button>`;
	//help = `<a id=VBOsumHelp class=helpItem href="JavaScript:POP.setPopupShowHide(VBOsumHelp,VBO.description);" >&nbsp; ? &nbsp;</a>`;

	const htm =

	`<details id="VBOdetMenu" ontoggle=VBO.getViewByOpeningsSelectOptions(); >

		<summary>Show/hide by openings <span id="VBOspnCount" ></span> ${ help }</summary>

		<p>
			View by openings. Surfaces with multiple openings in pink
		</p>

		<p>
			<input id=VBOinpSelectIndex oninput=VBO.setSelectIndex(this,VBOselViewByOpenings) placeholder="enter an id" >
		</p>

		<p>
			<select id=VBOselViewByOpenings oninput=VBO.selectedOpeningsFocus(this);
				style=width:100%; size=10 multiple >p
			</select>
		</p>

		<p>Select multiple openings by pressing shift or control keys</p>

		<p>
			<button onclick=VBO.setViewByOpeningsShowHide(this,VBO.surfaceWithOpenings); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};



VBO.getViewByOpeningsSelectOptions = function() {

	if ( VBOdetMenu.open === false ) { return; }

	//if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	let color;
	let htmOptions = '';
	let indexSurface = 0;
	VBO.openings = []; //GBX.surfaces.slice();

	GBX.surfaces.forEach( (surface, surfaceIndex ) => {

		const surfaceId = surface.match( 'id="(.*?)"' )[ 1 ];

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		color = openings.length > 1 ? 'pink' : '';

		openings.forEach( ( opening, openingInSurface )  => {

			//console.log( '', openings  );

			openingId = opening.match( 'id="(.*?)"' )[ 1 ];

			VBO.openings.push( { surfaceId, surfaceIndex, openingId, "openingIndex": VBO.openings.length, openingInSurface } );

			htmOptions +=
				`<option style=background-color:${ color } value=${ VBO.openings.length - 1 } >surf:${ surfaceId + " / open:" + openingId }</option>`;

		} );

		indexSurface ++;

	} );
	//console.log( 'VBO.openings', VBO.openings );

	VBOselViewByOpenings.innerHTML = htmOptions;
	VBOspnCount.innerHTML = `: ${ VBO.openings.length } found`;

	THR.controls.enableKeys = false;

	return VBO.openings.length;

};



VBO.setSelectIndex = function( input, select ) {

	const str = input.value.toLowerCase();

	const option = Array.from( select.options ).find( option => option.innerHTML.includes( str ) );
	//console.log( 'option', option );

	select.value = option ? option.value : "";

	if ( option ) { VBO.selectedOpeningsFocus( select ); }

};



VBO.selectedOpeningsFocus = function( select ) {

	const opening = VBO.openings[ select.value ];
	//console.log( 'opening', opening );

	POPX.intersected = GBX.surfaceGroup.children[ opening.surfaceIndex ];

	POPdivPopupData.innerHTML = POPX.getIntersectedDataHtml();

	const options = select.selectedOptions
	//console.log( 'options', options );

	const openingIndexes = Array.from( options ).map( option => Number( option.value ) );
	//console.log( 'openingIndexes', openingIndexes );

	openings = openingIndexes.map( index => VBO.openings[ index ] );
	//console.log( 'openings', openings );

	VBO.surfaceWithOpenings = openings.map( opening => GBX.surfacesIndexed[ opening.surfaceIndex ] );

	GBX.sendSurfacesToThreeJs( VBO.surfaceWithOpenings );

	VBO.setOpeningShowHide( select );

};



VBO.setOpeningShowHide = function( select ) {

	index = select.value;

	opening = VBO.openings[ index ];
	//console.log( '', opening );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );

	GBX.surfaceOpenings.children[ opening.openingIndex ].visible = true;

	GSAdetOpenings.open = true;

	openingDivs = Array.from( GSAdetOpenings.querySelectorAll( "div" ) );
	//console.log( 'openingDivs', openingDivs );

	theDiv = openingDivs.find( item => item.id === "GSAdivOpening" + opening.openingInSurface );

	theDiv.style.backgroundColor = 'pink';

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