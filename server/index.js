const express = require('express');
const app = express();
const port = 3000;
const superheroesInfo = require('C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_info.json');
const superheroesPowers = require('C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_powers.json');
const fs = require('fs');

//required functions
//function takes a pattern, returns a set number of hero ids that match given pattern
function getHeroIds(n, pattern, field, res){
    const superheroes = superheroesInfo.filter((hero) => hero[pattern].toLowerCase().includes(field.toLowerCase()));
    const ids = superheroes.map(hero => hero.id);

    if (ids.length > 0) {
        const limitedIds = ids.slice(0, n);
        res.json({ ids: limitedIds });
    } else {
    res.status(404).json({ error: 'No heroes found' });
    }
}



app.use(express.json());

//this method will return all the hero info depending on id
app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = superheroesInfo.find((hero) => hero.id === superheroId);
  
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
            getHeroIds(n,'name',field, res);
            break;
        case 'race':
            getHeroIds(n,'Race',field, res);
            break;
        case 'publisher':
            getHeroIds(n,'Publisher',field, res);
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

//this method will create a list with a list name and returns an error if the name already exists
app.get('/api/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const filePath = 'C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_lists.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          return;
        }
        if (data){
            if (jsonData.hasOwnProperty(listName)){
                res.status(404).json({ error: 'List name already exists' });
            } else{
            const jsonData = JSON.parse(data);
            const newListName = listName;
            const newSuperheroIds = [];
            jsonData[newListName] = newSuperheroIds;
      
            const jsonString = JSON.stringify(jsonData, null, 2);
      
            fs.writeFile(filePath, jsonString, 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing JSON file:', writeErr);
            } else {
                console.log('JSON data has been updated and written to', filePath);
            }
            });}
            
        }else{
            const initialData = { [listName]: [] };
            
            fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing JSON file:', writeErr);
                } else {
                    console.log('JSON data has been updated and written to', filePath);
                }
                });
        }
        
      });
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});