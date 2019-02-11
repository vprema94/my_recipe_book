class CommentsController < ApplicationController

  def index
    @recipe = Recipe.find(params[:id])
    @comments = Comment.where(recipe_id: @recipe.id)
  end

  def create
    @comment = Comment.new(comment_params)
    if @comment.save
      render json: @comment, status: :created
    else
      render json: @reciple.errors.full_messages, status: :unprocessable_entity
  end

  private
  def comment_params
    params.permit(:content, :recipe_id, :user_id)
  end

end
