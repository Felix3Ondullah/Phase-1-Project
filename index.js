//defining variables
const form = document.getElementById("searchMe");
const search = document.getElementById("lyricSearch");
const result = document.getElementById("search-result");

const apiURL = "https://api.genuis.com";


form.addEventListener("submit",e => {
	e.preventDefault();
	let searchValue = search.value.trim();
	if(!searchValue) {
		alert("You have not entered artist/Song Name");
	} else {
		getResult(searchValue);
	}
})


async function getResult(searchValue) {
	const searchResult = await fetch (`${apiURL}/search?${searchValue}`,{
		method: "GET",
		headers: {"Content-type": "application/json;charset=UTF-8",
		access_token:"DztkgnZeCR7cMEsrNuoanleMmDav4D5e9PjcgXjsUOV2oApDlHLsUzdxx2nPXVhYwWfhQcTI0EJ-FfLG21-efA",
		optimizeQuery: true,
	     }
	});
	//console.log(searchResult);
	const links= await searchResult.json();
    // console.log(links);
	 showData(links);
}

function showData(links) {
	result.innerHTML = `
	<ul class="lyrics">
	    ${links.data
         .map(song=> `<li>
                          <span class="attribute" song-title = "${song.title_short}"
                           song-artist = "${song.artist.name}"><strong>${song.title_short}</strong>-${song.artist.name}</span>
                        </li>`
         	)
         .join("")
	  }
	</ul>
	`;
}

result.addEventListener("click",e => {
	const clickedButton = e.target;

	if(clickedButton.className === 'attribute') {
		const artist = clickedButton.getAttribute('song-artist');
		const songTitle = clickedButton.getAttribute('song-title');

		getLyrics(artist , songTitle);
	} 
})

async function getLyrics(artist, songTitle) {
	const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
	const data = await res.json();
  
	if (data.error) {
	  result.innerHTML = data.error;
	} else {
	  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  
	  result.innerHTML = `
				<h2><strong>${artist}</strong> - ${songTitle}</h2>
				<span>${lyrics}</span>
			`;
}


}