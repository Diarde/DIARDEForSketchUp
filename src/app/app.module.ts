import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ToolGuard } from './tool/tool.guard';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SelectorComponent } from './tool/selector/selector.component';
import { ProjectComponent } from './tool/selector/project/project.component';
import { RoomComponent } from './tool/selector/room/room.component';
import { GeometryComponent } from './tool/selector/geometry/geometry.component';
import { ProjectService } from './tool/services/project.service';
import { ProjectloadService } from './tool/services/projectload.service';
import { ImageComponent } from './tool/selector/image/image.component';
import { RevisionComponent } from './tool/selector/revision/revision.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SelectorComponent,
    ProjectComponent,
    RoomComponent,
    GeometryComponent,
    ImageComponent,
    RevisionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    HttpClientModule,
    MatInputModule,
    NoopAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule
  ],
  providers: [ToolGuard, ProjectService,
    ProjectloadService],
  bootstrap: [AppComponent]
})

export class AppModule { }
