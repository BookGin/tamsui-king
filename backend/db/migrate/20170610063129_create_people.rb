class CreatePeople < ActiveRecord::Migration[5.1]
  def change
    create_table :people do |t|
      t.decimal :lat
      t.decimal :lng
      t.string :name
      t.timestamps
    end
  end
end
