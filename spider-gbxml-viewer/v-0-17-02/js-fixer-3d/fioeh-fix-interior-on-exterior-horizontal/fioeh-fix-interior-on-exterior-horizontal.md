
# Interior Floor or Air on Exterior (ISAOIOEF)

	<p>
		${ ISAOIOEF.description }
	</p>

	<p>This module is a work-in-progress. See Issues and Wish List for details.</p>
	<p>
		<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/isaoioef-air-or-interior-on-exterior-floor.js" target="_blank" >
		Air or Interior Floor or on Exterior source code
		</a>
	</p>

	<details>

		<summary>Usage</summary>

		<p>
			The current test case file for this project <a href="#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/TypicalProblems-AirSurface.zip" >TypicalProblems-AirSurface.zip</a>
			in the <a href="https://github.com/ladybug-tools/spider/tree/master/gbxml-sample-files" target="_blank">Spider gbXML sample files folder</a>.
		</p>

		<p>
			The test case may be loaded by refreshing the web page or pressing F5.
			Click the title in the menu to return to the default file.
		</p>

		<p>Usage is still at an early stage. </p>

		<p>
			Identifying external InteriorWall surfaces is a work-in-progress.
			The web page should be reloaded between each session.
			Click the numbered boxes in numerical order.
			Various normals and sprites at intersection will be drawn. These are for testing while developing and will not appear in final version.
		</p>

		<p>Editing surface types and saving your edits has not yet been started.</p>

	</details>

	<details>

		<summary>Methodology</summary>

		<p>See also Wikipedia: <a href="https://en.wikipedia.org/wiki/Point_in_polygon" target="_blank">Point in polygon</a></p>

		1. Identify the triangles used to create a Three.js tht represents a gbXML surface.<br>
		2. Create a Three.js 'ray' for each side of the identified triangles.<br>
		3. The ray follows the normal for that triangle at the center point of the triangle.<br>
		4. If one of the rays finds no intersections or an even number of intersections on one side then we know that there is no exterior type surface between the current surface and the exterior.

	</details>


	<details>
		<summary>Issues</summary>

		<ul>

			<li>2019-03-12 ~ Move more functions to ISRC. Select list box now handles multi-select. Add button to show/hide selected.</li>
			<li>
				2019-03-11 ~ When the exterior of a model has holes/is non-manifold,
				a number of false positives may be generated
				- along with the actual surface that is on the exterior.
				Future versions of algorithm should reduce the number of false positives.
			</li>
			<li>2019-02-13 ~ what to show in select box? ID? Name?</li>
			<li>2019-02-13 ~ Only works once - must reload between each run << 2019-03-11 ~ getting better</li>
		</ul>

	</details>


	<details>
		<summary>Wish List / To Do</summary>
		<ul>
			<li>
				2019-02-15 ~ Easy access to identify the currently selected surfaces in the
				menu select list box and display these in the 3D model space
			</li>
			<li>2019-02-15 ~ Save changes to files</li>
		</ul>
	</details>

	<details>
		<summary>Change log</summary>
		<ul>
			<li>2019-03-13 ~ R15.2 ~ Many fixes</li>
			<li>2019-03-11 ~ Move normals remove to ISRC. Add back vertical air surface types</li>
			<li>2019-03-11 ~ Following well underway</li>
				<ul>
				<li>2019-02-15 ~ Identify separately vertical and horizontal surfaces</li>
				<li>2019-02-15 ~ Show/hide identified incorrect surfaces</li>
				<li>2019-02-14 ~ Reset variables when loading new file/li>
				<li>2019-02-14 ~ Handle models with concavities</li>
			</ul>
			<li>2019-03-08 ~ R15.1 ~ Many fixes. Checks normals for both sides of surfaces</li>
			<li>2019-03-05 ~ first commit</li>
		</ul>
	</details>

