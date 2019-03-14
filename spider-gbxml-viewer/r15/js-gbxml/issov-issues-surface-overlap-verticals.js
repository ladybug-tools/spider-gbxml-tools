// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX */
/* jshint esversion: 6 */


const ISSOV = { "release": "R15.3", "date": "2019-03-14" };

ISSOV.description =
	`
		Issues Surface Overlap Verticals (ISSOV) checks if a surface includes another surface.

	`;

ISSOV.currentStatus =
	`

		<summary>Surface Overlap Verticals (ISSOV) ${ ISSOV.release} ~ ${ ISSOV.date }</summary>

		<p>
			${ ISSOV.description }
		</p>
		<p>
		Concept
			<ul>
				<li>Module is work-in-progress. Checking verticals only. You will need to reload the web page between each run.</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/issov-issues-surface-overlap-verticals.js: target="_blank" >
				Issues Surface Overlap Verticals source code
			</a>
		</p>
		<details>

			<summary>Change log</summary>
			<ul>
				<li>2019-03-14 ~ R15.3 ~ Add non-working delete button. Add stats display and text</li>
				<li>2019-03-13 ~ R15.2 ~ Many fixes</li>
				<li>2019-03-03 ~ R15.1 ~ beginning to find overlaps nicely</li>
				<li>2019-03-01 ~ R15.0 ~ First commit</li>
			</ul>
		</details>
	`;


ISSOV.getMenuSurfaceOverlapVerticals = function() {

	const htm =

	`<details id="ISSOVdetSurfaceOverlapVerticals" ontoggle=ISSOV.getSurfaceOverlapVerticalsCheck(); >

		<summary>Surface Overlap Verticals<span id="ISSOVspnCount" ></span>
			<a id=ISSOVsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISSOVsumHelp,ISSOV.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			Module is work-in-progress. Checking verticals only. You will need to reload the web page between each run.
		</p>

		<p>
			1. <button onclick=ISRC.addNormals(this,ISSOV.verticalSurfaces,ISSOVselSurfaceOverlapVerticals,ISSOVoverlaps); >
			add normals to vertical surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISRC.castRaysSetIntersectionArrays(this); >cast rays get intersections</button><br>
		</p>

		<p>
			<button onclick=ISRC.setSurfaceArraysShowHide(this,ISRC.surfaceIntersectionArrays); title="Starting to work!" >
			show/hide overlaps
			</button>
		</p>

		<p>
			<select id=ISSOVselSurfaceOverlapVerticals multiple onchange=ISRC.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISRC.showHideSelected(this,ISSOVselSurfaceOverlapVerticals); >show/hide selected surfaces</button>
		</p>

		<p>
			<button onclick=alert("coming_soon"); >delete selected surfaces</button>
		</p>

		<p id=ISSOVoverlaps ></p>

	</details>`;

	return htm;

};



ISSOV.getSurfaceOverlapVerticalsCheck = function() {

	THR.scene.remove( ISSOV.verticalNormalsFaces );

	ISSOV.verticalSurfaces = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i );

		if ( tilt && tilt[ 1 ] === "90" ) { ISSOV.verticalSurfaces.push( index ); }

	});

	return ISSOV.verticalSurfaces.length;

};
