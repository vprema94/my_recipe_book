class RecipesController < ApplicationController

  def index
    @recipes = Recipe.all
    render json: @recipes.as_json(:include => {:rec_ings => {:include => :ingredient}})
    # render json: tests.as_json(:include => {:questions => {:include => :subject}, :bonuses => {:include => :subject}})
  end

  def show
    @recipe = Recipe.find(params[:id])
    render json: @recipe.to_json(include :ingredients)
  end

  def create
    paramh = recipe_params.to_h
    @recipe = Recipe.new(name: paramh["name"], instructions: paramh["instructions"])
    if @recipe.save
      render json: @recipe, status: :created
    else
      render json: @recipe.errors.full_messages, status: :unprocessable_entity
    end

    inghash = recipe_params["ingredients"].map{|e| e.to_h}
    inghash.each do |ing|
      ingredient = Ingredient.find_or_create_by(name: ing['name'], ndbno: ing['ndbno'], conv: ing['conv'])
      @recipe.ingredients << ingredient
      rec_ing = RecIng.last
      rec_ing.amount = ing['amount']
      rec_ing.save
    end
  end

  def update
  end

  def destroy
    # byebug
    rec = Recipe.find(params[:id])
    rec.rec_ings.destroy_all
    rec.destroy
  end

  private
  def recipe_params
    params.require(:recipe).permit(:name, :instructions, ingredients: [:name, :ndbno, :conv, :amount])
  end

end
