import * as React from 'react';
import {createRoot} from 'react-dom/client';
import { BreakdownForm } from './components/BreakdownForm';

import '../src/assets/style.css';

const App: React.FC = () => {
  return <BreakdownForm />;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
