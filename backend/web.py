from crypt import methods
from datetime import datetime
from email.policy import default
from flask import Flask,request,jsonify,flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin
import re
from werkzeug.security import generate_password_hash,check_password_hash


app = Flask("Todolist")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///Todolist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    todolists = db.relationship("AddTodolist", back_populates = "user")

class AddTodolist(db.Model):
    __tablename__ = "todolists"
    id = db.Column(db.Integer, primary_key =True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    privacy = db.Column(db.String)
    user = db.relationship("Users", back_populates = "todolists")


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


        
    
@app.route('/addtodolist', methods = ['POST', 'GET'])
@cross_origin()
def addtodolist():
    user = Users.query.get(1)
    # for user in users:
    #     userid = user.id
    if(request.method == 'POST'):
        # users = Users.query.all()
        # for user in users:
        #     userid = user.id
        name = request.json['name']
        privacy = request.json['privacy']
        # user_id = userid
        todolist = AddTodolist(name = name, user_id = user.id, privacy = privacy)
        todo_list = AddTodolist.query.filter_by(name = name).first()
        if(todo_list):
            return jsonify({"message": "Todo List already exists"})
        else:
            db.session.add(todolist)
            db.session.commit()

            return jsonify({"message": "Todo List Added"})
    
    if (request.method == 'GET'):
        # todos = AddTodolist.query.all()
        todolists = user.todolists
        todolists_ = []
        for todolist in todolists:
            todolists_.append(dict(name = todolist.name, user_id = todolist.user_id ))
        return jsonify(todolists_)


@app.route('/guest',methods=['GET'])  
def guest():
    todolist= AddTodolist.query.filter_by(privacy="public")
    lis =[]
    for list in todolist:
        lis.append(dict(name=list.name, user_id = list.id))
    return jsonify(lis)
     
    

    

