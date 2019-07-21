# VWT View Opening Types Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-00/js-view-gbxml/vwt-view-opening-types.js )

<details open >

<summary>Concept</summary>

* Windows Types
* See WindowType schema: http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link1CB
	* One WindowType should be created for each type of window. Create a Blind, Frame, and Cost for each OpeningType, and then add as many Glaze and Gaps as exist in the window. Place these Glaze and Gap elements in order from outside to inside. For instance, a two pane window will have Glaze Gap Glaze, where the first Glaze represents the outside surface.

</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-07-20 ~ Theo ~ Add visible surfaces
* 2019-07-20 ~ Theo ~ Add clickable windows

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-07-20 ~ Theo

VWT 0.17.00-0vwt

* R - VWT.js: first commit

### 2019-06-28 ~ Theo

VBW 0.16-01-2vbw

* F - VBW.js: Add display attributes in popup
* F - VBW.js: Add show/hide openings by type
* F - First commit of read me

</details>
