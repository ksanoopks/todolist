from crypt import methods
from datetime import datetime
from email.policy import default
from flask import Flask,request,jsonify,flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin


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
    user  = Users(name = name, email = email, password= password)
    user_exists = Users.query.filter_by(email = email).first()
    if(user_exists):
        return jsonify({"message":"User is already exists"})
    else:
        
        db.session.add(user)
        db.session.commit()
        return jsonify({"message":"Registration done Successfully"})
        
    
@app.route('/addtodolist', methods = ['POST', 'GET'])
@cross_origin()
def addtodolist():
    user = Users.query.get(17)
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


            
    

    

