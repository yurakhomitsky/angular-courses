import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef, EventEmitter,
	Input, NgZone, OnChanges,
	OnDestroy,
	 Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import  Hls from 'hls.js';

@Component({
	selector: 'app-video-player',
	templateUrl: './video-player.component.html',
	styleUrls: ['./video-player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent implements OnChanges, AfterViewInit, OnDestroy {
	@Input() public src = '';
	@Input() public currentTime = 0;
	@Input() public poster = '';

	@Input() public muted = false;
	@Input() public controls = true;

	@Output() public timeWatch = new EventEmitter<number>();

	@ViewChild('videoPlayer') public videoPlayerElementRef!: ElementRef;

	public errorMessage = ''

	get videoPlayer(): HTMLVideoElement {
		return this.videoPlayerElementRef?.nativeElement;
	}

	private hls!: Hls;

	constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.videoPlayer && this.hls) {
			if (changes['src']?.currentValue) {
				this.loadVideo(changes['src'].currentValue);
				this.videoPlayer.play();
			}

			if (changes['currentTime']?.currentValue != null) {
				this.videoPlayer.currentTime = changes['currentTime'].currentValue;
			}
		}
	}

	public ngAfterViewInit(): void {
		this.initVideo();
	}

	public onTimeUpdated(): void {
		// We don't want to trigger change detection every when time gets updated
		// because it won't have any visual effect, the progress is calculated only when we switch the lesson
		this.ngZone.runOutsideAngular(() =>  {
			this.timeWatch.emit(this.videoPlayer.currentTime)
		})
	}

	public ngOnDestroy(): void {
		if (this.hls) {
			this.hls.destroy();
		}
	}

	private initVideo(): void {
		if (Hls.isSupported() && this.src) {
			this.hls = new Hls();
			this.loadVideo(this.src);
			this.videoPlayer.currentTime = this.currentTime;

			this.hls.on(Hls.Events.ERROR, (event, data) => {
				this.errorMessage = 'Error while loading media:' + data.type + data.details
				this.hls.detachMedia();
				this.cd.markForCheck();
			});
		}
	}

	private loadVideo(src: string): void {
		this.errorMessage = '';
		this.hls.detachMedia();
		this.hls.loadSource(src);

		this.hls.attachMedia(this.videoPlayer);
		this.cd.markForCheck();
	}
}
