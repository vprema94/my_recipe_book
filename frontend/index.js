document.addEventListener('DOMContentLoaded', setupPage);

const BASE_URL = 'http://localhost:3000'
const  API_KEY = '3EIKJr9x60u3tKEl9NOwreStlYavg2CcPmfcZ5ZS'
const addRecipeBtn = document.querySelector('#new-recipe-btn')
const recipeForm = document.querySelector('.add-recipe-form')
const submitBtn = document.querySelector('.submit-button')
let addRecipe = false
let recipeContainer = document.querySelector('#recipe-collection')
let resultsContainer = document.querySelector('#results')
let searchIngBtn = document.querySelector('#search')
let itemContainer = document.querySelector('#item-container')
let ingredientNums = []
let ingredientParams = []
let amounts = []

function setupPage() {
  // renderRecipes()
  addFormHandler()
  addSearchHandler()
}


function addFormHandler() {
  addRecipeBtn.addEventListener('click', () => {
    addRecipe = !addRecipe
    if (addRecipe) {
      recipeForm.style.display = 'block'
    } else {
      recipeForm.style.display = 'none'
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

  // getAllIngredientInfo().then(() => addAmounts).then(() => postRecipe(name, instructions)) 

  getAllIngredientInfo(name, instructions)

}

// function getAllIngredientInfo() {
//     return new Promise(result => {
//       ingredientNums.forEach(no => getIngredientInfo(no))
//       result()
//     })
// } 

async function getAllIngredientInfo(name, instructions) {
  await ingredientNums.forEach(no => getIngredientInfo(no))
  await addAmounts
  await postRecipe(name, instructions)
} 

function getIngredientInfo(no) {
  ING_URL = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${no}&type=f&format=json&api_key=${API_KEY}`
  fetch(ING_URL).then(res => res.json()).then(data => {
    let name = data.foods[0].food.desc.name
    let num = data.foods[0].food.desc.ndbno
    let conv = (data.foods[0].food.nutrients[0].measures[0].eqv / data.foods[0].food.nutrients[0].measures[0].qty).toString() + `${data.foods[0].food.nutrients[0].measures[0].eunit}/${data.foods[0].food.nutrients[0].measures[0].label}`

    let ingredientInfo = {name: name, ndbno: num, conv: conv}
    ingredientParams.push(ingredientInfo)
  })
}

function addAmounts() {
  for (let i = 0; i<amounts.length; i++ ) {
    ingredientParams[i]['amount'] = amounts[i]
  }
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
  })
  // ingredientNums = []
  // ingredientParams = []
  // amounts = []
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
    delbtn.className = 'delete-btn'
    delbtn.textContent = "Delete"
    // delbtn.addEventListener('click', deleteRecipe)
    element.appendChild(delbtn)
  recipeContainer.appendChild(element)
}
