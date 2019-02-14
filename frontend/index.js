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
let allRecipes = []

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
  resultsContainer.innerHTML= ""
}

function addSearchHandler() {
  searchIngBtn.addEventListener('click', () => ingredientSearch(document.querySelector('#ingredient').value))
   // // live recipe filter incoming
  recipeFilter = document.querySelector('#recipe-search-form')
  recipeFilter.addEventListener('input', ()=>{
    searchTerm = event.target.value
    const re = new RegExp(searchTerm, 'i', '^[ ,-]')
    console.log(re)
    const results = allRecipes.filter((p) => {
      return re.test(p.name)
    }) 
    results.forEach((recipe) => {
      renderRecipe(recipe)
    })

  })
}

function ingredientSearch(ingredient) {
  event.preventDefault()
  const ING_SEARCH_URL = `https://api.nal.usda.gov/ndb/search/?format=json&q=${ingredient}&sort=r&offset=0&api_key=${API_KEY}`
  fetch(ING_SEARCH_URL).then(res => res.json()).then(data => renderResults(data.list.item))
}

function renderResults(results) {
  resultsContainer.innerHTML = ""
  results.forEach(item => {
    let searchResult = document.createElement('p')
    searchResult.className = 'search-result'
    searchResult.textContent = item.name
      let ingBtn = document.createElement('button')
      ingBtn.className = 'search-result-btn'
      ingBtn.textContent = "Add to Recipe"
      ingBtn.addEventListener('click', () => renderItem(item))
      searchResult.appendChild(ingBtn)
    resultsContainer.appendChild(searchResult)
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
      gram.value = 'g'
      gram.textContent = 'gram(s)'
      amountDrop.appendChild(gram)

      let mL = document.createElement('option')
      mL.value = 'mL'
      mL.textContent = 'mL(s)'
      amountDrop.appendChild(mL)

      let fl_oz = document.createElement('option')
      fl_oz.value = 'fl oz'
      fl_oz.textContent = 'fl oz(s)'
      amountDrop.appendChild(fl_oz)

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

    let ingCont = document.createElement('div')
    ingCont.className = 'ing-cont'
    recipe.rec_ings.forEach((ing) => {
        let ingLine = document.createElement('span')
        ingLine.className = 'ing-line'
          let ingAmt = document.createElement('p')
          ingAmt.className = "ingredient-amount"
          ingAmt.textContent = ing.amount
          ingLine.appendChild(ingAmt)

          let ingName = document.createElement('p')
          ingName.textContent = ing.ingredient.name
          ingLine.appendChild(ingName)
        ingCont.appendChild(ingLine)
    })
    element.appendChild(ingCont)
    
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
    let convBtn = document.createElement('button')
    convBtn.textContent = 'Convert units'
    convBtn.className = 'delete-btn'
    convBtn.addEventListener('click', () => {convertUnits(recipe)})
    btnCont.appendChild(convBtn)
  recipeContainer.appendChild(element)
  allRecipes.push(recipe)
}

function deleteRecipe(recipe) {
  fetch(`${BASE_URL}/recipes/${recipe.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'}
    }).then(() => renderRecipes())
  }

  function convertUnits(recipe) {
    units = ['fl oz', 'cup', 'mL', 'oz', 'g']
    unitConv = {'cup': {'fl oz': 8, 'mL': 236.6},
                'mL': {'cup': (1/236.6), 'fl oz': (1/29.6)},
                'fl oz': {'cup': (1/8), 'mL': 29.6}}
    let i = 0
    recipe.rec_ings.forEach((ing) => {
      if (event.target.parentElement.parentElement.querySelectorAll('.ingredient-amount').item(i).textContent !== ing.amount) {
        event.target.parentElement.parentElement.querySelectorAll('.ingredient-amount').item(i).textContent = ing.amount
      } else {
        amt_value = parseInt(ing.amount.split(' ')[0])
        amt_unit = ing.amount.split(' ')[1]
        conv = ing.ingredient.conv
        gPerUnit = conv.split('/')[0]
        targetUnit = conv.split('/')[1]
        if (amt_unit === 'g') {
          //use conv to get to target units
          let newUnit = (amt_value/parseInt(gPerUnit)).toFixed(2)
          event.target.parentElement.parentElement.querySelectorAll('.ingredient-amount').item(i).textContent = `${newUnit} ${targetUnit}`
        } else if (amt_unit === targetUnit) {
          let newUnit = amt_value * parseInt(gPerUnit)
          event.target.parentElement.parentElement.querySelectorAll('.ingredient-amount').item(i).textContent = `${newUnit} g`
        } else if (units.indexOf(amt_unit) > -1 && units.indexOf(targetUnit) > -1) {
          let newUnit = amt_value * unitConv[amt_unit][targetUnit]
          event.target.parentElement.parentElement.querySelectorAll('.ingredient-amount').item(i).textContent = `${newUnit} g`
        }
      }
      i++
    })
  }
    // debugger
    // console.log(recipe)
