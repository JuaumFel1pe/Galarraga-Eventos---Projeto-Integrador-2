import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideCharts(withDefaultRegisterables()), provideHttpClient()
  ],
};
