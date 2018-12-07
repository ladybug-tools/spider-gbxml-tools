// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISCOR = { "release": "R9.3", "date": "2018-12-06" };

ISCOR.runAll = false;



ISCOR.getMenuIssues = function() {

	htm =
	`
		<p>
			<button onclick=ISCOR.onClickAllIssues(); title="May take a while to calculate and open menu on large files" >
				Check all issues in single pass
			</button>
			<br>
			Running all the checks may take a considerable amount of time om large gbXML files.
		</p>

		<p>2018-12-06 ~ Mostly working</p>


		${ ISFC.getMenuFileCheck() }

		${ ISMET.getMenuMetadataIssues() }

		${ ISSTI.getDivSurfaceTypeInvalid() }

		${ ISDC.getMenuDuplicateCoordinates() }

		${ ISASI.getMenuAdjacentSpaceInvalid() }

		${ ISASD.getMenuAdjacentSpaceDuplicate() }

		${ ISCOD.getMenuCadObjectId() }

		<div id = "divDuplicateRectangularGeometry" ></div>

		<div id = "divInclusions" ></div>

		<div id = "divPointInPolygon" ></div>

		${ ISTMP.getMenuTemplate() }

		<hr>

	`;

	return htm;

};



ISCOR.onClickAllIssues = function() {

	ISCOR.runAll = true;

	ISMET.getMetadataIssuesCheck();

	ISSTI.getSurfaceTypeInvalidCheck();

	ISDC.getDuplicateCoordinatesCheck();

	ISASI.setAdjacentSpaceInvalidCheck();

	ISCOD.getCadObjectIdCheck();

	ISTMP.getTemplateCheck();

	/*
	divDuplicateRectangularGeometry.innerHTML = ISDR.getMenuDuplicateRectangularGeometry();

	divInclusions.innerHTML = ISIN.getMenuInclusions();

	divPointInPolygon.innerHTML = ISPIP.getMenuPointInPolygon();

	*/

	ISCOR.runAll = false;

};

