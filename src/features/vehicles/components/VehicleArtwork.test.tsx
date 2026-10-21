import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VehicleArtwork } from './VehicleArtwork';

const image = (priority?: boolean) => {
  const { container } = render(<VehicleArtwork priority={priority} />);

  return container.querySelector('img') as HTMLImageElement;
};

describe('VehicleArtwork', () => {
  it('loads the LCP artwork eagerly with high priority', () => {
    const img = image(true);

    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('defers artwork below the fold', () => {
    const img = image();

    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('fetchpriority', 'auto');
  });
});
