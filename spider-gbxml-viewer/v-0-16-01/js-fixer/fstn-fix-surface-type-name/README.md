# Fix Surface Type Name (FSTN) Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/blob/master/r0-4-0/fstn-fix-surface-type-name/fstn-fix-surface-type-name.js )


<details open>

<summary>Concept</summary>

Checks for a surface type name that is not one of the 15 valid gbXML surface type names.

See the list of valid surface types here: http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link35C

Most likely this type of error is quite rare. It occurs when a user working with a CAD program types in a non-valid surface type in the originating file then exports the data to a gbXML file.

</details>

<details>

<summary>To Do / Wish List</summary>


</details>

<details open>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-05-22 ~ Theo

* C - FSTN: Update readme
* B - FSTN.js: Fix issues with not fixing
* B - FSTN.js: Pass through jsHint

Dealt with

* 2019-05-17 ~ Seems to be having issues with fixing errors

### 2019-05-21 ~ Theo

* F - FSTN.js: Add summary highlight
* C - FSTN: Update readme
* B - FSTN.js: Pass through jsHint
* C - FSTN.js: Update vars

### 2019-05-16 ~ Theo

* F - FSTN: update list of issues to select element


### 2019-05-14 ~ Theo

* F - First commit

</details>