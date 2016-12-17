# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
names = ["Indiana Jones", "Oliver Twist", "John Galt", "Lisbet Salander", "Ceiwyn of Powys"]
names.each { |n| User.find_or_create_by(name: n) }

10.times { |i| Exercise.find_or_create_by(name: "exercise_#{i}") }

User.all.each do |u|
  Exercise.all.each do |e|
    correct = [true, false].sample

    Answer.create!(correct: correct, user_id: u.id, exercise_id: e.id)
  end
end
