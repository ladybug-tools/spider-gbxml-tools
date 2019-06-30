# [Fix XML Attributes (FXA) Read Me]( #fxa-fix-xml-attributes/README.md )

<details open>

<summary>Concept</summary>

Check for existence of seven required gbXML file attributes. If any of the attributes are missing, then supply fixes obtained from a list of defaults in the source code which are as follows:

* areaUnit': 'SquareMeters'
* lengthUnit': 'Meters'
* temperatureUnit': 'C'
* useSIUnitsForResults': 'true'
* version': '0.37'
* volumeUnit': 'CubicMeters'
* xmlns': 'http://www.gbxml.org/schema'


[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/blob/master/r0-4-0/fxa-fix-xml-attributes/fxa-fix-xml-attributes.js )

</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-05-16 ~ Display current or proposed values for all attributes

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-05-21 ~ Theo

* C - FXA: Update readme
* F - FXA.js: Add summary highlighting
* B - FXA.js: Pass through jsHint

### 2019-05-14 ~ Theo

* F - First commit

</details>