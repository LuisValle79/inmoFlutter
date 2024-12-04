import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppComponent } from './app.component';
import { PersonComponent } from './admin/Usuarios/person/person.component';
import { PersonInactivosComponent } from './admin/Usuarios/person-inactivos/person-inactivos.component';


const routes: Routes = [

  {path: 'Person/for', component: PersonComponent},
  {path: 'Person/for/:id', component: PersonComponent},
  {path: '', redirectTo: '/Person', pathMatch: 'full'},
  {
    path: 'Person',
    component: PersonComponent,
  },
  {
    path: 'inactivos-p',
    component: PersonInactivosComponent,
  },
  {
    path: 'Home',
    component: HomeComponent,
  },
  {
    path: 'Footer',
    component: FooterComponent,
  },
  {
    path: 'App',
    component: AppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
