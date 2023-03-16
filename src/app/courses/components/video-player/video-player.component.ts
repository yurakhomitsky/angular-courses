import {
	ChangeDetectionStrategy,
	Component,
	ElementRef, EventEmitter,
	Input, NgZone, OnChanges,
	OnDestroy,
	OnInit, Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import videojs from 'video.js';

@Component({
	selector: 'app-video-player',
	templateUrl: './video-player.component.html',
	styleUrls: ['./video-player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent implements OnChanges, OnInit, OnDestroy {
	@Input() public src = '';
	@Input() public currentTime = 0;

	@Output() public timeWatch = new EventEmitter<number>();

	@ViewChild('videoPlayer', { static: true }) public videoPlayer!: ElementRef;

	private player!: ReturnType<typeof videojs>;

	constructor(private ngZone: NgZone) {
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.player) {
			console.log(changes);
			if (changes['src']?.currentValue) {
				this.player.src(changes['src'].currentValue);
			}

			if (changes['currentTime']?.currentValue != null) {
				this.player.currentTime(changes['currentTime']?.currentValue);
			}
		}

	}

	public ngOnInit(): void {
		this.initVideoJs();
	}

	public ngOnDestroy(): void {
		if (this.player) {
			this.player.dispose();
		}
	}

	private initVideoJs(): void {
		const options: typeof videojs.options = {
			controls: true,
			autoplay: false,
			preload: 'auto',
			sources: [{
				src: this.src,
				type: 'application/x-mpegURL'
			}
			]
		};

		this.ngZone.runOutsideAngular(() => {
			this.player = videojs(this.videoPlayer.nativeElement, options, () => {
				// Set the initial time
				this.player.currentTime(this.currentTime);
			});

			this.player.player().on('timeupdate', () => {
				this.timeWatch.emit(this.player.currentTime());
			});
		});
	}
}
