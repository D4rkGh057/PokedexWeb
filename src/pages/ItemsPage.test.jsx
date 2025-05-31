import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ItemsPage } from './ItemsPage';
import { ItemsContext } from '../context/ItemsContext';

jest.mock('ldrs', () => ({
  helix: { register: jest.fn() },
  bouncy: { register: jest.fn() },
}));

const mockContext = {
  allItems: [
    {
      id: 1,
      name: 'potion',
      sprites: { default: 'https://example.com/potion.png' },
      flavor_text_entries: [
        { language: { name: 'en' }, text: 'Heals 20 HP.' }
      ]
    }
  ],
  searchLoading: false,
  onClickLoadMore: jest.fn(),
};

describe('ItemsPage', () => {
  it('renderiza el nombre y la imagen del item', () => {
    render(
      <MemoryRouter>
        <ItemsContext.Provider value={mockContext}>
          <ItemsPage />
        </ItemsContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Potion/i)).toBeInTheDocument();
    expect(screen.getByAltText(/potion/i)).toBeInTheDocument();
  });

  it('renderiza el botón Load More', () => {
    render(
      <MemoryRouter>
        <ItemsContext.Provider value={mockContext}>
          <ItemsPage />
        </ItemsContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /cargar más objetos/i })).toBeInTheDocument();
  });
});
