import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  categories = ['Maison', 'Appartement', 'Magasin', 'Meuble', 'Décoration'];
  annonces: any[] = [];
  annoncesFiltrees: any[] = [];
  user: any = null;

  // Filtres & recherche
  filtreCategorie: string = '';
  filtreVille: string = '';
  filtrePrixMax: number | null = null;
  rechercheTexte: string = '';

  afficherFormulaire = false;
  hover = false;

  newAnnonce = {
    titre: '',
    description: '',
    prix: null as number | null,
    ville: '',
    region: '',
    categorie: '',
    telephone: ''
  };

  photosFichiers: File[] = [];

  constructor(public router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.loadUser().subscribe(res => {
      this.user = res.user;
      this.loadAnnonces();
    });
  }

  loadAnnonces() {
    // Appel API pour récupérer les annonces filtrées côté backend (à adapter selon backend)
    let params: any = {};

    if (this.filtreCategorie) params.categorie = this.filtreCategorie;
    if (this.filtreVille) params.ville = this.filtreVille;
    if (this.filtrePrixMax != null) params.prix_max = this.filtrePrixMax;
    if (this.rechercheTexte) params.q = this.rechercheTexte;

    this.http.get<any[]>('http://localhost:5000/api/annonces', { params })
      .subscribe(data => {
        this.annonces = data.map(a => {
          const photosUrl = a.photos.map((p: string) => {
            if (p.startsWith('http')) return p;
            return `http://localhost:5000${p}`;
          });
          return { ...a, photos: photosUrl, favori: false };
        });

        if (this.user) {
          this.http.get<number[]>(`http://localhost:5000/api/favorites/${this.user.id}`).subscribe(favs => {
            this.annonces.forEach(ann => {
              ann.favori = favs.includes(ann.id);
            });
            this.appliquerFiltres();
          });
        } else {
          this.appliquerFiltres();
        }
      });
  }

  appliquerFiltres() {
    // Si filtres sont déjà appliqués côté backend, ici c'est pour le cas où on filtre en plus localement (optionnel)
    this.annoncesFiltrees = this.annonces.filter(a => {
      const matchCategorie = this.filtreCategorie ? a.categorie === this.filtreCategorie : true;
      const matchVille = this.filtreVille ? a.ville === this.filtreVille : true;
      const matchPrix = this.filtrePrixMax != null ? a.prix <= this.filtrePrixMax : true;
      const matchRecherche = this.rechercheTexte ?
        (a.titre.toLowerCase().includes(this.rechercheTexte.toLowerCase()) ||
         a.description.toLowerCase().includes(this.rechercheTexte.toLowerCase())) : true;

      return matchCategorie && matchVille && matchPrix && matchRecherche;
    });
  }

  onChercher() {
    this.loadAnnonces();
  }

  allerMesFavoris() {
    if (!this.authService.isAuthenticated()) {
      alert('Veuillez vous connecter pour voir vos favoris.');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/favoris']);
  }

  logout() {
  this.authService.logout();
  this.user = null;
  this.router.navigate(['/']);
}


  deposerAnnonce() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/deposer-annonce']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleFavori(annonce: any) {
    if (!this.user) {
      alert('Veuillez vous connecter pour ajouter un favori.');
      this.router.navigate(['/login']);
      return;
    }

    if (!annonce.favori) {
      this.http.post('http://localhost:5000/api/favorites', { annonce_id: annonce.id }).subscribe({
        next: () => {
          annonce.favori = true;
        },
        error: () => {
          alert('Erreur lors de l\'ajout en favori');
        }
      });
    } else {
      this.http.delete(`http://localhost:5000/api/favorites/${annonce.id}`).subscribe({
        next: () => {
          annonce.favori = false;
        },
        error: () => {
          alert('Erreur lors de la suppression du favori');
        }
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.photosFichiers = Array.from(event.target.files);
    }
  }

  submitAnnonce() {
    const user = this.authService.getUser();
    if (!user) {
      alert("Vous devez être connecté.");
      return;
    }

    if (!this.newAnnonce.titre || !this.newAnnonce.description || !this.newAnnonce.prix ||
      !this.newAnnonce.ville || !this.newAnnonce.region || !this.newAnnonce.categorie ||
      !this.newAnnonce.telephone) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.newAnnonce.titre);
    formData.append('description', this.newAnnonce.description);
    formData.append('prix', this.newAnnonce.prix!.toString());
    formData.append('ville', this.newAnnonce.ville);
    formData.append('region', this.newAnnonce.region);
    formData.append('categorie', this.newAnnonce.categorie);
    formData.append('telephone', this.newAnnonce.telephone);
    formData.append('user_id', user.id.toString());

    this.photosFichiers.forEach(file => {
      formData.append('photos', file, file.name);
    });

    this.http.post('http://localhost:5000/api/annonces', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
          alert('Annonce publiée avec succès !');
          this.afficherFormulaire = false;
          this.newAnnonce = {
            titre: '',
            description: '',
            prix: null,
            ville: '',
            region: '',
            categorie: '',
            telephone: ''
          };
          this.photosFichiers = [];
          this.loadAnnonces();
        }
      }, error => {
        alert('Erreur lors de la publication de l\'annonce');
      });
  }

  allerDetail(annonce: any) {
    this.router.navigate(['/annonce', annonce.id]);
  }
}
