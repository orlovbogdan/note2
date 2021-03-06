class NotesController < ApplicationController
  before_action :set_note, only: [:show, :edit, :update, :destroy]

  # GET /notes
  # GET /notes.json
  def index
      @notes = Note.includes(:parent_note_links).where(note_links: {parent_id: nil})
  end

  # GET /notes/1
  # GET /notes/1.json
  def show
  end

  # GET /notes/new
  def new
    @note = Note.new(xpos: params[:xpos], ypos: params[:ypos])
    render layout: false
  end

  # GET /notes/1/edit
  def edit
  end

  # POST /notes
  # POST /notes.json
  def create
    if params[:note][:parent_note_links_attributes]
      @note = Note.create(note_params)
    else
      @root_note = Note.create(note_params.merge(text: ''))
      @note = Note.create(note_params.merge(parent_note_links_attributes: {'0'=> {parent_id: @root_note.id.to_s, position: 1}}))
    end
  end

  # PATCH/PUT /notes/1
  # PATCH/PUT /notes/1.json
  def update
    if params[:old_parent_id]
      NoteLink.where(note_id: @note.id, parent_id: params[:old_parent_id]).destroy_all
    end
    @note.update(note_params)
    respond_to do |format|
        format.html { redirect_to @note, notice: 'Note was successfully updated.' }
        format.json { render :show, status: :ok, location: @note }
    end
  end

  # DELETE /notes/1
  # DELETE /notes/1.json
  def destroy
    @note.destroy
  end

  def expand
    @note = Note.find(params[:id])
    @note.update!(expand: true)
  end

  def hide
    @note = Note.find(params[:id])
    @note.update!(expand: false)
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_note
    @note = Note.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def note_params
    params.require(:note).permit(:text, :xpos, :ypos, :width, :height, parent_note_links_attributes: [:parent_id, :position])
  end

end
