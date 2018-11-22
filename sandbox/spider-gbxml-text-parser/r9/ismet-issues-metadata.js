// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */

const ISMET = { "release": "R9.2", "data": "2018-11-21" };

ISMET.surfaceChanges = {};

ISMET.vvvrequirements = [
	'areaUnit', 'lengthUnit', 'temperatureUnit', 'useSIUnitsForResults', 'version', 'volumeUnit', 'xmlns'
];

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



ISMET.setMetadataIssues = function() {

	ISMET.provided = [];
	ISMET.attributesMissing = [];

	//for ( let attribute of ISMET.requirements ) {
	for ( let attribute of Object.keys( ISMET.metadataValues ) ){

		//console.log( 'attribute', attribute );

		if ( GBX.text.includes( attribute) ) {

			ISMET.provided.push( attribute );

		} else { //if ( GBX.text.includes( attribute ) === false ) {

			//console.log( 'attribute', attribute );
			ISMET.attributesMissing.push( attribute );

		}

	}

}



ISMET.getMenuMetadataIssues = function() {

	ISMET.setMetadataIssues();

	let htm =

	`<details ontoggle="ISMETdetPanelMetadataIssues.innerHTML=ISMET.setMenuMetadata();" >

		<summary>Missing gbXML Metadata: ${ ISMET.attributesMissing.length } found</summary>

		<p>
			<i>
				Identify required gbXML attributes that are missing in the file.
			</i>
		</p>

		<div id="ISMETdetPanelMetadataIssues" ></div>

		<div>${ ISMET.currentStatus }</div>

	</details>`;

	return htm;

};



ISMET.setMenuMetadata = function() {

	let htm;

	if ( ISMET.attributesMissing.length === 0 ) {

		htm =
		`
			<p>${ ISMET.attributesMissing.length } attributes missing</p>

			<p>Checked:<br>
			${ ISMET.provided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' ) }</p>
		`;

	} else {

		htm =
		`
			${ISMET.attributesMissing.length} attributes missing

			<p>gbXML attributes provided:<br>
				${ ISMET.provided.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )}</p>

			<p>gbXML attributes missing:<br>
				${ISMET.attributesMissing.map( ( item, index ) => `${ 1 + index }. ${ item }` ).join( '<br>' )} </p>

			<p>
				<button onclick=ISMET.setPopupMetadataIssues(); >Add missing attributes</button>
			</p>

			<div id=ISMETdivMissingMeta ></div>

		`;

	}

	return htm;

};



ISMET.setPopupMetadataIssues = function() {

	let attributesMissing = '';

	for ( let attribute of ISMET.attributesMissing ) {

		//GBX.gbjson[ attribute ] = values[ attribute ];
		attributesMissing +=

		`<p>
			${ attribute }:
			<input onclick=this.select(); onchange=ISMET.setChangesMetadataIssues(); value=${ISMET.metadataValues[attribute]} size=25 >
		<p>`;

	}

	ISMETdivMissingMeta.innerHTML =

	`
		<div id=divSavHeader ></div>

		<div id=ISMETdivInputs >${ attributesMissing }</div>

		<p>
			<button onclick=ISMET.setPopupMetadataIssues(); >Reset changes</button>
		</p>


		<p>
			<button onclick=onchange=ISMETtxtAttributesMissing.value=ISMET.setChangesMetadataIssues(); >Update the changes in gbXML file </button>
		</p>

		<h3>Changes for missing attributes</h3>

		<textArea id=ISMETtxtAttributesMissing style="height:100px;width:100%;" ></textArea>

		<p>
			<button onclick="alert('coming as soon as someone needs this')" >Save changes</button>
		</p>

	`;


	ISMETtxtAttributesMissing.value = ISMET.setChangesMetadataIssues();
};



ISMET.setChangesMetadataIssues = function() {

	inputs = ISMETdivInputs.querySelectorAll( "input" );

	metadataNew = ISMET.attributesMissing.map( ( attribute, index ) => {

		//console.log( 'att', attribute );

		return `${ attribute }="${ inputs[ index ].value }" `;

	} );

	return metadataNew.join( '' );

};
