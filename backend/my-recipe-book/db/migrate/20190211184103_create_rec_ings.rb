class CreateRecIngs < ActiveRecord::Migration[5.2]
  def change
    create_table :rec_ings do |t|
      t.references :recipe, foreign_key: true
      t.references :ingredient, foreign_key: true
      t.string :amount

      t.timestamps
    end
  end
end
