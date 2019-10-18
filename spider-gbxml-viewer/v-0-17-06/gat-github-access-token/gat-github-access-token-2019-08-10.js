/* globals FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const GAT = {

	"copyright": "Copyright 2019 PushMe-PullYou authors. MIT License",
	"date": "2019-06-08",
	"description": "GitHub access token",
	"helpFile": "https://pushme-pullyou.github.io/tootoo14/js-14-1/gat-github-access-token/README.md",
	"version": "0.14.0-2",
};



GAT.currentStatusAccessToken =
`
	<h3>GitHub API Access Token</h3>

	<p>This script uses the GitHub API to obtain the names of folders and files displayed in this menu.</p>

	<p>
		In rare circumstances your usage may push the requests over the sixty requests per hour limit,
		no list of files will appear and this script will display an error message.
		After an or so so, the rates limit is automatically reset and menus will again display as expected.
	</p>

	<p>
		If you are testing or building new menus or whatever,
		you may obtain access tokens from GitHub at no charge and enter the token into the text box.
		This will raise your limit to 5,000 requests per hour.
	</p>
	<p>
		See <a href="https://developer.github.com/v3/#rate-limiting" target="_blank">developer.github.com/v3</a>.
	</p>
	<p>
		<button onclick=GAT.getRateLimits(divPopUpData); title='If files and folder stop appearing, it is likely due to too many API calls' >
			View GitHub API rate limits</button>
	</p>
`;


GAT.getMenuGitHubAccessToken = function() {

	GAT.divContents = divContents;
	GAT.urlGitHubSource = "https://github.com/" + GAT.user + "/" + GAT.repo;
	GAT.urlGitHubApiContents = 'https://api.github.com/repos/' + GAT.user + "/" + GAT.repo + '/contents/' + GAT.pathRepo;
	GAT.accessToken = localStorage.getItem( 'githubAccessToken' ) || '';

	const htm =
	`
		<details>

			<summary>GitHub API Access Token
				<button id=butGAT class=butHelp onclick="POP.setPopupShowHide(butGAT,GAT.helpFile);" style=float:right; >?</button>
			</summary>

			<p>
				<div>Access token</div>
				<input value="${ GAT.accessToken }" id=GATinpGitHubApiKey  onclick=this.select(); onblur=GAT.setGitHubAccessToken(this.value); title="Obtain API Access Token" style=width:100%; >
			</p>

			<p>
				<button id=GATbutRateLimits onclick=MNU.rateLimits(GATbutRateLimits); title='If files and folder stop appearing, it is likely due to too many API calls' >
					View GitHub API rate limits</button>
			</p>


		</details>
	`;

	return htm;

}

GAT.setGitHubAccessToken = function( accessToken ) {

	console.log( 'accessToken', accessToken );

	localStorage.setItem( "githubAccessToken", accessToken );

	GAT.accessToken = accessToken;

};


// see MNU.rateLimits();
