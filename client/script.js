const searchButton = document.getElementById("searchButton");
//array to store selected results
const selectedResults = [];
const selectButton = document.getElementById("listAddButton");

document.addEventListener("DOMContentLoaded", () => {
  // This function will be called when the DOM is fully loaded
  displayFavoriteListsButtons();
  addLists();
  deleteLists();
  //authentication -- create new user in database
  document.getElementById('signUpButton').addEventListener('click', async () => {
    const username = document.getElementById('usernameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    try {
      const res = await fetch('/signup', { 
        method: 'POST', 
        body: JSON.stringify({ username, email, password }),
        headers: {'Content-Type': 'application/json'}
      });
      document.getElementById('usernameInput').value = '';
      document.getElementById('emailInput').value = '';
      document.getElementById('passwordInput').value = '';
      alert('Account successfully created!')
    }
    catch (err) {
      console.log(err);
    }
  });
  
  //selects results
  document.getElementById("searchResults").addEventListener("click", (event) => {
    const listItem = event.target.closest("li");

    if (listItem) {
      // Toggle selection
      if (listItem.classList.contains("selected")) {
        listItem.classList.remove("selected");
        const index = selectedResults.indexOf(listItem.dataset.id);
        if (index > -1) {
          selectedResults.splice(index, 1);
        }
      } else {
        listItem.classList.add("selected");
        selectedResults.push(listItem.dataset.id);
      }
    }
  });
    
  //adds selected results to list
  selectButton.addEventListener("click", () => {
    preventDefault()
    //current selected list name
    const favList = document.getElementById("listNames");
    const favListOption = favList.options[favList.selectedIndex];
    const favListText = favListOption.text;
    //call method to add selected heros to a list
    addSelectedResultsToFavorites(favListText, selectedResults);
    // Reset selectedResults array after adding them
    selectedResults.length = 0;
    // Remove the selection (reset background color)
    const selectedItems = document.querySelectorAll(".selected");
    for (const selectedItem of selectedItems) {
      selectedItem.classList.remove("selected");
    }
  });

  // Add event listeners for sorting buttons
  document.getElementById('sortByName').addEventListener('click', () => {
    searchSuperheroes('name');
  });

  document.getElementById('sortByRace').addEventListener('click', () => {
    searchSuperheroes('race');
  });

  document.getElementById('sortByPublisher').addEventListener('click', () => {
    searchSuperheroes('publisher');
  });

  document.getElementById('sortByPower').addEventListener('click', () => {
    searchSuperheroes('power');
  });


  // Add a click event listener to the search button
  searchButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the form from submitting
    searchSuperheroes(criteria = 0); // Call your search function
  });

  //add event listener for FAQ button
  document.getElementById('FAQ').addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/publishers`);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      const uniqueData = new Set(data);
      const uniqueDataArray = [...uniqueData];
      const joinedNames = uniqueDataArray.join(', ');
      alert(joinedNames);
    } catch (error) {
      console.error('Error:', error);
      return null; // Handle the error gracefully
    }
  });


  //adds new list to favourites
  document.getElementById('addListButton').addEventListener('click', async () => {
    const listName = prompt('Enter the name for the new list:');
    if (listName) {
      // Create a new list and add it to the UI
      //first sanitize the list name
      if (listName.length < 3 || listName.length > 50) {
        alert('List name should be between 3 and 50 characters.');
      } else if (!/^[a-zA-Z0-9\s-]+$/.test(listName)) {
        alert('List name can only contain letters, numbers, spaces, and hyphens.');
      } else {
        // sanitization: Remove any potentially harmful characters or escape them
        const sanitizedListName = escapeHtml(listName);
        await createList(sanitizedListName);
        displayFavoriteListsButtons();
        addLists();
        deleteLists();
      }
    }
  });

  //deletes list to favourites
  document.getElementById('deleteListButton').addEventListener('click', () => {
    const listName = document.getElementById("listNamesToDelete").value;

    if (listName) {
      // Create a new list and add it to the UI
      deleteList(listName);
      deleteLists();
      displayFavoriteListsButtons();
      addLists();
    }
  });

});


//adds selected results to list
async function addSelectedResultsToFavorites(list, ids){
  const url = `/api/lists/add/${list}?ids=${ids}`;
  try{
    const response = await fetch(url, {
      method: 'PUT',
    });
    if (response.status === 200) {
      console.log('List created successfully');
    } else if (response.status === 404) {
      console.log('List name already exists');
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

//function to delete a fav list in the back end
async function deleteList(listName){
  const url = `/api/lists/delete/${listName}`;
  try{
    const response = await fetch(url, {
      method: 'PUT',
    });
    if (response.status === 200) {
      console.log('List created successfully');
    } else if (response.status === 404) {
      console.log('List name already exists');
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

//function to create a fav list in the back end
async function createList(listName){
  const url = `/api/lists/${listName}`;
  try{
    const response = await fetch(url, {
      method: 'POST',
    });
    if (response.status === 201) {
      console.log('List created successfully');
    } else if (response.status === 404) {
      alert('List name already exists, try again');
    } else {
      console.error('Error in creating list', response.status);
    }
  } catch (error) {
    console.error('Error in creating list:', error);
  }
}

//function to delete a list
async function deleteLists() {
  const dropDownList = document.getElementById("listNamesToDelete");
   // Clear the previous options in the drop-down list
  dropDownList.innerHTML = "";
  // Fetch the list names and add buttons for each list
  const listNames = await getFavoriteListNames();
  if(listNames){
    listNames.listNames.forEach((listName) => {
      //new option in drop down list
      const newOption = document.createElement("option");
      newOption.value = `${listName}`;
      newOption.text = `${listName}`;
      dropDownList.appendChild(newOption);
    });
  }
  
}

//function to display list names in 'add selected heroes' drop-down menu
async function addLists() {
  const dropDownList = document.getElementById("listNames");
   // Clear the previous options in the drop-down list
  dropDownList.innerHTML = "";
  // Fetch the list names and add buttons for each list
  const listNames = await getFavoriteListNames();
  if(listNames){
    listNames.listNames.forEach((listName) => {
      //new option in drop down list
      const newOption = document.createElement("option");
      newOption.value = `${listName}`;
      newOption.text = `${listName}`;
      dropDownList.appendChild(newOption);
    });
  }
}

//function to display fav list names as buttons
async function displayFavoriteListsButtons() {
  const favouriteListsContainer = document.getElementById('favouriteLists');
  favouriteListsContainer.innerHTML = ''; // Clear existing content
  // Fetch the list names and add buttons for each list
  const listNames = await getFavoriteListNames();
  if(listNames){
    listNames.listNames.forEach((listName) => {
      //new button for fav list
      const listButton = document.createElement('button');
      listButton.textContent = listName;
      //display fav list when clicked
      //send data to search function to display results
      listButton.addEventListener('click', async () => {
        const data = await getFavoriteListIds(listName);
        displayFavoriteHeroNames(listName);
        //displayHeroes(data, sortCriteria = 0);
      });
      favouriteListsContainer.appendChild(listButton);
    });
  }
  
}

//function to display hero names in fav list in the right container
async function displayFavoriteHeroNames(listName) {
  const addedListsContainter = document.getElementById('addedListsResults');
  addedListsContainter.innerHTML = ''; // Clear existing content
  listItems = [];
  try {
    const response = await fetch(`/api/lists/info/${listName}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    for (const hero of data.heroList) {
      //create new button for each name
      const nameButton = document.createElement('button');
      nameButton.textContent = hero.name;
      nameButton.classList.add('large-square-button'); // Apply the CSS class
      addedListsContainter.appendChild(nameButton);
      //when the name is clicked, the hero's information is displayed in the searchResults div
      nameButton.addEventListener('click', async () => {
        const searchResultsDiv = document.getElementById('searchResults');
        // Clear existing options
        while (searchResultsDiv.firstChild) {
        searchResultsDiv.removeChild(searchResultsDiv.firstChild);
        }
        const resultList = document.createElement('ul');
        for (const prop in hero){
          const listItem = document.createElement('li');
          if (hero[prop] === null){
            listItem.appendChild(document.createTextNode(`${prop}: No Powers`));
            resultList.appendChild(listItem);
          }else{
            listItem.appendChild(document.createTextNode(`${prop}: ${hero[prop]}`));
            resultList.appendChild(listItem);
          }
          
        }
        searchResultsDiv.appendChild(resultList);
        
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return null; // Handle the error gracefully
  }
}


//get saved list's ids
async function getFavoriteListIds(listName) {
  try {
    const response = await fetch(`/api/lists/${listName}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; // Handle the error gracefully
  }
}

//fetch the saved list names from back end
async function getFavoriteListNames() {
  try {
    const response = await fetch(`/api/lists/fav/names`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; // Handle the error gracefully
  }
}


//function to get all hero info
async function getHero(id) {
  try {
    const response = await fetch(`/api/superheroes/${id}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; // Handle the error gracefully
  }
}


// Function to get all available publisher names
function getAllPublishers() {
  fetch('/api/publishers')
    .then((response) => response.json())
    .then((data) => {
      // Handle the data received from the server
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}



async function displayHeroes(data, sortCriteria){
  const searchResultsDiv = document.getElementById('searchResults');
  // Clear existing options
  while (searchResultsDiv.firstChild) {
    searchResultsDiv.removeChild(searchResultsDiv.firstChild);
  }
  const resultList = document.createElement('ul');
  const listItems = [];
  for (const i of data.ids) {
    //get hero info based on id
    const hero = await getHero(i);
    //get hero powers
    const powers = await getPowers(i);    
    const listItem = document.createElement('li');
    //hero attributes as list item attributes
    listItem.dataset.id = i;
    listItem.dataset.name = hero.name;
    listItem.dataset.Race = hero.Race;
    listItem.dataset.Publisher = hero.Publisher;
    //hero info:
    //powers
    const resultPowers = document.createElement('span');
    resultPowers.style.fontSize = '14px';
    //if no powers, no need for list
    if(powers === "No Powers"){
      resultPowers.appendChild(document.createTextNode(`Powers: None, `));
    }else if (powers.length > 1){
      listItem.dataset.powers = powers.powers;
      resultPowers.appendChild(document.createTextNode(`Powers: ${powers.powers.join(', ')}`));
    }else{
      listItem.dataset.powers = powers.powers;
      resultPowers.appendChild(document.createTextNode(`Powers: ${powers.powers}`));
    }
    //name
    const resultNameBold = document.createElement('strong');
    resultNameBold.style.color = '#007acc';
    resultNameBold.appendChild(document.createTextNode(hero.name + " "));
    //gender
    const resultGender = document.createElement('span');
    resultGender.style.fontSize = '14px';
    resultGender.appendChild(document.createTextNode(`Gender: ${hero.Gender}, `));
    //height
    const resultHeight = document.createElement('span');
    resultHeight.style.fontSize = '14px';
    resultHeight.appendChild(document.createTextNode(`Height: ${hero.Height}, `));
    //eye colour
    const resultEye = document.createElement('span');
    resultEye.style.fontSize = '14px';
    resultEye.appendChild(document.createTextNode(`Eye color: ${hero['Eye color']}, `));
    //alignment
    const resultAlignment = document.createElement('span');
    resultAlignment.style.fontSize = '14px';
    resultAlignment.appendChild(document.createTextNode(`Alignment: ${hero.Alignment}, `));
    //hair color
    const resultHair = document.createElement('span');
    resultHair.style.fontSize = '14px';
    resultHair.appendChild(document.createTextNode(`Hair colour: ${hero['Hair color']}, `));
    //publisher
    const resultPublisher = document.createElement('span');
    resultPublisher.style.fontSize = '14px';
    resultPublisher.appendChild(document.createTextNode(`Publisher: ${hero.Publisher}, `));
    //race
    const resultRace = document.createElement('span');
    resultRace.style.fontSize = '14px';
    resultRace.appendChild(document.createTextNode(`Race: ${hero.Race}, `));
    //skin colour
    const resultSkin = document.createElement('span');
    resultSkin.style.fontSize = '14px';
    resultSkin.appendChild(document.createTextNode(`Skin colour: ${hero['Skin color']}, `));
    //weight
    const resultWeight = document.createElement('span');
    resultWeight.style.fontSize = '14px';
    resultWeight.appendChild(document.createTextNode(`Weight: ${hero.Weight}, `));
    //append hero info to a list item:
    listItem.appendChild(resultNameBold);
    listItem.appendChild(document.createElement('br'));
    listItem.appendChild(resultGender);
    listItem.appendChild(resultHeight);
    listItem.appendChild(resultEye);
    listItem.appendChild(resultAlignment);
    listItem.appendChild(resultHair);
    listItem.appendChild(resultPublisher);
    listItem.appendChild(resultRace);
    listItem.appendChild(resultSkin);
    listItem.appendChild(resultWeight);
    listItem.appendChild(resultPowers);
    //push list item to array
    listItems.push(listItem);

  }
  //sort list items based on sortCriteria
  if(sortCriteria){
    sortResults(listItems,sortCriteria);
  }

  //append listen items to result list
  listItems.forEach((item) => {
    resultList.appendChild(item);
  });
  //display results or hide results div
  if (resultList.children.length > 0) {
    searchResultsDiv.style.display = 'block';
    searchResultsDiv.appendChild(resultList);
  } else {
    searchResultsDiv.style.display = 'none';
  }
}


function sortResults(listItems, criteria) {
  listItems.sort((a, b) => {
    switch (criteria){
      case 'name':
        const nameA = a.dataset.name;
        const nameB = b.dataset.name;
        return nameA.localeCompare(nameB);
      case 'race':
        const raceA = a.dataset.Race;
        const raceB = b.dataset.Race;
        return raceA.localeCompare(raceB);
      case 'publisher':
        const publisherA = a.dataset.Publisher;
        const publisherB = b.dataset.Publisher;
        return publisherA.localeCompare(publisherB);
      case 'power':
        const powerA = a.dataset.powers;
        const powerB = b.dataset.powers;
        return powerA.localeCompare(powerB);
    }
    
  });
}

//function to get hero powers based on ID
async function getPowers(id) {
  try {
    const response = await fetch(`/api/superheroes/${id}/power`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; // Handle the error gracefully
  }
}

  // Function to search for superheroes based on a pattern and field
  async function searchSuperheroes(criteria) {
    const pattern = document.getElementById("searchCategory").value;
    const field = document.getElementById("searchInput").value;
    //sanitization
    const sanitizedField = escapeHtml(field);
    const searchResultsDiv = document.getElementById('searchResults');
    const n = 20;
    try {
      const response = await fetch(`/api/search/${pattern}/${sanitizedField}/${n}`);
      if (!response.ok) {
        //if no heroes found, displays message
        while (searchResultsDiv.firstChild) {
          searchResultsDiv.removeChild(searchResultsDiv.firstChild);
        }
        const resultList = document.createElement('ul');
        const listItem = document.createElement('li');
        const resultString = document.createTextNode('No Heroes Found . . .');
        listItem.appendChild(resultString);
        resultList.appendChild(listItem);
        if (resultList.children.length > 0) {
          searchResultsDiv.style.display = 'block';
          searchResultsDiv.appendChild(resultList);
        } else {
          searchResultsDiv.style.display = 'none';
        }
        //if heroes found
        }else{
          const data = await response.json();
          if(criteria){
            displayHeroes(data, criteria);
          }else{
            displayHeroes(data, sortCriteria = 0);
          }
        }
        
      } catch (error) {
        console.error('Error:', error);
      }
  }
  
  
  // Function to save a list of superhero IDs to a given list name
  function saveSuperheroList(listName, ids) {
    // sanitization: Remove potentially harmful characters from listName
    const sanitizedListName = escapeHtml(listName);

    // sanitization: Ensure that IDs are properly formatted (comma-separated)
    const sanitizedIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
    fetch(`/api/lists/add/${sanitizedListName}?ids=${sanitizedIds.join(',')}`, {
      method: 'PUT',
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('List updated successfully');
        } else {
          console.error('Error:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  
  // Function to delete a list of superheroes with a given name
  function deleteSuperheroList(listName) {
    fetch(`/api/lists/delete/${listName}`, {
      method: 'PUT',
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('List deleted successfully');
        } else {
          console.error('Error:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  

  // Function to escape HTML characters to prevent XSS
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"']/g, function (match) {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
    }
  });
}
