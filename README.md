# 🏦 NeoBank – Frontend Banking Application (UI Only)

## 📌 Overview

**NeoBank** is a **frontend-only digital banking web application** built using **HTML, CSS, and Vanilla JavaScript**.

It simulates a real-world **fintech banking system**, including:

* Authentication
* Transactions
* Payments
* Account management

This project focuses on:

* Frontend architecture
* UI/UX design
* Banking workflow simulation

> ⚠️ Note: This is a UI-based simulation and does not include any real backend or financial processing.

---

## 🚀 Key Features

* Simulated login & OTP authentication
* Interactive dashboard with account insights
* Transaction and payment flows
* Card management UI
* Notifications system
* Profile & settings management
* localStorage-based state handling

---

## 🏗️ System Architecture

NeoBank follows a **modular multi-page architecture**:

* Each feature has a dedicated HTML page
* Shared global CSS for styling
* Modular JavaScript files
* Application state managed via `localStorage`

---

## 🧱 Architecture Layers

### 🔹 UI Layer

* HTML (structure)
* CSS (layout, styling, responsiveness)

### 🔹 Logic Layer

* JavaScript handles:

  * Authentication simulation
  * Payment flows
  * UI updates

### 🔹 Data Layer

* `localStorage` acts as:

  * Session manager
  * Mock database

---

## 🔐 Authentication Module

### Features

* Login & Signup pages
* OTP verification system
* Session persistence

### Flow

1. User enters email & password
2. System validates (mock logic)
3. Random 6-digit OTP generated
4. OTP stored in `localStorage`
5. On success → Redirect to dashboard

---

## 📊 Dashboard Module

### Components

* Account balance display
* Mini statement (last 5 transactions)
* Quick actions:

  * Send Money
  * Recharge
  * Bill Payment

---

## 💼 Accounts Module

### Features

* Account overview
* Transaction history
* UI-based filtering
* Simulated statement download

---

## 💳 Cards Module

### Features

* Card display with masked number
* Block / Unblock card
* Spending limit settings
* International usage toggle

---

## 💸 Payments Module

### Supported Flows

* Mobile recharge
* Bill payments
* UPI transfers

### Flow

1. Enter payment details
2. View confirmation screen
3. Simulated result:

   * ✅ Success (70%)
   * ❌ Failure (30%)

---

## 🔔 Notifications Module

### Features

* Transaction alerts
* Payment reminders
* Security alerts
* Toast notifications
* Notification panel

---

## 👤 Profile & Settings

### Features

* User information display
* Change password (UI only)
* Language selection
* Account settings

---

## 🎨 UI/UX Design

### Design Principles

* Clean fintech-style UI
* Card-based layout
* Minimal navigation

### Styling

* Gradient backgrounds
* Rounded components
* Soft shadows

### Interactions

* Hover effects
* Smooth transitions
* Button feedback

---

## 🧠 State Management

| Data Type     | Storage Key     |
| ------------- | --------------- |
| Session       | `isLoggedIn`    |
| OTP           | `otp`           |
| Transactions  | `transactions`  |
| Cards         | `cardState`     |
| Notifications | `notifications` |

---

## 📦 JavaScript Modules

* `auth.js` → Authentication & OTP logic
* `dashboard.js` → Load balance & transactions
* `payments.js` → Payment simulation
* `app.js` → Global session handling

---

## 🔐 Security Simulation

```id="sec1"
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}
```

> ⚠️ This is only a frontend protection mechanism and not secure for production.

---

## 📱 Responsiveness

* Works on desktop and mobile devices
* Built using Flexbox layouts
* Adaptive components for different screen sizes

---

## ⚠️ Limitations

* No backend integration
* No real authentication system
* No encryption/security layers
* Data lost when `localStorage` is cleared

---

## 🔮 Future Enhancements

* Backend integration (Node.js / FastAPI)
* JWT or OAuth authentication
* Real payment gateway integration
* Database connectivity
* Advanced analytics dashboard
* Dark mode support

---

## 🎯 Purpose

NeoBank is designed to:

* Demonstrate fintech UI architecture
* Simulate banking workflows
* Provide a base for full-stack development

---

## 🏁 Conclusion

NeoBank is a **complete frontend simulation of a banking system** that showcases how real-world financial applications are structured.

### Final Outcome:

* Structured banking UI
* Simulated transaction system
* Modular frontend architecture
* Backend-ready design

---

## 🤝 Contribution

Open for hackathons, learning, and development.
Feel free to fork and extend with backend functionality.

---

## 📜 License

Open for educational and development use.

---

💡 *Bank smarter. Build faster. Simulate better.*
