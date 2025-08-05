import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-annonces',
  templateUrl: './mes-annonces.component.html',
  styleUrls: ['./mes-annonces.component.scss']
})
export class MesAnnoncesComponent implements OnInit {
  annonces: any[] = [];
  user: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.loadUser().subscribe(res => {
      this.user = res.user;
      if (this.user) {
        this.loadUserAnnonces();
      }
    });
  }

  loadUserAnnonces() {
    this.http.get<any[]>(`http://localhost:5000/api/annonces/user/${this.user.id}`)
      .subscribe(data => {
        this.annonces = data.map(a => ({
          ...a,
          photos: a.photos.map((p: string) =>
            p.startsWith('http') ? p : `http://localhost:5000${p}`
          )
        }));
      });
  }

  supprimerAnnonce(id: number) {
    if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      this.http.delete(`http://localhost:5000/api/annonces/${id}`)
        .subscribe(() => {
          this.annonces = this.annonces.filter(a => a.id !== id);
        });
    }
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

  voirDetail(annonce: any) {
    this.router.navigate(['/annonce', annonce.id]);
  }
}
