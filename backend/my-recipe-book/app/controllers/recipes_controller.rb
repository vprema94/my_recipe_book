class RecipesController < ApplicationController

  def index
    @recipes = Recipe.all
    render json: @recipes
  end

  def show
    @recipe = Recipe.find(params[:id])
    render json: @recipe.to_json(include :ingredients)
  end

  def create
    paramh = recipe_params.to_h
    # @recipe = Recipe.new(name: paramh["name"], instructions: paramh["instructions"])
    @recipe = Recipe.create(name: paramh["name"], instructions: paramh["instructions"])
    # ingredients.each do |i|
    # @rec_ing = Rec_Ing.find_or_create_by(recipe: recipe, ingredient: ingredient, amount: amount)
    inghash = recipe_params["ingredients"].map{|e| e.to_h}
    inghash.each do |ing|
      ingredient = Ingredient.find_or_create_by(name: ing['name'], ndbno: ing['ndbno'], conv: ing['conv'])
      @recipe.ingredients << ingredient
      # RecIng.last['amount'] = ing['amount']
      # rec_ing = RecIng.find_or_create_by(recipe: @recipe, ingredient: ingredient)
      rec_ing = RecIng.last
      rec_ing.amount = ing['amount']
      rec_ing.save
      # byebug
    end
    if @recipe.save
      render json: @recipe, status: :created
    else
      render json: @recipe.errors.full_messages, status: :unprocessable_entity
    end
    # byebug
  end

  def update
  end

  def delete
  end

  private
  def recipe_params
    params.require(:recipe).permit(:name, :instructions, :user_id, ingredients: [:name, :ndbno, :conv, :amount])
  end

end
