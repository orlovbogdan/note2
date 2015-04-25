class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.text :text
      t.integer :xpos
      t.integer :ypos
      t.integer :width
      t.integer :height

      t.timestamps null: false
    end
  end
end
