// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-01-15
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const TSF = {};



TSF.init = function () {

	TSFdivThreeSceneFog.innerHTML += TSF.getMenu();

};


TSF.onLoad = function () {

	//TSF.toggleFog();

};


TSF.getMenu = function () {

	const htm = `
<details>

	<summary>
		Scene fog and background

		<span class="couponcode">?? <span class="coupontooltip">aaa bbb ccc 123 456</span></span>

	</summary>

	<p>
		<label>
			<input type="color" value="#ff00ff" id="TSFinpColorBackground"
				oninput="THR.scene.background=THR.scene.fog.color=( new THREE.Color(this.value));" >
			Select background color
		</label>
	</p>
	<p>
		<label title="Can you see me now!" >
			<input type=checkbox onchange=TSF.toggleFog() checked > fog
		</label>
	</p>

	<div id=TSFdivMessage ></div>

</details>`;

	return htm;

};



TSF.toggleFog = function () {

	THR.scene.fog.near = THR.scene.fog.near === 3* THR.radius ? 999 : 2 * THR.radius;
	THR.scene.fog.far = THR.scene.fog.far === 8 * THR.radius ? 9999 : 8 * THR.radius;

};


TSF.init();