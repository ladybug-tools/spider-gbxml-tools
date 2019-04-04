//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


GCO = { release: "2.0.0", date: "2019-04-03" };

GCO.description = `Check offset `;


GCO.currentStatus =
	`
		<h3>Get Check Offset(GCO) ${ GCO.release } status ${ GCO.date }</h3>

		<p>${ GCO.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/gco-get-check-offset.js" target="_blank">
			gco-get-check-offset.js source code</a>
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



GCO.getCheckOffset = function() {

	const htm =
		`
			<details ontoggle="GCOdivCheckOffset.innerHTML=GCO.getOffset();" >

			<summary id=GCOsumCheckOffset class=sumHeader >Check project offset distance from origin
				<a id=GCOSum class=helpItem href="JavaScript:MNU.setPopupShowHide(GCOSum,GCO.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>
				<div id=GCOdivCheckOffset ></div>

			</details>

		`;

	return htm;

};


GCO.getOffset = function() {

	const timeStart = performance.now();
	let max = 0;

	SGF.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );


	GCOsumCheckOffset.innerHTML = `Check maximum offset distance from origin ~ ${ max.toLocaleString() } units`;

	const offsetHtm =

	`
		<p><i>Largest distance - x, y, or z - from the origin at 0, 0, 0</i></p>

		<p>Largest coordinate found: ${ max.toLocaleString() }</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return offsetHtm;


};
