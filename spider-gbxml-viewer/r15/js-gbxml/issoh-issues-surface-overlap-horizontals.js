// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX */
/* jshint esversion: 6 */


const ISSOH = { "release": "R15.4", "date": "2019-03-14" };

ISSOH.description =
	`
		Issues Surface Overlap Horizontals (ISSOH) checks if a horizontal surface includes another surface.

	`;

ISSOH.currentStatus =
	`

		<summary>Surface Overlap Horizontals (ISSOH) ${ ISSOH.release} ~ ${ ISSOH.date }</summary>

		<p>
			${ ISSOH.description }
		</p>
		<p>
		Concept
			<ul>
				<li>Module is work-in-progress. Checking horizontals only. <i class=highlight >You will need to reload the web page between each run.</i></li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/issoh-issues-surface-overlap-horizonteals.js: target="_blank" >
				Issues Surface Overlap Horizontals source code
			</a>
		</p>

		<details>
			<summary>Change log</summary>

			<ul>
				<li>2019-03-14 ~ R15.4 ~ Add non-working delete button. Add stats display and text</li>
				<li>2019-03-13 ~ R15.3 ~ Many fixes</li>
				<li>2019-03-06 ~ R15.2 ~ bring in ISRC</li>
				<li>2019-03-03 ~ R15.1 ~ beginning to find overlaps nicely</li>
				<li>2019-03-01 ~ R15.0 ~ First commit</li>
			</ul>
		</details>
	`;


ISSOH.getMenuSurfaceOverlapHorizontals = function() {

	const htm =

	`<details id="ISSOHdetSurfaceOverlapHorizontals" ontoggle=ISSOH.getSurfaceOverlapHorizontalsCheck(); >

		<summary>Surface Overlap Horizntls<span id="ISSOHspnCount" ></span>
			<a id=ISSOHsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISSOHsumHelp,ISSOH.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			Module is work-in-progress. Checking horizontals only. You will need to reload the web page between each run.
		</p>

		<p>
			1. <button onclick=ISRC.addNormals(this,ISSOH.horizontalSurfaces,ISSOHselSurfaceOverlapHorizontals,ISSOHoverlaps); >
			add normals to horizontal surfaces</button>
		</p>

		<p>
			2. <button onclick=ISRC.castRaysSetIntersectionArrays(this); >cast rays get intersections</button>
		</p>

		<p>
			<button onclick=ISRC.setSurfaceArraysShowHide(this,ISRC.surfaceIntersectionArrays); title="Starting to work!" >
			show/hide overlaps
			</button>
		</p>

		<p>
			<select id=ISSOHselSurfaceOverlapHorizontals multiple onchange=ISRC.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISRC.showHideSelected(this,ISSOHselSurfaceOverlapHorizontals); >show/hide selected surfaces</button>
		</p>

		<p>
			<button onclick=alert("coming_soon"); >delete selected surfaces</button>
		</p>

		<p id=ISSOHoverlaps ></p>


	</details>`;

	return htm;

};



ISSOH.getSurfaceOverlapHorizontalsCheck = function() {

	THR.scene.remove( ISSOH.horizontalNormalsFaces );

	ISSOH.horizontalSurfaces = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i );

		if ( tilt && ( tilt[ 1 ] === "0" || tilt[ 1 ] === "180" ) ) { ISSOH.horizontalSurfaces.push( index ); }

	});

	return ISSOH.horizontalSurfaces.length;

};
