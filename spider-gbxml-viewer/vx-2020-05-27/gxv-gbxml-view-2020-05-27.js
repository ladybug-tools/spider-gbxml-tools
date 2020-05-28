
const GXV = {}

GXV.init = function() {

    const htm = `
    <p>
        Select surface types to view. Use cursor keys to scroll through the list.<br>

        <select id=selPanel oninput=GXV.showPanel(this.selectedIndex); size=10>${ GXV.getTypes() }</select>

    </p>
    <p>
        <button onclick="GXV.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
    </p>`;

    return htm;
}


GXV.getTypes = function() {

    GXV.meshTypes = GBX.surfaces.map( surface => surface.match( /surfaceType="(.*?)"/ )[ 1 ] );

    GXV.types = [...new Set( GXV.meshTypes )];

    //console.log( "types", GXV.types );

    const options = GXV.types.map( type => `<option>${ type }</option>`)

    return options

};


GXV.showPanel = function( index) {

    const type = GXV.types[ index ];

    GBX.meshGroup.children.forEach( mesh =>  mesh.visible = GXV.meshTypes[ mesh.userData.index ] === type )

}; 

GXV.setAllVisible = function() {

    GBX.meshGroup.children.forEach( mesh => mesh.visible = true );

}