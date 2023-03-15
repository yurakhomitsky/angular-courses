import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input, OnChanges,
  OnDestroy,
  OnInit,
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
export class VideoPlayerComponent  implements OnChanges, OnInit, OnDestroy {
  @Input() public src = '';

  @ViewChild('videoPlayer', { static: true }) public videoPlayer!: ElementRef;

  private player!: ReturnType<typeof videojs>

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']?.currentValue && this.player) {
      console.log(changes['src'].currentValue)
      this.player.src(changes['src'].currentValue);
    }
  }

  public ngOnInit(): void {
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
    this.player = videojs(this.videoPlayer.nativeElement, options)
  }

  public ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
