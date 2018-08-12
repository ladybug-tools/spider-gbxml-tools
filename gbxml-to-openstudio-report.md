# gbXML to OpenStudio Report

The goal of the scripts in this project is to enable you to transfer data from a CAD progran to an analysis program with as few steps of human intervention as possible.

This document is intended to a be a summary of lessens learned, test results and any issues of interest that occur in the pursuance of the above goal.

Sections of new text will will be posted to GitHub Issues under a 'lessons-learned' tag. These issues will be cclosed as and when a newer issue is posted. And actions or further investigations arsing from these reports should be opened as new issues

## 2018-08-10 ~ Theo

20:00
This model loads successfully and completes 'Run simulation' successfully
* https://github.com/GreenBuildingXML/Sample-gbXML-Files/blob/master/gbXML_TRK.xml
* Downloaded and ```encoding="UTF-16"``` deleted from first line.
* The report file that is produced is osm/trk/reports/eplustbl.html

seb.osm completes successfully
* But I don't know when and how the second pretty report gets built

I looked at a lot of our example models hoping to find a list of construction elements that closely matched the gbXML surface types but did not seem to find a good match.

The next step will be to see if I can construct a section of text that has construction elements that match the 15 standard surfaces types and then populates these with sufficient working attributes such that the text - when inserted in a gbXML file with no construction elements - enables the file to propagate a successful simulation.



## 2018-08-08 ~ Theo

Out of a number of attempts on various files, the first gbXML file to be imported into OpenStudio and successful complete 'Run Simulation is:

https://github.com/GreenBuildingXML/Sample-gbXML-Files/blob/master/gbXML_TRK.xml

### Notes on the successful run

* After being downloaded Windows10 or Chrome converted the file to UTF-8. This was noticeable because the files size was much reduced. 'Aragog' gbXML Viewer R14 failed to load the file. Work-around delete the text ```encoding="UTF-16"``` from the first line of the gbXML file
* The gbXML_TRK.xml files was imported using OpenStudio > File menu > Import gbXML
* EPW and DDY files for SFO were imported into OpenStudio 'Schedules' tab
* OpenStudio reports 'Unable to launch Dview' with a message 'Not found in expected location'.

### Notes on failed runs
* The usual first reported error is: ```** Severe  ** <root>[BuildingSurface:Detailed][B-00_110-E-F-58] - Missing required property 'construction_name'.```
* The examples file 'seb.osm' was loaded and completed a successful 'Run simulation. A gbXML files was created using OpenStudio > File menu > Export gbXML. The newly created file was then imported using OpenStudio > File menu > Import gbXML.Th file loaded successfully and was viewable in the OpenStudio Geometry tab. The file did not, however, complete a successful 'Run simulation.. The first error being: ```   ** Severe  ** <root>[Construction][3'0" x 3'0" Double pane  Alum Construction] - Missing required property 'outside_layer'.```
* Attempts were made to load a default OSM library and then merge in the gbXML file, but none of these attempts provided a successful run on files that had previously failed to be imported on their own

### Related Activity

* 'Aragog' gbXML Viewer R14.14 > Reports tab: now has a card for gbXML 'Construction' elements
* There wil be investigations as to whether the various viewers should ad the feature of adding Construction elements to gbXL file upon request.



### gbXML Sample Files with Construction Elements

* Urban_House_MEP.xml > geometry: OK > simulation: ```** Severe  ** <root>[BuildingSurface:Detailed][E-24-U-W-122] - Missing required property 'construction_name'.```
* gbXMLExport_ASHRAEHQ_Revit2017.xml > geometry OK > simulation: success! << 2018-08-10 ~ cannot reproduce
* gbXMLStandard Office (ASHRAE HQ) 2016.xml
* gbXMLStandard Office (Core & Shell) 2016.xml
* gbXMLStandard Single Family Residential 2016.xml
* gbXMLStandard Test Model 2016.xml
* gbXMLStandard.xml
* gbXMLStandardv Retail Big Box.xml
* gbXML_TRK.xml > geometry OK > simulation: success!

### NREL

* https://rawgit.com/NREL/openstudio-gbxml-validation/master/gbxml_test_suite/tests/output/test_case_6/test_case_6.xml
	* Building 1: ```* Severe  ** <root>[Construction][ASHRAE 189.1-2009 ExtWindow ClimateZone 7-8] - Missing required property 'outside_layer'.```


***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a></center>


