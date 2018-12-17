// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISCOR = { "release": "R10.2", "date": "2018-12-10" };

ISCOR.runAll = false;


ISCOR.currentStatus =
	`
		<aside>

			<details>

				<summary><a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/lib/iscor-issues-core.js" title="source code" >
					ISCOR ${ ISCOR.release}</a> status ${ ISCOR.date }</summary>

				<p>
					This module loads the desired issues modules.
				</p>
				<p>
					Every module is set up run as and when you click on the title to open it
					or when you click the 'check all...' button.
				</p>
				<p>
					2018-12-10 ~ 10.2 ~ Add current status details element
				</p>
				<p>
					<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues" target="_blank">Read Me file</a>
				</p>

				<!--
					2018-12-06 ~ Adds ability to run in 'check all issues'. Simplified code a bit. passed through jsHint<br>
					2018-12-05 ~ Add more functions
				-->

			</details>

		</aside>

	`;




ISCOR.getMenuIssues = function() {

	htm =
	`
		<p>
			<button onclick=ISCOR.onClickAllIssues(); title="May take a while to calculate and open menu on large files" >
				Check all issues in single pass
			</button>
			<br>
			Running all the checks may take a considerable amount of time on large gbXML files. Duplicate coordinates takes a long time. This will be fixed.
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



ISCOR.onClickAllIssues = function() {

	ISCOR.runAll = true;

	ISMET.getMetadataIssuesCheck();

	ISSTI.getSurfaceTypeInvalidCheck();

	ISDC.getDuplicateCoordinatesCheck();

	//ISASI.setAdjacentSpaceInvalidCheck();

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

