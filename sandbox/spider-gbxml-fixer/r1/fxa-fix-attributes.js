// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGT, FXAsumAtributes, FXAdivMissingMeta, FXAtxtAttributesMissing, FXAdivInputs */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const FXA = { "release": "R1.2", "date": "2019-04-02" };

FXA.description =
	`
		Check for existence of seven required gbXML file attributes. If attributes missing, then supply fixes.'
	`;

FXA.currentStatus =
	`
		<h3>FXA ${ FXA.release} status ${ FXA.date }</h3>

		<p>${ FXA.description }</p>

		<p>Fix Attributes (FXA) module is ready for light testing, but is still at an early stage of development.</p>

		<p>
			As and when the project gets access to more modules with other metadata errors,
			this module will be enhanced to identify and fix any more errors found.
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/: target="_blank" >
				Fix Attributes source code
			</a>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-02 ~ B - Validate and fix with jsHint</li>
				<li>2019-03-23 ~ 1.1 ~ Rename everything from 'metadata' to 'attributes.</li>
				<li>2019-03-23 ~ 1.1 fix run again issues</li>
				<li>2019-02-28 ~ R1.0 ~ First commit to Tester</li>
			</ul>
		</details>

	`;



FXA.checkAttributes = function() {

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

		if ( SGT.text.includes( attribute) ) {

			FXA.attributesProvided.push( attribute );

		} else {

			FXA.attributesMissing.push( attribute );

		}

	}

	const data = FXA.setMenuAttributes();

	const help = `<a id=fxmHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxmHelp,FXA.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXAsumAtributes.innerHTML =
	`Check for missing required gbXML attributes ~ ${FXA.attributesMissing.length} missing ${ help }`;

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

			<p>
				<button onclick=FXA.setDivAttributesIssues(); >Reset changes</button>
			</p>

			<p>
				<button onclick=onchange=FXAtxtAttributesMissing.value=FXA.setChangesAttributesIssues(); >Update the changes in gbXML file </button>
			</p>

			<h3>Changes for missing attributes</h3>

			<textArea id=FXAtxtAttributesMissing style="height:100px;width:100%;" ></textArea>

			<p>
				<button onclick=FXA.addChangesToData(); >Add changes to data in memory</button>

				<button onclick=FXAtxtAttributesMissing.value=SGT.text.slice(0,200); >view gbXML text</button>

				<button onclick=FXAdivAttributes.innerHTML=FXA.checkAttributes(); >Run check again</button>

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

	return FXA.attributesNew;

};



FXA.addChangesToData = function() {

	//console.log( '', FXA.attributesNew );

	SGT.text = SGT.text.replace ( '<gbXML ', '<gbXML ' + FXA.attributesNew );

	//detMenuEdit.open = false;

};
