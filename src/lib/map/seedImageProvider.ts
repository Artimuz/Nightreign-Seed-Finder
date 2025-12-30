export type SeedImageProvider = {
  imageUrl: string
  sourceLabel: string
}

const baseProvider = {
  baseUrl: 'https://thefifthmatt.github.io/nightreign/pattern/',
  fileExtension: 'jpg',
  sourceLabel: 'thefifthmatt'
}

const dlcProvider = {
  baseUrl: 'https://kevins78.github.io/nightreigndlcseeds/images/',
  fileExtension: 'png',
  sourceLabel: 'kevins78'
}

export function getSeedImageProvider(seedId: string): SeedImageProvider {
  const parsedSeedId = Number(seedId)

  const provider = Number.isFinite(parsedSeedId) && parsedSeedId >= 0 && parsedSeedId <= 319 ? baseProvider : dlcProvider

  return {
    imageUrl: `${provider.baseUrl}${seedId}.${provider.fileExtension}`,
    sourceLabel: provider.sourceLabel
  }
}
