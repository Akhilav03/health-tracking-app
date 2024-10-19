from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from collections import defaultdict
from flask import jsonify

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_tracking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=True)
    duration = db.Column(db.Integer, nullable=False)
    difficulty_level = db.Column(db.String(50), nullable=False)
    calories_burned = db.Column(db.Integer, nullable=False)
    distance_run = db.Column(db.Float, nullable=False)

class Diet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    meal = db.Column(db.String(50), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    nutrients = db.Column(db.String(200), nullable=False)


@app.route('/')
def home():
    return "Welcome to the Health Tracking Application!"

@app.route('/exercise', methods=['POST'])
def add_exercise():
    data = request.json
    new_exercise = Exercise(
        date=datetime.now().strftime("%Y-%m-%d"),
        type=data.get('type', None),
        duration=data['duration'],
        difficulty_level=data['difficultyLevel'],
        calories_burned=data['caloriesBurned'],
        distance_run=data['distanceRun']
    )
    db.session.add(new_exercise)
    db.session.commit()
    return jsonify({"message": "Exercise added successfully"}), 201

@app.route('/diet', methods=['POST'])
def add_diet():
    data = request.json
    new_diet = Diet(
        date=datetime.now().strftime("%Y-%m-%d"),
        meal=data['meal'],
        calories=data['calories'],
        nutrients=data['nutrients']
    )
    db.session.add(new_diet)
    db.session.commit()
    return jsonify({"message": "Diet added successfully"}), 201

@app.route('/summary/exercise', methods=['GET'])
def get_exercise_summary():
    exercises = Exercise.query.all()
    summary = [{"id": ex.id, "date": ex.date, "type": ex.type or 'N/A', "duration": ex.duration, "difficulty_level": ex.difficulty_level, "calories_burned": ex.calories_burned, "distance_run": ex.distance_run} for ex in exercises]
    return jsonify(summary), 200

@app.route('/summary/diet', methods=['GET'])
def get_diet_summary():
    diets = Diet.query.all()
    summary = [{"id": dt.id, "date": dt.date, "meal": dt.meal, "calories": dt.calories, "nutrients": dt.nutrients} for dt in diets]
    return jsonify(summary), 200

@app.route('/summary', methods=['GET'])
def get_summary():
    exercises = Exercise.query.all()
    diets = Diet.query.all()
    entries = []

    for ex in exercises:
        entries.append({
            'type': 'exercise',
            'date': ex.date,
            'duration': ex.duration,
            'calories_burned': ex.calories_burned,
            'difficulty_level': ex.difficulty_level
        })

    for dt in diets:
        entries.append({
            'type': 'diet',
            'date': dt.date,
            'calories_intake': dt.calories,
            'nutrients': dt.nutrients
        })

    entries.sort(key=lambda x: x['date'])
    return jsonify(entries), 200

@app.route('/exercise/<int:id>', methods=['DELETE'])
def delete_exercise(id):
    exercise = Exercise.query.get(id)
    if exercise:
        db.session.delete(exercise)
        db.session.commit()
        return jsonify({"message": "Exercise deleted successfully"}), 200
    else:
        return jsonify({"message": "Exercise not found"}), 404

@app.route('/diet/<int:id>', methods=['DELETE'])
def delete_diet(id):
    diet = Diet.query.get(id)
    if diet:
        db.session.delete(diet)
        db.session.commit()
        return jsonify({"message": "Diet deleted successfully"}), 200
    else:
        return jsonify({"message": "Diet not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)