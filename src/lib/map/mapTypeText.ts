export type MapTypeKey = 'normal' | 'crater' | 'mountaintop' | 'rotted' | 'noklateo' | 'greatHollow'

type MapTypeText = {
  title: string
  paragraphs: string[]
  sourceUrl: string
}

const mapTypeTexts: Record<MapTypeKey, MapTypeText> = {
  normal: {
    title: 'Normal',
    paragraphs: [
      'Limveld exists within the same universe as the Lands Between and shares a Roundtable Hold. It is the setting for Elden Ring Nightreign, which occurs in parallel to the events of Elden Ring after diverging during or after the Shattering.',
      "Limveld is influenced by the power of Runes and is home to colossal shadow giants and various Sites of Grace. It is currently under the rule of the Night Lord and threatened by the encroaching Night's Tide. A maiden enlists the Nightfarers to save the land from its impending doom.",
    ],
    sourceUrl: 'https://eldenring.fandom.com/wiki/Limveld',
  },
  crater: {
    title: 'Crater',
    paragraphs: [
      'The Crater is a massive, open pit of lava that appears at the center of Limveld during the Crater Shifting Earth event. This location erupts with lava and is populated by Fire Monks and Guilty Sorcerers, and is home to a Fallingstar Beast and Magma Wyrm.',
      'This area features a temple constructed in ancient times to honor the divine art of smithing. Reaching the bottom and defeating the Magma Wyrm allows the Nightfarers to upgrade a single Armament to Legendary quality at the Smithing Altar.',
      'Objects: Ancient Forge Altar — upgrades any one Armament to Legendary quality; one per player.',
    ],
    sourceUrl: 'https://eldenring.fandom.com/wiki/Crater',
  },
  mountaintop: {
    title: 'Mountaintop',
    paragraphs: [
      'The First Peak is a large, scalable mountain that appears in the northwest quadrant of Limveld during the Mountaintop Shifting Earth event. This snowy location is populated by Giant Crows, Giant Dogs, and Snowfield Trolls. A rimed gale blows through the First Peak, the home of the Ice Dragons.',
      'Interacting with the blue ice crystals at the summit grants the party the Favor of the Mountaintop boon, which reduces Frostbite damage and buildup by 50%, and increases Attack Power whenever Frostbite procs nearby.',
      'Objects: Blue Ice Crystals — Favor of the Mountaintop.',
    ],
    sourceUrl: 'https://eldenring.fandom.com/wiki/Mountaintop',
  },
  rotted: {
    title: 'Rotted Woods',
    paragraphs: [
      'The Rotted Woods is a dense forest that appears in the southeast (bottom-right) quadrant of Limveld during the Rotted Woods Shifting Earth event. This location is populated by Giant Ants, Servants of Rot, and other creatures affected by Scarlet Rot.',
      'The forest is blighted by rot, but a tower of fire keeps it at bay. A red flower found within grants a protective blessing of the forest.',
      'This event is unlocked by defeating five different Nightlords.',
      'Objects: Miranda Flower — grants Favor of the Rotted Woods, which nullifies Scarlet Rot, increases max HP, and melee attacks after receiving damage partially recover HP. It is marked by Scarlet Butterflies and specks of red grace, in a tree at the randomly determined spot.',
    ],
    sourceUrl: 'https://eldenring.fandom.com/wiki/Rotted_Woods',
  },
  noklateo: {
    title: 'Noklateo, the Shrouded City',
    paragraphs: [
      'Noklateo, the Shrouded City is a lost Eternal City that appears in the southwest quadrant of Limveld during the Noklateo, the Shrouded City Shifting Earth event. This location is populated by the headless spirits of Mausoleum Knights and the Fallen Hawks. Basilisks lurk in the sewers.',
      'It contains a stone coffin that performs Armament Duplication.',
      'This event is unlocked by defeating seven different Nightlords.',
      "It can be accessed early during chapter 3 of Wylder's Remembrance quest.",
      'Objects: Secret Chest at the top — Favor of Noklateo, the Shrouded City: “Rise from near death, unaided, a single time and become more powerful for a short time”.',
    ],
    sourceUrl: 'https://eldenring.fandom.com/wiki/Noklateo,_the_Shrouded_City',
  },
  greatHollow: {
    title: 'Great Hollow',
    paragraphs: [
      'A vast chasm lying deep within Limveld, littered with strange ruins and Divine Towers that mark the remnants of an ancient civilization. Crystals within the Great Hollow radiate an accursed, life-draining mist.',
    ],
    sourceUrl: 'https://eldenring.fandom.com/wiki/The_Great_Hollow',
  },
}

export function getMapTypeText(mapType: MapTypeKey): MapTypeText {
  return mapTypeTexts[mapType]
}
