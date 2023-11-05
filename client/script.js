// Function to get all superhero information by ID
function getSuperheroInfo(id) {
    fetch(`/api/superheroes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the data received from the server
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Function to get superhero powers by ID
  function getSuperheroPowers(id) {
    fetch(`/api/superheroes/${id}/power`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the data received from the server
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Function to get all available publisher names
  function getAllPublishers() {
    fetch('/api/publishers')
      .then((response) => response.json())
      .then((data) => {
        // Handle the data received from the server
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Function to search for superheroes based on a pattern and field
  function searchSuperheroes(pattern, field, n) {
    fetch(`/api/search/${pattern}/${field}/${n}`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the data received from the server
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Function to create a new list of superheroes
  function createSuperheroList(listName) {
    fetch(`/api/lists/${listName}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('List created successfully');
        } else {
          console.error('Error:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Function to save a list of superhero IDs to a given list name
  function saveSuperheroList(listName, ids) {
    fetch(`/api/lists/add/${listName}?ids=${ids.join(',')}`, {
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
  
  // Function to get the list of superhero IDs for a given list name
  function getSuperheroList(listName) {
    fetch(`/api/lists/${listName}`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the data received from the server
        console.log(data);
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
  
  // Function to get a list of names, information, and powers of all superheroes saved in a given list
  function getSuperheroListInfo(listName) {
    fetch(`/api/lists/info/${listName}`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the data received from the server
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  