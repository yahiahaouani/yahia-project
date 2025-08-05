from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import jwt
from functools import wraps
import pymysql

# Initialisation
pymysql.install_as_MySQLdb()
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Important pour gérer les credentials avec CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/vente'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key'  # à sécuriser en prod
db = SQLAlchemy(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Décorateur JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            if bearer.startswith("Bearer "):
                token = bearer.split(" ")[1]

        if not token:
            return jsonify({'message': 'Token manquant'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except Exception:
            return jsonify({'message': 'Token invalide'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# Modèles
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Annonce(db.Model):
    __tablename__ = 'annonces'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    titre = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    prix = db.Column(db.Float, nullable=False)
    ##vlle = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    categorie = db.Column(db.String(50), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    photos = db.relationship('Photo', backref='annonce', lazy=True)

class Photo(db.Model):
    __tablename__ = 'photos'
    id = db.Column(db.Integer, primary_key=True)
    annonce_id = db.Column(db.Integer, db.ForeignKey('annonces.id'), nullable=False)
    chemin = db.Column(db.String(255))

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    annonce_id = db.Column(db.Integer, nullable=False)
    date_ajout = db.Column(db.DateTime, default=datetime.utcnow)

# Authentification
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    nom = data.get('nom')
    username = data.get('username')
    password = data.get('password')

    if not nom or not username or not password:
        return jsonify({'message': 'Tous les champs sont requis'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': "Nom d'utilisateur déjà pris"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(nom=nom, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Inscription réussie'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        token = jwt.encode({'user_id': user.id}, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token, 'user': {'id': user.id, 'nom': user.nom, 'username': user.username}})

    return jsonify({'message': 'Nom d\'utilisateur ou mot de passe incorrect'}), 401

@app.route('/api/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({'user': {'id': current_user.id, 'nom': current_user.nom, 'username': current_user.username}})

# Annonces avec filtres GET
@app.route('/api/annonces', methods=['GET'])
def get_annonces():
    categorie = request.args.get('categorie')
    region = request.args.get('region')
    prix_max = request.args.get('prix_max', type=float)
    q = request.args.get('q')  # recherche texte

    query = Annonce.query

    if categorie:
        query = query.filter(Annonce.categorie == categorie)
    if region :
        query = query.filter(Annonce.region == region)
    if prix_max is not None:
        query = query.filter(Annonce.prix <= prix_max)
    if q:
        like_pattern = f"%{q.lower()}%"
        query = query.filter(
            db.or_(
                Annonce.titre.ilike(like_pattern),
                Annonce.description.ilike(like_pattern)
            )
        )

    annonces = query.all()
    result = []
    for a in annonces:
        result.append({
            'id': a.id,
            'titre': a.titre,
            'description': a.description,
            'prix': a.prix,
            'region': a.region,
            'categorie': a.categorie,
            'telephone': a.telephone,
            'date_creation': a.date_creation.isoformat(),
            'photos': [f'/uploads/{os.path.basename(p.chemin)}' for p in a.photos]
        })
    return jsonify(result)

@app.route('/api/annonces/by-ids', methods=['POST'])
def get_annonces_by_ids():
    data = request.json
    ids = data.get('ids', [])
    if not ids:
        return jsonify([])

    annonces = Annonce.query.filter(Annonce.id.in_(ids)).all()
    result = []
    for a in annonces:
        result.append({
            'id': a.id,
            'titre': a.titre,
            'description': a.description,
            'prix': a.prix,
            'region': a.region,
            'categorie': a.categorie,
            'telephone': a.telephone,
            'date_creation': a.date_creation.isoformat(),
            'photos': [f'/uploads/{os.path.basename(p.chemin)}' for p in a.photos]
        })
    return jsonify(result)

@app.route('/api/annonces', methods=['POST'])
@token_required
def create_annonce(current_user):
    titre = request.form.get('titre')
    description = request.form.get('description')
    prix = request.form.get('prix')
    region = request.form.get('region')
    categorie = request.form.get('categorie')
    telephone = request.form.get('telephone')

    if not all([titre, description, prix, region, categorie, telephone]):
        return jsonify({'message': 'Tous les champs sont requis'}), 400

    try:
        prix = float(prix)
    except:
        return jsonify({'message': 'Prix invalide'}), 400

    annonce = Annonce(
        user_id=current_user.id,
        titre=titre,
        description=description,
        prix=prix,
        region=region,
        categorie=categorie,
        telephone=telephone
    )
    db.session.add(annonce)
    db.session.commit()

    photos = request.files.getlist('photos')
    for photo in photos:
        if photo and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            photo.save(filepath)
            new_photo = Photo(annonce_id=annonce.id, chemin=filepath)
            db.session.add(new_photo)
    db.session.commit()

    return jsonify({'message': 'Annonce créée avec succès', 'id': annonce.id})

@app.route('/api/annonces/user/<int:user_id>', methods=['GET'])
def get_annonces_by_user(user_id):
    annonces = Annonce.query.filter_by(user_id=user_id).all()
    result = [{
        'id': a.id,
        'titre': a.titre,
        'description': a.description,
        'prix': a.prix,
        'region': a.region,
        'categorie': a.categorie,
        'telephone': a.telephone,
        'date_creation': a.date_creation.isoformat(),
        'photos': [f'/uploads/{os.path.basename(p.chemin)}' for p in a.photos]
    } for a in annonces]
    return jsonify(result)

@app.route('/api/annonces/<int:annonce_id>', methods=['DELETE'])
@token_required
def delete_annonce(current_user, annonce_id):
    annonce = Annonce.query.get(annonce_id)
    if not annonce or annonce.user_id != current_user.id:
        return jsonify({'message': 'Non autorisé'}), 403

    photos = Photo.query.filter_by(annonce_id=annonce_id).all()
    for photo in photos:
        try:
            os.remove(photo.chemin)
        except Exception as e:
            print(f"Erreur suppression fichier: {e}")
        db.session.delete(photo)

    db.session.delete(annonce)
    db.session.commit()
    return jsonify({'message': 'Annonce supprimée'}), 200

# Favoris
@app.route('/api/favorites', methods=['GET'])
@token_required
def get_favorites(current_user):
    results = db.session.query(Favorite, Annonce).join(Annonce, Favorite.annonce_id == Annonce.id).filter(Favorite.user_id == current_user.id).all()
    favoris = [{
        'id': annonce.id,
        'titre': annonce.titre,
        'description': annonce.description,
        'prix': annonce.prix,
        'region': annonce.region,
        'categorie': annonce.categorie,
        'telephone': annonce.telephone,
        'date_creation': annonce.date_creation.isoformat(),
        'photos': [f'/uploads/{os.path.basename(photo.chemin)}' for photo in annonce.photos]
    } for fav, annonce in results]
    return jsonify(favoris)

@app.route('/api/favorites', methods=['POST'])
@token_required
def add_favorite(current_user):
    data = request.json
    annonce_id = data.get('annonce_id')
    if not annonce_id:
        return jsonify({'message': 'annonce_id manquant'}), 400

    if Favorite.query.filter_by(user_id=current_user.id, annonce_id=annonce_id).first():
        return jsonify({'message': 'Déjà en favori'}), 400

    fav = Favorite(user_id=current_user.id, annonce_id=annonce_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({'message': 'Favori ajouté'}), 201

@app.route('/api/favorites/<int:annonce_id>', methods=['DELETE'])
@token_required
def remove_favorite(current_user, annonce_id):
    fav = Favorite.query.filter_by(user_id=current_user.id, annonce_id=annonce_id).first()
    if not fav:
        return jsonify({'message': 'Favori non trouvé'}), 404

    db.session.delete(fav)
    db.session.commit()
    return jsonify({'message': 'Favori supprimé'}), 200

@app.route('/api/favorites/<int:user_id>', methods=['GET'])
def get_favorites_by_user(user_id):
    results = Favorite.query.filter_by(user_id=user_id).all()
    annonce_ids = [f.annonce_id for f in results]
    return jsonify(annonce_ids)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True)
