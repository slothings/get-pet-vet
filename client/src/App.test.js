// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
