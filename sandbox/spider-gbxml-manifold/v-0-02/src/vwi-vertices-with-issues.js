const SWI = {};

SWI.getMenu = function() {

	const htm =
`
<details ontoggle="SWI.getOptions()">

	<summary>Surfaces with Issues</summary>

	<p>
		<select id=SWIselSurfaces ></select>

		<div id=SWIdivSurface >ccc</div>

	</p>

</details>
`;

	return htm;

};


SWI.getOptions = function() {
	console.log('', 23);

	options = issues.map(mesh => {

		index = mesh.userData.index;

		return `<option>${surfaces[ index ].id}</option>`
	});

	console.log('', options);
	SWIselSurfaces.innerHTML = options;

}