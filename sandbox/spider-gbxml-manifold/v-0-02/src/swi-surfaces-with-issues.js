const SWI = {};

SWI.getMenu = function() {

	const htm =
`
<details id=SWIdetMenu ontoggle="SWI.getOptions()">

	<summary><mark>Surfaces with Issues</mark></summary>

	<p>
		<select id=SWIselSurfaces onclick=SWI.getSurface(this.selectedIndex); ></select>
	</p>

	<div id=SWIdivSurface ></div>

	<div id=SWIdivSurfacesNearby ></div>

</details>
`;

	return htm;

};


SWI.getOptions = function() {

	options = issues.map(mesh => {

		const index = mesh.userData.index;

		return `<option>${surfaces[index].id}</option>`

	});

	//console.log('', options);
	SWIselSurfaces.innerHTML = options;

}


SWI.getSurface = function ( issueIndex) {

	const index  = issues[issueIndex].userData.index;

	SWI.surface = surfaces[ index ]

	SWIdivSurface.innerHTML =
`
<p>id: ${ SWI.surface.id}</p>
<p>type: ${ SWI.surface.type}</p>
<p>Errant vertex: ${ SWI.surface.mesh.position.toArray()}</p>
<p>
<button onclick=SWI.findNearbySurfaces(); >find surfaces with vertex distance < 0.2</button>
</p>

`;

};

SWI.findNearbySurfaces = function() {

	const vertexIssue = SWI.surface.mesh.position;

	let htm ="";
	for (let i = 0; i < surfaces.length; i++) {

		const surface = surfaces[i];

		SWI.surface.mesh.scale.set(2, 2, 2);

		vertices = surface.vertices;

		htm += vertices.filter(vertex => vertexIssue.distanceTo(new THREE.Vector3().fromArray(vertex)) < 0.2)

			.map(vertex => {
				//console.log('surface', surface);

				const distance = vertexIssue.distanceTo(new THREE.Vector3().fromArray(vertex));
				const txt =
					`
				<p>surface id: ${ surface.id}<br>
				type: ${ surface.type}<br>
				distance: ${ distance}</p>
				<hr>

				`;
				//console.log('htm', txt);
				return txt;
			});

	}

	SWIdivSurfacesNearby.innerHTML = htm;

};

