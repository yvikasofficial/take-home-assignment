# React Data Table

A React data table implementation with 20,000 rows of data, featuring virtualization, sorting, column reordering, and CRUD operations.

## 🌐 Live Demo

Check out the live version of the application:
**[https://take-home-assignment-eight.vercel.app/](https://take-home-assignment-eight.vercel.app/)**

## 🎯 Core Requirements

### Required Features ✅

- **20,000 Row Dataset** - Generated with realistic test data and saved to localStorage
- **Required Columns**: ID, First Name, Last Name, Email, City, Registered Date
- **Computed Columns**:
  - Full Name (First Name + Last Name)
  - DSR (Days Since Registered)
- **Column Reordering** - Drag and drop to reorder columns
- **Sorting** - Click column headers to sort
- **Virtual Scrolling** - Smooth performance with large datasets

## 🚀 Additional Bonus Features

- **Create, Read, Update, Delete** user records
- **Search & Filter** functionality
- **Responsive Design** for all screen sizes

## 🛠️ Tech Stack

- **React 19** - Modern React with TypeScript
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Styling and responsive design
- **Faker.js** - Realistic test data generation
- **date-fns** - Date calculations
- **react-query** - State management
- **Shadcn** - Components library

## 🚦 How to Use

### Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run code linting

---

Built with React, TypeScript, and modern web technologies.
