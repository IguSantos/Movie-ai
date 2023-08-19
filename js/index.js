//https://developer.themoviedb.org/reference/movie-popular-list
async function getMovies() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZmJlNzYxYmY5NTgxMjcyMDkwMTdjNjI1Zjg4NzJhZiIsInN1YiI6IjY0ZDI0MDUwNGQ2NzkxMDBmZjY5NTJiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l3dgLPJ7wnk031Nawhl_w5pO15h7kG7cY2JlCtD4J4I",
      },
    }
    try {
      return fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
        options
      ).then((response) => response.json())
    } catch (error) {
      console.log(error)
    }
  }
  
  //puxas as informações extas do filme
  //api.themoviedb.org/3/movie/{movie_id}
  async function getMoreInfo(id) {
    // const results = await fetch()
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZmJlNzYxYmY5NTgxMjcyMDkwMTdjNjI1Zjg4NzJhZiIsInN1YiI6IjY0ZDI0MDUwNGQ2NzkxMDBmZjY5NTJiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l3dgLPJ7wnk031Nawhl_w5pO15h7kG7cY2JlCtD4J4I",
      },
    }
    try {
      return fetch("https://api.themoviedb.org/3/movie/" + id, options).then(
        (response) => response.json()
      )
    } catch (error) {
      console.log(error)
    }
  }
  
  //quando clicar no botão assistir trailer
  //https://api.themoviedb.org/3/movie/{movie_id}/videos
  async function watch(e) {
    // console.log(e.currentTarget.dataset)
    const movie_id = e.currentTarget.dataset.id
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZmJlNzYxYmY5NTgxMjcyMDkwMTdjNjI1Zjg4NzJhZiIsInN1YiI6IjY0ZDI0MDUwNGQ2NzkxMDBmZjY5NTJiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l3dgLPJ7wnk031Nawhl_w5pO15h7kG7cY2JlCtD4J4I",
      },
    }
  
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movie_id}/videos`,
        options
      ).then((response) => response.json())
  
      const { results } = data
      const youtubeVideo = results.find((video) => video.type === "Trailer")
  
      window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, "blank")
    } catch (error) {
      console.log(error)
    }
  }
  
  //criando template
  function createMovieLayout({ id, title, stars, image, time, year }) {
    return ` <div class="movie">
              <div class="title">
                <span>${title}</span>
                <div>
                  <img src="./icons/Star.svg" alt="" />
  
                  <p>${stars}</p>
                </div>
              </div>
  
              <div class="poster">
                <img src="https://image.tmdb.org/t/p/w500${image}" alt="Imagem de ${title}" />
              </div>
  
              <div class="info">
                <div class="duration">
                  <img src="./icons/clock.svg" alt="" />
  
                  <span>${time}</span>
                </div>
  
                <div class="year">
                  <img src="./icons/calendar.svg" alt="" />
  
                  <span>${year}</span>
                </div>
              </div>
  
              <button class="play" onclick="watch(event)" data-id="${id}">
                <img src="./icons/Play.png" alt="" />
  
                <span>Assistir Trailer</span>
              </button>
            </div>`
  }
  
  function minutesToHourMinutesAndSecods(minutes) {
    const date = new Date(null)
    date.setMinutes(minutes)
    return date.toISOString().slice(11, 19)
  }
  
  function select3Videos(results) {
    const random = () => Math.floor(Math.random() * results.length)
  
    let selectedVideos = new Set()
    while (selectedVideos.size < 3) {
      selectedVideos.add(results[random()].id)
    }
    return [...selectedVideos]
  }
  
  async function start() {
    //pegar as sugestões de filmes da API
    const { results } = await getMovies()
    console.log(results)
  
    //pegar randomicamente 3 filmes para sugestão
    const best3 = select3Videos(results).map(async (movie) => {
      //pegar informações extras dos 3 filmes
      const info = await getMoreInfo(movie)
  
      //organizar os dados para ...
      const props = {
        id: info.id,
        title: info.title,
        stars: Number(info.vote_average).toFixed(1),
        image: info.poster_path,
        time: minutesToHourMinutesAndSecods(info.runtime),
        year: info.release_date.slice(0, 4),
      }
  
      return createMovieLayout(props)
    })
  
    const output = await Promise.all(best3)
    console.log(output)
  
    // Mostrar carregamento das recomendações
    
    document.querySelector(".movies").innerHTML = output.join("")


    var flashIcon = document.getElementById("flashIcon");

    var gerando = document.querySelector(".gerando");
    flashIcon.src = "./icons/circle-notch-bold-16px.svg";
    flashIcon.classList.add("rotate");
      gerando.innerHTML = "Carregando" 
   
    
    setTimeout(function() {
        flashIcon.classList.remove("rotate"); 
        flashIcon.src = "./icons/flash.svg"
        gerando.innerHTML = "Nova recomendação"
    }, 1050);


  }
  
  //executar a função
  start()

