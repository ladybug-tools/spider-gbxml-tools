/* globals FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const GAT = {

	"copyright": "Copyright 2019 PushMe-PullYou authors",
	"date": "2019-06-08",
	"description": "GitHub access token",
	"helpFile": "../gat-github-access-token/README.md",
	"license": "MIT License",
	"version": "0.14.06-0gat",
};



GAT.getMenuGitHubAccessToken = function() {

	//GAT.divContents = divContents;
	//GAT.urlGitHubSource = "https://github.com/" + GAT.user + "/" + GAT.repo;
	//GAT.urlGitHubApiContents = 'https://api.github.com/repos/' + GAT.user + "/" + GAT.repo + '/contents/' + GAT.pathRepo;
	GAT.accessToken = localStorage.getItem( 'githubAccessToken' ) || '';

	const htm =
	`
		<details>

			<summary>GitHub API Access Token </summary>

			<div>
				<button id=butGAT class=butHelp onclick="GAT.setViewHelp(butGAT,GAT.helpFile);" >?</button>
			</div>

			<p>
				<div>Access token</div>
				<input value="${ GAT.accessToken }" id=GATinpGitHubApiKey onclick=this.select(); onblur=GAT.setGitHubAccessToken(this.value); title="Obtain API Access Token" style=width:100%; >
			</p>

			<p>
				<button id=GATbutRateLimits onclick=GAT.setViewRateLimits(GATbutRateLimits); title='If files and folder stop appearing, it is likely due to too many API calls' >
					View your current GitHub API usage & rate limits
				</button>
			</p>


		</details>
	`;

	return htm;

};



GAT.setViewHelp = function () {

	if ( window.POP ) {

		POP.setPopupShowHide(butGAT,GAT.helpFile);

	} else {


	}

};


GAT.setGitHubAccessToken = function( accessToken ) {

	console.log( 'accessToken', accessToken );

	localStorage.setItem( "githubAccessToken", accessToken );

	GAT.accessToken = accessToken;

};





GAT.setViewRateLimits = function( button, target = divContents ) {
	//console.log( 'button', button );

	const url = "https://api.github.com/rate_limit";

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onload = callback;
	xhr.send( null );

	function callback( xhr ) {

		const htm =
		`
			<h3>GitHub rate limits status</h3>

			<p>
				Some of the scripts in this app use the GitHub Developer API.
				The API which has rate limits that reset every hour.
				See <a href="https://developer.github.com/v3/#rate-limiting" target="_blank">developer.github.com/v3</a>.
			</p>

			<pre> ${ xhr.target.response } </pre>
		`;

		target.innerHTML += htm;

	}

};