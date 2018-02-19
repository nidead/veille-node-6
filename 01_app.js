const express = require('express');
const app = express();
const fs = require("fs");

app.use(express.static('public'));
const util = require("util");
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs'); // générateur de template



//db.adresse.find().pretty()

app.get('/', function (req, res) {
	 var cursor = db.collection('adresse').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD         
  res.render('gabarit.ejs', {adresses: resultat})  
  });
})
app.post('/ajouter', (req, res) => {
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/')
 })
})

app.get('/delete/:id', (req, res) => {
	var critere = ObjectID(req.params.id)
	db.collection('adresse')
	.findOneAndDelete( {'_id': critere} ,(err, resultat) => {
		if (err) return res.send(500, err)
		var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
			if (err) return console.log(err)
			res.render('gabarit.ejs', {adresses: resultat})
		})
	})
})

app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == "asc" ? 1 : -1)

	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat) {
		console.log(req.params.ordre);
		ordre = (req.params.ordre == "asc" ? "desc" : "asc")
		console.log(ordre);
		res.render('gabarit.ejs', {adresses: resultat, cle, ordre})
	})
})


app.post('/modifier', (req, res) => {
  
  console.log('util = ' + util.inspect(req.body));
 req.body._id = ObjectID(req.body._id)	 
 db.collection('adresse').save(req.body, (err, result) => {
	 if (err) return console.log(err)
	 console.log('sauvegarder dans la BD')
	 res.redirect('/')
 })
})
////////////////////////////connexion a MangoDB et au serveur node.js

let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
 if (err) return console.log(err)
 db = database.db("carnet_adresse")
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})