import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedDemoData() {
  console.log('🌱 Seeding comprehensive demo data...')

  try {
    // Create demo users
    const demoUsers = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'STUDENT'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'STUDENT'
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'MENTOR'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'STUDENT'
      }
    ]

    console.log('👥 Creating demo users...')
    for (const userData of demoUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        await prisma.user.create({
          data: userData
        })
        console.log(`   ✅ Created user: ${userData.email}`)
      }
    }

    // Create comprehensive React course
    console.log('📚 Creating comprehensive React course...')
    
    const reactCourse = await prisma.course.upsert({
      where: { slug: 'complete-react-mastery' },
      update: {},
      create: {
        title: 'Complete React Mastery 2024',
        slug: 'complete-react-mastery',
        description: 'Master React from basics to advanced concepts with hands-on projects, real-world examples, and interactive coding exercises.',
        thumbnail: '/course-thumbnails/react-mastery.jpg',
        level: 'Beginner',
        duration: '40 hours',
        price: 0, // FREE
        status: 'PUBLISHED',
        metadata: {
          language: 'JavaScript',
          category: 'Frontend Development',
          tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Components', 'Hooks'],
          objectives: [
            'Master React fundamentals and advanced concepts',
            'Build real-world applications with React',
            'Understand component lifecycle and state management',
            'Work with React Hooks and Context API',
            'Implement routing and navigation',
            'Deploy React applications to production'
          ],
          prerequisites: [
            'Basic HTML, CSS, and JavaScript knowledge',
            'Understanding of ES6+ features',
            'Familiarity with npm/yarn package manager'
          ]
        }
      }
    })

    // Create course modules and lessons
    console.log('📖 Creating course modules and lessons...')
    
    const modules = [
      {
        title: 'React Fundamentals',
        description: 'Learn the core concepts of React',
        order: 1,
        lessons: [
          {
            title: 'Introduction to React',
            slug: 'introduction-to-react',
            content: `
# Introduction to React

React is a powerful JavaScript library for building user interfaces, particularly web applications. Created by Facebook (now Meta), React has revolutionized how we think about building interactive UIs.

## What is React?

React is a **declarative**, **efficient**, and **flexible** JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

## Key Features

### 1. Component-Based Architecture
React applications are built using components - reusable pieces of UI that manage their own state.

### 2. Virtual DOM
React uses a virtual representation of the DOM to optimize updates and improve performance.

### 3. Unidirectional Data Flow
Data flows down from parent to child components, making applications predictable and easier to debug.

## Why Choose React?

- **Popular & Well-Supported**: Backed by Meta with a huge community
- **Flexible**: Can be used for web, mobile (React Native), and desktop apps
- **Performance**: Virtual DOM and efficient reconciliation
- **Developer Experience**: Great tooling and debugging capabilities
- **Job Market**: High demand for React developers

## React vs Other Frameworks

| Feature | React | Vue | Angular |
|---------|-------|-----|---------|
| Learning Curve | Moderate | Easy | Steep |
| Performance | Excellent | Excellent | Good |
| Community | Huge | Growing | Large |
| Flexibility | High | High | Opinionated |

## Getting Started

In the next lessons, we'll set up our development environment and create our first React component!
            `,
            type: 'lesson',
            duration: 15,
            order: 1
          },
          {
            title: 'Setting Up Development Environment',
            slug: 'setting-up-development-environment',
            content: `
# Setting Up Your React Development Environment

Let's get your machine ready for React development with all the necessary tools and configurations.

## Prerequisites

Before we start, make sure you have:
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A code editor (VS Code recommended)
- Basic command line knowledge

## Step 1: Install Node.js

React requires Node.js to run the development tools.

### Download and Install
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard

### Verify Installation
Open your terminal and run:
\`\`\`bash
node --version
npm --version
\`\`\`

You should see version numbers for both Node.js and npm.

## Step 2: Install a Code Editor

### VS Code (Recommended)
1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install useful extensions:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - Auto Rename Tag
   - Bracket Pair Colorizer

## Step 3: Create Your First React App

We'll use Create React App, the official tool for setting up React projects.

### Install Create React App
\`\`\`bash
npx create-react-app my-first-react-app
cd my-first-react-app
npm start
\`\`\`

### Project Structure
\`\`\`
my-first-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
\`\`\`

## Step 4: Understanding the Development Server

When you run \`npm start\`, you get:
- **Hot Reloading**: Changes appear instantly in the browser
- **Error Overlay**: Helpful error messages
- **Development Tools**: React DevTools integration

## Browser Developer Tools

### Install React Developer Tools
- **Chrome**: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- **Firefox**: Available in Firefox Add-ons

### Using React DevTools
- Inspect component hierarchy
- View props and state
- Profile component performance
- Debug hooks

## Next Steps

Now that your environment is ready, let's create your first React component in the next lesson!

## Troubleshooting

### Common Issues
1. **Node.js not found**: Restart your terminal after installation
2. **Permission errors**: Use \`sudo\` on macOS/Linux or run as administrator on Windows
3. **Port 3000 in use**: The dev server will automatically use port 3001

### Getting Help
- [React Documentation](https://reactjs.org/docs)
- [Create React App Documentation](https://create-react-app.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)
            `,
            type: 'lesson',
            duration: 20,
            order: 2
          },
          {
            title: 'Your First React Component',
            slug: 'your-first-react-component',
            content: `
# Your First React Component

Let's dive into creating React components and understand how they work!

## What is a Component?

A React component is a JavaScript function or class that returns JSX (JavaScript XML) to describe what should appear on the screen.

## Function Components

The modern way to create components is using functions:

\`\`\`jsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}
\`\`\`

## JSX - JavaScript XML

JSX allows you to write HTML-like syntax in JavaScript:

\`\`\`jsx
function App() {
  const name = "React Developer";
  
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
}
\`\`\`

## Component Rules

### 1. Component Names Must Start with Capital Letter
\`\`\`jsx
// ✅ Correct
function MyComponent() { }

// ❌ Wrong
function myComponent() { }
\`\`\`

### 2. Components Must Return JSX
\`\`\`jsx
function MyComponent() {
  return <div>Hello World</div>;
}
\`\`\`

### 3. JSX Must Have One Parent Element
\`\`\`jsx
// ✅ Correct
function MyComponent() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// ✅ Also correct (React Fragment)
function MyComponent() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}
\`\`\`

## Hands-On Exercise

Let's create a personal greeting component:

\`\`\`jsx
function PersonalGreeting() {
  const firstName = "John";
  const lastName = "Doe";
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f8ff',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>{getGreeting()}, {firstName} {lastName}!</h2>
      <p>Welcome to React Development</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
\`\`\`

## Embedding JavaScript in JSX

Use curly braces \`{}\` to embed JavaScript expressions:

\`\`\`jsx
function MathComponent() {
  const a = 5;
  const b = 10;
  
  return (
    <div>
      <p>{a} + {b} = {a + b}</p>
      <p>Random number: {Math.floor(Math.random() * 100)}</p>
      <p>Is {a} greater than {b}? {a > b ? 'Yes' : 'No'}</p>
    </div>
  );
}
\`\`\`

## Styling Components

### Inline Styles
\`\`\`jsx
function StyledComponent() {
  const styles = {
    container: {
      backgroundColor: '#282c34',
      color: 'white',
      padding: '20px',
      borderRadius: '10px'
    }
  };
  
  return (
    <div style={styles.container}>
      <h3>Styled Component</h3>
    </div>
  );
}
\`\`\`

### CSS Classes
\`\`\`jsx
function StyledComponent() {
  return (
    <div className="my-component">
      <h3>Styled with CSS</h3>
    </div>
  );
}
\`\`\`

## Practice Exercise

Create a \`UserCard\` component that displays:
- User's name
- User's email
- User's join date
- A welcome message based on the time of day

Try implementing this yourself before looking at the solution!

## Solution

\`\`\`jsx
function UserCard() {
  const user = {
    name: "Alice Johnson",
    email: "alice@example.com",
    joinDate: "2024-01-15"
  };
  
  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Have a great morning!";
    if (hour < 17) return "Hope you're having a productive afternoon!";
    return "Enjoy your evening!";
  };
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ color: '#333', marginTop: 0 }}>
        {user.name}
      </h3>
      <p style={{ color: '#666' }}>
        📧 {user.email}
      </p>
      <p style={{ color: '#666' }}>
        📅 Member since: {new Date(user.joinDate).toLocaleDateString()}
      </p>
      <p style={{ 
        color: '#4CAF50', 
        fontStyle: 'italic',
        marginBottom: 0 
      }}>
        {getTimeBasedMessage()}
      </p>
    </div>
  );
}
\`\`\`

## Key Takeaways

1. **Components are functions** that return JSX
2. **JSX combines HTML and JavaScript** using curly braces
3. **Component names must be capitalized**
4. **JSX must have a single parent element**
5. **Use JavaScript expressions** for dynamic content

## Next Up

In the next lesson, we'll learn about **Props** - how to pass data between components!
            `,
            type: 'lesson',
            duration: 25,
            order: 3
          }
        ]
      },
      {
        title: 'Props and State',
        description: 'Understanding data flow in React',
        order: 2,
        lessons: [
          {
            title: 'Understanding Props',
            slug: 'understanding-props',
            content: `
# Understanding Props in React

Props (short for "properties") are how we pass data from parent components to child components in React. Think of props as function arguments for components.

## What are Props?

Props are **read-only** data that a parent component passes to a child component. They allow components to be dynamic and reusable.

## Basic Props Example

\`\`\`jsx
// Child Component
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Parent Component
function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}
\`\`\`

## Destructuring Props

Instead of using \`props.name\`, we can destructure props for cleaner code:

\`\`\`jsx
// Using destructuring
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Multiple props
function UserProfile({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Usage
function App() {
  return (
    <UserProfile 
      name="John Doe" 
      age={30} 
      email="john@example.com" 
    />
  );
}
\`\`\`

## Different Types of Props

### String Props
\`\`\`jsx
<Component title="My Title" />
\`\`\`

### Number Props
\`\`\`jsx
<Component count={42} price={19.99} />
\`\`\`

### Boolean Props
\`\`\`jsx
<Component isVisible={true} isActive={false} />
// Shorthand for true
<Component isVisible isActive />
\`\`\`

### Array Props
\`\`\`jsx
<Component items={['apple', 'banana', 'orange']} />
\`\`\`

### Object Props
\`\`\`jsx
<Component user={{ name: 'John', age: 30 }} />
\`\`\`

### Function Props
\`\`\`jsx
<Component onClick={() => alert('Clicked!')} />
\`\`\`

## Real-World Example: Product Card

\`\`\`jsx
function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, inStock } = product;
  
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">${price.toFixed(2)}</p>
      <p className={inStock ? 'in-stock' : 'out-of-stock'}>
        {inStock ? 'In Stock' : 'Out of Stock'}
      </p>
      <button 
        onClick={() => onAddToCart(id)}
        disabled={!inStock}
      >
        Add to Cart
      </button>
    </div>
  );
}

// Usage
function ProductList() {
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: '/images/headphones.jpg',
      inStock: true
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: '/images/watch.jpg',
      inStock: false
    }
  ];
  
  const handleAddToCart = (productId) => {
    console.log(\`Added product \${productId} to cart\`);
  };
  
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
\`\`\`

## Default Props

You can provide default values for props:

\`\`\`jsx
function Button({ text = 'Click Me', color = 'blue', onClick }) {
  return (
    <button 
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

// Usage
<Button /> // Uses defaults
<Button text="Submit" color="green" />
\`\`\`

## Props Validation with PropTypes

For better development experience, you can validate props:

\`\`\`jsx
import PropTypes from 'prop-types';

function UserProfile({ name, age, email, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  isActive: PropTypes.bool
};

UserProfile.defaultProps = {
  isActive: true
};
\`\`\`

## Props Best Practices

### 1. Keep Props Simple
\`\`\`jsx
// ✅ Good
<UserCard name="John" age={30} />

// ❌ Avoid complex nested objects when possible
<UserCard user={{ profile: { personal: { name: "John" } } }} />
\`\`\`

### 2. Use Descriptive Names
\`\`\`jsx
// ✅ Good
<Button isLoading={true} onClick={handleSubmit} />

// ❌ Unclear
<Button flag={true} handler={handleSubmit} />
\`\`\`

### 3. Destructure Props Early
\`\`\`jsx
// ✅ Good
function Component({ title, content, isVisible }) {
  // Use title, content, isVisible directly
}

// ❌ Less readable
function Component(props) {
  // Use props.title, props.content, props.isVisible
}
\`\`\`

## Common Props Patterns

### Conditional Rendering with Props
\`\`\`jsx
function Alert({ type, message, isVisible }) {
  if (!isVisible) return null;
  
  const alertClass = \`alert alert-\${type}\`;
  
  return (
    <div className={alertClass}>
      {message}
    </div>
  );
}
\`\`\`

### Passing Children as Props
\`\`\`jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="My Card">
  <p>This is the card content</p>
  <button>Action</button>
</Card>
\`\`\`

## Practice Exercise

Create a \`WeatherCard\` component that accepts these props:
- \`city\` (string): The city name
- \`temperature\` (number): Current temperature
- \`condition\` (string): Weather condition (sunny, cloudy, rainy)
- \`humidity\` (number): Humidity percentage
- \`onRefresh\` (function): Function to call when refresh button is clicked

The component should:
1. Display all the weather information
2. Show different icons based on the condition
3. Have a refresh button that calls the onRefresh function
4. Use appropriate styling

Try implementing this yourself!

## Solution

\`\`\`jsx
function WeatherCard({ 
  city, 
  temperature, 
  condition, 
  humidity, 
  onRefresh 
}) {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      default: return '🌤️';
    }
  };
  
  const getTemperatureColor = (temp) => {
    if (temp > 80) return '#ff4444';
    if (temp > 60) return '#ff8800';
    if (temp > 40) return '#4CAF50';
    return '#2196F3';
  };
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '20px',
      margin: '10px',
      backgroundColor: '#f8f9fa',
      textAlign: 'center',
      minWidth: '250px'
    }}>
      <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
        {city}
      </h2>
      
      <div style={{ fontSize: '48px', margin: '10px 0' }}>
        {getWeatherIcon(condition)}
      </div>
      
      <div style={{ 
        fontSize: '36px', 
        fontWeight: 'bold',
        color: getTemperatureColor(temperature),
        margin: '10px 0'
      }}>
        {temperature}°F
      </div>
      
      <p style={{ 
        fontSize: '18px', 
        color: '#666',
        textTransform: 'capitalize',
        margin: '5px 0'
      }}>
        {condition}
      </p>
      
      <p style={{ color: '#888', margin: '5px 0' }}>
        Humidity: {humidity}%
      </p>
      
      <button 
        onClick={onRefresh}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        🔄 Refresh
      </button>
    </div>
  );
}

// Usage Example
function WeatherApp() {
  const handleRefresh = (city) => {
    console.log(\`Refreshing weather for \${city}\`);
  };
  
  return (
    <div>
      <WeatherCard 
        city="New York"
        temperature={72}
        condition="sunny"
        humidity={45}
        onRefresh={() => handleRefresh('New York')}
      />
      <WeatherCard 
        city="London"
        temperature={58}
        condition="cloudy"
        humidity={78}
        onRefresh={() => handleRefresh('London')}
      />
    </div>
  );
}
\`\`\`

## Key Takeaways

1. **Props are read-only** - never modify props directly
2. **Props flow down** from parent to child components
3. **Use destructuring** for cleaner code
4. **Provide default values** when appropriate
5. **Validate props** in development for better debugging
6. **Keep props simple** and well-named

## Next Up

In the next lesson, we'll learn about **State** - how to make components interactive and manage changing data!
            `,
            type: 'lesson',
            duration: 30,
            order: 1
          }
        ]
      }
    ]

    for (const moduleData of modules) {
      const module = await prisma.module.create({
        data: {
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          courseId: reactCourse.id
        }
      })

      for (const lessonData of moduleData.lessons) {
        await prisma.lesson.create({
          data: {
            ...lessonData,
            courseId: reactCourse.id,
            moduleId: module.id
          }
        })
      }
    }

    // Create demo projects
    console.log('🚀 Creating demo projects...')
    
    const projects = [
      {
        title: 'Todo List App',
        slug: 'todo-list-app',
        description: 'Build a fully functional todo list with React hooks and local storage',
        thumbnail: '/project-thumbnails/todo-app.jpg',
        level: 'Beginner',
        category: 'Frontend Development',
        tools: ['React', 'JavaScript', 'CSS', 'Local Storage'],
        status: 'PUBLISHED',
        price: 0,
        metadata: {
          difficulty: 'Beginner',
          estimatedTime: '2-3 hours',
          technologies: ['React', 'JavaScript', 'CSS', 'Local Storage'],
          isPaid: false,
        content: `
# Todo List App Project

Build a complete todo list application using React hooks and modern JavaScript features.

## Project Overview

In this project, you'll create a todo list app that allows users to:
- Add new tasks
- Mark tasks as complete
- Delete tasks
- Filter tasks (all, active, completed)
- Persist data in local storage

## Learning Objectives

- Practice React hooks (useState, useEffect)
- Work with arrays and array methods
- Implement local storage
- Handle form submissions
- Create reusable components

## Starter Code

\`\`\`jsx
import React, { useState, useEffect } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add your implementation here
  
  return (
    <div className="todo-app">
      <h1>My Todo List</h1>
      {/* Add your JSX here */}
    </div>
  );
}

export default TodoApp;
\`\`\`

## Step-by-Step Implementation

### Step 1: Add Todo Functionality
### Step 2: Toggle Todo Completion
### Step 3: Delete Todo Functionality
### Step 4: Filter Todos
### Step 5: Add Styling

## Complete Solution Available After Attempt
\`,
          codeFiles: [
            {
              filename: 'TodoApp.js',
              language: 'javascript',
              content: `import React, { useState, useEffect } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>My Todo List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({todos.filter(t => !t.completed).length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p className="empty-message">
          {filter === 'all' ? 'No todos yet!' : \`No \${filter} todos!\`}
        </p>
      )}
    </div>
  );
}

export default TodoApp;`
          },
          {
            filename: 'TodoApp.css',
            language: 'css',
            content: `.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.todo-input:focus {
  outline: none;
  border-color: #007bff;
}

.add-button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background-color: #0056b3;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-buttons button {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.filter-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 8px;
  background: white;
}

.todo-list li.completed {
  background-color: #f8f9fa;
  opacity: 0.7;
}

.todo-text {
  flex: 1;
  font-size: 16px;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
}

.delete-button {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}

.empty-message {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 40px;
}`
          }
        ]
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'Create a weather dashboard with API integration and responsive design',
        thumbnail: '/project-thumbnails/weather-dashboard.jpg',
        level: 'Intermediate',
        category: 'Frontend Development',
        tools: ['React', 'API Integration', 'CSS Grid', 'Responsive Design'],
        status: 'PUBLISHED',
        price: 0,
        metadata: {
          difficulty: 'Intermediate',
          estimatedTime: '4-5 hours',
          technologies: ['React', 'API Integration', 'CSS Grid', 'Responsive Design'],
          isPaid: false
        }
      }
    ]

    for (const projectData of projects) {
      await prisma.project.upsert({
        where: { slug: projectData.slug },
        update: {},
        create: projectData
      })
    }

    // Create realtime events for demo
    console.log('⚡ Creating realtime demo events...')
    
    const realtimeEvents = [
      {
        channel: 'user_activity',
        type: 'user_login',
        entity: 'user',
        payload: JSON.stringify({
          userId: 'demo-user-1',
          userName: 'John Smith',
          timestamp: new Date().toISOString(),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
      },
      {
        channel: 'course_activity',
        type: 'course_enrollment',
        entity: 'enrollment',
        payload: JSON.stringify({
          userId: 'demo-user-2',
          userName: 'Sarah Johnson',
          courseId: reactCourse.id,
          courseName: 'Complete React Mastery 2024',
          timestamp: new Date().toISOString()
        })
      },
      {
        channel: 'lesson_activity',
        type: 'lesson_completed',
        entity: 'progress',
        payload: JSON.stringify({
          userId: 'demo-user-1',
          userName: 'John Smith',
          lessonId: 'intro-to-react',
          lessonTitle: 'Introduction to React',
          courseId: reactCourse.id,
          courseName: 'Complete React Mastery 2024',
          completionTime: 15,
          timestamp: new Date().toISOString()
        })
      },
      {
        channel: 'project_activity',
        type: 'project_started',
        entity: 'project',
        payload: JSON.stringify({
          userId: 'demo-user-3',
          userName: 'Mike Chen',
          projectId: 'todo-list-app',
          projectTitle: 'Todo List App',
          timestamp: new Date().toISOString()
        })
      }
    ]

    for (const event of realtimeEvents) {
      await prisma.realtimeEvent.create({
        data: event
      })
    }

    console.log('✅ Demo data seeding completed successfully!')
    console.log('\n📊 Demo Data Summary:')
    console.log('   👥 4 Demo Users Created')
    console.log('   📚 1 Complete React Course with 3+ Lessons')
    console.log('   🚀 2 Interactive Projects')
    console.log('   ⚡ 4 Realtime Activity Events')
    console.log('\n🔐 Demo Login Credentials:')
    console.log('   📧 john.smith@example.com / demo123')
    console.log('   📧 sarah.johnson@example.com / demo123')
    console.log('   📧 mike.chen@example.com / demo123 (Mentor)')
    console.log('   📧 emily.davis@example.com / demo123')

  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this is the main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  console.log('🌱 Starting demo data seeding...')
  seedDemoData()
    .then(() => {
      console.log('🎉 Demo data seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Demo data seeding failed:', error)
      process.exit(1)
    })
}

export { seedDemoData }