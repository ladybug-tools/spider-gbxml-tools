// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGT, SGTinpIgnoreAirSurfaceType, FXCIMsumIdMissing, FXCIMinpCadId, FXCIMdivIdMissing */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FXCIM = { "release": "1.3", "date": "2019-04-01" };

FXCIM.description = `Assign an ID to surfaces with a missing CAD object ID`;

FXCIM.currentStatus =
	`
		<h3>Fix Surface CAD Object ID Missing (FXCIM) R${ FXCIM.release } ~ ${ FXCIM.date }</h3>

		<p>
			${ FXCIM.description }.
		</p>

		<details open>
			<summary>Wish list / to do</summary>
			<ul>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Set a correct CAD object ID in the input automatically</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-01 ~ D - Update this pop-up</li>
				<li>2019-04-01 ~ B - Fix missing CAD object is not updating / Show name not id in select</li>
				<li>2019-03-29 ~ F - Add place holder value and update surface data / Pass through jsHint</li>
				<li>2019-03-29 ~ Add - FXCIM.showSelectedSurfaceGbxml()</li>
				<li>2019-03-25 ~ List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-23 ~ Add help pop-up. Fix 'run again'</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;



FXCIM.getFixCadIdMissing = function() {

	const timeStart = performance.now();
	let noId = [];

	SGT.surfaces.forEach( ( surface, index ) => {

		const cadId = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		if ( !cadId ){ noId.push( index ); }

	} );

	if ( SGTinpIgnoreAirSurfaceType.checked === true ) {

		noId = noId.filter( id => {

			const surfaceText = SGT.surfaces[ id ];
			//console.log( 'surfaceText', surfaceText );

			const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			return surfaceType !== "Air";

		}) ;

	}

	//const options = noId.map( index =>
	//	`<option value=${index } >${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }</option>` );
	//console.log( 'options', options );

	const options = noId.map( index => {

		const surface = SGT.surfaces[ index ];
		//console.log( 'sf', surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/gi );
		//console.log( 'name', name );

		name = name ? name.pop() : id;
		//.pop();

		return `<option value=${index } title="${ id }" >${ name }</option>`;

	} );
	//console.log( 'options', options );

	const help = `<a id=fxcimHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxcimHelp,FXCIM.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXCIMsumIdMissing.innerHTML =
		`Fix surfaces with missing CAD object ID ~ ${ noId.length.toLocaleString() } found
			${ help }
		`;


	const cimHtm =
		`
			<p><i>The CADObjectId Element is used to map unique CAD object identifiers to gbXML elements</i></p>

			Surfaces with no CAD Object ID: ${ noId.length.toLocaleString() }<br>

			<p>
				<select id=FXCIMselSurface onclick=FXCIMdivIdMissingData.innerHTML=FXCIM.getFixCim(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<div id="FXCIMdivIdMissingData" >Click a surface ID above to view its details and update its surface type</div>


			<div id=FXCIMdivSelectedSurfaceGbXML></div>

			<p>
				<button onclick=FXCIMdivSelectedSurfaceGbXML.innerText=SGT.surfaces[FXCIMselSurface.value] >View gbXML text</button>
			</p>

			<p>
				<button onclick=FXCIMdivIdMissing.innerHTML=FXCIM.getFixCadIdMissing(); >Run check again</button>
			</p>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return cimHtm;

};



FXCIM.getFixCim = function( select ) {

	const invalidData = SGT.getSurfacesAttributesByIndex( select.value,  select.options[ select.selectedIndex ].innerText );
	//console.log( 'invalidData', invalidData );

	const surfaceText = SGT.surfaces[ select.value ];
	//console.log( 'surfaceText', surfaceText );

	const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];

	const htm =

	`
		${ invalidData }
		<p>
			CAD Object ID <input id=FXCIMinpCadId value="Place holder: ${ surfaceType }" style=width:30rem; >

			<button onclick=FXCIM.setCadData(FXCIMselSurface); >UpdateCAD Object ID</button>
		</p>
	`;

	return htm;

};



FXCIM.setCadData = function( select ) {
	//console.log( '', 23 );

	const surfaceTextCurrent = SGT.surfaces[ select.value ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const cadId = FXCIMinpCadId.value ? FXCIMinpCadId.value : "";

	let surfaceTextNew = surfaceTextCurrent.replace( /<Name>/, `<CADObjectId>${ cadId }</CADObjectId> </Name>` );

	//console.log( 'surfaceTextNew', surfaceTextNew );

	if ( surfaceTextNew === surfaceTextCurrent ) {

		surfaceTextNew = surfaceTextCurrent.replace( /<\/Surface>/, `<CADObjectId>${ cadId }</CADObjectId> </Surface>` );

	}

	SGT.text =  SGT.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );

	FXCIMdivIdMissing.innerHTML=FXCIM.getFixCadIdMissing();

};