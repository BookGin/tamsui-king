class AddRadiusToBomb < ActiveRecord::Migration[5.1]
  def change
    add_column :bombs, :radius, :decimal
  end
end
