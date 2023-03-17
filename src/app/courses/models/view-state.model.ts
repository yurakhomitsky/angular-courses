export interface ViewStateModel<T> {
	isLoading: boolean;
	error?: string;
	data: T | null;
}
