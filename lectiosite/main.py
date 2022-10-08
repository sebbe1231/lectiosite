from flask import Flask, render_template, request, jsonify
from lectio import Lectio
from datetime import datetime, timedelta
from os import environ

app = Flask(__name__, static_folder='static/', static_url_path='')
lect = Lectio(environ['INST_ID'], environ['USERNAME'], environ['PASSWORD'])

@app.route("/")
def index():
    sched = lect.me().get_schedule(datetime.now(), datetime.now())
    name = str(lect.me().name).replace("<", "&lt")
    name = name.replace(">", "&gt")
    return render_template('index.html', name=lect.me().name, 
        sched=sched, cdate=datetime.now())

@app.post("/search_rooms")
def get_rooms():
    query = request.json.get("room")

    if not query:
        return jsonify({"error": "No room!"}), 400

    rooms_object = lect.get_school().search_for_rooms(query)
    rooms = []
    for i in rooms_object:
        rooms.append({
            "name": i.name,
            "room_id": i.id
        })
    return jsonify(rooms)

@app.post("/search_users/<search_type>")
def get_users(search_type):
    query = request.json.get("user")

    if not query:
        return jsonify({"error": "No user!"}), 400

    if search_type == "users":
        users_object = lect.get_school().search_for_users(query)
    if search_type == "students":
        users_object = lect.get_school().search_for_students(query)
    if search_type == "teachers":
        users_object = lect.get_school().search_for_teachers_by_name(query)
    if search_type == "initials":
        users_object = lect.get_school().search_for_teachers_by_initials(query)
    
    
    users = []
    for i in users_object:
        users.append({
            "name": i.name,
            "class": i.class_name,
            "initials": i.initials,
            "type": i.type.get_str(),
            "image": i.image,
            "user_id": i.id
        })
    return jsonify(users)

@app.post("/get_user_sched")
def get_user_sched():
    query = request.json.get("user_id")

    sched_object = lect.get_school().get_user_by_id(int(query)).get_schedule(datetime.now(), datetime.now(), True)
    sched = []
    for i in sched_object:
        sched.append({
            "subject": i.subject,
            "title": i.title,
            "room": i.room,
            "teacher": i.teacher,
            "start_time": i.start_time,
            "end_time": i.end_time,
            "status": str(i.status)
        })
    return jsonify(sched)

if __name__ == '__main__':
    app.run('0.0.0.0', 8080, debug=True)