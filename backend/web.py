from crypt import methods
from datetime import datetime
from email.policy import default
from flask import Flask,request,jsonify,flash
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

@app.route('/register',methods=['POST'])
def register():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    

    user  = Users(name = name, email = email, password= password)
    

    user_exists = Users.query.filter_by(email = email).first() 


    if(user_exists):
        return "user is already exists"
    else:
        
        db.session.add(user)
        db.session.commit()
        return "done"
    

    # x = cursor.execute("SELECT * FROM users WHERE email = ?", (email))
    # if int(len(x)) > 0:
    #             flash("That username is already taken, please choose another")
    


            
    

    

