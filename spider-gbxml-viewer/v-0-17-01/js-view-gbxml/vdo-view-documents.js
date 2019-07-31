/* globals GBX, GBXU, VGC, VDOselViewSurfaces, VDOspnCount */
// jshint esversion: 6
// jshint loopfunc: true

const VDO = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-30",
		description: "View Document (VDO) provides HTML and JavaScript to view document elements.",
		helpFile: "js-view-gbxml/vdo-view-documents.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vdo-view-documents.js",
		version: "0.17-01-1vdo"

	}

};



VDO.getMenuViewDocuments = function() {

	const help = VGC.getHelpButton("VDObutSum",VDO.script.helpFile);

	const htm =

	`<details id="VDOdet" ontoggle=VDO.setViewOptions(); >

		<summary>VDO Documents <span id="VDOspnCount" ></span> </summary>

		${ help }

		<p>
			View document history. Raw gbXML data only. Full parser created as and when needed.
		</p>

		<textarea id=VDOtxtDocuments style=height:15rem;resize:both;width:100% ></textarea>


	</details>`;

	return htm;

};


VDO.setViewOptions = function() {

	if ( VDOdet.open === false ) { return; }

	VDO.documentHistory = GBX.text.match( /<DocumentHistory(.*?)<\/DocumentHistory>/gi ) || [];

	VDOtxtDocuments.value = VDO.documentHistory[ 0 ].replace( /> /g, ">\n");

};
