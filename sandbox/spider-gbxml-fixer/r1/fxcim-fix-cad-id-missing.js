// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const FXCIM = { "release": "1.1", "date": "2019-03-25" };

FXCIM.description = `Fix surfaces with missing CAD object ID`;

FXCIM.currentStatus =
	`
		<h3>Fix Surface CAD Objct ID Missing (FXCIM) R${ FXCIM.release } ~ ${ FXCIM.date }</h3>

		<p>
			${ FXCIM.description }.
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

		if ( !cadId ){ noId.push( index ) }

	} );

	const options = noId.map( index =>
		`<option value=${index } >${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }</option>` );
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
				<select onclick=FXCIMdivIdMissingData.innerHTML=FXCIM.getFixCim(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<div id="FXCIMdivIdMissingData" >Click a surface ID above to view its details and update its surface type</div>

			<p>
				<button onclick=FXCIMdivIdMissing.innerHTML=FXCIM.getFixCadIdMissing(); >Run check again</button>
			</p>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;
// 			${ htm.join( "" ) }

	return cimHtm;

};



FXCIM.getFixCim = function( select ) {

	const invalidData = SGT.getSurfacesAttributesByIndex(select.value );
	const htm =

	`
		${ invalidData }

		<p>
			CAD Object ID <input style=width:30rem; > <button onclick=alert("Coming-soon"); >update</button>
		</p>
	`;

	return htm;

};
