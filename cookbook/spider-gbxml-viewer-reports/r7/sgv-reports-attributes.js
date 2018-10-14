// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX */
/* jshint esversion: 6 */


const REPA = {};

REPA.getAttributesMenuItems = function() {

	const htm =

	`
		<i>View gbXML project attributes</i>

		<details onToggle=divCampus.innerHTML=REPA.setGbjsonAttributes(GBX.gbjson.Campus); >

			<summary>Campus</summary>

			<div id=divCampus ></div>

			<hr>

		</details>


		<details onToggle=divCampusLocation.innerHTML=REPA.setGbjsonAttributes(GBX.gbjson.Campus.Location); >

			<summary>Campus Location</summary>

			<div id=divCampusLocation ></div>

			<hr>

		</details>


		<details onToggle=divBuilding.innerHTML=REPA.setGbjsonAttributes(GBX.gbjson.Campus.Building); >

			<summary>Building</summary>

			<div id=divBuilding ></div>

			<hr>

		</details>

		<details onToggle=divConstruction.innerHTML=REPA.setGbjsonAttributes(GBX.gbjson.Construction); >

			<summary>Construction</summary>

			<div id=divConstruction ></div>

			<hr>

		</details>

		<hr>

		<details onToggle=divMore.innerHTML=REPA.getMore() >

			<summary>More</summary>

			<div id=divMore ></div>

			<hr>

		</details>

		<p>
			<small><i>Need reports on more gbXML elements? <br>
			<a href="https://github.com/ladybug-tools/spider/issues" >Just shout</a> and they will be made to appear.</i></small>
		</p>

	`;

	return htm;

};



REPA.setGbjsonAttributes = function( obj, target, title ) {
	//console.log( 'obj', obj );
	//console.log( 'target', target );

	let attributes = '';

	for ( let property in obj ) {

		if ( obj[ property ] !== null && typeof( obj[ property ] ) === 'object' ) {

			if ( title === 'Construction') {

				//console.log( 'property', obj[ property ] );

				attributes +=
				`<div>
					<p class=attributeTitle >${obj[ property ].id }:</p>`;

				const construction = obj[ property ];

				keys = Object.keys( construction );

				for ( let key of keys ) {

					//console.log( key, construction[ key ] );

					if ( key === "LayerId" ) {

						for ( let item of Array.from( construction.LayerId ) ) {

							//console.log( 'item', item );
							attributes += `LayerId: ${ item.layerIdRef }<br>`;
						}

					} else {

						attributes += `${ key }: ${ construction[ key ] } <br>`;

					}

				}

				attributes += '</div><br>';

			}

		} else {

			attributes +=
			`<div>
				<span class=attributeTitle >${property}:</span>
				<span class=attributeValue >${obj[ property ]}</span>
			</div>`;

		}

	}
	//console.log( 'attributes', attributes );

	return attributes;

};



////////// More

REPA.getMore = function() {

	const mapLink = REPA.getGoogleMap();

	const wolframAlphaLink = REPA.getWolframAlpha();

	return `${ mapLink } <br> ${ wolframAlphaLink }`;

};



REPA.getGoogleMap = function() {

	const locate = GBX.gbjson.Campus.Location;  // remember that location is a reserved word in your browser
	let linkToMap;

	if ( locate && locate.Latitude && locate.Longitude ) {

		const link = 'https://www.google.com/maps/@' + locate.Latitude + ',' + locate.Longitude + ',17z';

		linkToMap = '<a href="'+ link + '" target=_blank > Google Map at lat & lon</a>';

	} else {

		linkToMap = '';

	}

	return '<span title="Use context menu to open a Google Map in a new tab" >' + linkToMap + '<span>';

};



REPA.getWolframAlpha = function() {

	const locate = GBX.gbjson.Campus.Location;  // remember that location is a reserved word in your browser
	let linkToMap;

	if ( locate && locate.Latitude && locate.Longitude ) {

		const link = 'http://www.wolframalpha.com/input/?i=' + locate.Latitude + '+degrees,+' + locate.Longitude + '+degrees';

		linkToMap = '<a href="'+ link + '"  target=_blank > Wolfram info for lat & lon</a>';

	} else {

		linkToMap = '';

	}

	return '<span title="Use context menu to open a Wolfram Alpha in a new tab" >' + linkToMap + '<span>';

};

