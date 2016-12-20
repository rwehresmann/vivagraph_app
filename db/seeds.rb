names = ["Alan Turing", "Marie Curie", "Margaret Hamilton", "Albert Einstein", "Kip Thorne"]
names.each { |n| User.find_or_create_by(name: n) }

10.times { |i| Exercise.find_or_create_by(name: "exercise_#{i}") }

User.all.each do |u|
  Exercise.all.each do |e|
    correct = [true, false].sample

    Answer.create!(correct: correct, user_id: u.id, exercise_id: e.id)
  end
end
