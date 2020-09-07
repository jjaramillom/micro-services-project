# Ticketing App Micro-services Udemy course

This project is developed to have the following functionalities:

- Users can list a ticket for an event (concert, sports) for sale
- Other users can purchase this ticket
- Any user can list tickets for sale and purchase tickets
- When a user attempts to purchase a ticket, it is 'locked' for X time. If the users does not enter their payment info, the ticket is released
- While locked, no other user can purchase the ticket
- Ticket prices can be edited if they are not locked

## Data Types:

### User

|   Name   |  Type  |
| :------: | :----: |
|  email   | string |
| password | string |

---

### Ticket

|  Name   |     Type     |
| :-----: | :----------: |
|  title  |    string    |
|  price  |    number    |
| userId  | ref to User  |
| orderId | ref to Order |

---

### User

|   Name    |          Type          |
| :-------: | :--------------------: |
|  userId   |      ref to User       |
|  status   | order status Interface |
| ticketId  |     ref to Ticket      |
| expiresAt |          Date          |

---

### Order

|      Name      |          Type           |
| :------------: | :---------------------: |
|    orderId     |      ref to Order       |
|     status     | charge status Interface |
|     amount     |         number          |
|    stripeId    |         string          |
| stripeRefundId |         string          |

---

## Services:

- **Authentication**: Everything related to user signup/signing/signout
- **Tickets**: Ticket creation/editing. Knows whether a ticket can be updated
- **Orders**: Order creation/editing
- **Expiration**: Watches for orders to be created, cancels them after X Time
- **Payments**: Handles credit card payments. Cancels orders if payment fails. Completes if payment succeeds

## Events

- **User Created**
- **User Updated**
- **Order Created**
- **Order Cancelled**
- **Order Expired**
- **Ticket Created**
- **Ticket Updated**
- **Charge Created**