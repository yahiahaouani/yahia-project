import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeposerAnnonceComponent } from './deposer-annonce/deposer-annonce.component';
import { AnnonceDetailComponent } from './annonce-detail/annonce-detail.component';
import { MesAnnoncesComponent } from './mes-annonces/mes-annonces.component';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FavorisComponent} from './favoris/favoris.component' ;

// Ajoute d'autres composants si tu les ajoutes plus tard (ex: DéposerAnnonceComponent)

const routes: Routes = [
  { path: '', component: HomeComponent },            // Page d’accueil
  { path: 'login', component: LoginComponent }, 
  { path: 'favoris', component: FavorisComponent },     // Page de connexion
  { path: 'register', component: RegisterComponent }, 
  { path: 'mes-annonces', component: MesAnnoncesComponent },
  { path: 'annonce/:id', component: AnnonceDetailComponent },// Page d’inscription
  { path: 'deposer-annonce', component: DeposerAnnonceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
