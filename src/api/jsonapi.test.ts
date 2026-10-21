import { describe, expect, it } from 'vitest';
import { deriveTotal, firstRelationshipId, indexIncluded, parseCollection, relationshipIds } from './jsonapi';
import type { JsonApiResource } from './jsonapi.types';
import { vehiclesJsonApiFixture } from '@/test/fixtures/vehicles';

const resource = (id: string, type: string, relationships?: JsonApiResource['relationships']) =>
  ({ id, type, attributes: {}, relationships }) as JsonApiResource;

describe('deriveTotal', () => {
  it('adds the limit to the last offset', () => {
    expect(
      deriveTotal({ last: 'https://api-v3.mbta.com/vehicles?page[limit]=2&page[offset]=138' }),
    ).toBe(140);
  });

  it('handles url-encoded bracket keys', () => {
    expect(
      deriveTotal({ last: 'https://api-v3.mbta.com/vehicles?page%5Blimit%5D=5&page%5Boffset%5D=135' }),
    ).toBe(140);
  });

  it('returns null without a last link or unusable values', () => {
    expect(deriveTotal(undefined)).toBeNull();
    expect(deriveTotal({})).toBeNull();
    expect(deriveTotal({ last: 'https://api-v3.mbta.com/vehicles' })).toBeNull();
  });
});

describe('parseCollection', () => {
  it('returns items, included and the derived total', () => {
    const collection = parseCollection(vehiclesJsonApiFixture);

    expect(collection.items).toHaveLength(2);
    expect(collection.included).toHaveLength(3);
    expect(collection.total).toBe(140);
  });

  it('normalises a single resource and null payloads', () => {
    expect(parseCollection({ data: resource('y2105', 'vehicle') }).items).toHaveLength(1);
    expect(parseCollection({ data: null }).items).toEqual([]);
  });
});

describe('indexIncluded', () => {
  it('keys resources by type and id', () => {
    const index = indexIncluded(vehiclesJsonApiFixture.included);

    expect(index.get('route:91')?.id).toBe('91');
    expect(index.get('trip:78265338')?.type).toBe('trip');
    expect(index.size).toBe(3);
  });
});

describe('relationship helpers', () => {
  it('reads a to-one relationship id', () => {
    const vehicle = resource('y2105', 'vehicle', {
      route: { data: { id: '91', type: 'route' } },
    });

    expect(firstRelationshipId(vehicle, 'route')).toBe('91');
  });

  it('returns null/empty when the relationship is missing or null', () => {
    const vehicle = resource('y2105', 'vehicle', { route: { data: null } });

    expect(firstRelationshipId(vehicle, 'route')).toBeNull();
    expect(firstRelationshipId(resource('y2105', 'vehicle'), 'route')).toBeNull();
    expect(relationshipIds(vehicle, 'route')).toEqual([]);
  });

  it('reads the ids of a to-many relationship', () => {
    const trip = resource('78265338', 'trip', {
      stops: {
        data: [
          { id: '185', type: 'stop' },
          { id: '4355', type: 'stop' },
        ],
      },
    });

    expect(relationshipIds(trip, 'stops')).toEqual(['185', '4355']);
  });
});
