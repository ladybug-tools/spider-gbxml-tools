// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGT, FIL, FXsumCheckGeneral, FXsumCheckOffset */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


SGT.getCheckGeneral = function() {

	const timeStart = performance.now();
	let htm = "";

	if ( SGT.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16 and supports double byte characters.
				The file is twice the size of a utf-8 file. This may be unnecessary.
			</p>

		`;
	}

	let area =  SGT.text.match( /<Area(> <|><|>0<?)\/Area>/gi );
	area = area ? area.length : 0;
	//console.log( 'area', area );

	htm +=
	`
		<p>
			Area = 0 or space or null: ${ area } found
		</p>
	`;


	let vol = SGT.text.match( /<volume(> <|><|>0<?)\/volume>/gi );
	vol = vol ? vol.length : 0;

	htm  +=
	`
		<p>
			Volume = 0 or space or null: ${ vol } found
		</p>
	`;

	let string = SGT.text.match( /""/gi );
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

	FXsumCheckGeneral.innerHTML = `Check for valid text and numbers ~ ${ errors } errors found`;

	const generalHtm =
		`
			<p><i>check for elements with no values</i></p>

			<p>General Check - ${ errors } found</p>

			<p>${ htm }</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return generalHtm;

};



SGT.getCheckOffset = function() {
	// move to own module / add pop-up etc

	const timeStart = performance.now();
	let max = 0;

	FIL.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );


	FXsumCheckOffset.innerHTML = `Check maximum offset distance from origin ~ ${ max.toLocaleString() } units`;

	const offsetHtm =

	`
		<p><i>Largest distance - x, y, or z - from the origin at 0, 0, 0</i></p>

		<p>Largest coordinate found: ${ max.toLocaleString() }</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return offsetHtm;

};
