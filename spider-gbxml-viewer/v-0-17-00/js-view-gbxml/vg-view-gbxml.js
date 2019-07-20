/* globals THR, GBX, POPX, divDragMoveContent, VGdet */
// jshint esversion: 6
// jshint loopfunc: true

const VG = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-19",
		"description": "View gbXML (VG) - view campus and building attributes",
		"helpFile": "../v-0-17-00/js-view-gbxml/vg-view-gbxml.md",
		"urlSourceCode":
	"https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxml/vg-view-gbxml.js",
		"version": "0.17.00-0vg"

	}

};



VG.getMenuViewGbxml = function() {

	document.body.addEventListener( 'onGbxParse', () => { VGdet.open = false; }, false );

	const help = `<button id="butVGsum" class="butHelp" onclick="POP.setPopupShowHide(butVGsum,VG.script.helpFile);" >?</button>`;

	const htm =

	`<details id="VGdet" ontoggle=VG.setViewGbxml(); >

		<summary>gbXML attributes and nodes ${ help }</summary>

		<div id=VGdivReport > </div>

	</details>`;

	return htm;

};


VG.setViewGbxml = function( target = VGdivReport ) {

	const campusXml = POPX.parser.parseFromString( GBX.text, "application/xml").documentElement;
	POPX.campusXml = campusXml;
	//console.log( 'campusXml', campusXml.attributes );
	//console.log( 'campusXml', campusXml );

	const locationXml = campusXml.getElementsByTagName( 'Location' )[ 0 ];
	const buildingXml = campusXml.getElementsByTagName( 'Building' )[ 0 ];
	//const documentXml = campusXml.getElementsByTagName( 'DocumentHistory' )[ 0 ];

	latitude = campusXml.getElementsByTagName( 'Latitude' )[ 0 ].innerHTML;
	longitude = campusXml.getElementsByTagName( 'Longitude' )[ 0 ].innerHTML;

	//console.log( '', latitude, longitude );

	//console.log( '', performance.now() - time );

	if ( latitude && longitude ) {

		const linkG = 'https://www.google.com/maps/@' + latitude + ',' + longitude + ',17z';

		const linkW = 'http://www.wolframalpha.com/input/?i=' + latitude + '+degrees,+' + longitude + '+degrees';

		linkToMap =
			`<p>
			<b>&raquo;</b> <a href="${ linkG }" target=_blank > &#x1f310; Google Maps</a> /
			<a href="${ linkW }" target=_blank > Wolfram Alpha</a>
			</p>`;

	} else {

		linkToMap = '';

	}

	const htm =
	`
		${ linkToMap }

		<p>
			<b>Campus Attributes</b>
			<div>${ GSA.getAttributesHtml( campusXml ) }</div>
		</p>

		<p>
			<b>Location Attributes</b>
			<div>${ GSA.getAttributesHtml( locationXml ) }</div>
		</p>
		<p>
			<b>Building Attributes</b>
			<div>${ GSA.getAttributesHtml( buildingXml ) }</div>
		</p>
		<p>
			${ GBXU.stats }
		</p>



	`;

	target.innerHTML = htm;


}