import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryObserverService {
  private breakpointObserver = inject(BreakpointObserver);

  // Media query oberver for break points
  mediaQuery(): Observable<string> {
    const displayNameMap = new Map([
      [Breakpoints.XSmall, 'XSmall'],
      [Breakpoints.Small, 'Small'],
      [Breakpoints.Medium, 'Medium'],
      [Breakpoints.Large, 'Large'],
      [Breakpoints.XLarge, 'XLarge'],
    ]);

    return this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((breakPointState: BreakpointState) => {
          let breakpoint = '';
          for (const query of Object.keys(breakPointState.breakpoints)) {
            if (breakPointState.breakpoints[query]) {
              breakpoint = displayNameMap.get(query) ?? 'Unknown';
            }
          }
          return breakpoint;
        })
      );
  }
}
