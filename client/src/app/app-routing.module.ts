import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { MapListComponent } from './map-list/map-list.component';
import { MapViewComponent } from './map-view/map-view.component';
import { NewMapComponent } from './new-map/new-map.component';
import { ActiveMatchesComponent } from './active-matches/active-matches.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'users', component: UserListComponent },
  { path: 'maps', component: MapListComponent },
  { path: 'maps/:id', component: MapViewComponent },
  { path: 'newmap', component: NewMapComponent },
  { path: 'games', component: ActiveMatchesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
