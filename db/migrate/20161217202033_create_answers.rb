class CreateAnswers < ActiveRecord::Migration[5.0]
  def change
    create_table :answers do |t|
      t.boolean :correct

      t.timestamps
    end
  end
end
