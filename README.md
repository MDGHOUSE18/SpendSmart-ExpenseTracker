
# 💰 SpendSmart - Expense Tracker

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://expense-tracker-app-ydzc.bolt.host/)
[![Built with](https://img.shields.io/badge/Built%20with-Angular-red)](https://angular.io/)

A modern, responsive personal finance management application that helps you track income, manage expenses, and visualize your spending habits with intuitive charts and analytics.

## ✨ Features

- **💵 Transaction Management**
  - Add income and expense transactions
  - Edit and delete existing transactions
  - Categorize transactions (Food, Transport, Entertainment, Bills, etc.)
  - Add descriptions and dates to transactions

- **📊 Visual Analytics**
  - Interactive charts showing expense breakdown
  - Income vs Expense comparison
  - Monthly spending trends
  - Category-wise spending analysis

- **💾 Data Persistence**
  - Local storage integration
  - Data persists across browser sessions
  - No account registration required

- **🎨 Modern UI/UX**
  - Clean and intuitive interface
  - Fully responsive design
  - Dark/Light theme support
  - Smooth animations and transitions

- **📱 Responsive Design**
  - Mobile-first approach
  - Works seamlessly on all devices
  - Touch-friendly interface

## 🚀 Live Demo

Check out the live application: [SpendSmart Expense Tracker](https://expense-tracker-app-ydzc.bolt.host/)

## 🛠️ Tech Stack

- **Frontend Framework:** Angular 17+
- **Language:** TypeScript
- **Styling:** SCSS / Tailwind CSS
- **Charts:** Chart.js / Ngx-Charts
- **State Management:** RxJS
- **Storage:** Browser LocalStorage
- **Build Tool:** Angular CLI
- **Deployment:** Bolt.host

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MDGHOUSE18/SpendSmart-ExpenseTracker.git
   cd SpendSmart-ExpenseTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Build for Production

```bash
ng build --configuration production
```

The production build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
SpendSmart-ExpenseTracker/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── transaction-list/
│   │   │   ├── transaction-form/
│   │   │   ├── balance-overview/
│   │   │   └── expense-chart/
│   │   ├── models/
│   │   │   └── transaction.model.ts
│   │   ├── services/
│   │   │   └── transaction.service.ts
│   │   ├── pipes/
│   │   │   └── currency-format.pipe.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   └── images/
│   ├── styles/
│   │   └── global.scss
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎯 Key Features Explained

### Transaction Management
Easily add, edit, and delete your financial transactions. Each transaction includes:
- Type (Income/Expense)
- Amount
- Category
- Date
- Description

### Data Visualization
Interactive charts provide insights into:
- Monthly income vs expenses
- Spending by category
- Budget tracking
- Financial trends over time

### Budget Alerts
Set monthly budgets and receive visual indicators when approaching limits.

## 🔧 Configuration

### Customizing Categories

Edit the categories in `src/app/constants/categories.ts`:

```typescript
export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  // Add more categories
];
```

### Theme Customization

Modify color schemes in `src/styles/variables.scss`:

```scss
$primary-color: #4f46e5;
$success-color: #10b981;
$danger-color: #ef4444;
```

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**MD Ghouse**
- GitHub: [@MDGHOUSE18](https://github.com/MDGHOUSE18)
- Portfolio: [CodeByGhouse](https://ghouse-dev.netlify.app/)

## 🙏 Acknowledgments

- Built with [Angular](https://angular.io/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Deployed on [Bolt.host](https://bolt.host/)

## 📞 Support

For support, email mdghouse23102@gmail.com or open an issue in the repository.

---

Made with ❤️ by MD Ghouse
