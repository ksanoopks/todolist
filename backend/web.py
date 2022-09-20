from datetime import datetime,timedelta
from email.policy import default
from flask import Flask,request,jsonify,flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin
import re
from functools import wraps
from werkzeug.security import generate_password_hash,check_password_hash
import jwt


app = Flask("Todolist")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///Todolist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config["JWT_SECRET_KEY"] = "todolist"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)


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
    status = db.Column(db.String)
    todolist = db.relationship("Todolist", back_populates = "tasks")


def auth_middleware():
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = ""
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]
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
                },

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
        return jsonify({"message":"User is already exists"})
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
    todolists = Todolist.query.get(id)
    if(request.method == 'POST'):
        name = request.json['name']
        date = request.json['date']
        task_one = Task(name = name, date = date, user_id = current_user.id, todolist_id = todolists.id)
        task_exist = Task.query.filter_by(name = name).first()
        if(task_exist):
            return jsonify({"message":"Task already exists"})
        else:
            db.session.add(task_one)
            db.session.commit()
            return jsonify({"message":"Task added"})
    
    if(request.method == 'GET'):
        tasks = todolists.tasks
        task_ = []
        for task in tasks:
            task_.append(dict(name = task.name, date = task.date, status = task.status))
        return jsonify(task_)


@app.route('/guest',methods=['GET'])  
def guest():
    todolist= Todolist.query.filter_by(privacy="public")
    todolists =[]
    for list in todolist:
        todolists.append(dict(name=list.name, user_id = list.id))
    return jsonify(todolists)


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
    print(password)
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
                        "accessToken": accessToken})
    return jsonify({"error":"Password is incorrect"}),401
   

@app.route('/todolist', methods = ['POST', 'GET'])
@auth_middleware()
def addtodolist(current_user):
    # print(current_user)
    if(request.method == 'POST'):
        name = request.json['name']
        privacy = request.json['privacy']
        todolist = Todolist(name = name, user_id = current_user.id, privacy = privacy)
        # print (todolist)
        todo_list = Todolist.query.filter_by(name = name).first()
        if(todo_list and current_user.id == todo_list.id):
            return jsonify({"error": "Todo List already exists"}),409
        else:
            db.session.add(todolist)
            db.session.commit()
            return jsonify({"message": "Todo List Added"}),200
    
    if (request.method == 'GET'):        
        todolists = current_user.todolists
        todolists_ = []
        for todolist in todolists:
            todolists_.append(dict(name = todolist.name, user_id = todolist.user_id ))
        return jsonify(todolists_)




