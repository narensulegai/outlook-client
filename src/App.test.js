import React from 'react';

import { render } from '@testing-library/react';
import App from './App';

it('renders app name', () => {
  const { getByText } = render(<App />);
  expect(getByText('Outlook Client')).toBeInTheDocument();
});

it('renders login message', () => {
  const { getByText } = render(<App />);
  expect(getByText('Please log in to Outlook')).toBeInTheDocument();
});
