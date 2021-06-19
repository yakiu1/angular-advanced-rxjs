import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { interval, Observable, of, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit, OnDestroy {
  canStart: boolean = true;
  allTimes: string[] = [];
  curretnTime = 0;
  pauseTime = 0;
  toolBarControl = this.fb.control('stop');

  destroy$ = new Subject();
  recordTime$ = new Subject<string>();
  time$ = this.toolBarControl.valueChanges.pipe(
    tap(state => {
      if (state === 'record') {
        this.recordTime$.next(this.formatTime(this.curretnTime));
      }
    }),
    filter(state => state !== 'record'),
    switchMap((state: 'start' | 'pause' | 'stop') => {
      switch (state) {
        case 'start': {
          this.canStart = false;
          return interval(10).pipe(this.startTimer(this.pauseTime))
        }
        case 'pause': {
          this.canStart = true;
          this.pauseTime = this.curretnTime;
          return of(this.curretnTime)
        }
        default: {
          this.canStart = true;
          this.pauseTime = 0;
          return of(this.curretnTime);
        }
      }
    }),
    tap(time => { this.curretnTime = time }),
    map(time => this.formatTime(time)),
    startWith(this.formatTime(0)),
  )

  startTimer = (startTime: number) => (source: Observable<number>) => new Observable<number>(subscriber => {
    const subscription = source.subscribe({
      next: (value: number) => {
        subscriber.next(value + startTime)
      },
    });
    return subscription;
  });

  constructor(
    private fb: FormBuilder
  ) {
    this.recordTime$.pipe(takeUntil(this.destroy$)).subscribe(recordedTime => {
      this.allTimes.push(recordedTime);
    })
  }

  formatTime(time: number): string {
    return (time / 100).toLocaleString('en-US', { minimumFractionDigits: 2, minimumIntegerDigits: 3 }) + '';
  }

  ngOnInit(): void {

  }

  doStart(): void {
    this.toolBarControl.patchValue('start');
  }

  doPause(): void {
    this.toolBarControl.patchValue('pause');
  }

  doStop(): void {
    this.toolBarControl.patchValue('stop');
  }

  doRecord(): void {
    this.toolBarControl.patchValue('record');
  }

  doClear(): void {
    this.allTimes = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


