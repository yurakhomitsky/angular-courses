import { inject, InjectionToken } from '@angular/core';
import { ENV_CONFIGURATION } from './environment-configuration.token';

export const BASE_PATH = new InjectionToken<string>('basePath', {
	providedIn: 'root',
	factory: () => {
		const environment = inject(ENV_CONFIGURATION);

		return `${environment.host}/${environment.version}`;
	}
});
