FROM python:3.10.9-alpine

WORKDIR /app

COPY . .

# TEMP; add git to install lectio.py@dev
RUN apk add git

RUN pip install pipenv
RUN pipenv install --deploy --system
RUN pip uninstall pipenv -y

RUN pip install gunicorn

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8080", "main:app"]