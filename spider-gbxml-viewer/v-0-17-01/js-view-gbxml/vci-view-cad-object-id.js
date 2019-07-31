/* globals GBX, GBXU, VGC, VCIselViewSurfaces, VCIspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VCI = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-30",
		description: "View by CAD Object ID (VCI) provides HTML and JavaScript to view individual surfaces.",
		helpFile: "js-view-gbxml/vci-view-cad-object-id.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vci-view-cad-object-id.js",
		version: "0.17-01-1vci"

	}

};



VCI.getMenuViewCadObjectId = function() {

	const source = `<a href=${ MNU.urlSourceCode + VCI.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VCIbutSum",VCI.script.helpFile, POP.footer, source );

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

	let cadObjects = GBX.surfaces.map( surface => {

		let text = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/gi );
		text = text ? text.pop() : "";
		text = text.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		return text = text ? text[ 1 ].replace( /\[(.*)\]/, "" ) : "";

	} );

	cadObjects = [...new Set( cadObjects )].sort();
	// console.log( 'cadObjects', cadObjects );

	let color;

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

	GBX.meshGroup.children.forEach( element => element.visible = false );

	VCI.CadIdsActive = Array.from( select.selectedOptions ).map( option => option.innerHTML );

	VCI.surfaceVisibleIndices = VCI.CadIdsActive.flatMap( cadId =>

		GBX.surfaces.filter( surface => surface.includes( cadId ) )
			.map( surface => GBX.surfaces.indexOf( surface ) )

	 );

	GBX.meshGroup.children.forEach( ( mesh, index ) => mesh.visible =
		VCI.surfaceVisibleIndices.includes( index ) ? true : false );

	VCIdivReportsLog.innerHTML = `${ VCI.surfaceVisibleIndices.length } surfaces visible`;

	THR.controls.enableKeys = false;

};