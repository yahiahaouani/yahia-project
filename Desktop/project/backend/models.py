from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# 👤 Utilisateur
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)

    annonces = db.relationship('Annonce', backref='user', lazy=True)

# 📢 Annonce
class Annonce(db.Model):
    __tablename__ = 'annonces'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    titre = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    prix = db.Column(db.Numeric(10, 2), nullable=False)
    ville = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    categorie = db.Column(db.String(50), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    photos = db.relationship('Photo', backref='annonce', lazy=True)

# 🖼️ Photo
class Photo(db.Model):
    __tablename__ = 'photos'
    id = db.Column(db.Integer, primary_key=True)
    annonce_id = db.Column(db.Integer, db.ForeignKey('annonces.id'), nullable=False)
    chemin = db.Column(db.String(255), nullable=False)
