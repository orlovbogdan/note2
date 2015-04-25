class CreateNoteLinks < ActiveRecord::Migration
  def change
    create_table :note_links do |t|
      t.integer :note_id
      t.integer :parent_id
      t.integer :position
      t.integer :link_type_id

      t.timestamps null: false
    end
    add_index :note_links, :note_id
    add_index :note_links, :parent_id
    add_index :note_links, :position
    add_index :note_links, :link_type_id
  end
end
