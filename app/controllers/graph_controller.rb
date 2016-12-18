class GraphController < ApplicationController
  def index
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
