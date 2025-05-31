import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { PokemonContext } from '../context/PokemonContext';

jest.mock('ldrs', () => ({
  helix: { register: jest.fn() },
  bouncy: { register: jest.fn() },
}));
jest.mock('../assets/burger-menu.svg', () => 'burger-menu.svg');
jest.mock('../assets/pkdx_logo.png', () => 'pkdx_logo.png');

const mockContext = {
  onClickLoadMore: jest.fn(),
  allPokemons: [],
  filteredPokemons: [],
  loading: false,
};

describe('HomePage', () => {
  it('renderiza el botón Load More', () => {
    render(
      <MemoryRouter>
        <PokemonContext.Provider value={mockContext}>
          <HomePage />
        </PokemonContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /cargar más pokémon/i })).toBeInTheDocument();
  });
});
