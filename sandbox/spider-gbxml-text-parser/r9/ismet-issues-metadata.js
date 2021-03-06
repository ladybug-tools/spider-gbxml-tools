// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */

const ISMET = { "release": "R9.4", "data": "2018-12-02" };


ISMET.metadataValues = {

	'areaUnit': 'SquareMeters',
	'lengthUnit': 'Meters',
	'temperatureUnit': 'C',
	'useSIUnitsForResults': 'true',
	'version': '0.37',
	'volumeUnit': 'CubicMeters',
	'xmlns': 'http://www.gbxml.org/schema'
};



ISMET.currentStatus =
	`
		<aside>

			<details>
				<summary>ISMET ${ ISFC.release} status ${ ISFC.date }</summary>

				<p>This module is ready for light testing, but is still at an early stage of development.</p>

				<p>
					As and when the project gets access to more modules with other metadata errors,
					this module will be enhanced to identify and fix any more errors found.
				</p>

				<p>Whatever further checks you might need could be added here...</p>

			</details>

		</aside>

		<hr>
	`;



ISMET.getMetadataIssuesCheck = function() {

	ISMET.attributesProvided = [];
	ISMET.attributesMissing = [];

	for ( let attribute of Object.keys( ISMET.metadataValues ) ){
		//console.log( 'attribute', attribute );

		if ( GBX.text.includes( attribute) ) {

			ISMET.attributesProvided.push( attribute );

		} else {
			//console.log( 'attribute', attribute );

			ISMET.attributesMissing.push( attribute );

		}

	}

	ISMETdivMetadataIssues.innerHTML = ISMET.setMenuMetadata();

	ISMETspnCount.innerHTML = `: ${ ISMET.attributesMissing.length } found`;

	return ISMET.attributesMissing.length;

};



ISMET.getMenuMetadataIssues = function() {

	const htm =

	`<details id=ISMETdetMetadataIssues ontoggle=ISMET.getMetadataIssuesCheck();	>

		<summary>Missing gbXML Metadata<span id="ISMETspnCount" ></span></summary>

		<p>
			<i>
				Identify required gbXML attributes that are missing in the file.
			</i>
		</p>

		<div id="ISMETdivMetadataIssues" ></div>

		<div>${ ISMET.currentStatus }</div>

	</details>`;

	return htm;

};



ISMET.setMenuMetadata = function() {

	//ISMET.getMetadataIssuesCheck();

	let htm;

	if ( ISMET.attributesMissing.length === 0 ) {

		htm =
		`
			<p>${ ISMET.attributesMissing.length } attributes missing</p>

			<p>Checked:<br>
			${ ISMET.attributesProvided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' ) }</p>
		`;

	} else {

		htm =
		`
			${ISMET.attributesMissing.length} attributes missing

			<p>gbXML attributes provided:<br>
				${ ISMET.attributesProvided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )}</p>

			<p>gbXML attributes missing:<br>
				${ISMET.attributesMissing.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )} </p>

			<p>
				<button onclick=ISMET.setDivMetadataIssues(); >Add missing attributes</button>
			</p>

			<div id=ISMETdivMissingMeta ></div>

		`;

	}

	return htm;

};



ISMET.setDivMetadataIssues = function() {

	let attributesMissing = '';

	for ( let attribute of ISMET.attributesMissing ) {

		attributesMissing +=
		`
			<p>
				${ attribute }:
				<input onclick=this.select(); onchange=ISMET.setChangesMetadataIssues(); value=${ISMET.metadataValues[attribute]} size=25 >
			<p>
		`;

	}

	ISMETdivMissingMeta.innerHTML =

	`
		<div id=ISMETdivInputs >${ attributesMissing }</div>

		<p>
			<button onclick=ISMET.setDivMetadataIssues(); >Reset changes</button>
		</p>

		<p>
			<button onclick=onchange=ISMETtxtAttributesMissing.value=ISMET.setChangesMetadataIssues(); >Update the changes in gbXML file </button>
		</p>

		<h3>Changes for missing attributes</h3>

		<textArea id=ISMETtxtAttributesMissing style="height:100px;width:100%;" ></textArea>

		<p>
			<button onclick=ISMET.addChangesToData(); >Add changes to data in memory</button>
		</p>

		<p>
			Click 'Save file as' button in File menu to save changes to a file.
		</p>
	`;

	ISMETtxtAttributesMissing.value = ISMET.setChangesMetadataIssues();

};



ISMET.setChangesMetadataIssues = function() {

	const inputs = ISMETdivInputs.querySelectorAll( "input" );

	const metadataNew = ISMET.attributesMissing.map( ( attribute, index ) => {
		//console.log( 'att', attribute );

		return `${ attribute }="${ inputs[ index ].value }" `;

	} );

	ISMET.metadataNew = metadataNew.join( '' );

	return ISMET.metadataNew;

};


ISMET.addChangesToData = function() {

	//console.log( '', ISMET.metadataNew );

	GBX.text = GBX.text.replace ( '<gbXML ', '<gbXML ' + ISMET.metadataNew );

	detMenuEdit.open = false;

}
