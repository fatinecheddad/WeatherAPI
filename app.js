const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const https = require("node:https");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  //on veut faire une requete get à un serveur externe (WeatherAPI) pour recup les infos
  //sur la meteo qu'on pourra envoyer au moteur de recherche pour qu'il nous les affiche

  const query = req.body.city;
  const appid = "5c3b6a9c0a32c98b65c03d092119e387";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    appid;
  //erreur:401 peut etre que appid incorrect car erreur d'authentification
  //erreur:402 ressources introuvable, peut etre erreur dans path ou parametres
  https.get(url, function (response) {
    //on fait une requete get au site API weather a travers l'url et on recupere une reponse
    console.log(response.statusCode); //recup le code status
    response.on("data", function (data) {
      //on recupe les donnees de meteo qui sont dans cette reponse
      console.log(data); //on recup les donnees en hexa decimal et on veut les recuperer en objet javascript
      var weather = JSON.parse(data); //on convertit l'ojet hexadecimal en objet java
      console.log(weather);
      const temperature = weather.main.temp;
      const weatherDescription = weather.weather[0].description;
      console.log(temperature);
      console.log(weatherDescription);

      const icon = weather.weather[0].icon;
      const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<html>");
      res.write(
        "<h1>The temperature in " +
          query +
          " is  " +
          temperature +
          "degrees </h1>"
      );
      res.write("<h1>  the sky is " + weatherDescription + "</h1> ");
      res.write("<img src=" + imageurl + ">");

      res.write("</html>");
      //un fois que l'utilisateur submit le formulaire la page se rafraichit et on a
      //un affichage different c'est pourquoi on a un autre send
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("server is listening on port 3000");
});
