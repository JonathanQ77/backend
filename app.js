// EXPRESS
/** Veillez à :
soit modifier la méthode  use  en  get  pour le middleware des requêtes GET ;
soit placer la route POST au-dessus du middleware pour les requêtes GET,
 car la logique GET interceptera actuellement toutes les requêtes envoyées à votre endpoint /api/stuff ,
  étant donné qu'on ne lui a pas indiqué de verbe spécifique. Placer la route POST au-dessus interceptera les requêtes POST,
   en les empêchant d'atteindre le middleware GET. */

const express = require("express");
const mongoose = require("mongoose");
const Thing = require("./models/Thing");
const app = express();

// connexion DATABASE MONGODB : RENSEIGNER LE NOM UTILISATEUR ET MOT DE PASSE DE MONGODB DANS LES DATABASES ACCESS
mongoose
  .connect(
    "mongodb+srv://Jonathan_Quesnel:Jade-26113193@cluster0.gls8rpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    //  { useNewUrlParser: true, useUnifiedTopology: true } // on peux ne pas mettre useNewUrlParser et useUnifiedTopology dans les denrieres versions
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json()); // intercepte les datas JSON des middlewares toutes les requetes sont interceptés : get put patch delete
// acceder au json avec req.body

// requete pour communiquer entre le server backend et front end qui sont sur deux port différents :  MODFIER LE CORS ORIGIN
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// requete API POST :
app.post("/api/stuff", (req, res, next) => {
  // suppression faux ID front End :
  delete req.body._id;
  // instance d'un nouveau Thing et inserer la valeur posté du formulaire POST dans la requete
  const thing = new Thing({
    ...req.body,
  });
  // sauvegarde sur MONGODB : si réuissi statut 201 et message si erreur affiche l'erreur en question et statut 400
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré" }))
    .catch((error) => res.status(400).json({ error }));
});

// recuperation des datas d'un article pour la page de l'article :
app.get("/api/stuff/:id", (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
});

// METTRE A JOUR LES DATAS AVEC PUT  :
app.put("/api/stuff/:id", (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
});

// SUPPRESSION D'un ARTICLE (DELETE)

app.delete("/api/stuff/:id", (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé" }))
    .catch((error) => res.status(400).json({ error }));
});
//requete API pour les articles de ventes : si aucun parametre de route alors sapplique a toute les routes pour récupérer les datas

app.get("/api/stuff", (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
