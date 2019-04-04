//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


TMP = { release: "2.0.0", date: "2019-04-03" };

TMP.description = `Template`;


TMP.currentStatus =
	`
		<h3>Get Template(TMP) ${ TMP.release } status ${ TMP.date }</h3>

		<p>${ TMP.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/tnp-template.js" target="_blank">
			tmp-template.js source code</a>
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



TMP.getTemplate = function() {

	const htm =
		`
			<details ontoggle="TMPdivTemplate.innerHTML=TMP.getData();" >

			<summary id=TMPsumTemplate class=sumHeader >Template
				<a id=TMPSum class=helpItem href="JavaScript:MNU.setPopupShowHide(TMPSum,TMP.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>
				<div id=TMPdivTemplate ></div>

			</details>

		`;

	return htm;

};


TMP.getData = function() {


	const htm =
	`
		<p>
			lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
		</p>

	`;

	return htm;

};
