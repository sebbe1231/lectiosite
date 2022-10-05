from flask import Flask, render_template, request
from lectio import Lectio
from datetime import datetime
from os import environ

app = Flask(__name__, static_folder='static/', static_url_path='')
lect = Lectio(environ['INST_ID'], environ['USERNAME'], environ['PASSWORD'])

@app.route("/")
def index():
    sched = lect.me().get_schedule(datetime.now(), datetime.now())
    return render_template('index.html', name=lect.me().name, 
        sched=sched, cdate=datetime.now())

if __name__ == '__main__':
    app.run('0.0.0.0', 8080, debug=True)