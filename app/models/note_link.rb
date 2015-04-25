class NoteLink < ActiveRecord::Base
  belongs_to :parent, :class_name => 'Note'
  belongs_to :child, :class_name => 'Note', :foreign_key => :note_id
end
