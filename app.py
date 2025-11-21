import os
from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, Float

# --- Configuração do App e SQLite ---

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui' # Mude esta chave em produção

# ⭐ Retorna ao SQLite. O banco de dados será um arquivo chamado 'pagely.db'
DATABASE_FILE = 'pagely.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_FILE}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Definição dos Modelos ORM ---

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    books = db.relationship('Book', backref='owner', lazy='dynamic')
    schedule_items = db.relationship('ScheduleItem', backref='owner', lazy='dynamic')

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    
    publication_year = db.Column(db.Integer)
    date_added = db.Column(db.String(10), nullable=False) 
    review = db.Column(db.Text)
    rating = db.Column(db.Float)
    date_finished = db.Column(db.String(10)) 
    is_favorite = db.Column(db.Boolean, default=False)
    
    # ⭐ CAMPO cover_icon
    cover_icon = db.Column(db.String(50), default='initial') 

    # ⭐ NOVO CAMPO: Status de Leitura
    status = db.Column(db.String(20), default='Lendo')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'publication_year': self.publication_year,
            'date_added': self.date_added,
            'review': self.review,
            'is_favorite': int(self.is_favorite), 
            'rating': self.rating,
            'date_finished': self.date_finished,
            'cover_icon': self.cover_icon,
            'status': self.status # Incluído no JSON
        }

class ScheduleItem(db.Model):
    __tablename__ = 'schedule'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity = db.Column(db.String(255), nullable=False)
    period = db.Column(db.String(50), nullable=False) 
    is_important = db.Column(db.Boolean, default=False)
    is_favorite = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'activity': self.activity,
            'period': self.period,
            'is_important': int(self.is_important), 
            'is_favorite': int(self.is_favorite)   
        }

# --- Funções de Inicialização e Usuário Padrão ---

def init_db():
    """Cria as tabelas no BD SQLite (se não existirem) e um usuário padrão."""
    with app.app_context():
        # Cria todas as tabelas definidas pelas classes Model
        db.create_all()
        
        # Cria um usuário padrão para facilitar o login, se a tabela estiver vazia
        if User.query.count() == 0:
            default_username = 'leitor'
            default_password = '123'
            password_hash = generate_password_hash(default_password)
            default_user = User(username=default_username, password_hash=password_hash)
            db.session.add(default_user)
            db.session.commit()
            print(f"Usuário padrão '{default_username}' criado no SQLite com senha '123'.")
        
# --- Funções de Autenticação e Rotas Principais ---

def get_current_user():
    user_id = session.get('user_id')
    if user_id is None:
        return None
    return User.query.get(user_id)

def login_required(f):
    def wrapper(*args, **kwargs):
        # ⭐ CORREÇÃO: Verifica se o usuário existe no DB ANTES de prosseguir
        user = get_current_user()
        if user is None:
            session.clear() # Limpa o cookie de sessão inválido
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

# --- ROTA DE REGISTRO ---
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # 1. Verifica se o usuário já existe
        if User.query.filter_by(username=username).first():
            return render_template('login.html', register_error="Usuário já existe. Escolha outro nome.", show_register=True)

        # 2. Cria o novo usuário
        password_hash = generate_password_hash(password)
        new_user = User(username=username, password_hash=password_hash)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            # Loga o novo usuário automaticamente
            session['user_id'] = new_user.id
            return redirect(url_for('pagely'))
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao registrar: {e}")
            return render_template('login.html', register_error="Erro inesperado ao registrar.", show_register=True)

    return render_template('login.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            return redirect(url_for('pagely'))
        else:
            return render_template('login.html', error="Usuário ou senha inválidos.")
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/')
@login_required
def pagely():
    # Agora temos a garantia que 'user' não é None, graças ao decorator.
    user = get_current_user() 
    return render_template('pagely.html', user_name=user.username)

# --- ROTAS API PARA BOOKS ---

@app.route('/api/books', methods=['GET'])
@login_required
def get_books():
    user_id = session['user_id']
    
    books = Book.query.filter_by(user_id=user_id).order_by(Book.date_added.desc()).all()
    
    return jsonify([b.to_dict() for b in books])

@app.route('/api/books', methods=['POST'])
@login_required
def add_book():
    user_id = session['user_id']
    data = request.json
    
    title = data.get('title')
    author = data.get('author')
    year = data.get('year') or None
    rating = data.get('rating') or None
    review = data.get('review', '')
    date_added = datetime.now().strftime('%Y-%m-%d')
    cover_icon = data.get('cover_icon', 'initial') 
    # ⭐ NOVO: Obtém o status, ou usa 'Lendo' como padrão
    status = data.get('status', 'Lendo')
    
    if not title or not author:
        return jsonify({"error": "Título e autor são obrigatórios"}), 400
    
    try:
        new_book = Book(
            user_id=user_id, 
            title=title, 
            author=author, 
            publication_year=year, 
            date_added=date_added,
            review=review,
            rating=rating,
            cover_icon=cover_icon,
            status=status # Salva o novo campo
        )
        db.session.add(new_book)
        db.session.commit()
        
        return jsonify({"message": "Livro adicionado com sucesso", "id": new_book.id}), 201
        
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"error": "Erro inesperado ao salvar livro."}), 500

@app.route('/api/books/<int:book_id>', methods=['PUT'])
@login_required
def update_book(book_id):
    user_id = session['user_id']
    data = request.json
    
    book = Book.query.filter_by(id=book_id, user_id=user_id).first()
    if not book:
        return jsonify({"error": "Livro não encontrado ou não autorizado"}), 404
    
    # Atualiza data de finalização, rating, e ícone
    if 'date_finished' in data:
        book.date_finished = data['date_finished'] if data['date_finished'] else None
    
    if 'rating' in data:
        book.rating = data['rating'] if data['rating'] is not None else None
    
    if 'cover_icon' in data:
        book.cover_icon = data['cover_icon'] 

    # ⭐ NOVO: Permite atualizar o status
    if 'status' in data:
        book.status = data['status']
        
    try:
        db.session.commit()
        return jsonify({"message": "Livro atualizado com sucesso"}), 200
        
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"error": "Erro ao atualizar livro."}), 500

# --- ROTAS API PARA SCHEDULE (Cronograma) ---
# ... (Nenhuma alteração nas rotas de Cronograma)
@app.route('/api/schedule', methods=['GET'])
@login_required
def get_schedule():
    user_id = session['user_id']
    
    items = ScheduleItem.query.filter_by(user_id=user_id).order_by(
        ScheduleItem.is_important.desc(), ScheduleItem.id.desc()
    ).all()
    
    return jsonify([i.to_dict() for i in items])
    
# Rotas POST, PUT, DELETE do Schedule (Cruciais para o widget funcionar)

@app.route('/api/schedule', methods=['POST'])
@login_required
def add_schedule_item():
    user_id = session['user_id']
    data = request.json
    
    activity = data.get('activity')
    period = data.get('period')
    is_important = data.get('is_important', 0) == 1
    is_favorite = data.get('is_favorite', 0) == 1
    
    if not activity or not period:
        return jsonify({"error": "Atividade e período são obrigatórios"}), 400
    
    try:
        new_item = ScheduleItem(
            user_id=user_id, 
            activity=activity, 
            period=period, 
            is_important=is_important, 
            is_favorite=is_favorite
        )
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({"message": "Atividade adicionada com sucesso", "id": new_item.id}), 201
        
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"error": "Erro ao salvar atividade."}), 500

@app.route('/api/schedule/<int:item_id>', methods=['GET'])
@login_required
def get_schedule_item(item_id):
    user_id = session['user_id']
    
    item = ScheduleItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "Item não encontrado"}), 404
        
    return jsonify(item.to_dict())

@app.route('/api/schedule/<int:item_id>', methods=['PUT'])
@login_required
def update_schedule_item(item_id):
    user_id = session['user_id']
    data = request.json
    
    item = ScheduleItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "Item não encontrado ou não autorizado"}), 404

    item.activity = data.get('activity', item.activity)
    item.period = data.get('period', item.period)
    if 'is_important' in data:
        item.is_important = data['is_important'] == 1
    if 'is_favorite' in data:
        item.is_favorite = data['is_favorite'] == 1
        
    try:
        db.session.commit()
        return jsonify({"message": "Atividade atualizada com sucesso"}), 200
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"error": "Erro ao atualizar atividade."}), 500

@app.route('/api/schedule/<int:item_id>', methods=['DELETE'])
@login_required
def delete_schedule_item(item_id):
    user_id = session['user_id']
    
    item = ScheduleItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "Item não encontrado ou não autorizado"}), 404
        
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Atividade excluída com sucesso"}), 200
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"error": "Erro ao excluir atividade."}), 500

# --- ROTAS API PARA METRICS (Métricas) ---

@app.route('/api/metrics', methods=['GET'])
@login_required
def get_metrics():
    user_id = session['user_id']
    
    try:
        # 1. Progresso Mensal (Contagem de livros finalizados este mês)
        current_month = datetime.now().strftime('%Y-%m')
        
        # O LIKE do SQLAlchemy é usado para buscar por string (SQLite)
        progress_mensal_count = db.session.query(func.count(Book.id)).filter(
            Book.user_id == user_id,
            Book.date_finished.like(f'{current_month}%')
        ).scalar() or 0

        # 2. Performance Anual (Média de avaliação)
        performance_anual_avg = db.session.query(
            func.avg(Book.rating).cast(Float) 
        ).filter(
            Book.user_id == user_id,
            Book.rating.isnot(None)
        ).scalar()
        
        performance_anual_avg = performance_anual_avg if performance_anual_avg is not None else 0.0
        
        return jsonify({
            "progress_mensal_count": progress_mensal_count,
            "performance_anual": round(performance_anual_avg, 1)
        })
        
    except Exception as e:
        print(f"Database Error in Metrics: {e}")
        return jsonify({"error": "Erro ao calcular métricas."}), 500


if __name__ == '__main__':
    # Inicializa o BD (cria tabelas e usuário padrão) antes de rodar o app
    # ⭐ É NECESSÁRIO DELETAR pagely.db e recriar para que a coluna 'status' seja adicionada!
    init_db() 
    app.run(debug=True, port=8000)