class Recipe < ApplicationRecord
  has_many :rec_ings
  has_many :ingredients, through: :rec_ings
  has_many :comments
  accepts_nested_attributes_for :ingredients

end
