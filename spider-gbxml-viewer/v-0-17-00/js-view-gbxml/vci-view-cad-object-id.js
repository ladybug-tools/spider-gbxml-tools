/* globals GBX, GBXU, VGC, VCIselViewSurfaces, VCIspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VCI = {

	script: {
		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-22",
		description: "View by CAD Object ID (VCI) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "../v-0-17-00/js-view-gbxml/vci-view-cad-object-id.md",
		license: "MIT License",
		version: "0.17-00-1vci"
	}

};



VCI.getMenuViewCadObjectId = function() {

	const help = VGC.getHelpButton("VCIbutSum",VCI.script.helpFile);

	const htm =

	`<details id="VCIdet" ontoggle=VCI.setViewOptions(); >

		<summary>CAD object id groups <span id="VCIspnCount" ></span> </summary>

		${ help }

		<p>
			View surfaces by groups of CAD object IDs. For individual CAD Object IDs see 'Surfaces'.
		</p>

		<p>
			<input type=search id=VCIinpSelectIndex oninput=VGC.setSelectedIndex(this,VCIselViewSurfaces) placeholder="Enter an attribute" >
		</p>

		<p>
			<select id=VCIselViewSurfaces oninput=VCI.selectedSurfacesFocus(this); style=width:100%; size=10 multiple >
			</select>
		</p>

		<p>Select multiple groups by pressing shift or control keys</p>

		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VCIselViewSurfaces,VCI.surfaces); >
				Show/hide by surfaces
			</button>
		</p>

	</details>`;

	return htm;

};


VCI.setViewOptions = function() {

	let color;

	const cadObjects = [];

	GBX.surfaces.forEach( (surface, index ) => {

		let text = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
		text = text ? text.pop() : "";
		text = text.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		text = text ? text[ 1 ].replace( /\[(.*)\]/, "") : "";
		//console.log( 'text', cadObjects.indexOf( text ) < 0 );

		if ( cadObjects.indexOf( text ) < 0 ) { cadObjects.push( text ); }

	} );
	// console.log( 'cadObjects', cadObjects );

	cadObjects.sort();

	const options = cadObjects.map( item => {

		color = color === 'pink' ? '' : 'pink';
		return `<option style=background-color:${ color } value=${ item } >${ item }</option>`;

	} );

	VCIselViewSurfaces.innerHTML = options;

	VCIspnCount.innerHTML = `: ${ cadObjects.length } groups found`;

	return options;

};



VCI.selectedSurfacesFocus = function( select ) {

	VGC.setPopup();

	VCI.surfaces = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const surfaces = GBX.surfaces.filter( surface => surface.includes( option.innerText ) );

		VCI.surfaces.push( ...surfaces );

	} );

	GBXU.sendSurfacesToThreeJs( VCI.surfaces );

};