# Spider gbXML Viewer 0.18 'LT' Read Me


## [Spider gbXML Viewer 0.18.00 'LT']( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/v-0-18-00/ )

* 2019-11-14 ~ First commit
* Solution to challenge or instructions oe problem  proposed by [Stephen Roth]( https://www.linkedin.com/in/stephenbroth/ )
	* Build a version of Spider gbXML Viewer that makes the building data in gbXML files look good
	* Build a highly interactive and intuitive user experience for viewing gbXML data in 3D
* First pass
	* Objective: always show as much of the building as possible:
	* Response: menu with transparency and self adjusting height
	* Objective: clear definition between 'inworld' and 'menuing' experience
	* Also: follow ['material design']( https://material.io ) principles
	* Response: add margins, rounded corners and shadows to menu
	* Objective: enable the use of coloring building surfaces on-the-fly to expose a variety of aspects included in the underlying data of the surface
	* Response: Add 'color settings' panel with demos of various possibilities


Underlying the above is the bases for a much updated core - hence the jump from 17 to 18

* Faster downloads by using Fetch instead of xmlhttprequest
* Better utf-16 handling use textDecoder
* Increased compliance with new industry standards for HTML - hence more user friendly for peeps with accessibility issues
