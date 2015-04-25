json.array!(@notes) do |note|
  json.extract! note, :id, :text, :xpos, :ypos, :width, :height
  json.url note_url(note, format: :json)
end
