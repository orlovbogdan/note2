class AddExpandToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :expand, :boolean
  end
end
