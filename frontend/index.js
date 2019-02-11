document.addEventListener('DOMContentLoaded', setupPage);

const BASE_URL = 'http://localhost:3000'

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
  let ingredientSearch = event.target.ingredient.value
  let instructions = event.target.instructions.value
  console.log(ingredientSearch)




}

function ingredientSearch(ingredient) {
  
}
