from flask import Flask, render_template, request, jsonify, send_file
from io import BytesIO
from lectio import Lectio, exceptions
from datetime import date, datetime, timedelta
from os import environ
import calendar

app = Flask(__name__, static_folder='static/', static_url_path='')
lect = Lectio(environ['INST_ID'], environ['USERNAME'], environ['PASSWORD'])

@app.route("/")
def index():
    sched = lect.me().get_schedule(datetime.now(), datetime.now())
    name = str(lect.me().name).replace("<", "&lt")
    name = name.replace(">", "&gt")
    return render_template('index.html', name=lect.me().name, 
        sched=sched, cdate=datetime.now())

@app.route("/usersched")
def usersched():
    today = datetime.today()

    # First day of the monst
    datem = datetime(today.year, today.month, 1)

    # Last day of the month
    last_datem = datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1])

    # First day of the full calander range
    first_day = datem-timedelta(days=datem.weekday())
    
    sched = lect.me().get_schedule(datem, last_datem)
    
    # All dates in the the full 42 day calander range
    dates = []
    for i in range(42):
        dates.append(first_day+timedelta(days=i))

    actual_dates = []
    for i in sched:
        if i.start_time.date() not in actual_dates:
            actual_dates.append(i.start_time.date())

    # data = []
    # for i in sched:
    #     data.append({
    #         "subject": i.subject,
    #         "title": i.title,
    #         "room": i.room,
    #         "teacher": i.teacher,
    #         "start_time": i.start_time,
    #         "end_time": i.end_time,
    #         "status": str(i.status),
    #         "extra_info": i.extra_info
    #     })

    return render_template('usersched.html', sched=sched, cdate=datetime.now(), dates = dates, actual_dates=actual_dates)

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
            "user_id": i.id
        })
    return jsonify(users)

@app.get("/get_user_image")
def get_image():
    user_id = request.args.get("id")

    if not user_id:
        return "Bad request", 400
    
    try:
        user = lect.get_school().get_user_by_id(user_id)
    except exceptions.UserDoesNotExistError:
        return "Not found", 404

    r = lect._request(user.image, full_url=True)

    return send_file(
        BytesIO(r.content),
        "image/jpeg"
    )

@app.post("/get_user_sched")
def get_user_sched():
    query = request.json.get("user_id")

    sched_object = lect.get_school().get_user_by_id(int(query)).get_schedule(datetime.now()-timedelta(days=datetime.now().weekday()), datetime.now()+timedelta(days=6), True)
    sched = []
    for i in sched_object:
        sched.append({
            "subject": i.subject,
            "title": i.title,
            "room": i.room,
            "teacher": i.teacher,
            "start_time": str(i.start_time),
            "end_time": str(i.end_time),
            "status": str(i.status)
        })

    return jsonify(sched)

@app.post("/get_room_sched")
def get_room_sched():
    query = request.json.get("room_id")

    sched_object = lect.get_school().get_room_by_id(int(query)).get_schedule(datetime.now()-timedelta(days=datetime.now().weekday()), datetime.now()+timedelta(days=6), True)
    sched_available = lect.get_school().get_room_by_id(int(query)).is_available(datetime.now())
    room_sched = []
    sched = [sched_available]
    for i in sched_object:
        room_sched.append({
            "subject": i.subject,
            "title": i.title,
            "teacher": i.teacher,
            "start_time": str(i.start_time),
            "end_time": str(i.end_time)
        })
        print(i.start_time)
    
    sched.append(room_sched)
    
    return jsonify(sched)

if __name__ == '__main__':
    app.run('0.0.0.0', 8080, debug=True)