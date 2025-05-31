import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CardPokemon } from './CardPokemon';

jest.mock('ldrs', () => ({
  helix: { register: jest.fn() },
  bouncy: { register: jest.fn() },
}));

describe('CardPokemon', () => {
  const pokemon = {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
      },
    },
    types: [
      { type: { name: 'grass' } },
      { type: { name: 'poison' } },
    ],
  };

  it('renderiza el nombre y la imagen del Pokémon', () => {
    render(
      <MemoryRouter>
        <CardPokemon pokemon={pokemon} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByAltText(/bulbasaur/i)).toBeInTheDocument();
  });

  it('muestra los tipos correctamente', () => {
    render(
      <MemoryRouter>
        <CardPokemon pokemon={pokemon} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Grass/i)).toBeInTheDocument();
    expect(screen.getByText(/Poison/i)).toBeInTheDocument();
  });
});
