//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


GCS = { release: "2.0.0", date: "2019-04-03" };

GCS.description = `Check strings`;


GCS.currentStatus =
	`
		<h3>Get Get Strings(GCS) ${ GCS.release } status ${ GCS.date }</h3>

		<p>${ GCS.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/gcs-get-check-strings.js" target="_blank">
			gcs-get-check-strings.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li></li>
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
  				<li>2019-04-03 ~ F - First commit</li>
			</ul>
		</details>
	`;



GCS.getCheckStrings = function() {

	const htm =
		`
			<details ontoggle="GCSdivCheckStrings.innerHTML=GCS.getData();" >

			<summary id=GCSsumGetCheckStrings class=sumHeader >Check Strings
				<a id=GCSSum class=helpItem href="JavaScript:MNU.setPopupShowHide(GCSSum,GCS.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id=GCSdivCheckStrings ></div>

			</details>

		`;

	return htm;

};


GCS.getData = function() {

	const timeStart = performance.now();
	let htm = "";

	if ( SGF.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16 and supports double byte characters.
				The file is twice the size of a utf-8 file. This may be unnecessary.
			</p>

		`;
	}

	let area =  SGF.text.match( /<Area(> <|><|>0<?)\/Area>/gi );
	area = area ? area.length : 0;
	//console.log( 'area', area );

	htm +=
	`
		<p>
			Area = 0 or space or null: ${ area } found
		</p>
	`;


	let vol = SGF.text.match( /<volume(> <|><|>0<?)\/volume>/gi );
	vol = vol ? vol.length : 0;

	htm  +=
	`
		<p>
			Volume = 0 or space or null: ${ vol } found
		</p>
	`;

	let string = SGF.text.match( /""/gi );
	string = string ? string.length : 0;

	htm  +=
	`
		<p>
			String = "": ${ string } found
		</p>
	`;

	//divContents.innerHTML += htm;

	const errors = area + vol + string;
	//console.log( 'errors ', errors );

	GCSsumGetCheckStrings.innerHTML = `Check for valid text and numbers ~ ${ errors } errors found`;

	const generalHtm =
		`
			<p><i>check for elements with no values</i></p>

			<p>General Check - ${ errors } found</p>

			<p>${ htm }</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return generalHtm;

};
