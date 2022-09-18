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
    todolists = db.relationship("AddTodolist", back_populates = "user")

class AddTodolist(db.Model):
    __tablename__ = "todolists"
    id = db.Column(db.Integer, primary_key =True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    privacy = db.Column(db.String)
    user = db.relationship("Users", back_populates = "todolists")

def auth_middleware():
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = ""
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]
                print(request.headers)
                print (token)
            if not token:
                return {
                    "message": "Authentication Token is missing!", 
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            try:
                data=jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
                print(data)
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


@app.route('/guest',methods=['GET'])  
def guest():
    todolist= AddTodolist.query.filter_by(privacy="public")
    lis =[]
    for list in todolist:
        lis.append(dict(name=list.name, user_id = list.id))
    return jsonify(lis)


@app.route('/deletetodo',methods=['POST'])
@auth_middleware()
def deletetodo():
    if request.method == 'POST':
        id= request.json['id']
        print(id)
        todo = AddTodolist.query.get(id)
        print(todo)
        print(todo.name)
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
        return jsonify({"message":"Email doesn't exist",
                         "status": False})
    if check_password_hash(user.password, password):
        accessToken = jwt.encode({
            "user_id": user.id,
            "email": user.email
        }, app.config["JWT_SECRET_KEY"], algorithm="HS256")
        return jsonify({"message": "LoggedIn Successfully",
                        "status": True,
                        "accessToken": accessToken})
    return jsonify({"error":"Password is incorrect"})
   

@app.route('/addtodolist', methods = ['POST', 'GET'])
@auth_middleware()
def addtodolist(current_user):
    print(current_user)
    if(request.method == 'POST'):
        name = request.json['name']
        privacy = request.json['privacy']
        todolist = AddTodolist(name = name, user_id = current_user.id, privacy = privacy)
        print (todolist)
        todo_list = AddTodolist.query.filter_by(name = name).first()
        if(todo_list):
            return jsonify({"message": "Todo List already exists"})
        else:
            db.session.add(todolist)
            db.session.commit()

            return jsonify({"message": "Todo List Added"})
    
    if (request.method == 'GET'):        
        todolists = current_user    .todolists
        todolists_ = []
        for todolist in todolists:
            todolists_.append(dict(name = todolist.name, user_id = todolist.user_id ))
        return jsonify(todolists_)




