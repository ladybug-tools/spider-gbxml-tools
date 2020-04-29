// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-13
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const TMP = {};



TMP.init = function () {

	divContent.innerHTML += TMP.getMenu();

};



TMP.getMenu = function () {

	const htm = `
<details>

	<summary>
		Template

		<span class="couponcode">??<span class="coupontooltip">aaa bbb ccc 123 456</span></span>

	</summary>

	<p>ccc</p>

	<p>vvvvv</p>

	<div id=TMPdivMessage ></div>

</details>`;

	return htm;

};



TMP.init();