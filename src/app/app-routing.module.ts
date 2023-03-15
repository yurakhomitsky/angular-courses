import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
	{
		path: '', pathMatch: 'full', redirectTo: 'courses'
	},
	{

		path: '**', pathMatch: 'full', component: NotFoundPageComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
