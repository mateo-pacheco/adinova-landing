import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Diseno } from './pages/diseno/diseno';
import { Legal } from './pages/legal/legal';
import { Construccion } from './pages/construccion/construccion';
import { Testimonios } from './pages/testimonios/testimonios';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'diseno', component: Diseno},
    {path: 'legal', component: Legal},
    {path: 'construccion', component: Construccion},
    {path: 'testimonios', component: Testimonios}
];
