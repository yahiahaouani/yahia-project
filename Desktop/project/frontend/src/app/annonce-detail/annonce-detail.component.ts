import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-annonce-detail',
  templateUrl: './annonce-detail.component.html',
  styleUrls: ['./annonce-detail.component.scss']
})
export class AnnonceDetailComponent implements OnInit {

  annonceId!: number;
  annonce: any = null;
  isLoading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.annonceId = +idStr;
        this.loadAnnonceDetails();
      } else {
        this.errorMsg = 'Annonce non trouvée.';
        this.isLoading = false;
      }
    });
  }

  loadAnnonceDetails() {
    this.isLoading = true;

    this.http.post<any[]>(
      'http://localhost:5000/api/annonces/by-ids',
      { ids: [this.annonceId] }).subscribe({
      next: (data) => {
        if (data.length > 0) {
          const a = data[0];
          // Préfixer les URLs des photos si besoin
          a.photos = a.photos.map((p: string) =>
            p.startsWith('http') ? p : `http://localhost:5000${p}`
          );
          this.annonce = a;
        } else {
          this.errorMsg = 'Annonce introuvable.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Erreur lors du chargement de l\'annonce.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
