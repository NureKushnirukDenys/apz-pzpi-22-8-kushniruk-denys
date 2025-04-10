// Компонентний інтерфейс
interface Component {
  operation(): void;
}

// Листок (Leaf) - конкретний компонент
class Leaf implements Component {
  constructor(private name: string) {}

  operation(): void {
    console.log(`Leaf: ${this.name}`);
  }
}

// Композит (Composite) - контейнер для компонентів
class Composite implements Component {
  private children: Component[] = [];

  add(child: Component): void {
    this.children.push(child);
  }

  operation(): void {
    console.log("Composite operation:");
    for (const child of this.children) {
      child.operation();
    }
  }
}

// Використання патерну Composite
const leaf1 = new Leaf("Leaf 1");
const leaf2 = new Leaf("Leaf 2");

const composite = new Composite();
composite.add(leaf1);
composite.add(leaf2);

composite.operation();  // Викликає операцію для всіх компонентів

import React from 'react';

// Батьківський компонент Container
const Container: React.FC = ({ children }) => {
  return (
    <div className="container">
      <h2>Container Component</h2>
      <div className="content">
        {children} {/* Відображення вкладених компонентів */}
      </div>
    </div>
  );
};

// Дочірні компоненти
const Header: React.FC = () => {
  return <h3>Header Component</h3>;
};

const Footer: React.FC = () => {
  return <footer>Footer Component</footer>;
};

// Основний компонент, що складається з Container
const App: React.FC = () => {
  return (
    <Container>
      <Header /> {/* Вкладений Header */}
      <p>This is some content inside the container.</p>
      <Footer /> {/* Вкладений Footer */}
    </Container>
  );
};

export default App;