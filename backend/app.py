import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from models import db, User, Book

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pagely.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'cozy-secret-key'

db.init_app(app)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Usuário já existe"}), 400
    user = User(username=data['username'], password_hash=generate_password_hash(data['password']))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Sucesso"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        session['user_id'] = user.id
        return jsonify({"id": user.id, "username": user.username})
    return jsonify({"error": "Falha no login"}), 401

@app.route('/api/books', methods=['GET', 'POST'])
def handle_books():
    uid = session.get('user_id')
    if not uid: return jsonify({"error": "Não autorizado"}), 401
    
    if request.method == 'POST':
        data = request.json
        new_book = Book(
            user_id=uid, title=data['title'], author=data['author'],
            rating=data.get('rating', 0), status=data.get('status', 'Lendo'),
            date_added=datetime.now().strftime('%d/%m/%Y')
        )
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"id": new_book.id}), 201
    
    books = Book.query.filter_by(user_id=uid).all()
    return jsonify([{'id': b.id, 'title': b.title, 'author': b.author, 'rating': b.rating, 'status': b.status, 'date_added': b.date_added} for b in books])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)