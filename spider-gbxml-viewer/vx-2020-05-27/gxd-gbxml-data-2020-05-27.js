

GXD = {}

GXD.init = function() {

    htm = 
    `<div id=GXDdivSurfaceData >
        <p>
            Selected surface data will appear here when a surface in the 3D model is clicked on or touched.
        </p>
    </div>`;

    return htm;

};

GXD.getSurfaceData = function( index ){
    
    detNavMenu.open = true;
    detData.open = true;

    surfaceText = GBX.surfaces[ index ];

    // console.log( "surfaceText", surfaceText );

    // const parser = new DOMParser();
	// const surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	// //console.log( "surfaceXml", surfaceXml );

    // var xmlText = new XMLSerializer().serializeToString( surfaceXml);
    htm = surfaceText; //xmlText

    GXDdivSurfaceData.innerText = htm;
}