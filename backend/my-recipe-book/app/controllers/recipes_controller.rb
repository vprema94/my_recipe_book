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
    @recipe = Recipe.new(recipe_params)
    # ingredients.each do |i|
    @rec_ing = RecipeIngredient.find_or_create_by(recipe: recipe, ingredient: ingredient, amount: amount)
    if @recipe.save
      render json: @recipe, status: :created
    else
      render json: @recipe.errors.full_messages, status: :unprocessable_entity
  end

  def update
  end

  def delete
  end

  private
  def recipe_params
    params.permit(:name, :instructions, :user_id, :ingredients_attributes)
  end

end
