// Copyright 2019 Ladybug Tools authors. MIT License
/* global THREE * /
/* jshint esversion: 6 */



const FLS = { "release": "R13.1", "date": "2019-01-10" };

 FLS.description = FLS.description || document.head.querySelector( "[ name=description ]" ).content;

 FLS.currentStatus =
	`
		<h3>Spider Selected Files ${ FLS.release} ~ ${ FLS.date }</h3>

		<p>Menu panel inserted into TooToo menu</p>

	`;



FLS.getMenuSelectedFiles = function() {

	const htm =
	`
		<details open >

			<summary>Selected Spider Files
				<a id=FLSSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FLSSum,FLS.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div>

				<p>Current development activity is primarily going on here:<br>

				<b><a href="https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/index.html" target="_blank">Spider gbXML Plus</a></b>

				<p>The objective is to open and view huge gbXML files very quickly.
				See also its <a href="#sandbox/spider-gbxml-text-parser/README.md" target="_blank">Read Me</a> file.</p>

				<p>Other scripts of interest include <a href="https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/index.html" target="_blank">Spider gbXML Viewer Basic</a>.</p>

				<p>For more background see <a href="https://www.ladybug.tools/spider" target="_blank">Ladybug Tools / Spider</a>.</p>

			</div>

		</details>
	`;

	return htm;


};