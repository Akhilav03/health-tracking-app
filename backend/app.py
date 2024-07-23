from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_tracking.db'
db = SQLAlchemy(app)

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    intensity = db.Column(db.String(50), nullable=False)

class Diet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    meal = db.Column(db.String(50), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    nutrients = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Welcome to the Health Tracking Application!"

@app.route('/exercise', methods=['POST'])
def add_exercise():
    data = request.json
    new_exercise = Exercise(
        date=datetime.now().strftime("%Y-%m-%d"),
        type=data['type'],
        duration=data['duration'],
        intensity=data['intensity']
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
    summary = [{"id": ex.id, "date": ex.date, "type": ex.type, "duration": ex.duration, "intensity": ex.intensity} for ex in exercises]
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

    exercise_data = [{"date": ex.date, "type": ex.type, "duration": ex.duration, "intensity": ex.intensity} for ex in exercises]
    diet_data = [{"date": dt.date, "meal": dt.meal, "calories": dt.calories, "nutrients": dt.nutrients} for dt in diets]

    summary = {
        "exercises": exercise_data,
        "diets": diet_data
    }
    return jsonify(summary), 200

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
