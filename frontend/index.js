document.addEventListener('DOMContentLoaded', setupPage);

const BASE_URL = 'http://localhost:3000'
let array = ['45367385', '11672', '45276886']
const  API_KEY = ''


function setupPage() {
  fetchRecipes().then(function(data) {
    data.forEach(renderRecipe)
  })
  addFormHandler()
}

function fetchRecipes() {
  return fetch(BASE_URL + '/recipes').then(res => res.json())
}


function renderRecipe(recipe) {

}

function addFormHandler() {
  let form = document.querySelector('form')
  form.addEventListener('submit', submitForm)
}

function submitForm() {
  event.preventDefault()
  let name = event.target.name.value
  let ingSearch = event.target.ingredient.value
  let instructions = event.target.instructions.value
  ingredientSearch(ingSearch)

}

function ingredientSearch(ingredient) {

  const ING_SEARCH_URL = `https://api.nal.usda.gov/ndb/search/?format=json&q=${ingredient}&sort=n&offset=0&api_key=${API_KEY}`
  fetch(ING_SEARCH_URL).then(res => res.json()).then(data => renderResults(data.list.item))
}

function renderResults(results) {
  // debugger
  console.log(results)
  let resultsContainer = document.querySelector('#results')
  results.forEach(item => {
    // debugger
    let name = document.createElement('p')
    // add "add ingredient" pushes ingredient info into an array & renders ingredient name on page under a 'list'
    name.textContent = item.name
    resultsContainer.appendChild(name)
    // submit form will call createIngredients() that takes in the array of ingredients and creates them
    // submit form will also call createRecipe() and creates recipe with name and instructions
  })
}

function createIngredients(array) {
  //fetch ingredient info from ndbno
  array.forEach(ndbno => {
    ING_URL = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${ndbno}&type=f&format=json&api_key=${API_KEY}`
    return fetch(ING_URL).then(res => res.json()).then(data => console.log(data.foods[0].food.nutrients[0].measures[0]))
    createIngredient(name, body, ndbno)
  })
}

createIngredients(array)
