// Copyright 2019 Ladybug Tools authors. MIT License
/* globals ISFC, ISASI, ISASD, ISASE, ISASTE, ISCOD, ISMET, ISSTI, ISDC, ISSOH, ISSOV, ISTMP, detMenuEdit*/
/* jshint esversion: 6 */


const ISCOR = { "release": "R15.2", "date": "2019-03-04" };

ISCOR.runAll = false;
ISCOR.surfaceCheckLimit = 10000;

ISCOR.description =
	`
		Issues Core (ISCOR) module loads the desired issues modules.
		Issues modules check the gbXML files for issues, identify what issues have been found
		and allow you to fix the issues.
	`;


ISCOR.currentStatus =
	`
		<h3>ISCOR ${ ISCOR.release}</a> ~ ${ ISCOR.date }</h3>

		<p>
			${ ISCOR.description }
		</p>
		<p>
			Every module is set up run as and when you click on its title to open it
			or when you click the 'check all...' button.
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/iscor-issues-core.js" title="source code" >
			ISCOR source code </a><br>
		</p>

		<details>
			<summary>Wish list</summary>
			<ul>
				<li>2019-02-22 ~ Add module to check if interior surface types are on exterior</li>
				<li>2019-02-22 ~ Add module to check if a surface should be shade</li>
				<li>2019-02-22 ~ Add module to move geometry closer to origin</li>
				<!-- <li></li>
				-->
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-04 ~ 15.2 ~ ISSOH & ISSOV added</li>
				<li>2019-02-22 ~ 15.1 ~ fix ISASTE link. Add wish list. Run through jsHint & do fix</li>
				<li>2019-02-12 ~ 15.0 ~ Update text content. Add 'Air Surface Type on Exterior' module</li>
				<li>2018-12-16 ~ Add close details and reset summaries when new file loaded</li>
				<li>2018-12-10 ~ 10.2 ~ Add current status details element</li>
				<li>2018-12-06 ~ Adds ability to run in 'check all issues'. Simplified code a bit. passed through jsHint</li>
				<li>2018-12-05 ~ Add more functions</li>
				<!-- <li></li>
				-->
			</ul>
		</details>

	`;



ISCOR.getMenuIssues = function() {

	document.body.addEventListener( 'onGbxParse', ISCOR.onGbxParse, false );

	const htm =
	`
		<p>
			<button onclick=ISCOR.onClickAllIssues();
				title="May take a while to calculate and open menu on large files" >
				Check all issues in single pass
			</button>
			<br>
			Running all the checks may take a considerable amount of time on large gbXML files.
			<a id=isCor class=helpItem href="JavaScript:MNU.setPopupShowHide(isCor,ISCOR.currentStatus);" >&nbsp; ? &nbsp;</a>
		</p>

		${ ISFC.getMenuFileCheck() }

		${ ISMET.getMenuMetadataIssues() }

		${ ISSTI.getMenuSurfaceTypeInvalid() }

		${ ISDC.getMenuDuplicateCoordinates() }

		<!-- ${ ISASI.getMenuAdjacentSpaceInvalid() } -->

		${ ISASE.getMenuAdjacentSpaceExtra() }

		${ ISASD.getMenuAdjacentSpaceDuplicate() }

		${ ISCOD.getMenuCadObjectId() }

		Not yet part of 'Check all...'<br>

		${ ISASTE.getMenuAirSurfaceTypeEditor() }

		${ ISSOV.getMenuSurfaceOverlapVerticals() }

		${ ISSOH.getMenuSurfaceOverlapHorizontals() }

		<div id = "divDuplicateRectangularGeometry" ></div>

		<div id = "divInclusions" ></div>

		<div id = "divPointInPolygon" ></div>

		${ ISTMP.getMenuTemplate() }

	`;

	return htm;

};



ISCOR.onGbxParse = function() {

	//detMenuEdit.open = true;

	const issues = detMenuEdit.querySelectorAll( 'details' ); // agree with FIL!
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

	ISASTE.getAirSurfaceTypeEditorCheck();

	ISCOD.getCadObjectIdCheck();

	ISTMP.getTemplateCheck();

	/*
	divDuplicateRectangularGeometry.innerHTML = ISDR.getMenuDuplicateRectangularGeometry();

	divInclusions.innerHTML = ISIN.getMenuInclusions();

	divPointInPolygon.innerHTML = ISPIP.getMenuPointInPolygon();

	*/

	ISCOR.runAll = false;

};
