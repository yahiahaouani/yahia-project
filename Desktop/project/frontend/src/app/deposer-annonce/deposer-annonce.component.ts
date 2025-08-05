import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-deposer-annonce',
  templateUrl: './deposer-annonce.component.html',
  styleUrls: ['./deposer-annonce.component.scss']
})
export class DeposerAnnonceComponent {

  afficherFormulaire = true;

  newAnnonce: {
    titre: string;
    description: string;
    prix: number | null;
   
    region: string;
    categorie: string;
    telephone: string;
  } = {
    titre: '',
    description: '',
    prix: null,
    region: '',
    categorie: '',
    telephone: ''
  };

  categories = ['Maison', 'Appartement', 'Magasin', 'Meuble', 'Décoration'];
  photos: File[] = [];
  previewUrls: string[] = [];

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const files = event.target.files;
    this.photos = Array.from(files);
    this.previewUrls = [];

    for (let file of this.photos) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  submitAnnonce() {
    if (!this.validateFields()) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.newAnnonce.titre);
    formData.append('description', this.newAnnonce.description);
    formData.append('prix', this.newAnnonce.prix !== null ? this.newAnnonce.prix.toString() : '');

    formData.append('region', this.newAnnonce.region);
    formData.append('categorie', this.newAnnonce.categorie);
    formData.append('telephone', this.newAnnonce.telephone);

    for (let file of this.photos) {
      formData.append('photos', file);
    }

    this.http.post('http://localhost:5000/api/annonces', formData).subscribe({
      next: () => {
        alert('Annonce publiée avec succès !');
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la publication de l\'annonce.');
      }
    });
  }

  validateFields(): boolean {
    return !!this.newAnnonce.titre &&
           !!this.newAnnonce.description &&
           this.newAnnonce.prix !== null &&
           
           !!this.newAnnonce.region &&
           !!this.newAnnonce.categorie &&
           !!this.newAnnonce.telephone;
  }

  resetForm() {
    this.newAnnonce = {
      titre: '',
      description: '',
      prix: null,
      region: '',
      categorie: '',
      telephone: ''
    };
    this.photos = [];
    this.previewUrls = [];
  }

  cancel() {
    this.resetForm();
    this.afficherFormulaire = false;
  }
}
