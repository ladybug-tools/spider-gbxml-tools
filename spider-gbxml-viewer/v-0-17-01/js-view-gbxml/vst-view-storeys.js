/* globals GBX, VST, THREE, THR, PIN, divDragMoveContent, VSTdetMenu, VSTselStoreys, VSTdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
// jshint loopfunc: true

const VST = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View the surfaces in a gbXML file by selecting one or more storeys from a list of all storeys",
		helpFile: "js-view-gbxml/vst-view-storeys.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vst-view-storeys.js",
		version: "0.17.01-0vst"

	}

};



VST.getMenuViewStoreys = function() {

	const source = `<a href=${ MNU.urlSourceCode + VST.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VSTbutSum",VST.script.helpFile,POP.footer,source);

	const selectOptions = [ "id", "Level", "Name" ].map( option => `<option ${ option === "Name" ? "selected" : "" }>${ option }</option>`);

	const htm =
	`
		<details id=VSTdetMenu ontoggle=VST.setViewStoreysOptions(); >

			<summary>VST Storeys</summary>

			${ help }

			<p>
				Display of surfaces by storey. Storeys are listed from lowest to highest elevation followed by storey name.
				Operates in conjunction with surface type settings.
				<span id=VSTspnCount ></span>
			</p>

			<p>
				<input type=search id=VSTinpAttribute oninput=VGC.setSelectedIndex(this,VSTselStoreys) placeholder="Enter an attribute" >
			</p>

			<div id="VSTdivViewStoreys" >
				<select id=VSTselStoreys oninput=VST.selStoreys(this); onclick=VST.selStoreys(this); multiple style=width:100%; ></select
			</div>

			<div id="VSTdivReportsLog" ></div>

			<!--
			<p>Attribute to show:
				<select id=VSTselAttribute oninput=VST.setViewStoreysOptions(); >${ selectOptions }</select>
			</p>
			-->

			<p>
				<button onclick=VST.setAllStoreysVisible(); >
					show all storeys
				</button>
			<p>

			<p>Select multiple storeys by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VST.setViewStoreysOptions = function() {

	if ( VSTdetMenu.open === false ) { return; }

	VSTinpAttribute.value = "";

	VSTselStoreys.size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const options = GBX.storeysJson.map( storey => `<option value=${ storey.id } title="id: ${ storey.id }">${ storey.level } m / ${ storey.name }</option>` );

	VSTselStoreys.innerHTML = options;

	VSTspnCount.innerHTML = `${ GBX.storeys.length } storeys found.`;

};



//////////

VST.selStoreys = function( select ) {

	VGC.setPopupBlank();

	divDragMoveContent.innerHTML = PCO.getStoreyAttributes( VSTselStoreys.value );

	PFO.storeyIdsActive = Array.from( select.selectedOptions ).map( option => option.value );

	PFO.setVisible();

	THR.controls.enableKeys = false;


};



VST.setAllStoreysVisible = function(){

	PFO.storeyIdsActive = PFO.storeyIdsInUse;

	PFO.setVisible();

	VSTselStoreys.selectedIndex= -1;

};