import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MatSelectModule } from '@angular/material/select';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './admin/Pages/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { PersonComponent } from './admin/Usuarios/person/person.component';
import { PersonInactivosComponent } from './admin/Usuarios/person-inactivos/person-inactivos.component';
import { PersonFormComponent } from './forms/person-form/person-form.component';
import { PersonService } from './services/person.services';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    PersonComponent,
    PersonInactivosComponent,
    PersonFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    OAuthModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatSelectModule,

  ],
  providers: [
    PersonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
