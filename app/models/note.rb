class Note < ActiveRecord::Base
  has_many :child_note_links, :class_name => 'NoteLink', :foreign_key => 'parent_id'
  has_many :children, :through => :child_note_links, :source => :child
  has_many :parent_note_links, :class_name => 'NoteLink'
  has_many :parents, :through => :parent_note_links, :source => :parent

  accepts_nested_attributes_for :child_note_links
  accepts_nested_attributes_for :parent_note_links
end
