# Ticketing App Micro-services Udemy course

#### To run the apps =>

1. Enable Kubernetes.

2. Install minikube

3. Install skaffold

   ```bash
   curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
   sudo install skaffold /usr/local/bin/
   ```

4. setup Ingress-Nginx

   ```bash
   minikube addons enable ingress
   ```

  <!--   ```bash
   kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.35.0/deploy/static/provider/cloud/deploy.yaml
   ```

   or

   ```bash
   kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
   ``` -->

5. Init the app with

   ```bash
     skaffold dev
   ```

6. Modify the hosts file in **/etc/hosts**. Add the following:

   ```
   127.0.0.1 ticketing.test
   ```

   It is important noting. The minikube IP address might be different. So check this via `minikube ip` and then change the `/etc/hosts` IP address to the returned value.

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
