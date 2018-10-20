
const ISSM = {};

ISSM.surfaceChanges = {};

////////// Metadata

ISSM.getPanelMetadataIssues = function() {


	let htm =

	`<details ontoggle="ISSMdetPanelMetadataIssues.innerHTML=ISSM.setMenuMetadata();" >

		<summary>Missing gbXML Metadata </summary>

		<div id="ISSMdetPanelMetadataIssues" >ccc</div>

		<p><button onclick=ISSM.setPopupMetadataIssues(); >Add missing attributes</button></p>

		<div id=ISSMdivMissingMeta ></div>

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

		if ( !GBX.gbjson[ attribute ] ) {

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

	let values = {

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
			<button onclick=onchange=ISSM.setChangesMetadataIssues(this); >Update the changes</button>

			<button onclick=ISSM.surfaceChanges.addAttributesMissing=[];ISSM.setChangesMetadataIssues(this); >Clear changes</button>
		</p>

		<h3>Changes for missing attributes</h3>

		<textArea id=ISSMtxtAttributesMissing style="height:300px;width:100%;" ></textArea>

		<button onclick=ISSM.surfaceChanges.addAttributesMissing=ISSM.surfaceChanges.addAttributesMissing; >Save changes</button>
	`;

	//CORdivMenuRight.style.display = 'block';
	//window.scrollTo( 0, 0 );

	let txt = '';

	ISSM.surfaceChanges.addAttributesMissing = {};

	for ( let attribute of ISSM.attributesMissing ) {

		ISSM.surfaceChanges.addAttributesMissing[ attribute ] = values[ attribute ];
		GBX.gbjson[ attribute ] = values[ attribute ];
		txt += `<p><input onclick=this.select(); onchange=ISSM.setChangesMetadataIssues(this,"${attribute}"); value=${values[attribute]} size=25 > ${attribute} <p>`;
	}

	ISSMdivAttributesMissing.innerHTML = txt;
	ISSMtxtAttributesMissing.value = JSON.stringify( ISSM.surfaceChanges.addAttributesMissing, null, ' ' );

	};



	ISSM.setChangesMetadataIssues = function( that, attribute ) {

	//console.log( 'that', that );

	if ( attribute ) {

		ISSM.surfaceChanges.addAttributesMissing[attribute]=that.value;

		ISSMtxtAttributesMissing.value = JSON.stringify( ISSM.surfaceChanges.addAttributesMissing, null, ' ' );

	} else {

		ISSMtxtAttributesMissing.value =
			'There are no missing attributes that still need fixing.\n\n' +
			'Remember to save your changes to a new file.';

	}

};
