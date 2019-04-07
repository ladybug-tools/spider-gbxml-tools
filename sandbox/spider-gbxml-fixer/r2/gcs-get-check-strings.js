//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


GCS = { release: "2.0.1", date: "2019-04-04" };

GCS.description = `Check and report on elements with inappropriate null, zero or blank values values`;


GCS.currentStatus =
	`
		<h3>Get Get Strings(GCS) ${ GCS.release } status ${ GCS.date }</h3>

		<p>${ GCS.description }</p>

		<p><i>Another important check is to verify that your gbXML file loads properly
			and is nicely formatted  in your browser. <a href="https://en.wikipedia.org/wiki/XML" target="_blank">XML</a> files are designed to be used across the Internet.</i></p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/gcs-get-check-strings.js" target="_blank">
			gcs-get-check-strings.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li>2019-04-04 ~ Invalid text does not seem to be an issue that occurs frequently.
				Therefore, it is being given low-priority.
				If you have a number of gbXML files with these sorts of issues, please let us know.
				We should be able to fix errors like these quite easily.</li>
			</ul>

		</details>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-04 ~ D - Update text in script and pop-up</li>
				<li>2019-04-04 ~ B - Fix help not appearing</li>
  				<li>2019-04-03 ~ F - First commit</li>
			</ul>
		</details>
	`;



GCS.getCheckStrings = function() {

	GCS.help = `<a id=GCSSum class=helpItem href="JavaScript:MNU.setPopupShowHide(GCSSum,GCS.currentStatus);" >&nbsp; ? &nbsp;</a>`
	const htm =
		`
			<details ontoggle="GCSdivCheckStrings.innerHTML=GCS.getData();" >

			<summary id=GCSsumGetCheckStrings class=sumHeader >Check for valid text and numbers
				${ GCS.help }
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

	GCSsumGetCheckStrings.innerHTML = `Check for valid text and numbers ~ ${ errors } errors found ${ GCS.help }`;

	const generalHtm =
		`
			<p><i>check for elements with no values</i></p>

			<p>General Check - ${ errors } found</p>

			<p>${ htm }</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return generalHtm;

};
