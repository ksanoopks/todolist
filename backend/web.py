from datetime import datetime,timedelta
from email.policy import default
from flask import Flask,request,jsonify,flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin
import re
from functools import wraps
from werkzeug.security import generate_password_hash,check_password_hash
import jwt
# from flask_jwt_extended import create_access_token
# from flask_jwt_extended import get_jwt_identity
# from flask_jwt_extended import jwt_required,unset_jwt_cookies
# from flask_jwt_extended import JWTManager


app = Flask("Todolist")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///Todolist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
# jwt = JWTManager(app)

class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.Integer)
    todolists = db.relationship("Todolist", back_populates = "user")

class Todolist(db.Model):
    __tablename__ = "todolists"
    id = db.Column(db.Integer, primary_key =True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    privacy = db.Column(db.String)
    user = db.relationship("Users", back_populates = "todolists")
    tasks = db.relationship("Task", back_populates = "todolist")

class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"),nullable=False)
    todolist_id = db.Column(db.Integer, db.ForeignKey("todolists.id"), nullable=False)
    status = db.Column(db.String,default = "on progress")
    todolist = db.relationship("Todolist", back_populates = "tasks")


def auth_middleware():
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = ""
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]
                # print(request.headers)
            if not token:
                return {
                    "message": "Authentication Token is missing!", 
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            try:
                data=jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
                # print(data)
                current_user=Users.query.get(data["user_id"])
                if current_user is None:
                    return {
                    "message": "Invalid Authentication token!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            
            except Exception as e:
                return {
                    "message": "Something went wrong",
                    "data": None,
                    "error": str(e)
                }, 500

            return f(current_user, *args, **kwargs)

        return decorated
    return token_required

@app.route('/register',methods=['POST'])
def register():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    user  = Users(name = name, email = email, password= generate_password_hash(password))
    user_exists = Users.query.filter_by(email = email).first()
    emailformat= r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if re.fullmatch(emailformat,email):
        email = email
    else:
        email = False
    if(user_exists):
        return jsonify({"message":"User is already exists"}),409
    elif(len(name)<3 or name == ''):
        return jsonify({"message":"invalid name"})
    elif (email== False):
        return jsonify({"message":"invalid Email"})

    elif(len(password)<6 or password== ''):
        return jsonify({"message":"invalid password"}),
    else:  
        db.session.add(user)
        db.session.commit()
        return jsonify({"message":"Registration done Successfully"}),200


@app.route('/addtodoitems', methods = ['POST','GET'])
@auth_middleware()
def addtodoitem(current_user):
    id = request.json['id']
    if(request.method == 'POST'):
        name = request.json['name']
        date = request.json['date']
        
        # print(todolists.id)
        task_one = Task(name = name, date = date, user_id = current_user.id, todolist_id = id)
        task_exist = Task.query.filter_by(name = name, user_id = current_user.id).first()
        if(task_exist):
            return jsonify({"error":"Task already exists"}),409
        else:
            db.session.add(task_one)
            db.session.commit()
            return jsonify({"message":"Task added"}),200

    if(request.method == 'GET'):

        # id = request.json['id']
        print(id)
        tasks = Task.query.filter_by(todolist_id=id)
        task_ = []
        for task in tasks:
            task_.append(dict(name = task.name, date = task.date, status = task.status))
        return jsonify(task_)


@app.route('/guest',methods=['GET'])  
def guest():
    todolists = Todolist.query.filter_by(privacy="public").all()
    public_todolists = []
    for todolist in todolists:
        tasks = []
        for task in todolist.tasks:
            tasks.append(task.name)
        public_todolists.append(dict(name=todolist.name, username=todolist.user.name, tasks=tasks))
    return jsonify(public_todolists)


@app.route('/deletetodo',methods=['POST'])
@auth_middleware()
def deletetodolist(current_user):
    if request.method == 'POST':
        id= request.json['id']
        todo = Todolist.query.get(id)
        # print("idfffffffff",id)
        tasks = Task.query.filter_by(todolist_id=id).all()
        for task in tasks:
            db.session.delete(task)
            db.session.commit()
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"status": True})

@app.route("/login", methods=["POST"])
def login():
    email = request.json['email']
    password = request.json['password']
    # print(password)
    user = Users.query.filter_by(email = email).first()
    if(not user):
        return jsonify({"error":"Email doesn't exist"}),401
    if check_password_hash(user.password, password):
        accessToken = jwt.encode({
            "user_id": user.id,
            "email": user.email
        }, app.config["JWT_SECRET_KEY"], algorithm="HS256")
        return jsonify({"message": "LoggedIn Successfully",
                        "status": True,
                        "accessToken": accessToken}),200
    return jsonify({"error":"Password is incorrect"}),401
   

@app.route('/todolist', methods = ['POST', 'GET'])
@auth_middleware()
def addtodolist(current_user):
    # print(current_user)
    if(request.method == 'POST'):
        name = request.json['name']
        privacy = request.json['privacy']
        todolist = Todolist(name = name, user_id = current_user.id, privacy = privacy )
        # print (todolist)
        todo_list = Todolist.query.filter_by(name = name).first()
        if(todo_list and current_user.id == todo_list.user_id):
            return jsonify({"error": "Todo List already exists"}),409
        else:
            db.session.add(todolist)
            db.session.commit()
            return jsonify({"message": "Todo List Added"}),200
    
    if (request.method == 'GET'):        
        todolists = current_user.todolists
        todolists_ = []
        for todolist in todolists:
            todolists_.append(dict(name = todolist.name, user_id = todolist.user_id, privacy = todolist.privacy,id = todolist.id))

        return jsonify(todolists_)


@app.route('/deletetask', methods = ['POST'])
@auth_middleware()
def deletetask(current_user):
    id = request.json['id']
    task = Task.query.get(id)
    # task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"status":True})




