# Fix Adjacent Space Surface Type (FASST) Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/blob/master/r0-4-0/fasst-fix-adjacent-space-surface-type/fasst-fix-adjacent-space-surface-type.js )
<details open>

<summary>Concept</summary>

* Identify surfaces with two (or more) adjacent spaces and adjacent spaces have different space IDs and the given surface type is invalid for two adjacent spaces
* Fixes
	* If tilt equals 90:
		* update surface type to "InteriorWall"
		* set exposedToSun to false
		* Update CADObjectID to Spider defaults
	* If tilt not equal to 90: TBD

Surface types to be checked:

* InteriorWall
* InteriorFloor
* Ceiling
* Air

</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-05-12 ~ Add fixes if tilt not equal 90

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-05-21 ~ Theo

* C - FASST: Update readme
* F - FASST.js: Add summary highlight
* C - FASST.js: Update vars
* B - FASST.js: pass through jsHint


### 2019-05-16 ~ Theo

* F - FASST.js: Add textarea display new data
* R - FASST.js: Separate fixSurface and fixAll

### 2019-05-14 ~ Theo

* F - FASST.js: Add button to fix single surface
* B - FASST.js: fix popup help links

### 2019-05-12 ~ Theo

* F - First commit

</details>