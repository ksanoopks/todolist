from datetime import datetime
from email.policy import default
from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask("Todolist")

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///Todolist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)

@app.route('/register')
def register():
    return("hi")

