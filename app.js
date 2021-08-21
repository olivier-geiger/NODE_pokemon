// dépendances
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');

// variables
const app = express();
const port = process.env.PORT || 3000;

// base de données
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// connexion mongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  })
  .catch(err => {
    console.log(err);
  });

// Schema
const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  index: {
    type: Number,
    required: true,
  },
  pv: {
    type: Number,
    required: true,
  },
  attaque: {
    type: Number,
    required: true,
  },
  defense: {
    type: Number,
    required: true,
  },
  att_special: {
    type: Number,
    required: true,
  },
  def_special: {
    type: Number,
    required: true,
  },
  vitesse: {
    type: Number,
    required: true,
  },
  picture: String,
  types: [],
});

// model
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// ajout d'un pokemon
const addPokemon = new Pokemon({
  name: 'Florizarre',
  index: 3,
  pv: 80,
  attaque: 82,
  defense: 83,
  att_special: 100,
  def_special: 100,
  vitesse: 80,
  types: ['Plante', 'Poison'],
});

// middlewares
app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json());

//routes
app.get('/api/v1/pokemons', (req, res) => {
  Pokemon.find()
    .exec()
    .then(pokemons => {
      console.log('La liste de tout les pokemons a bien été récupérée!');
      res.json(pokemons);
    })
    .catch(err => console.log("La liste des pokemons n'a pas été récupérée!"));
});

app.get('/api/v1/pokemons/:id', (req, res) => {
  Pokemon.findOne({ name: 'Bulbizarre' })
    .exec()
    .then(pokemon => {
      console.log('Un pokemon a été récupéré');
      res.json(pokemon);
    })
    .catch(err => console.log("Le pokemon n'a pas été récupéré"));
});

app.post('/api/v1/pokemons', (req, res) => {
  addPokemon
    .save()
    .then(pokemon => {
      console.log('Un pokemon a été créé');
      res.json(pokemon);
    })
    .catch(err => {
      console.log("Une erreur est survenue lors de la créatin d'un pokemon");
    });
});

app.put('/api/pokemons/:id', (req, res) => {
  Pokemon.findOneAndUpdate({ name: 'Bulbizarre' }, { $set: { attaque: 49 } })
    .exec()
    .then(pokemon => {
      console.log("Update d'un pokemon");
      res.json(pokemon);
    })
    .catch(err => console.log(err));
});

app.delete('/api/v1/pokemons/:id', (req, res) => {
  Pokemon.findOneAndDelete({ name: 'Florizarre' })
    .exec()
    .then(pokemon => {
      console.log('Un pokemon a été supprimé');
      res.json(pokemon);
    })
    .catch(err => console.log("Le pokemon n'a pas été supprimé"));
});

// serveur
app.listen(port, () => console.log(`Le serveur est lancé sur le port ${port}`));
