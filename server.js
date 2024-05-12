'use strict'
require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios');
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT;;
const apiKey = process.env.API_KEY;
const movieData = require('./Movie_Data/data.json');

const { Client } = require('pg')
const url = `postgres://student:0000@localhost:5432/moviedb`
const client = new Client(url)

client.connect().then(() => { console.log("connect succeed"); }).catch();


//routs
app.post('/addMovie', addMovieHandler);
app.get('/getAllMovies', getAllMoviesHandler);

app.get('/trending', trendingHandler);
app.get("/search", searchHandler);
app.get("/popular", popularHandler);
app.get("/topRated", topRatedHandler);


app.get('/', homePageHandler);
app.get('/favorite', favoritePgeHandler);


//functions
//Lab13
function addMovieHandler(req, res) {

    const { id, title, release_date, poster_path, overview, comment } = req.body
    const sql = `INSERT INTO movies(id, title, release_date, poster_path, overview, comment)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`
    const values = [id, title, release_date, poster_path, overview, comment]

    client.query(sql, values).then((reuslt) => {
        console.log(reuslt.rows)
        res.status(201).json(reuslt.rows)
    }).catch(error => { console.log(error); })
}
function getAllMoviesHandler(req, res) {
    const sql = `SELECT * FROM movies;`
    client.query(sql).then((reuslt) => {
        const data = reuslt.rows
        res.json(data)

    }).catch(error => { console.log(error); })
}

//Lab12
function trendingHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)
        .then(result => {
            let trendingMovie = result.data.results.map(movie => {
                return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
            })
            res.json(trendingMovie)
        })
        .catch(error => {
            console.log(error)
        })
}
function searchHandler(req, res) {
    let movieName = req.query.name;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;

    axios.get(url)
        .then(result => {
            res.json(result.data.results);
        })
        .catch(error => {
            console.error(error);
        });
}
function popularHandler(req, res) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

    axios.get(url)
        .then(result => {
            res.json(result.data.results);
        })
        .catch(error => {
            console.error(error);
        });
}
function topRatedHandler(req, res) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`;

    axios.get(url)
        .then(result => {
            res.json(result.data.results);
        })
        .catch(error => {
            console.error(error);
        });
}





//Lab11
function homePageHandler(req, res) {
    let result;
    //result = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    //res.json(result);
}
function favoritePgeHandler(req, res) {
    res.send("Welcome to Favorite Page");
}

//constructor
function Movie(id, title, releaseDate, postarPath, overview) {
    this.id = id;
    this.title = title;
    this.release_date = releaseDate;
    this.postar_path = postarPath;
    this.overview = overview;
}


//error handler 
function handleNotFoundError(req, res) {
    res.status(404).json({
        status: 404,
        responseText: 'Page not found'
    });
}
function handleInternalServerError(err, req, res) {
    res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong'
    });
}
app.use(handleNotFoundError);
app.use(handleInternalServerError);

//listener
app.listen(port, () => {
    console.log(`my app is running and  listening on port ${port}`)
})




