# Get Check Offset (GCO) Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/blob/master/r0-4-0/gco-get-check-offset/gco-get-check-offset.js )

<details open>

<summary>Concept</summary>

Calculate the maximum distance from the origin of any and all the coordinates in the model.

Numbers of six digits or more to left of decimal point may cause rounding errors which will cause surfaces to be displayed at unintended angles.

</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-05-21 ~ Looks like fixing this issue would be very difficult as the errors are embedded in the gbXML file

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-05-23 ~ Theo

* F - GCO: Add highlight only if max > 10,000
* C - GCO: Update readme

### 2019-05-21 ~ Theo

* C - GCO: Update readme
* C - GCO.js: Update text content / Pass through jsHint

### 2019-05-20 ~ Theo

* C - GCO.js: Update vars
* C - GCO: Update readme
* B - GCO.js: Pass through jsHint

### 2019-05-10 ~ Theo

* F - Add popup help and readme

### 2019-04-03 ~ tHEO

* F - First commit

</details>