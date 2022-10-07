from flask import Flask, render_template, request, jsonify
from lectio import Lectio
from datetime import datetime, timedelta
from os import environ

app = Flask(__name__, static_folder='static/', static_url_path='')
lect = Lectio(environ['INST_ID'], environ['USERNAME'], environ['PASSWORD'])

@app.route("/")
def index():
    sched = lect.me().get_schedule(datetime.now(), datetime.now())
    return render_template('index.html', name=lect.me().name, 
        sched=sched, cdate=datetime.now())

@app.post("/search_rooms")
def get_rooms():
    query = request.json.get("room")

    if not query:
        return jsonify({"error": "No room!"}), 400

    rooms_object = lect.get_school().search_for_rooms(query)
    rooms = [i.name for i in rooms_object]
    return jsonify(rooms)

@app.post("/search_users")
def get_users():
    query = request.json.get("user")

    if not query:
        return jsonify({"error": "No user!"}), 400

    users_object = lect.get_school().search_for_users(query)
    users = [i.name for i in users_object]
    return jsonify(users)

@app.post("/search_students")
def get_students():
    query = request.json.get("user")

    if not query:
        return jsonify({"error": "No user!"}), 400

    users_object = lect.get_school().search_for_students(query)
    users = [i.name for i in users_object]
    return jsonify(users)

@app.post("/search_teachers")
def get_teachers():
    query = request.json.get("user")

    if not query:
        return jsonify({"error": "No user!"}), 400

    users_object = lect.get_school().search_for_teachers_by_name(query)
    users = [i.name for i in users_object]
    return jsonify(users)

@app.post("/search_initials")
def get_initials():
    query = request.json.get("user")

    if not query:
        return jsonify({"error": "No user!"}), 400

    users_object = lect.get_school().search_for_teachers_by_initials(query)
    users = [i.name for i in users_object]
    print(users)
    return jsonify(users)

if __name__ == '__main__':
    app.run('0.0.0.0', 8080, debug=True)