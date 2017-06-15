class CreateBombs < ActiveRecord::Migration[5.1]
  def change
    create_table :bombs do |t|
      t.decimal :lat
      t.decimal :lng
      t.references :person, foreign_key: true

      t.timestamps
    end
  end
end
