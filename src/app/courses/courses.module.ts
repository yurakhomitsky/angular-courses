import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseComponent } from './course/course.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { DurationPipe } from './pipes/duration.pipe';

const routes: Routes = [
  { path: 'courses', pathMatch: 'full', component: CoursesComponent },
  { path: 'courses/:id', component: CourseComponent }
];

@NgModule({
  declarations: [
    CoursesComponent,
    CourseComponent,
    VideoPlayerComponent,
    DurationPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    MatInputModule
  ],
  exports: [RouterModule]
})
export class CoursesModule { }