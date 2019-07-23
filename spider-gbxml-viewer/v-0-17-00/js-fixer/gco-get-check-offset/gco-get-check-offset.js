/* globals GBX, GCOsumCheckOffset*/
// jshint esversion: 6
// jshint loopfunc: true


const GCO = {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Check for the maximum vertex offset from the origin point of the model",
		helpFile: "https://www.ladybug.tools/spider-gbxml-fixer/r0-4-0/gco-get-check-offset/README.md",
		version: "0.4.0-6"

};



GCO.getCheckOffset = function() {

	GCO.help = `<button id=butGCO class=butHelp onclick="POP.setPopupShowHide(butGCO,GCO.helpFile);" >?</button>`;

	const htm =
		`
			<details ontoggle="GCOdivCheckOffset.innerHTML=GCO.getOffset();" >
				<summary id=GCOsumCheckOffset >Check project offset distance from origin
					${ GCO.help }
				</summary>

				<div id=GCOdivCheckOffset ></div>

			</details>
		`;

	return htm;

};


GCO.getOffset = function() {

	const timeStart = performance.now();
	let max = 0;

	GBX.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );

	const tag = max < 10000 ? "span" : "mark";

	GCOsumCheckOffset.innerHTML =
		`Check project offset distance from origin ~ <${ tag }>${ max.toLocaleString() }</${ tag }> units
			${ GCO.help }
		`;

	const offsetHtm =

		`
			<p><i>Maximum distance - x, y, or z - from the origin at 0, 0, 0</i></p>

			<p>Largest coordinate found: ${ max.toLocaleString() }</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return offsetHtm;

};
