class CreateDumbs < ActiveRecord::Migration[5.1]
  def change
    create_table :dumbs do |t|
      t.text :content

      t.timestamps
    end
  end
end
