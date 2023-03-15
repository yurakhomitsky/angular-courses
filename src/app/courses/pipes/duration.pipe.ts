import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {

	public transform(totalSeconds: number | null | undefined): string {
		if (!totalSeconds) {
			return '00:00';
		}

		if (totalSeconds < 0) {
			return '00:00';
		}

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		if (hours > 0) {
			return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
		} else {
			return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
		}
	}

	private padZero(number: number): string {
		return (number < 10 ? '0' : '') + number;
	}

}
