import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BerriesPage } from './BerriesPage';
import { BerriesContext } from '../context/BerriesContext';

jest.mock('ldrs', () => ({
  helix: { register: jest.fn() },
  bouncy: { register: jest.fn() },
}));

const mockContext = {
  allBerries: [
    {
      id: 1,
      name: 'oran',
      effect_entries: [{ effect: 'Restores 10 HP.' }],
    }
  ],
  searchLoading: false,
  onClickLoadMore: jest.fn(),
};

describe('BerriesPage', () => {
  it('renderiza el nombre de la baya', () => {
    render(
      <MemoryRouter>
        <BerriesContext.Provider value={mockContext}>
          <BerriesPage />
        </BerriesContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Oran/i)).toBeInTheDocument();
  });

  it('renderiza el botón Load More', () => {
    render(
      <MemoryRouter>
        <BerriesContext.Provider value={mockContext}>
          <BerriesPage />
        </BerriesContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /cargar más bayas/i })).toBeInTheDocument();
  });
});
