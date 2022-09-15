from crypt import methods
from datetime import datetime
from email.policy import default
from flask import Flask,request,jsonify,flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import re
from werkzeug.security import generate_password_hash,check_password_hash


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
    password = db.Column(db.Integer)

@app.route('/register',methods=['POST'])

def register():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    

    user  = Users(name = name, email = email, password= generate_password_hash(password))
    nameformate = re.compile(r'^(Mr\.|Mrs\.|Ms\.) ([a-z]+)( [a-z]+)( [a-z]+)$', 
              re.IGNORECASE)
    # emailvalidation= r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

    # name1= nameformate.test(name)


    user_exists = Users.query.filter_by(email = email).first()
    emailformat= r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if re.fullmatch(emailformat,email):
        email = email
    else:
        email = False



    if(user_exists):
        return jsonify({"message":"User is already exists"})
    elif(len(name)<3 or name == ''):
        return jsonify({"message":"invalid name"})
    elif (email== False):
        return jsonify({"message":"invalid Email"})

    elif(len(password)<6 or password== ''):
        return jsonify({"message":"invalid password"})
    else:  
        db.session.add(user)
        db.session.commit()
        return jsonify({"message":"Registration done Successfully"})

@app.route('/login',methods=['POST'])

def login():
    email = request.json['email']
    password = request.json['password']

    user = Users.query.filter_by(email = email).first()
    if check_password_hash(user.password,password):
    
        return jsonify({"message":"Loggin successful"})
    else:
        return jsonify({"error":"Invalid login"})
    


