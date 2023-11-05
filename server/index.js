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
//function takes hero id and returns all hero info
function getHeroInfo(id){
    const superhero = superheroesInfo.find((hero) => hero.id === id);
    return superhero;
}
//function takes hero id and returns all powers
function getHeroPower(id){
    const superhero = superheroesInfo.find((hero) => hero.id === id);
    console.log(superhero);
    const superheroPower = superheroesPowers.find((hero) => hero.hero_names.toLowerCase() === superhero.name.toLowerCase());
    const powers = Object.keys(superheroPower).filter(power => superheroPower[power] === 'True');
    return powers;
}


app.use(express.json());

//this method will return all the hero info depending on id
app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = getHeroInfo(superheroId);
  
    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
  
    res.json(superhero);
});

//this method will return the powers of hero based on id
app.get('/api/superheroes/:id/power', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = getHeroInfo(superheroId);
    
    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const powers = getHeroPower(superheroId);
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
app.get('/api/search/:pattern/:field/:n', (req, res) => {
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
app.post('/api/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const filePath = 'C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_lists.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
        //if there is data in the json file
        if (data){
            const jsonData = JSON.parse(data);
            //if the list name already exists, send error
            if (jsonData.hasOwnProperty(listName)){
                res.status(404).json({ error: 'List name already exists' });
            }
            const newListName = listName;
            const newSuperheroIds = [];
            jsonData[newListName] = newSuperheroIds;
      
            const jsonString = JSON.stringify(jsonData, null, 2);
            fs.writeFile(filePath, jsonString, 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing JSON file:', writeErr);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                console.log('JSON data has been updated and written to', filePath);
                res.sendStatus(201);
            }
            });
        }else{
            //if there is no data in the json file, must start with initial data (can not parse)
            const initialData = { [listName]: [] };
            
            fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing JSON file:', writeErr);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    console.log('JSON data has been updated and written to', filePath);
                    res.sendStatus(201);
                }
                });
        }
      });
});
//save list of superhero IDs to a given list name
app.put('/api/lists/add/:listNameAndIds', (req, res) => {
    const listName = req.params.listNameAndIds;
    //assuming we are receiving the URL in the format: /api/lists/myList?ids=1,2,3
    const ids = req.query.ids;
    idArray = ids.split(',');
    const filePath = 'C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_lists.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
        const jsonData = JSON.parse(data);
        //if the name does exist, update the IDs
        if (jsonData.hasOwnProperty(listName)){
            jsonData[listName] = idArray;
            const jsonString = JSON.stringify(jsonData, null, 2);
            fs.writeFile(filePath, jsonString, 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing JSON file:', writeErr);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.sendStatus(200);
            }
            });
        }else{
            //if it doesnt exist, send an error
            res.status(404).json({ error: 'List name does not exist' });
        }        
      });
});

//get list of superhero IDs for given list name
app.get('/api/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const filePath = 'C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_lists.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
        const jsonData = JSON.parse(data);
        //if the name does exist, update the IDs
        idArray = jsonData[listName];
        if(idArray){
            res.json({idArray});
        }else{
            //if it doesnt exist, send an error
            console.log(idArray);
            console.log(listName);
            res.status(404).json({ error: 'List name does not exist' });
        }     
      }); 
});

//delete list with given name
app.put('/api/lists/delete/:listName', (req, res) => {
    const listName = req.params.listName;
    const filePath = 'C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_lists.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
        const jsonData = JSON.parse(data);
        //if the name does exist, delete it
        if (jsonData.hasOwnProperty(listName)){
            delete jsonData[listName];
            const jsonString = JSON.stringify(jsonData, null, 2);
            fs.writeFile(filePath, jsonString, 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing JSON file:', writeErr);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.sendStatus(200);
            }
            });
        }else{
            //if it doesnt exist, send an error
            res.status(404).json({ error: 'List name does not exist' });
        }        
      });
});

//get list of names, info and powers of all superheroes in list
app.get('/api/lists/info/:listName', (req, res) => {
    const listName = req.params.listName;
    const filePath = 'C:/se 3316/lab 3/se3316-nmurad4-lab3/superhero_lists.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
        const jsonData = JSON.parse(data);
        //if the name does exist, update the IDs
        idArray = jsonData[listName];
        console.log(idArray);
        if(idArray){
            heroList = [];
            for (const i of idArray){
                const info = getHeroInfo(parseInt(i));
                console.log(i);
                const powers = getHeroPower(parseInt(i));
                const heroWithPowers = {
                    ...info,
                    powers: powers,
                };
                heroList.push(heroWithPowers);
            }
            res.json({heroList});
        }else{
            //if it doesnt exist, send an error
            res.status(404).json({ error: 'List name does not exist' });
        }     
      }); 
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});