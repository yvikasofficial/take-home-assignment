# React Data Table

A React data table implementation with 20,000 rows of data, featuring virtualization, sorting, column reordering, and CRUD operations.

## 🎯 Core Requirements

### Required Features ✅

- **20,000 Row Dataset** - Generated with realistic test data
- **Required Columns**: ID, First Name, Last Name, Email, City, Registered Date
- **Computed Columns**:
  - Full Name (First Name + Last Name)
  - DSR (Days Since Registered)
- **Column Reordering** - Drag and drop to reorder columns
- **Sorting** - Click column headers to sort
- **Virtual Scrolling** - Smooth performance with large datasets

## 🚀 Additional Bonus Features

### CRUD Operations

- **Create** - Add new user records
- **Read** - View and search through data
- **Update** - Edit existing user information
- **Delete** - Remove user records

### Enhanced UI/UX

- **Responsive Design** - Works on all screen sizes
- **Search & Filter** - Find specific records quickly

## 🛠️ Tech Stack

- **React 19** - Modern React with TypeScript
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Styling and responsive design
- **Faker.js** - Realistic test data generation
- **date-fns** - Date calculations
- **react-query** - State management

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

### Using the Table

#### Basic Operations

- **Sort**: Click any column header to sort data
- **Reorder Columns**: Drag column headers to reorder
- **Theme Toggle**: Click the theme button in the top-right
- **Scroll**: Virtual scrolling handles large datasets smoothly

#### CRUD Operations

- **Add User**: Click "Add New User" button
- **Edit User**: Click the edit icon in any row
- **Delete User**: Click the delete icon in any row
- **Bulk Delete**: Select multiple rows and click "Delete Selected"

#### Search & Filter

- **Global Search**: Use the search box to find users

### Data Model

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  registeredDate: Date;
}
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run code linting

---

Built with React, TypeScript, and modern web technologies.
