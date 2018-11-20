
const ISSM = { "release": "R7.1" };

ISSM.surfaceChanges = {};

////////// Metadata

ISSM.getPanelMetadataIssues = function() {


	let htm =

	`<details ontoggle="ISSMdetPanelMetadataIssues.innerHTML=ISSM.setMenuMetadata();" >

		<summary>Missing gbXML Metadata</summary>

		<p>
			<i>
				Identify missing but required gbXML attributes.
				Issues Metadata ${ ISSM.release }
			</i>
		</p>

		<div id="ISSMdetPanelMetadataIssues" ></div>

		<p><button onclick=ISSM.setPopupMetadataIssues(); >Add missing attributes</button></p>

		<div id=ISSMdivMissingMeta ></div>

		<hr>

	</details>`;

	return htm;


};



ISSM.setMenuMetadata = function() {

	const requirements = [
		'areaUnit', 'lengthUnit', 'temperatureUnit', 'useSIUnitsForResults', 'version', 'volumeUnit', 'xmlns'
	];

	let provided = [];
	ISSM.attributesMissing = [];

	for ( let attribute in GBX.gbjson ) {

		//console.log( 'attribute', attribute );

		if ( requirements.includes( attribute) ) {

			provided.push( attribute );

		}

	}
	//console.log( 'provided', provided );

	for ( let attribute of requirements ) {

		if ( GBX.text.includes( attribute ) === false ) {

			//console.log( 'attribute', must );
			ISSM.attributesMissing.push( attribute );

		}

	}
	//console.log( 'ISSM.attributesMissing', ISSM.attributesMissing.join( '<br>' ) );


	let htm =

	`
		${ISSM.attributesMissing.length} attributes missing

		<p>gbXML attributes provided:<br>&bull; ${provided.join( '<br>&bull; ' )}</p>

		<p>gbXML attributes missing:<br>&bull;  ${ISSM.attributesMissing.join( '<br>&bull; ' )} </p>
	`;

	//console.log( 'htm', htm );

	return htm;

};



ISSM.setPopupMetadataIssues = function() {

	ISSM.metadataValues = {

		'areaUnit': 'SquareMeters',
		'lengthUnit': 'Meters',
		'temperatureUnit': 'C',
		'useSIUnitsForResults': 'true',
		'version': '0.37',
		'volumeUnit': 'CubicMeters',
		'xmlns': 'http://www.gbxml.org/schema'
	};

	ISSMdivMissingMeta.innerHTML =
	`
		<div id=divSavHeader ></div>
		<div id=ISSMdivAttributesMissing ></div>

		<p>
			<button onclick=ISSM.surfaceChanges.addAttributesMissing=[];ISSM.setChangesMetadataIssues(this); >Reset changes</button>

			<button onclick=onchange=ISSM.setChangesMetadataIssues(this); >Update the changes in gbXML file </button>

		</p>

		<h3>Changes for missing attributes</h3>

		<textArea id=ISSMtxtAttributesMissing style="height:300px;width:100%;" ></textArea>

		<p>
			<button onclick=alert( "coming as soon as someone needs this" ) >Save changes</button>
		</p>

	`;

	//CORdivMenuRight.style.display = 'block';
	//window.scrollTo( 0, 0 );

	let txt = '';

	ISSM.surfaceChanges.addAttributesMissing = {};

	for ( let attribute of ISSM.attributesMissing ) {

		ISSM.surfaceChanges.addAttributesMissing[ attribute ] = ISSM.metadataValues[ attribute ];
		//GBX.gbjson[ attribute ] = values[ attribute ];
		txt += `<p><input onclick=this.select(); onchange=ISSM.setChangesMetadataIssues(this,"${attribute}"); value=${ISSM.metadataValues[attribute]} size=25 > ${attribute} <p>`;
	}

	ISSMdivAttributesMissing.innerHTML = txt;

	metadataNew = '';

	for ( attribute of ISSM.attributesMissing ) {

		console.log( 'att', attribute );

		metadataNew += `${ attribute }="${ ISSM.metadataValues[ attribute ] }" `;

	}

	console.log( 'metadataNew', metadataNew );
	//metadataNew = ISSM.surfaceChanges.addAttributesMissing.( ( acc, item ) => acc + item.slice( 1, 5 ) );


	ISSMtxtAttributesMissing.value = metadataNew; // JSON.stringify( ISSM.surfaceChanges.addAttributesMissing, null, ' ' );

};



ISSM.setChangesMetadataIssues = function( that, attribute ) {

	//console.log( 'that', that );

	//if ( attribute ) {

		ISSM.surfaceChanges.addAttributesMissing[attribute]=that.value;

		metadataNew = '';

		for ( attribute of ISSM.attributesMissing ) {

			console.log( 'att', attribute );

			metadataNew += `${ attribute }="${ ISSM.metadataValues[ attribute ] }" `
		}

		ISSMtxtAttributesMissing.value = metadataNew; // JSON.stringify( ISSM.surfaceChanges.addAttributesMissing, null, ' ' );

		GBX.text = GBX.text.replace( /(<gbXML )/, `$1 ${ metadataNew } ` );

		console.log( 'text', GBX.text.slice( 0, 200 ) );

/* 	} else {

		ISSMtxtAttributesMissing.value =
			'There are no missing attributes that still need fixing.\n\n' +
			'Remember to save your changes to a new file.';

	} */

};
