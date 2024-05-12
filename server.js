const express = require('express')
const app = express()
const port = 3002
const movieData = require('./Movie_Data/data.json');


//routs
app.get('/', homePageHandler);
app.get('/favorite', favoritePgeHandler);


//functions
function homePageHandler(req, res) {
    let result;
    result = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    res.json(result);
}
function favoritePgeHandler(req, res) {
    res.send("Welcome to Favorite Page");
}

//constructor
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
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




