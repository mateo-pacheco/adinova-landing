import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Diseno } from './pages/diseno/diseno';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'diseno', component: Diseno}
];
