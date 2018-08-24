# gbXML to OpenStudio Report

A goal of the scripts in this project is to enable you to transfer data from a CAD program to an analysis program such as [OpenStudio]( https://www.openstudio.net/ ) with as few steps of human intervention as possible.

The benefits sought include
* An architect/engineer/designer with little or no energy analysis domain experience may be able to create and view simulations
* The transfer of data between design and analysis programs is speedy, easy and error-free
* Customization for organizational or locality needs may be accomplished without reference or updates to CAD or analysis programs

This document is intended to a be a summary of lessens learned, test results and any issues of interest that occur in the pursuance of the above goal.

Sections of new text will will be posted to GitHub Issues under a 'lessons-learned' tag. These issues will be closed as and when a newer issue is posted. And actions or further investigations arsing from these reports should be opened as new issues


## 2018-08-24 ~ Theo

We want a scripts that open gbXMl files and add sufficient data such that an OpenStudio Simulation may be created on the first pass without failure.

As a first step toward achieving this objective, there should be a body of gbXML files that are known to run simulations successfully.

A good place to start might be with the example file included with OpenStudio.

Upon a load of OpenStudio
* Open: openstudio-2.6.1\Examples\compact_osw\files\seb\files\seb.osm

Upon load of 'seb.osm' file:
* Note upgrade to new fille format
* Add EPW and DDY file URLs: OpenStudio > 'Site' tab
* Click: OpenStudio > 'Run Simulation' tab > 'Run' button
* Wait for simulation to complete

Upon successful completion of simulation run:
* Export data to gbXML file: OpenStudio > 'File' menu > 'Export' > 'gbXML'
* Save file as 'seb.xml' and place it in same folder as 'seb.osm'

Upon file save:
* Open new project: OpenStudio > 'File' menu > 'New'
* Import just saved 'seb.xml' file: OpenStudio > 'File' menu > 'Import' > 'gbXML'
* When prompted to save current project: click 'Discard'

Upon load of gbXML file:
* Add EPW and DDY file URLs: OpenStudio > 'Site' tab
* Click: OpenStudio > 'Run Simulation' tab > 'Run' button
* When prompted to save current project: save 'seb.osm' or 'seb-new.osm'
* Wait for simulation to complete
* Note the result that the run failed:

> Starting Simulation.
> EnergyPlus Starting
> EnergyPlus, Version 8.9.0-eba93e8e1b, YMD=2018.08.24 11:37
> **FATAL:Errors occurred on processing input file. Preceding condition(s) cause termination.
> EnergyPlus Run Time=00hr 00min  0.18sec
? Program terminated: EnergyPlus Terminated--Error(s) Detected.
> Failed.

This file details the errors: openstudio-2.6.1/Examples/compact_osw-2018-08-24/files/seb/run/eplusout.err

The question for the moment: What text may be added to 'seb.xml' that will cause the run to complete successfully?






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


