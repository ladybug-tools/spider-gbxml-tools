/* globals GBX, FXAsumAttributes, FXAdivMissingMeta, FXAtxtAttributesMissing, FXAdivInputs, FXAdet, FXAdivFixXmlAttributes */
// jshint esversion: 6
// jshint loopfunc: true



const FXA = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Check for existence of seven required gbXML file attributes. If attributes missing, then supply fixes.",
		helpFile: "../v-0-17-00/js-fixer/fxa-fix-xml-attributes/fxa-fix-xml-attributes.md",
		license: "MIT License",
		version: "0.17.00-0fxa"

	}

};



FXA.getMenuFixXmlAttributes = function() {

	const htm =
		`
			<details id=FXAdet ontoggle="FXAdivAttributes.innerHTML=FXA.getAttributes();" >

			<summary id=FXAsumAttributes >Fix missing required gbXML attributes</summary>

			${ GBXF.getHelpButton( "FXAbutHelp", FXA.script.helpFile ) }

				<div id=FXAdivAttributes ></div>

				<div id=TMPdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FXA.getAttributes = function() {

	const timeStart = performance.now();

	FXA.metadataValues = {

		'areaUnit': 'SquareMeters',
		'lengthUnit': 'Meters',
		'temperatureUnit': 'C',
		'useSIUnitsForResults': 'true',
		'version': '0.37',
		'volumeUnit': 'CubicMeters',
		'xmlns': 'http://www.gbxml.org/schema'

	};

	FXA.attributesProvided = [];
	FXA.attributesMissing = [];

	const keys = Object.keys( FXA.metadataValues );

	for ( let attribute of keys ){
		//console.log( 'attribute', attribute );

		if ( GBX.text.includes( attribute) ) {

			FXA.attributesProvided.push( attribute );

		} else {

			FXA.attributesMissing.push( attribute );

		}

	}

	const data = FXA.setMenuAttributes();

	const tag = FXA.attributesMissing.length === 0 ? "span" : "mark";

	FXAsumAttributes.innerHTML =
		`Fix missing required gbXML attributes ~ <${ tag }>${FXA.attributesMissing.length}</${ tag }> missing`;

	const htm =
		`
			<p><i>Seven types of attributes are required: ${ keys.join( ', ' ) }.</i></p>

			Attributes provided: ${ FXA.attributesProvided.length.toLocaleString() } found<br>

			Attributes missing: ${ FXA.attributesMissing.length.toLocaleString() } found<br>

			<div>${ data }</div

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return htm;

};



FXA.setMenuAttributes = function() {

	let htm;

	if ( FXA.attributesMissing.length === 0 ) {

		htm =
		`
			<p>Checked:<br>
			${ FXA.attributesProvided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' ) }</p>
		`;

	} else {

		htm =
			`
				<p>gbXML attributes provided:<br>
					${ FXA.attributesProvided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )}</p>

				<p>gbXML attributes missing:<br>
					${FXA.attributesMissing.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )} </p>

				<p>
					<button onclick=FXA.setDivAttributesIssues(); >Add missing attributes</button>
				</p>

				<div id=FXAdivMissingMeta ></div>
			`;

	}

	return htm;

};



FXA.setDivAttributesIssues = function() {

	let attributesMissing = '';

	for ( let attribute of FXA.attributesMissing ) {

		attributesMissing +=
		`
			<p>
				${ attribute }:
				<input onclick=this.select(); onchange=FXA.setChangesAttributesIssues(); value=${FXA.metadataValues[attribute]} size=25 >
			<p>
		`;

	}

	FXAdivMissingMeta.innerHTML =
		`
			<div id=FXAdivInputs >${ attributesMissing }</div>

			<!--
			<p>
				<button onclick=FXA.setDivAttributesIssues(); >Reset changes</button>
			</p>
			-->

			<p>
				<button onclick=onchange=FXAtxtAttributesMissing.value=FXA.setChangesAttributesIssues(); >Update the changes in gbXML file </button>
			</p>

			<h3>Changes for missing attributes</h3>

			<textArea id=FXAtxtAttributesMissing style="height:100px;width:100%;" ></textArea>

			<p>
				<button onclick=FXA.addChangesToData(); >Add changes to data in memory</button>

				<button onclick=FXAtxtAttributesMissing.value=GBX.text.slice(0,200); >view gbXML text</button>

				<button onclick=FXAdivGetFixAttributes.innerHTML = FXA.getFixAttributes(); >Run check again</button>

			</p>

			<p>
				Click 'Save file as' button in File menu to save changes to a file.
			</p>
		`;

	FXAtxtAttributesMissing.value = FXA.setChangesAttributesIssues();

};



FXA.setChangesAttributesIssues = function() {

	const inputs = FXAdivInputs.querySelectorAll( "input" );

	const attributesNew = FXA.attributesMissing.map( ( attribute, index ) => {
		//console.log( 'att', attribute );

		return `${ attribute }="${ inputs[ index ].value }" `;

	} );

	FXA.attributesNew = attributesNew.join( '' );

	GBX.text = GBX.text.replace ( '<gbXML ', '<gbXML ' + FXA.attributesNew );

	FXAdet.open = false;

	FXAdivFixXmlAttributes.innerHTML = FXA.getMenuFixXmlAttributes();

};



FXA.addChangesToData = function() {

	//console.log( '', FXA.attributesNew );

	GBX.text = GBX.text.replace ( '<gbXML ', '<gbXML ' + FXA.attributesNew );

	//detMenuEdit.open = false;

};
