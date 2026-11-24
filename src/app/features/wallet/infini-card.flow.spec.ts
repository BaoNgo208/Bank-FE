import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InfiniFundingFlow } from './services/infini-card.service';
import { CardCreationStore } from './stores/card-creation.store';
import { InfiniFundingResponse } from './types/infini-card.type';

const url = (end: string) => (req: { url: string }) => req.url.endsWith(end);

describe('Infini card flows', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: { success: vi.fn(), error: vi.fn(), info: vi.fn() } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  const input = { name: 'Card', holderName: 'JACK LACZ', amount: 10 };
  const order = (request_id: string, status: string) => ({
    data: {
      request_id,
      status,
      provider: 'INFINI',
      card_id: null,
      amount: 10,
      fee: 1,
      total_debit: 11,
    },
  });

  it('polls a pending creation until it succeeds', () => {
    const store = TestBed.inject(CardCreationStore);
    store.submit(input);
    const post = http.expectOne(url('/wallet/create-card'));
    const id = post.request.body.requestId;
    post.flush(order(id, 'PENDING'));
    vi.advanceTimersByTime(0);
    http.expectOne(url(`/card-creation/${id}`)).flush(order(id, 'PENDING'));
    vi.advanceTimersByTime(2500);
    http.expectOne(url(`/card-creation/${id}`)).flush(order(id, 'SUCCEEDED'));

    expect(store.polling()).toBe(false);
    expect(store.completed()).toBe(1);
    expect(sessionStorage.length).toBe(0);
    vi.advanceTimersByTime(10000);
  });

  it('reuses the request ID when the same creation is retried after a lost response', () => {
    const store = TestBed.inject(CardCreationStore);
    store.submit(input);
    const first = http.expectOne(url('/wallet/create-card'));
    const id = first.request.body.requestId;
    first.error(new ProgressEvent('error'));
    vi.advanceTimersByTime(0);
    http.expectOne(url(`/card-creation/${id}`)).flush({}, { status: 404, statusText: 'x' });

    store.submit(input);
    const second = http.expectOne(url('/wallet/create-card'));
    expect(second.request.body.requestId).toBe(id);
    second.flush(order(id, 'SUCCEEDED'));
  });

  it('uses a new request ID after a definite rejection', () => {
    const store = TestBed.inject(CardCreationStore);
    store.submit(input);
    const first = http.expectOne(url('/wallet/create-card'));
    first.flush({ message: 'no' }, { status: 400, statusText: 'x' });
    expect(store.error()).toBe('no');

    store.submit(input);
    const second = http.expectOne(url('/wallet/create-card'));
    expect(second.request.body.requestId).not.toBe(first.request.body.requestId);
    second.flush(order('x', 'FAILED'));
  });

  it('follows the running creation after a conflict', () => {
    const store = TestBed.inject(CardCreationStore);
    store.submit(input);
    http
      .expectOne(url('/wallet/create-card'))
      .flush(
        { message: 'pending', data: { request_id: 'other' } },
        { status: 409, statusText: 'x' },
      );
    vi.advanceTimersByTime(0);
    http.expectOne(url('/card-creation/other')).flush(order('other', 'SUCCEEDED'));
    expect(store.completed()).toBe(1);
  });

  it('asks for the result instead of sending a second top-up after a lost response', () => {
    const flow = TestBed.inject(InfiniFundingFlow);
    let result: InfiniFundingResponse | undefined;
    flow.run('topup', 9, 20).subscribe((r) => (result = r));
    const post = http.expectOne(url('/infini-cards/9/topup'));
    const id = post.request.body.requestId;
    post.error(new ProgressEvent('error'));
    http.expectOne(url(`/funding/${id}`)).flush({ data: { request_id: id, status: 'SUCCEEDED' } });
    expect(result?.status).toBe('SUCCEEDED');
  });

  it('returns the pending state after polling and keeps the request ID for a retry', () => {
    const flow = TestBed.inject(InfiniFundingFlow);
    let result: InfiniFundingResponse | undefined;
    flow.run('withdraw', 9, 20).subscribe((r) => (result = r));
    const post = http.expectOne(url('/infini-cards/9/withdraw'));
    const id = post.request.body.requestId;
    const pending = { data: { request_id: id, status: 'REVIEW_REQUIRED' } };
    post.flush(pending);
    for (let t = 0; t <= 30000; t += 3000) {
      vi.advanceTimersByTime(t === 0 ? 0 : 3000);
      http.match(url(`/funding/${id}`)).forEach((r) => r.flush(pending));
    }
    expect(result?.status).toBe('REVIEW_REQUIRED');

    let error: HttpErrorResponse | undefined;
    flow.run('withdraw', 9, 20).subscribe({ error: (e) => (error = e) });
    const retry = http.expectOne(url('/infini-cards/9/withdraw'));
    expect(retry.request.body.requestId).toBe(id);
    retry.flush({ message: 'no' }, { status: 400, statusText: 'x' });
    expect(error?.status).toBe(400);
  });
});
