<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-collaborator//README.md "View file as a web page." ) </span>


# Spider gbXML Collaborator Read Me


<details open >

<summary>Concept</summary>


## Latest [Spider gbXML Collaborator]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-collaborator/v-0-02/spider-gbxml-collaborator.html )

From time to time several people may need to collaborate on the same gbXML file.

Spider gbXML Collaborator is an attempt to create a script that operates on a collaborative manner - similar to the way that Google Docs operates.

This project is an early stage work-in-progress. Only camera position, camera target and text messages are synchronized. More features will be added in future versions.

When viewing models, the file must be loaded by clicking the same button on each instance.

If the model appears to be moving by itself, there is probably somebody updating the model at the same time you are. All differences are same to the same single file at [jsonbox.io]( https://jsonbox.io/ )


### Usage

Open this script in two tabs, windows or devices. Check the 'editor' box in one tab and rotate the model or enter a message in the text box. Press 'send data to server' and see the other tab update.

### Versions

### [Spider gbXML Collaborator V0.02]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-collaborator/v-0-02/spider-gbxml-collaborator.html )

* Add sync to camera target - enables full rotate, zoom and pan sync
* Updates the UI a bit

### [Spider gbXML Collaborator V0.01]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-collaborator/v-0-01/spider-gbxml-collaborator.html )

* Syncs data using [jsonbox.io]( https://jsonbox.io/ ) in near real time
* Syncs camera position and messages only

### [Spider gbXML Collaborator V0.00]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-collaborator/v-0-00/spider-gbxml-collaborator.html )

* Uses GitHub pages to sync data
* Requires a [GitHub Personal Access Token]( https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line ). Also vailable upon email request to Theo.
* Works just fine, just one issue: Updates take 2 or 3 minutes to propagate


</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-10-25 ~ Theo ~ Add camera 'tweeing' - smooth transitions between camera positions
* 2019-10-25 ~ Theo ~ Add user details such as IP address or Lat/Lon
* 2019-10-25 ~ Theo ~ Add currently loaded URL is synchronized
* 2019-10-25 ~ Theo ~ Allow multiple users to load the same file from disk and keep views in sync

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-10-25 ~ Theo

SGC v0.02

* F: Add sync camera target
* C: Rename "editor" to "Follow the leader" and tooltip "Uncheck to gain control of the view"

### 2019-10-24 ~ Theo

* F - First commit

</details>
