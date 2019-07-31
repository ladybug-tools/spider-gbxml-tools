/* globals GBX, GBXU, VGC, VCIselViewSurfaces, VCIspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VCI = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View by CAD Object ID (VCI) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "../v-0-17-01/js-view-gbxml/vci-view-cad-object-id.md",
		license: "MIT License",
		version: "0.17-01-0vci"

	}

};



VCI.getMenuViewCadObjectId = function() {

	const help = VGC.getHelpButton("VCIbutSum",VCI.script.helpFile);

	const htm =

	`<details id="VCIdet" ontoggle=VCI.setViewOptions(); >

		<summary>VCI CAD object id groups <span id="VCIspnCount" ></span> </summary>

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

		<div id=VCIdivReportsLog ></div>

		<p>Select multiple id groups by pressing shift or control keys</p>

		<p>
			<button onclick=VGC.toggleViewSelectedOrAll(this,VCIselViewSurfaces,VCI.surfaces); >
				Show/hide by id groups
			</button>
		</p>

	</details>`;

	return htm;

};


VCI.setViewOptions = function() {

	if ( VCIdet.open === false ) { return; }

	VCIinpSelectIndex.value = "";

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

	VGC.setPopupBlank();

	VCI.surfaces = [];

	Array.from( select.selectedOptions ).forEach( option => {

		const surfaces = GBX.surfaces.filter( surface => surface.includes( option.innerText ) );

		VCI.surfaces.push( ...surfaces );

	} );

	VCIdivReportsLog.innerHTML = `<p>${ VCI.surfaces.length } surfaces visible`;
	
	GBXU.sendSurfacesToThreeJs( VCI.surfaces );

};