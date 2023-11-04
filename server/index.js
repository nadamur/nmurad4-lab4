const express = require('express');
const app = express();
const port = 3000;
const superheroesInfo = require('./superhero_info.json');

app.use(express.json());

app.get('/',(req,res) => {
    res.send('Hello');
});

app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = superheroesInfo.find((hero) => hero.id === superheroId);
  
    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
  
    res.json(superhero);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});