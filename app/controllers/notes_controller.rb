class NotesController < ApplicationController
  before_action :set_note, only: [:show, :edit, :update, :destroy]

  # GET /notes
  # GET /notes.json
  def index
    @notes = Note.all#joins(:parent_note_links)
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
      @note = Note.create(note_params.merge(parent_note_links_attributes: {'0'=> {parent_id: @root_note.id.to_s}}))
    end
  end

  # PATCH/PUT /notes/1
  # PATCH/PUT /notes/1.json
  def update
    respond_to do |format|
      if @note.update(note_params)
        format.html { redirect_to @note, notice: 'Note was successfully updated.' }
        format.json { render :show, status: :ok, location: @note }
      else
        format.html { render :edit }
        format.json { render json: @note.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /notes/1
  # DELETE /notes/1.json
  def destroy
    @note.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_note
    @note = Note.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def note_params
    params.require(:note).permit(:text, :xpos, :ypos, :width, :height, parent_note_links_attributes: [:parent_id, :position, :new_parent_id])
  end
end
