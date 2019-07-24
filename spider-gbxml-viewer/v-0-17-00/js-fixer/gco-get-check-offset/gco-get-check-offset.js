// jshint esversion: 6
/* globals GBX, GCOsumCheckOffset*/
// jshint loopfunc: true


const GCO = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Check for the maximum vertex offset from the origin point of the model",
		helpFile: "../v-0-17-00/js-fixer/gco-get-check-offset/gco-get-check-offset.md",
		license: "MIT License",
		version: "0.17.00-0gco"

	}

};



GCO.getCheckOffset = function() {

	const htm =
		`
			<details ontoggle="GCOdivCheckOffset.innerHTML=GCO.getOffset();" >

				<summary id=GCOsumCheckOffset >Check project offset distance from origin</summary>

				${ GBXF.getHelpButton( "GCObutHelp", GCO.script.helpFile ) }

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
		`Check project offset distance from origin ~ <${ tag }>${ max.toLocaleString() }</${ tag }> units`;

	const offsetHtm =

		`
			<p><i>Maximum distance - x, y, or z - from the origin at 0, 0, 0</i></p>

			<p>Largest coordinate found: ${ max.toLocaleString() }</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return offsetHtm;

};
