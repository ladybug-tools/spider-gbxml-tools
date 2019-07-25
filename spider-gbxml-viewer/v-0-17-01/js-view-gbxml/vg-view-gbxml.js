/* globals GBX, GBXU, GSA, PIN, VGC, VGdivReport */
// jshint esversion: 6
// jshint loopfunc: true

const VG = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View gbXML (VG) - view campus and building attributes",
		helpFile: "../v-0-17-01/js-view-gbxml/vg-view-gbxml.md",
		license: "MIT License",
		version: "0.17.00-1vg"

	}

};



VG.getMenuViewGbxml = function() {


	const help = VGC.getHelpButton("VGbutSum",VG.script.helpFile);
	const htm =

	`<details id="VGdet" ontoggle=VG.setViewGbxml(); >

		<summary>VG gbXML attributes and nodes </summary>

		${ help }

		<div id=VGdivReport > </div>

	</details>`;

	return htm;

};



VG.setViewGbxml = function( target = VGdivReport ) {

	const campusXml = PIN.parser.parseFromString( GBX.text, "application/xml").documentElement;
	PIN.campusXml = campusXml;
	//console.log( 'campusXml', campusXml.attributes );
	//console.log( 'campusXml', campusXml );

	const locationXml = campusXml.getElementsByTagName( 'Location' )[ 0 ];
	const buildingXml = campusXml.getElementsByTagName( 'Building' )[ 0 ];
	//const documentXml = campusXml.getElementsByTagName( 'DocumentHistory' )[ 0 ];

	const latitude = campusXml.getElementsByTagName( 'Latitude' )[ 0 ].innerHTML;
	const longitude = campusXml.getElementsByTagName( 'Longitude' )[ 0 ].innerHTML;

	let linkToMap;

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


};