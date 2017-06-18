(function() {

	/*GIHPY*/

	const PUBLIC_KEY = 'dc6zaTOxFJmzC';
	const BASE_URL = '//api.giphy.com/v1/gifs/';
	const ENDPOINT = 'search';
	const LIMIT = 5;
	const RATING = 'pg';

	let $queryInput = $('.query');
	let $resultWrapper = $('.result');
	let $loader = $('.loader');
	let $inputWrapper = $('.input-wrapper');
	let $clear = $('.clear');
	let $button = $('.random');
	let $gif = $('.gif'); 

	let currentTimeout;
	
	var templateSource = document.getElementById('giphy-template').innerHTML,
	    template = Handlebars.compile(templateSource),
	    resultsPlaceholder = document.getElementById('results'),
	    playingCssClass = 'playing',
	    audioObject = null;


	let query = {
		text: null,
		offset: 0,
		request() {
			return `${BASE_URL}${ENDPOINT}?q=${this.text}&limit=${LIMIT}&rating=${RATING}&offset=${this.offset}&api_key=${PUBLIC_KEY}`;
		},
		handleData(data){
				let results = data.data;
				console.log(data)
					
				if (results.length) {
					resultsPlaceholder.innerHTML = template(data);
					//callback(url);
				} else {
					//callback('');
				}

		},

		failData(error){
			console.log(error)
		},


		fetch(callback) {

			return $.ajax({
				url : this.request(),
				type: 'GET',
				success : this.handleData,
				fail: this.failData
			})


		}
	}




	$queryInput.on('keyup', e => {
		let key = e.which || e.keyCode;
		query.text = $queryInput.val();
		query.offset = Math.floor(Math.random() * 25);

		if (currentTimeout) {
			clearTimeout(currentTimeout);
			$loader.removeClass('done');
		}

		currentTimeout = setTimeout(() => {
			currentTimeout = null;
			$('.gif').addClass('hidden');

			if (query.text && query.text.length) {

				$inputWrapper.addClass('active').removeClass('empty');

				query.fetch(url => {
					if (url.length) {
						//$resultWrapper.html(buildImg(url));

						$button.addClass('active');
					} else {
						$resultWrapper.html(`<p class="no-results hidden">No Results found for <strong>${query.text}</strong></p>`);

						$button.removeClass('active');
					}

					$loader.addClass('done');
					currentTimeout = setTimeout(() => {
						$('.hidden').toggleClass('hidden');
					}, 1000);
				})
				.then(function(){
					console.log('now search '+query.text)
					searchAlbums(query.text) 
					}
				);

				;
			} else {
				$inputWrapper.removeClass('active').addClass('empty');
				$button.removeClass('active');
			}
		}, 1000);


	});



	$('body').on('click', '.gif', function (e) { //Plays GIF
		this.src = this.getAttribute('data-gif')
		playSong(e);
	});




	/*SPOTIFY*/

	function getHashParams() {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
		while ( e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */
	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
	        error = params.error;

	
	var searchAlbums = function (query) {
		$.ajax({
			url: 'https://api.spotify.com/v1/search',
			headers: {
				'Authorization': 'Bearer ' + access_token
			},

			data: {
				q: query,
				type: 'album'
			},
			success: function (response) {
				//resultsPlaceholder.innerHTML = template(response);
				console.log(response) 
				addAlbumIds(response); 
			}
		});
	};
	var fetchTracks = function (albumId, callback) {
		$.ajax({
			url: 'https://api.spotify.com/v1/albums/' + albumId,
			headers: {
				'Authorization': 'Bearer ' + access_token
			},

			success: function (response) {
				console.log(response)
			callback(response);
			}
		});
	};

	function playSong(e){
		console.log(e);
		var target = e.target;
		if (target !== null && target.classList.contains('cover')) {
			if (target.classList.contains(playingCssClass)) {
				audioObject.pause();
			} else {
				if (audioObject) {
					audioObject.pause();
				}
				fetchTracks(target.getAttribute('data-album-id'), function (data) {
					console.log(data)
					var preview_url;
					for(var i=0; i<	data.tracks.items.length; i++){		
						preview_url = data.tracks.items[i].preview_url
						if (preview_url != null){
							break;
						}
					}
					console.log(i);
					
					audioObject = new Audio(preview_url);
					audioObject.play();
					target.classList.add(playingCssClass);
					audioObject.addEventListener('ended', function () {
						target.classList.remove(playingCssClass);
					});
					audioObject.addEventListener('pause', function () {
						target.classList.remove(playingCssClass);
					});
				});
			}
		}
	}

	function addAlbumIds(response){
		console.log($('.gif'))
		$('.gif').each(function(i){
			console.log(this,i) 
			this.setAttribute('data-album-id',response.albums.items[i].id)
		})

	}


	window.addEventListener("unhandledrejection", function(err, promise) { 
    // handle error here, for example log  
    // 		 
    		console.log(err)
	});

})();





	/*
		function buildImg(src = '//giphy.com/embed/xv3WUrBxWkUPC', classes = 'gif hidden') {
			return `<img src="${src}" class="${classes}" alt="gif" />`;
		}

	$clear.on('click', e => {
		$queryInput.val('');
		$inputWrapper.removeClass('active').addClass('empty');
		$('.gif').addClass('hidden');
		$loader.removeClass('done');
		$button.removeClass('active');
	});

	$button.on('click', e => {
		query.offset = Math.floor(Math.random() * 25);

		query.fetch(url => {
			if (url.length) {
				$resultWrapper.html(buildImg(url));

				$button.addClass('active');
			} else {
				$resultWrapper.html(`<p class="no-results hidden">No Results found for <strong>${query.text}</strong></p>`);

				$button.removeClass('active');
			}

			$loader.addClass('done');
			currentTimeout = setTimeout(() => {
				$('.hidden').toggleClass('hidden');
			}, 1000);
		});
	});*/










