// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISCOR = { "release": "R10.3", "date": "2018-12-16" };

ISCOR.runAll = false;
ISCOR.surfaceCheckLimit = 10000;


ISCOR.currentStatus =
	`
		<aside>

			<details>

				<summary>ISCOR ${ ISCOR.release}</a> status ${ ISCOR.date }</summary>

				<p>
					Issues Core (ISCOR) module loads the desired issues modules.
					Issues modules check the gbXML files for issues, identify what issues have been found
					and allow you to fix the issues.
				</p>
				<p>
					Every module is set up run as and when you click on its title to open it
					or when you click the 'check all...' button.
				</p>
				<p>
					<ul>
						<li>2018-12-16 ~ Add close details and reset summaries when new file loaded</li>
					</ul>

				</p>
				<p>
					<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/lib/iscor-issues-core.js" title="source code" >
					ISCOR source code </a><br>
					<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues" target="_blank">
					ISCOR Read Me file</a>
				</p>

				<!--
					2018-12-10 ~ 10.2 ~ Add current status details element
					2018-12-06 ~ Adds ability to run in 'check all issues'. Simplified code a bit. passed through jsHint<br>
					2018-12-05 ~ Add more functions
				-->

			</details>

		</aside>

	`;



ISCOR.getMenuIssues = function() {

	document.body.addEventListener( 'onGbxParse', ISCOR.onGbxParse, false );


	htm =
	`
		<p>
			<button onclick=ISCOR.onClickAllIssues();
				title="May take a while to calculate and open menu on large files" >
				Check all issues in single pass
			</button>
			<br>
			Running all the checks may take a considerable amount of time on large gbXML files.
		</p>


		${ ISFC.getMenuFileCheck() }

		${ ISMET.getMenuMetadataIssues() }

		${ ISSTI.getMenuSurfaceTypeInvalid() }

		${ ISDC.getMenuDuplicateCoordinates() }

		<!-- ${ ISASI.getMenuAdjacentSpaceInvalid() } -->

		${ ISASE.getMenuAdjacentSpaceExtra() }

		${ ISASD.getMenuAdjacentSpaceDuplicate() }

		${ ISCOD.getMenuCadObjectId() }

		<div id = "divDuplicateRectangularGeometry" ></div>

		<div id = "divInclusions" ></div>

		<div id = "divPointInPolygon" ></div>

		${ ISTMP.getMenuTemplate() }

		${ ISCOR.currentStatus }

		<hr>

	`;

	return htm;

};



ISCOR.onGbxParse = function() {

	detMenuEdit.open = false;

	const issues = detMenuEdit.querySelectorAll( 'details' );
	//console.log( 'issues', issues );
	issues.forEach( item => item.open = false );

	const spans = detMenuEdit.querySelectorAll( 'span' );
	spans.forEach( item => item.innerHTML = '' );

};



ISCOR.onClickAllIssues = function() {

	ISCOR.runAll = true;

	ISMET.getMetadataIssuesCheck();

	ISSTI.getSurfaceTypeInvalidCheck();

	ISDC.getDuplicateCoordinatesCheckInit();

	//ISASI.setAdjacentSpaceInvalidCheck(); // deprecated

	ISASE.getAdjacentSpaceExtraCheck();

	ISASD.getAdjacentSpaceDuplicateCheck();

	ISCOD.getCadObjectIdCheck();

	ISTMP.getTemplateCheck();

	/*
	divDuplicateRectangularGeometry.innerHTML = ISDR.getMenuDuplicateRectangularGeometry();

	divInclusions.innerHTML = ISIN.getMenuInclusions();

	divPointInPolygon.innerHTML = ISPIP.getMenuPointInPolygon();

	*/

	ISCOR.runAll = false;

};

