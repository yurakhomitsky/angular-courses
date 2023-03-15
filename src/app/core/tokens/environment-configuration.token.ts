import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface EnvironmentModel {
	host: string;
	version: string;
}

export const ENV_CONFIGURATION = new InjectionToken<EnvironmentModel>('ENV_CONFIGURATION', {
	providedIn: 'root',
	factory: () => {
		return environment
	}
});
