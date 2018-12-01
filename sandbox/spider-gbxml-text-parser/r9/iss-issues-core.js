// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISS = { "release": "R9.1", "date": "2018-11-30" };


ISS.onToggleIssues = function() {

	divFileCheck.innerHTML = ISFC.getMenuFileCheck();

	divPanelMetadataIssues.innerHTML = ISMET.getMenuMetadataIssues();

	divAdjacentSpaceInvalid.innerHTML = ISASI.getMenuAdjacentSpaceInvalid();

	divDuplicateCoordinates.innerHTML = ISDC.getMenuDuplicateCoordinates();

	/*
	divDuplicateRectangularGeometry.innerHTML = ISDR.getMenuDuplicateRectangularGeometry();

	divInclusions.innerHTML = ISIN.getMenuInclusions();

	divPointInPolygon.innerHTML = ISPIP.getMenuPointInPolygon();

	divTemplate.innerHTML = ISS.getMenuTemplate();
	*/

}

