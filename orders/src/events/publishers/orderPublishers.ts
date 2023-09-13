import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  Subject,
  BasePublisher,
} from '@jjaramillom-tickets/common';

export class OrderCreatedEventPublisher extends BasePublisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}

export class OrderCancelledEventPublisher extends BasePublisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}
