import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { PageViewComponent } from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityViewComponent } from './views/entity-view/entity-view.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	{path: 'stranka/:id',component: EntityListComponent},
	{path: 'seznam/ministerstva',component: EntityListComponent, data: {type:"ministry"}},
	{path: 'seznam/obce',component: EntityListComponent, data: {type:"municipality"}}
];

export const routing = RouterModule.forRoot(appRoutes);