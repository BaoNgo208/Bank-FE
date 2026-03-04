import { Directive, ElementRef, Input, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[countUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit {
  @Input() countUp = 0;
  @Input() duration = 600;

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const startTime = performance.now();

    this.zone.runOutsideAngular(() => {
      const animate = (time: number) => {
        const progress = Math.min((time - startTime) / this.duration, 1);
        const value = +(this.countUp * progress).toFixed(2);

        this.el.nativeElement.innerText = value;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }
}
