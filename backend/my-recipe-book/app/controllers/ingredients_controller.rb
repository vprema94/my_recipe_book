class IngredientsController < ApplicationController

  def index
  end

  def show
  end

  def create
    @ingredient = Ingredient.new(ingredient_params)
    if @ingredient.save
      render json: @ingredient, status: :created
    else
      render json: @ingredient.errors.full_messages, status: :unprocessable_entity
  end

  def update
  end

  def delete
  end

  private
  def ingredient_params
    params.permit(:name, :conv, :ndbno)
  end


end
