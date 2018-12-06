// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISCOR = { "release": "R9.2", "date": "2018-12-02" };

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

			2018-12-05: mostly broken / must run tests one by one.
		</p>

		${ ISFC.getMenuFileCheck() }

		${ ISMET.getMenuMetadataIssues() }

		${ ISSTI.getDivSurfaceTypeInvalid() }

		${ ISDC.getMenuDuplicateCoordinates() }

		${ ISASI.getMenuAdjacentSpaceInvalid() }

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
	//divFileCheck.innerHTML = ISFC.getMenuFileCheck();

	ISMETdetPanelMetadataIssues.innerHTML=ISMET.setMenuMetadata();

	ISSTI.getSurfaceTypeInvalidCheck();

	ISDC.getDuplicateCoordinatesCheck();

	ISASI.setAdjacentSpaceInvalidCheck();

	ISCODspnCount.innerHTML = `: ${ ISCOD.getCadObjectIdCheck() } found`;


	//ISTMP.getMenuTemplate();

	/*
	divDuplicateRectangularGeometry.innerHTML = ISDR.getMenuDuplicateRectangularGeometry();

	divInclusions.innerHTML = ISIN.getMenuInclusions();

	divPointInPolygon.innerHTML = ISPIP.getMenuPointInPolygon();

	*/

	ISCOR.runAll = false;
}

