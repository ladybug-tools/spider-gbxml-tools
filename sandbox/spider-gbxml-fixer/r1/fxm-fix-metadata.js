// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */

const FXM = { "release": "R1.0", "date": "2019-03-19" };

FXM.description =
	`
	Check for existence of seven required gbXML file attributes'
	`;

FXM.currentStatus =
	`
		<h3>FXM ${ FXM.release} status ${ FXM.date }</h3>

		<p>${ FXM.description }</p>

		<p>Fix Metadata (FXM) module is ready for light testing, but is still at an early stage of development.</p>

		<p>
			As and when the project gets access to more modules with other metadata errors,
			this module will be enhanced to identify and fix any more errors found.
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/: target="_blank" >
				Fix Metadata source code
			</a>
		</p>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-02-28 ~ R1.0 ~ First commit to Tester</li>

			</ul>
		</details>

	`;



FXM.checkMetaData = function() {

	const timeStart = performance.now();

	FXM.metadataValues = {

		'areaUnit': 'SquareMeters',
		'lengthUnit': 'Meters',
		'temperatureUnit': 'C',
		'useSIUnitsForResults': 'true',
		'version': '0.37',
		'volumeUnit': 'CubicMeters',
		'xmlns': 'http://www.FXMml.org/schema'

	};

	FXM.attributesProvided = [];
	FXM.attributesMissing = [];
	const keys = Object.keys( FXM.metadataValues );

	for ( let attribute of keys ){
		//console.log( 'attribute', attribute );

		if ( SGT.text.includes( attribute) ) {

			FXM.attributesProvided.push( attribute );

		} else {

			FXM.attributesMissing.push( attribute );

		}

	}

	const data = FXM.setMenuMetadata();

	const help = `<a id=fxmHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxmHelp,FXM.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXMdet = SGT.getItemHtm( {

		open: ( FXM.attributesMissing.length ? "open" : "" ),
		summary: `Invalid Metadata - ${ FXM.attributesMissing.length} found ${ help }`,
		description: `Seven types of attributes are required: ${ keys.join( ', ' ) }`,
		contents:
			`
			Attributes provided: ${ FXM.attributesProvided.length.toLocaleString() } found<br>
			Attributes missing: ${ FXM.attributesMissing.length.toLocaleString() } found<br>

			<div>${ data }</div
			`,
		timeStart: timeStart

	} );


	return FXMdet;
};



FXM.setMenuMetadata = function() {

	//FXM.getMetadataIssuesCheck();

	let htm;

	if ( FXM.attributesMissing.length === 0 ) {

		htm =
		`
			<p>${ FXM.attributesMissing.length } attributes missing</p>

			<p>Checked:<br>
			${ FXM.attributesProvided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' ) }</p>
		`;

	} else {

		htm =
		`
			${FXM.attributesMissing.length} attributes missing

			<p>gbXML attributes provided:<br>
				${ FXM.attributesProvided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )}</p>

			<p>gbXML attributes missing:<br>
				${FXM.attributesMissing.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )} </p>

			<p>
				<button onclick=FXM.setDivMetadataIssues(); >Add missing attributes</button>
			</p>

			<div id=FXMdivMissingMeta ></div>

		`;

	}

	return htm;

};



FXM.setDivMetadataIssues = function() {

	let attributesMissing = '';

	for ( let attribute of FXM.attributesMissing ) {

		attributesMissing +=
		`
			<p>
				${ attribute }:
				<input onclick=this.select(); onchange=FXM.setChangesMetadataIssues(); value=${FXM.metadataValues[attribute]} size=25 >
			<p>
		`;

	}

	FXMdivMissingMeta.innerHTML =

	`
		<div id=FXMdivInputs >${ attributesMissing }</div>

		<p>
			<button onclick=FXM.setDivMetadataIssues(); >Reset changes</button>
		</p>

		<p>
			<button onclick=onchange=FXMtxtAttributesMissing.value=FXM.setChangesMetadataIssues(); >Update the changes in gbXML file </button>
		</p>

		<h3>Changes for missing attributes</h3>

		<textArea id=FXMtxtAttributesMissing style="height:100px;width:100%;" ></textArea>

		<p>
			<button onclick=FXM.addChangesToData(); >Add changes to data in memory</button>

			<button onclick=FXMtxtAttributesMissing.value=SGT.text.slice(0,200); >view gbXML text</button>

			<button onclick=FXMdivMetaData.innerHTML=FXM.checkMetaData(); >Run check again</button>

		</p>

		<p>
			Click 'Save file as' button in File menu to save changes to a file.
		</p>
	`;

	FXMtxtAttributesMissing.value = FXM.setChangesMetadataIssues();

};



FXM.setChangesMetadataIssues = function() {

	const inputs = FXMdivInputs.querySelectorAll( "input" );

	const metadataNew = FXM.attributesMissing.map( ( attribute, index ) => {
		//console.log( 'att', attribute );

		return `${ attribute }="${ inputs[ index ].value }" `;

	} );

	FXM.metadataNew = metadataNew.join( '' );

	return FXM.metadataNew;

};


FXM.addChangesToData = function() {

	//console.log( '', FXM.metadataNew );

	SGT.text = SGT.text.replace ( '<gbXML ', '<gbXML ' + FXM.metadataNew );

	//detMenuEdit.open = false;



}
