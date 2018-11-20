

const ISS = {};


ISS.onToggleIssues = function() {

	divFileCheck.innerHTML=ISFC.getMenuFileCheck();

	divPanelMetadataIssues.innerHTML = ISSM.getPanelMetadataIssues();

	divAdjacentSpaceInvalid.innerHTML = ISASI.getMenuAdjacentSpaceInvalid();

	divDuplicateCoordinates.innerHTML = ISDC.getMenuDuplicateCoordinates();

	/*
	divDuplicateRectangularGeometry.innerHTML = ISDR.getMenuDuplicateRectangularGeometry();

	divInclusions.innerHTML = ISIN.getMenuInclusions();

	divPointInPolygon.innerHTML = ISPIP.getMenuPointInPolygon();

	divTemplate.innerHTML = ISS.getMenuTemplate(); */
}

