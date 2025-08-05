import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.scss']
})
export class FavorisComponent implements OnInit {

  favoris: any[] = [];
  user: any = null;
  isLoading = true;

  constructor(
    private http: HttpClient,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.loadUser().subscribe(res => {
      this.user = res.user;
      if (!this.user) {
        alert('Veuillez vous connecter pour accéder à vos favoris.');
        this.router.navigate(['/login']);
      } else {
        this.loadFavoris();
      }
    });
  }

  loadFavoris() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:5000/api/favorites').subscribe(favs => {
      this.favoris = favs.map(fav => {
        const photosUrl = fav.photos.map((p: string) => {
          if (p.startsWith('http')) return p;
          return `http://localhost:5000${p}`;
        });
        return { ...fav, photos: photosUrl, favori: true };
      });
      this.isLoading = false;
    }, err => {
      console.error('Erreur chargement favoris', err);
      this.isLoading = false;
    });
  }

  enleverFavori(annonce: any) {
    this.http.delete(`http://localhost:5000/api/favorites/${annonce.id}`).subscribe(() => {
      this.favoris = this.favoris.filter(fav => fav.id !== annonce.id);
    }, err => {
      alert('Erreur lors de la suppression du favori');
      console.error(err);
    });
  }

  allerDetail(annonce: any) {
    this.router.navigate(['/annonce', annonce.id]);
  }

  logout() {
  this.authService.logout();
  this.user = null;
  this.router.navigate(['/']);
}

}
