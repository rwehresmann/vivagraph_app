class GraphController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.js
    end
  end

  def node
    @answer = params[:answer]
    @node_html_id = params[:node_html_id]

    respond_to do |format|
      format.js
    end
  end

  def link
    @link_html_id = params[:link_html_id]
    @answer_1 = params[:answer_1]
    @answer_2 = params[:answer_2]

    respond_to do |format|
      format.js
    end
  end

  # Build a nice data structure to use in graph.
  def data
    answers = []
    Answer.all.each do |answer|
      hash = answer.as_json
      hash[:user] = answer.user
      hash[:exercise] = answer.exercise
      answers << hash
    end

    respond_to do |format|
      format.json { render :json => answers }
    end
  end
end
