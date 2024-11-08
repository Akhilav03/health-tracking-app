from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from collections import defaultdict
from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_tracking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


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


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)



login_manager = LoginManager()
login_manager.init_app(app)


# @app.before_first_request
# def create_tables():
#     db.create_all()





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
    summary = [{"id": dt.id, "date": dt.date, "meal": dt.meal, "calories": dt.calories} for dt in diets]
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

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({'message': 'Username already exists'}), 409
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User successfully registered'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user is None or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    login_user(user)
    return jsonify({'message': 'Logged in successfully'}), 200



# if __name__ == '__main__':
#     app.run(debug=True)
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)