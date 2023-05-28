FROM python:3.8-slim
WORKDIR /app
COPY . .
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
# CMD gunicorn --bind localhost:5000 --chdir /app app:app
CMD ["python", "app.py"]