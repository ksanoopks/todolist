from datetime import datetime
from email.policy import default
from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask("Todolist")
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///Todolist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
