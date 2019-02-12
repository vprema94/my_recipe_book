document.addEventListener('DOMContentLoaded', setupPage);

const BASE_URL = 'http://localhost:3000'
let array = ['45367385', '11672', '45276886']
const  API_KEY = '3EIKJr9x60u3tKEl9NOwreStlYavg2CcPmfcZ5ZS'
const addRecipeBtn = document.querySelector('#new-recipe-btn')
const recipeForm = document.querySelector('.add-recipe-form')
let addRecipe = false
let recipeContainer = document.querySelector('#recipe-collection')
let resultsContainer = document.querySelector('#results')
let searchIngBtn = document.querySelector('#search')


function setupPage() {
  // renderRecipes()
  addFormHandler()
  addSearchHandler()
}

function renderRecipes() {
  getRecipes().then(function(data) {
    data.forEach(renderRecipe)
  })
} 

function getRecipes() {
  return fetch(`${BASE_URL}/recipes`).then(res => res.json())
} 

function renderRecipe(recipe) {
  let element = document.createElement('div')
  element.className = 'card'
  element.dataset.id = recipe.id
    let recipeName = document.createElement('h2')
    recipeName.textContent = recipe.name
    element.appendChild(recipeName) 

    let recipeIns = document.createElement('p')
    recipeIns.textContent = recipe.instructions
    element.appendChild(recipeIns)

    // let recipeIng = document.createElement('p')
    // element.appendChild(recipeIng) 

    let delbtn = document.createElement('button') 
    delbtn.className = 'like-btn'
    delbtn.textContent = "Like <3"
    // delbtn.addEventListener('click', deleteRecipe)
    element.appendChild(delbtn)
  recipeContainer.appendChild(element)
}

function addFormHandler() {
  addRecipeBtn.addEventListener('click', () => { 
    recipeForm.addEventListener('submit', submitForm)
    // hide & seek with the form
    addRecipe = !addRecipe
    if (addRecipe) {
      recipeForm.style.display = 'block'
    } else {
      recipeForm.style.display = 'none'
    }
  }) 
}

function submitForm() {
  event.preventDefault()
  let name = event.target.name.value
  let instructions = event.target.instructions.value
  // let ingSearch = event.target.ingredient.value
  // ingredientSearch(ingSearch)
}

function addSearchHandler() {
  searchIngBtn.addEventListener('click', () => ingredientSearch(event.target.parentElement.children[1].value)) 
}

function ingredientSearch(ingredient) {
  event.preventDefault()
  const ING_SEARCH_URL = `https://api.nal.usda.gov/ndb/search/?format=json&q=${ingredient}&sort=n&offset=0&api_key=${API_KEY}`
  fetch(ING_SEARCH_URL).then(res => res.json()).then(data => renderResults(data.list.item))
}

function renderResults(results) {
  console.log(results)
  resultsContainer.innerHTML = ""
  results.forEach(item => {
    let searchResult = document.createElement('p')
    // add "add ingredient" pushes ingredient info into an array & renders ingredient name on page under a 'list'
    searchResult.textContent = item.name
    resultsContainer.appendChild(searchResult)
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

// createIngredients(array)
