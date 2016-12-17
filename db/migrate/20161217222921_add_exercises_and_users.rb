class AddExercisesAndUsers < ActiveRecord::Migration[5.0]
  def self.up
    create_table :exercises_users do |t|
      t.references :exercise, :user
    end
  end

  def self.down
    drop_table :exercises_users
  end
end
