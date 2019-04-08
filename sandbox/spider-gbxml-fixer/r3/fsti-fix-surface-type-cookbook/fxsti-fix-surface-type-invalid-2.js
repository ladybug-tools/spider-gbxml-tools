//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FXSTI = { "release": "2.1.0", "date": "2019-04-02" };


FXSTI.description =
	`
		type 2 Checks for a surface type that is not one of the 15 valid gbXML surface types
	`;

FXSTI.currentStatus =
	`
		<h3>Fix Surface Type Invalid (FXSTI) R${ FXSTI.release } ~ ${ FXSTI.date }</h3>

		<p>
			${ FXSTI.description }.
		</p>

		<p>
			Most likely this type of error is quite rare. It occurs when a user types in a non-valid surface type in the originating CAD application.
		</p>

		<p>
			Wish List / To do:<br>
			<ul>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface type in the select type list box</li>
			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-29 ~ Add - FXSTI.showSelectedSurfaceGbxml() / Pass through jsHint</li>
				<li>2019-03-25 ~ List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-23 ~ Add help pop-up. Fix 'run again'</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;




FXSTI.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details ontoggle="FXSTIdivSurfaceType.innerHTML=FXSTI.getSurfaceType();" >

			<summary id=FXSTIsumSurfaceType class=sumHeader >Fix surfaces with invalid surface type
				<a id=FXSTISum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXSTISum,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id=FXSTIdivSurfaceType ></div>

			</details>

		`;

	return htm;

};



FXSTI.getSurfaceType = function() {

	const timeStart = performance.now();

	count = 0

	FXSTI.surfaceTypes = SGF.surfaces.map( surface => {

		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

		let spaces = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		spaces = spaces ? spaces : [];
		//console.log( '', spaces );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 1 ] : false;

		let type;

		if ( tilt === "90" ) {

				if ( spaces.length === 2 ) {

				const id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i )[1 ];
				const id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i )[1 ];
				//console.log( '', id1, id2 );

				if ( id1 !== id2) {

					type = "InteriorWall";

				} else {

					type = "Air";

				}

				//type = "InteriorWall";



			} else if ( spaces.length === 1 ) {

				//console.log( '', exposedToSun );

				if ( exposedToSun === "true" ) {

					type = "ExteriorWall";

				} else {

					type = "UndergroundWall";

				}


			} else if ( spaces.length === 0 ) {

				type = "Shade";

			} else {

				//console.log( 'typeSource', spaces );
				//console.log( 'typeSource', typeSource );

			}

		} else if ( tilt === "0" ){

				if ( spaces.length === 2 ) {

				//type = "Ceiling";
				type = "InteriorFloor";


			} else if ( spaces.length === 1 ) {

				type = "Roof"

			} else {

				type = "Shade";

			}

		} else if ( tilt === "180" ){

			if ( spaces.length === 2 ) {

				type = "InteriorFloor";

			} else if ( spaces.length === 1 ) {

				if ( exposedToSun === "true" ) {

					type = "RaisedFloor";

				} else {

					type = "SlabOnGrade"

				}

			} else {

				type = "Shade";

			}

		} else {

			//console.log( 'tilt', tilt );

			if ( spaces.length === 2 ) {

				if ( Number( tilt ) > 45 && Number( tilt ) <=90 ) {

					type = "InteriorWall";

					} else {

					type = "InteriorFloor";

					}

			} else if ( spaces.length === 1 ) {

				if ( Number( tilt ) > 45 && Number( tilt ) <=90 ) {

					//console.log( 'tilt', tilt );
					type = "ExteriorWall";

				} else {

					type = "Roof";

				}

			} else {

				type = "Shade";

			}

		}

		if ( type !== typeSource ) {

			if ( typeSource === "UndergroundSlab" && type === "SlabOnGrade" ) {

			} else {

				console.log( 'ff', typeSource, type, spaces, tilt );

			}


		}
		return type;

	} )

	console.log( 'count', count );
	//console.log( 'FXSTI.surfaceTypes', FXSTI.surfaceTypes );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceType.innerHTML =
		`Surface types ~ ${ FXSTI.surfaceTypes.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGF.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FXSTI.surfaceTypes.length.toLocaleString() } surface types found. See tool tips for surface ID.</p>


		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};


FXSTI.setTypeInvalidData = function( select ) {

	const invalidData = SGF.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText );

	const options = SGF.surfaceTypes.map( ( type, index ) => {

		const selected = ""; //index === selectedIndex ? "selected" : "";
		return `<option ${ selected } >${ type }</option>`;

	} ).join( "" );

	let index = 0;

	const htm =
		`
			<p>
				${ invalidData }
			</p>

			<p>
				Select new surface type <select id=selSurfaceType${ index } >${ options }</select>
				<button onclick=FXSTI.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FXSTI.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FXSTI.setSurfaceType = function( index ) {
	//console.log( 'index',FXSTI.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGF.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text =  SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FXSTI.showSurfaceGbxml = function( index ) {

	const surfaceText = SGF.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FXSTIdivSelecteSurfaceTGbxml.innerText = surfaceText;

};
