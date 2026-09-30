import { Relationship, RelationshipStatus } from '../types';

export interface CanonicalEntity {
  canonicalId: string;
  canonicalName: string;
  entityType: 'STATION' | 'EXPEDITION' | 'RESEARCHER' | 'INSTITUTION' | 'DATASET';
  aliases: string[];
  sourceIdentifiers: string[];
  coordinates?: { lat: number; lng: number };
  verificationStatus: 'VERIFIED' | 'DERIVED' | 'SUGGESTED';
}

export const CANONICAL_REGISTRY: CanonicalEntity[] = [
  {
    canonicalId: 'sta-bharati',
    canonicalName: 'Bharati Station',
    entityType: 'STATION',
    aliases: ['Bharati', 'Bharathi', 'Indian Antarctic Station Bharati', 'Bharati Base', 'भारती'],
    sourceIdentifiers: ['NCPOR-STA-03', 'SCAR-9812'],
    coordinates: { lat: -69.4072, lng: 76.1872 },
    verificationStatus: 'VERIFIED'
  },
  {
    canonicalId: 'sta-maitri',
    canonicalName: 'Maitri Station',
    entityType: 'STATION',
    aliases: ['Maitri', 'Maitree', 'Station Maitri', 'Schirmacher Base', 'मैत्री'],
    sourceIdentifiers: ['NCPOR-STA-02', 'SCAR-9801'],
    coordinates: { lat: -70.7667, lng: 11.7333 },
    verificationStatus: 'VERIFIED'
  },
  {
    canonicalId: 'sta-himadri',
    canonicalName: 'Himadri Station',
    entityType: 'STATION',
    aliases: ['Himadri', 'Ny-Alesund Himadri', 'Indian Arctic Research Station', 'हिमाद्रि'],
    sourceIdentifiers: ['NCPOR-ARC-01', 'KNG-NYA-12'],
    coordinates: { lat: 78.9233, lng: 11.9283 },
    verificationStatus: 'VERIFIED'
  },
  {
    canonicalId: 'sta-himansh',
    canonicalName: 'Himansh Station',
    entityType: 'STATION',
    aliases: ['Himansh', 'Himalayan Cryosphere Station Himansh', 'Sutri Dhaka Base', 'हिमांशु'],
    sourceIdentifiers: ['HICOS-TP-01'],
    coordinates: { lat: 32.4086, lng: 77.6106 },
    verificationStatus: 'VERIFIED'
  }
];

/**
 * Resolves a raw entity name or alias to canonical ID using deterministic matching
 */
export function resolveEntity(rawName: string): {
  canonicalEntity: CanonicalEntity | null;
  matchType: 'EXACT' | 'ALIAS' | 'FUZZY_SUGGESTION' | 'NONE';
  confidence: number;
} {
  const query = rawName.trim().toLowerCase();

  // 1. Exact canonical name match
  const exact = CANONICAL_REGISTRY.find(e => e.canonicalName.toLowerCase() === query);
  if (exact) return { canonicalEntity: exact, matchType: 'EXACT', confidence: 1.0 };

  // 2. Alias match
  const aliasMatch = CANONICAL_REGISTRY.find(e =>
    e.aliases.some(alias => alias.toLowerCase() === query)
  );
  if (aliasMatch) return { canonicalEntity: aliasMatch, matchType: 'ALIAS', confidence: 0.95 };

  // 3. Substring match
  const partial = CANONICAL_REGISTRY.find(e =>
    e.aliases.some(alias => alias.toLowerCase().includes(query) || query.includes(alias.toLowerCase()))
  );
  if (partial) return { canonicalEntity: partial, matchType: 'FUZZY_SUGGESTION', confidence: 0.75 };

  return { canonicalEntity: null, matchType: 'NONE', confidence: 0.0 };
}

/**
 * Updates relationship verification status without silently dropping rejected links
 */
export function updateRelationshipStatus(
  relationship: Relationship,
  newStatus: RelationshipStatus,
  verifierName: string,
  reason?: string
): Relationship {
  return {
    ...relationship,
    status: newStatus,
    verifiedBy: verifierName,
    verifiedAt: new Date().toISOString().split('T')[0],
    reason: reason ? `${relationship.reason} | Updated: ${reason}` : relationship.reason
  };
}
