const express = require('express');
const app = express();
const port = 3000;
const superheroesInfo = require('C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_info.json');
const superheroesPowers = require('C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_powers.json');


app.use(express.json());

//this method will return all the hero info depending on id
app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = superheroesInfo.find((hero) => hero.id === superheroId);
    console.log('id')
  
    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
  
    res.json(superhero);
});

//this method will return the powers of hero based on id
app.get('/api/superheroes/:id/power', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = superheroesInfo.find((hero) => hero.id === superheroId);
    const superheroPowers = superheroesPowers.find((hero) => hero.hero_names === superhero.name);
    console.log('power')
  
    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    const powers = Object.keys(superheroPowers).filter(power => superheroPowers[power] === 'True');

    if (powers.length > 0) {
      res.json({ powers });
    } else {
      res.status(404).json({ error: 'No true powers found for this superhero' });
    }
});

//this method will return all publisher names
app.get('/api/publishers', (req, res) => {
    const publishers = superheroesInfo.map(hero => hero.Publisher);
    console.log(publishers);
  
    res.json(publishers);
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});