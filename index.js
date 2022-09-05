
//defining variables
const form = document.getElementById("searchMe");
const search = document.getElementById("lyricSearch");
const result = document.getElementById("search-result");

//const apiURL = "https://api.genuis.com";
// Text-Processing API Url
const API_URL = 'https://genius.p.rapidapi.com/';

form.addEventListener("submit", e => {
	e.preventDefault();
	let searchValue = search.value.trim();
	if (!searchValue) {
		alert("You have not entered artist/Song Name");
	} else {
		getResult(searchValue);
	}
})


async function getResult(searchValue) {

	const options = {
		method: 'GET',
		url: 'https://genius.p.rapidapi.com/search',
		params: { q: searchValue },
		headers: {
			'X-RapidAPI-Key': 'edf121352dmsh89c48baae7c2ce8p1ee422jsn942eb83a2998',
			'X-RapidAPI-Host': 'genius.p.rapidapi.com'
		}
	};

	axios.request(options).then(function (response) {
		//console.log(response.data.response.hits);
		showData(response.data.response.hits)
	}).catch(function (error) {
		console.error(error);
	});

}

function showData(links) {
	result.innerHTML = `
	<ul class="lyrics">
	    ${links.map(song => `<li>
                          
						        <strong><span class="attribute" 
								song-title = ${song.result.title}
								song-artist = ${song.result.artist_names}>${song.result.full_title}</span></strong>
						   
                        </li>`
	)
			.join("")
		}
	</ul>
	`;
}

result.addEventListener("click", e => {
	const clickedButton = e.target;
	if (clickedButton.className === 'attribute') {
		const artist = clickedButton.getAttribute('song-artist');
		const songTitle = clickedButton.getAttribute('song-title');

		getLyrics(artist, songTitle);
	}
})

async function getLyrics(artist, songTitle) {
	console.log(songTitle)
	const options = {
		method: 'POST',
		url: 'https://lyrics-search.p.rapidapi.com/search/lyrics',
		headers: {
			'content-type': 'application/json',
			'X-RapidAPI-Key': 'edf121352dmsh89c48baae7c2ce8p1ee422jsn942eb83a2998',
			'X-RapidAPI-Host': 'lyrics-search.p.rapidapi.com'
		},
		data: `{"searchTerm": "${songTitle}"}`
	};

	axios.request(options).then(function (response) {
		console.log(response.data);
		const data = response.data
		const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
		if (data.title === "N/A") {
			result.innerHTML = "The api does not have the lyrics for this song";
		}
		result.innerHTML = `
				<h2><strong>${artist}</strong> - ${songTitle}</h2>
				<span>${lyrics}</span>
			`;
	}).catch(function (error) {
		result.innerHTML = error;
	});






}