class Ingredient < ApplicationRecord
  has_many :rec_ings
  has_many :recipes, through: :rec_ings
  accepts_nested_attributes_for :rec_ings
end
