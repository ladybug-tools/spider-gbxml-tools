/* global THREE * /
/* jshint esversion: 6 */

// Copyright 2019 pushMe-pullYou authors. MIT License


const TMP = { "release": "R1.0", "date": "2018-12-31" };

 TMP.description = TMP.description || document.head.querySelector( "[ name=description ]" ).content;
 TMP.currentStatus =
	`
		<h3 TMP ${ TMP.release} status ${ TMP.date }</h3>

		<p>TooToo Template.</p>

	`;



TMP.getMenuTemplate = function() {


	const htm =
	`
		<details >

			<summary>Template
				<a id=tmpSum class=helpItem href="JavaScript:MNU.setPopupShowHide(tmpSum,TMP.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div>

				<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>

			</div>

		</details>
	`;

	return htm;


};