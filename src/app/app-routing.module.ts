import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { AboutComponent } from './components/about/about.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
const routes : Routes = [
    {path: '', component:ContainerComponent},
    {path: 'calculator', component:ContainerComponent},
    {path: 'about', component:AboutComponent},
    {path: '**', component:ErrorPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}