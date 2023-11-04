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
    const superheroPower = superheroesPowers.find((hero) => hero.hero_names === superhero.name);
    console.log('power')
  
    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    const powers = Object.keys(superheroPower).filter(power => superheroPower[power] === 'True');

    if (powers.length > 0) {
      res.json({ powers });
    } else {
      res.status(404).json({ error: 'No powers found for this superhero' });
    }
});

//this method will return all publisher names
app.get('/api/publishers', (req, res) => {
    const publishers = superheroesInfo.map(hero => hero.Publisher);
    console.log(publishers);
  
    res.json(publishers);
});

//this method will return n number of search results (hero ids) for given search pattern
app.get('/api/:pattern/:field/:n', (req, res) => {
    const n = parseInt(req.params.n);
    const pattern = req.params.pattern;
    const field = req.params.field;
    //pattern can either be name, race, publisher or power
    switch (pattern){
        case 'name':
            const superheroesNames = superheroesInfo.filter((hero) => hero.name.includes(field));
            const nameIds = superheroesNames.map(hero => hero.id);

            if (nameIds.length > 0) {
                const limitedNameIds = nameIds.slice(0, n);
                res.json({ nameIds: limitedNameIds });
            } else {
                res.status(404).json({ error: 'No heroes found for this name' });
            }
            break;
        case 'race':
            const superheroesRace = superheroesInfo.filter((hero) => hero.Race.toLowerCase() === field.toLowerCase());
            const raceIds = superheroesRace.map(hero => hero.id);

            if (raceIds.length > 0) {
                const limitedRaceIds = raceIds.slice(0, n);
                res.json({ raceIds: limitedRaceIds });
            } else {
            res.status(404).json({ error: 'No heroes found for this race' });
            }
            break;
        case 'publisher':
            const superheroesPublishers = superheroesInfo.filter((hero) => hero.Publisher.includes(field));
            const publisherIds = superheroesPublishers.map(hero => hero.id);

            if (publisherIds.length > 0) {
                const limitedPublisherIds = publisherIds.slice(0, n);
                res.json({ publisherIds: limitedPublisherIds });
            } else {
            res.status(404).json({ error: 'No heroes found for this publisher' });
            }
            break;
        case 'power':
            const superheroPowers = superheroesInfo.filter((hero) => hero.Power.includes(field));
            const powers = Object.keys(superheroPowers).filter(power => superheroPowers[power] === 'True');
            const powersId = powers.map(hero => hero.id);

            if (powersId.length > 0) {
                const limitedPublisherIds = publisherIds.slice(0, n);
                res.json({ publisherIds: limitedPublisherIds });
            } else {
            res.status(404).json({ error: 'No heroes found for this publisher' });
            }
            break;
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});