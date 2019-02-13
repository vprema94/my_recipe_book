document.addEventListener('DOMContentLoaded', setupPage);

const BASE_URL = 'http://localhost:3000'
const  API_KEY = '3EIKJr9x60u3tKEl9NOwreStlYavg2CcPmfcZ5ZS'
const addRecipeBtn = document.querySelector('#new-recipe-btn')
const recipeFormCont = document.querySelector('.container')
const recipeForm = document.querySelector('.add-recipe-form')
const submitBtn = document.querySelector('#submit-button')
let addRecipe = false
let recipeContainer = document.querySelector('#recipe-collection')
let resultsContainer = document.querySelector('#results')
let bigResultsContainer = document.querySelector('.results-container')
let searchIngBtn = document.querySelector('#search-button')
let itemContainer = document.querySelector('#item-container')
let ingredientNums = []
let ingredientParams = []
let amounts = []

function setupPage() {
  renderRecipes()
  addFormHandler()
  addSearchHandler()
}

function addFormHandler() {
  addRecipeBtn.addEventListener('click', () => {
    addRecipe = !addRecipe
    if (addRecipe) {
      recipeFormCont.style.display = 'flex'
      bigResultsContainer.style.display = 'block'
    } else {
      recipeFormCont.style.display = 'none'
      bigResultsContainer.style.display = 'none'
    }
  })
  recipeForm.addEventListener('submit', submitForm)
}

function submitForm() {
  event.preventDefault()
  let name = event.target.name.value
  let instructions = event.target.instructions.value

  for (let j = 0; j<itemContainer.children.length; j++) {
    let amount = itemContainer.children[j].children[0].value + " " + itemContainer.children[j].children[1].value
    amounts.push(amount)
  }
  getAllIngredientInfo().then(() => postRecipe(name, instructions))

}

function getAllIngredientInfo() {
  queryString = ingredientNums.map((num) => {
    return `ndbno=${num}`
  })

  ING_URL = `https://api.nal.usda.gov/ndb/V2/reports?${queryString.join('&')}&type=f&format=json&api_key=${API_KEY}`
  return fetch(ING_URL).then(res => res.json()).then((data) => getIngredientInfo(data))
}

function getIngredientInfo(data) {
    data.foods.forEach(ing => {
      let name = ing.food.desc.name
      let num = ing.food.desc.ndbno
      let conv = (ing.food.nutrients[0].measures[0].eqv / ing.food.nutrients[0].measures[0].qty).toString() + `${ing.food.nutrients[0].measures[0].eunit}/${ing.food.nutrients[0].measures[0].label}`
      let ingredientInfo = {name: name, ndbno: num, conv: conv, amount: amounts.shift()}
      ingredientParams.push(ingredientInfo)
    })
}

function postRecipe(name, instructions) {
  let recipe = {name: name, instructions: instructions, ingredients: ingredientParams}

  fetch(BASE_URL + '/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({recipe})
  }).then(() => renderRecipes())

  ingredientNums = []
  ingredientParams = []
  amounts = []
  recipeForm.reset()
  recipeFormCont.style.display = 'none'
  bigResultsContainer.style.display = 'none'

}

function addSearchHandler() {
  searchIngBtn.addEventListener('click', () => ingredientSearch(document.querySelector('#ingredient').value))
}

function ingredientSearch(ingredient) {
  event.preventDefault()
  const ING_SEARCH_URL = `https://api.nal.usda.gov/ndb/search/?format=json&q=${ingredient}&sort=n&offset=0&api_key=${API_KEY}`
  fetch(ING_SEARCH_URL).then(res => res.json()).then(data => renderResults(data.list.item))
}

function renderResults(results) {
  resultsContainer.innerHTML = ""
  results.forEach(item => {
    let searchResult = document.createElement('p')
    // add "add ingredient" pushes ingredient info into an array & renders ingredient name on page under a 'list'
    searchResult.textContent = item.name
      let ingBtn = document.createElement('button')
      ingBtn.textContent = "Add Me to Your Recipe!"
      ingBtn.addEventListener('click', () => renderItem(item))
      searchResult.appendChild(ingBtn)
    resultsContainer.appendChild(searchResult)
    // submit form will call createIngredients() that takes in the array of ingredients and creates them
    // submit form will also call createRecipe() and creates recipe with name and instructions
  })
}

function renderItem(item) {
  resultsContainer.innerHTML= ""
  let singleItem = document.createElement('p')
  singleItem.textContent = item.name
    let amountInput = document.createElement('input')
    amountInput.placeholder = 'Enter Amount'
    singleItem.appendChild(amountInput)

    let amountDrop = document.createElement('select')
    amountDrop.name = 'measurements'
      let tbsp = document.createElement('option')
      tbsp.value = 'tbsp'
      tbsp.textContent = 'tablespoon'
      amountDrop.appendChild(tbsp)

      let tsp = document.createElement('option')
      tsp.value = 'tsp'
      tsp.textContent = 'teaspoon'
      amountDrop.appendChild(tsp)

      let cup = document.createElement('option')
      cup.value = 'cup'
      cup.textContent = 'cup(s)'
      amountDrop.appendChild(cup)

      let gram = document.createElement('option')
      gram.value = 'gram'
      gram.textContent = 'gram(s)'
      amountDrop.appendChild(gram)

    singleItem.appendChild(amountDrop)
  itemContainer.appendChild(singleItem)
  ingredientNums.push(item.ndbno)
}

function renderRecipes() {
  recipeContainer.innerHTML = ''
  getRecipes().then(function(data) {
    console.log(data)
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
    let recipeName = document.createElement('p')
    recipeName.className = 'recipe-card-name'
    recipeName.textContent = recipe.name
    element.appendChild(recipeName)

    let title2 = document.createElement('p')
    title2.textContent = 'INGREDIENTS'
    title2.className = 'titlez'
    element.appendChild(title2) 

    recipe.rec_ings.forEach((ing) => {
      let ingCont = document.createElement('div')
        let ingName = document.createElement('p')
        ingName.textContent = ing.ingredient.name
        ingCont.appendChild(ingName)

        let ingAmt = document.createElement('p')
        ingAmt.textContent = ing.amount
        ingCont.appendChild(ingAmt)
      element.appendChild(ingCont)
    }) 

    let title1 = document.createElement('p')
    title1.textContent = 'INSTRUCTIONS'
    title1.className = 'titlez'
    element.appendChild(title1)

    let recipeIns = document.createElement('p')
    recipeIns.textContent = recipe.instructions
    element.appendChild(recipeIns)

    let btnCont = document.createElement('div')
    btnCont.style.alignSelf = 'flex-end'
      let delbtn = document.createElement('button')
      delbtn.className = 'delete-btn'
      delbtn.textContent = "Delete"
      delbtn.addEventListener('click', () => {deleteRecipe(recipe)})
      btnCont.appendChild(delbtn)
    element.appendChild(btnCont)
  recipeContainer.appendChild(element)
}

function deleteRecipe(recipe) {
  fetch(`${BASE_URL}/recipes/${recipe.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'}
    }).then(() => renderRecipes())
  }
