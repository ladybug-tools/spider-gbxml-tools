/* globals THR, GBX, GBXU, VGC, PIN, POPF, divDragMoveFooter, navDragMove, VCIOdet, VCIOselViewGroup, VCIOspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VCIO = {

	script: {
		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View by CAD Object ID open (VCIO) provides HTML and JavaScript to view openings by their CAD Object ID group.",
		helpFile: "../v-0-17-01/js-view-gbxml/vcio-view-cad-object-id-open.md",
		license: "MIT License",
		version: "0.17.01-0vcio"
	}

};



VCIO.getMenuViewCadObjectIdOpen = function() {

	const help = VGC.getHelpButton("VCIObutSum",VCIO.script.helpFile);

	const htm =

	`<details id="VCIOdet" ontoggle=VCIO.setViewOptions(); >

		<summary>VCIO CAD object id opening groups </summary>

		${ help }

		<p>
			View opening types by groups of CAD object IDs.
			For individual CAD Object ID opening types see 'Openings'.
			<span id="VCIOspnCount" ></span>
		</p>

		<p>
			<input type=search id=VCIOinpSelectIndex oninput=VGC.setSelectedIndex(this,VCIOselViewGroup) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VCIOselViewGroup oninput=VCIO.selectedGroupFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple groups by pressing shift or control keys</p>

		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VCIOselViewGroup,VCIO.surfacesWithOpenings); >
				Show/hide by cad object opening types
			</button>
		</p>

	</details>`;

	return htm;

};



VCIO.setViewOptions = function() {

	if ( VCIOdet.open === false ) { return; }

	VCIOinpSelectIndex.value = "";

	let color;

	VCIO.cadObjects = [];

	GBX.openings.forEach( (opening, index ) => {

		let text = opening.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
		text = text ? text.pop() : "";
		text = text.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		text = text ? text[ 1 ].replace( /\[(.*)\]/, "") : "";
		//console.log( 'text', VCIO.cadObjects.indexOf( text ) < 0 );

		if ( VCIO.cadObjects.indexOf( text ) < 0 ) { VCIO.cadObjects.push( text ); }

	} );
	// console.log( 'VCIO.cadObjects', VCIO.cadObjects );

	VCIO.cadObjects.sort();

	const options = VCIO.cadObjects.map( item => {

		color = color === 'pink' ? '' : 'pink';
		return `<option style=background-color:${ color } value=${ item } >${ item }</option>`;

	} );

	VCIOselViewGroup.innerHTML = options;

	VCIOspnCount.innerHTML = `${ VCIO.cadObjects.length } types found`;

	THR.controls.enableKeys = false;

};



VCIO.selectedGroupFocus = function( select ) {

	VGC.setPopupBlank();

	GBX.openingGroup.children.forEach( opening => opening.visible = false );

	VCIO.surfacesWithOpenings = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const cadId = option.innerText;

		const surfacesWithOpenings = GBX.surfaces.filter( opening => opening.includes( cadId ) );

		VCIO.surfacesWithOpenings.push( ...surfacesWithOpenings );

		GBX.openings.filter( opening => opening.includes( cadId ) )
			.map( item => GBX.openings.indexOf( item ) )
			.forEach( index => GBX.openingGroup.children[ index ].visible = true );

	} );

	GBXU.sendSurfacesToThreeJs( VCIO.surfacesWithOpenings );

};