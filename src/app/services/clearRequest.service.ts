import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class clearRequest {
  private cancelPendingRequests$ = new Subject<void>()
  private cancelPendingRequestsCurves$ = new Subject();
  private cancelPendingRequestsAltasStatistics$ = new Subject();

  constructor() { }

  /** Cancels all pending Http requests. */
  public cancelPendingRequests() {
    this.cancelPendingRequests$.next()
  }

  public onCancelPendingRequests() {
    return this.cancelPendingRequests$.asObservable()
  }

  /** Cancels curves pending Http requests. */
  public cancelPendingRequestsCurves() {
    this.cancelPendingRequestsCurves$.next()
  }

  public onCancelPendingRequestsCurves() {
    return this.cancelPendingRequestsCurves$.asObservable()
  }

  /** Cancels altas statistics pending Http requests. */
  public cancelPendingRequestsAltasStatistics() {
    this.cancelPendingRequestsAltasStatistics$.next()
  }

  public onCancelPendingRequestsAltasStatistics() {
    return this.cancelPendingRequestsAltasStatistics$.asObservable()
  }

  
}