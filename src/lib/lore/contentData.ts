import { LoreCharacter, LoreContent } from './types'
import { pagesWebpUrl, pagesPngUrl } from '@/lib/pagesAssets'

export const nightlordsData: LoreCharacter[] = [
  {
    id: 'gladius',
    name: 'Gladius',
    title: 'Beast of Night (Tricephalos)',
    description: 'A three-headed wolf Nightlord possessing the ability to split into three separate wolves, wielding chain-link swords to hunt its prey.',
    lore: 'Gladius, Beast of Night, also known as Tricephalos, stands as one of the most fearsome Nightlords in the corrupted realm of Limveld. This massive three-headed wolf emerges from shadow carrying chain-link swords on its back, used to hunt down any prey that dares to challenge the eternal night. Between the fangs of its multiple heads flicker overwhelming flames that can incinerate anything in their path. When the beast is assailed by multiple enemies, it demonstrates its most terrifying ability: the power to split into three separate wolves, each maintaining the deadly coordination and pack tactics that make this Nightlord so feared across the darkened lands.',
    abilities: ['Three-Headed Form', 'Pack Splitting', 'Chain-Link Sword Combat', 'Flame Breath'],
    strengths: ['Multiple attack vectors', 'Pack coordination', 'Overwhelming flames', 'Relentless hunting'],
    weaknesses: ['Vulnerable to holy damage', 'Sacred light disrupts abilities', 'Split forms share damage'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/gladius-tricephalos-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['beast', 'wolf', 'fire', 'hunter', 'pack']
  },
  {
    id: 'adel',
    name: 'Adel',
    title: 'Baron of Night (Gaping Jaw)',
    description: 'A colossal dragon-type Nightlord with massive grinding jaws lined with teeth, capable of harboring lightning and devouring everything in its path.',
    lore: 'Adel, Baron of Night, also known as Gaping Jaw, represents the insatiable hunger that consumes the dark realm of Limveld. This colossal, crooked black-framed beast towers above the landscape with its most defining feature - massive jaws lined with grinding teeth designed to devour anything and everything it encounters. The creature\'s frame is capable of harboring and channeling lightning, making it not just a physical threat but an elemental force of destruction. What makes Adel particularly terrifying is its ability to consume entire landscapes, leaving nothing but devastation in its wake.',
    abilities: ['Gaping Maw Attack', 'Lightning Harboring', 'Grinding Teeth', 'Colossal Frame'],
    strengths: ['Massive size and reach', 'Lightning channeling', 'Devouring everything', 'Intimidating presence'],
    weaknesses: ['Vulnerable to poison', 'Slow movement', 'Predictable attack patterns'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/adel-gaping-jaw-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['dragon', 'baron', 'lightning', 'devourer', 'colossal']
  },
  {
    id: 'gnoster',
    name: 'Gnoster',
    title: 'Wisdom of Night (Sentient Pest)',
    description: 'A dual-creature Nightlord composed of a flying insect that rains magical light and living shears that trail the earth, working in deadly coordination.',
    lore: 'Gnoster, Wisdom of Night, also known as Sentient Pest, represents one of the most unique and dangerous encounters among the Nightlords. This boss is actually composed of two separate creatures that share a single health pool and work in perfect, deadly coordination. The first component is a massive flying moth-like insect that soars through the air, raining down magical light attacks that can devastate those caught below. Those fortunate enough to escape the moth\'s aerial assault often find themselves facing the second component: living shears that trail across the earth, ready to inject parasitic poison into any who dare to challenge this strange Nightlord.',
    abilities: ['Magical Light Rain', 'Coordinated Assault', 'Parasitic Poison', 'Dual-Form Combat'],
    strengths: ['Two-pronged attacks', 'Aerial and ground coverage', 'Poison injection', 'Shared health pool'],
    weaknesses: ['Vulnerable to fire damage', 'Cannot be fought separately', 'Predictable coordination patterns'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/gnoster-sentient-pest-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['insect', 'wisdom', 'poison', 'dual-form', 'magic']
  },
  {
    id: 'maris',
    name: 'Maris',
    title: 'Fathom of Night (Augur)',
    description: 'An unknown aquatic entity that drifts through the skies, transforming its surroundings into an ocean to blend with whatever life it encounters.',
    lore: 'Maris, Fathom of Night, also known as Augur, represents one of the most mysterious and ethereal threats among the Nightlords. This unknown entity defies conventional understanding, existing as an aquatic being that somehow drifts through the very skies themselves. What makes Maris particularly dangerous is its ability to make an ocean of its surroundings, fundamentally altering the battlefield to suit its aquatic nature. This environmental manipulation allows the creature to blend seamlessly with whatever life it encounters, making it nearly impossible to distinguish between the Nightlord and the transformed landscape it creates.',
    abilities: ['Ocean Creation', 'Environmental Manipulation', 'Sleep Induction', 'Reality Blending'],
    strengths: ['Environmental control', 'Illusion weaving', 'Sleep attacks', 'Fluid movement'],
    weaknesses: ['Vulnerable to lightning', 'Reliant on water manipulation', 'Disrupted by electrical attacks'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/maris-augur-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['aquatic', 'fathom', 'augur', 'dreams', 'ocean']
  },
  {
    id: 'libra',
    name: 'Libra',
    title: 'Creature of Night (Equilibrious Beast)',
    description: 'A goat-headed humanoid being skilled in dubious alchemy, who offers corrupting bargains that test the sanity and resolve of those who face it.',
    lore: 'Libra, Creature of Night, also known as Equilibrious Beast, stands as one of the most psychologically dangerous Nightlords that warriors can encounter. This goat-headed being who pretends to be a man possesses an unsettling mastery of dubious alchemy and the art of the deal. Before combat even begins, Libra appears as the Scale-bearing Merchant, presenting warriors with a series of tempting bargains that always come with a terrible price. Each deal offers great power in exchange for sanity, health, or worse, creating a psychological battle that begins long before weapons are drawn.',
    abilities: ['Corrupting Bargains', 'Dubious Alchemy', 'Madness Induction', 'Scale-bearing Commerce'],
    strengths: ['Psychological manipulation', 'Pre-combat advantages', 'Madness spreading', 'Tempting offers'],
    weaknesses: ['Vulnerable to madness', 'Weak to holy damage', 'Susceptible to fire', 'Own corruption affects it'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/libra-equilibrious-beast-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['goat', 'alchemy', 'madness', 'merchant', 'corruption']
  },
  {
    id: 'fulghor',
    name: 'Fulghor',
    title: 'Champion of Nightglow (Darkdrift Knight)',
    description: 'An ancient centaur warrior consumed with divine battle fervor, wielding a sacred form of the Night\'s power while serving the radiant gods.',
    lore: 'Fulghor, Champion of Nightglow, also known as Darkdrift Knight, stands as a paradoxical figure among the Nightlords - a being of darkness who still burns with fervor for the gods he once served. This ancient centaur warrior represents the tragic fusion of divine devotion and corrupted power, consumed with an eternal battle that rages within his very soul. His fervor for the gods he serves yet burns within him, even as he has been transformed by the Night\'s influence into something far removed from his original divine purpose. The Champion conceals himself within thunder, using divine storms as both weapon and shield.',
    abilities: ['Sacred Night Power', 'Divine Storm Connection', 'Centaur Combat', 'Righteous Fury'],
    strengths: ['Divine-dark hybrid power', 'Thunder concealment', 'Ancient warrior skill', 'Sacred fervor'],
    weaknesses: ['Vulnerable to lightning', 'Conflicted nature', 'Memories of former glory'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/fulghor-darkdrift-knight-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['centaur', 'champion', 'divine', 'thunder', 'corruption']
  },
  {
    id: 'caligo',
    name: 'Caligo',
    title: 'Miasma of Night (Fissure in the Fog)',
    description: 'A prehistoric dragon that lurks within impenetrable fog, using frost and frigid mist to purloin the living warmth from its victims.',
    lore: 'Caligo, Miasma of Night, also known as Fissure in the Fog, represents one of the most ancient and elemental threats among the Nightlords. This prehistoric dragon has existed since time immemorial, lurking within the depths of impenetrable fog that serves as both its domain and its weapon. The great shadowy pair of eyes that emerge from the frigid mist are said to appear at history\'s great junctures, suggesting that Caligo has been a witness to and participant in the most significant events that have shaped the world. The dragon uses frost and frigid mist to purloin the living warmth from its victims, leaving them as frozen husks.',
    abilities: ['Fog Manipulation', 'Frost Mastery', 'Warmth Theft', 'Ancient Dragon Power'],
    strengths: ['Impenetrable fog concealment', 'Temperature control', 'Life force drain', 'Prehistoric wisdom'],
    weaknesses: ['Vulnerable to fire damage', 'Fog can be dispersed', 'Ancient but predictable patterns'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/caligo-fissure-in-the-fog-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['dragon', 'fog', 'frost', 'ancient', 'prehistoric']
  },
  {
    id: 'heolstor',
    name: 'Heolstor',
    title: 'The Nightlord (Night Aspect)',
    description: 'The origin of the Night itself, appearing as a hazy figure beyond the boundless darkness - the primordial enemy to the world.',
    lore: 'Heolstor the Nightlord, also known as the Night Aspect, stands as the ultimate source of the darkness that has consumed Limveld and transformed the once-thriving Lands Between into a realm of eternal night. Beyond the boundless Night, there lies the hazy figure of a person - and that figure is Heolstor, the Night\'s origin and the fundamental enemy to the world itself. Unlike the other Nightlords who were transformed or corrupted by the Night\'s influence, Heolstor is the primordial source from which all darkness flows, making him both the most dangerous and most important target for any who would restore light to the world.',
    abilities: ['Night Generation', 'Primordial Power', 'Reality Corruption', 'Darkness Embodiment'],
    strengths: ['Source of all Night', 'Primordial authority', 'Reality manipulation', 'Ultimate darkness'],
    weaknesses: ['Vulnerable to holy damage', 'Opposed by sacred light', 'Tied to Night\'s existence'],
    imageUrl: pagesPngUrl('/Images/nightlordIcons/heolstor-night-aspect-elden-ring-nightreign-icon.png'),
    category: 'nightlord',
    tags: ['primordial', 'night', 'origin', 'darkness', 'ultimate']
  }
]

export const nightfarersData: LoreCharacter[] = [
  {
    id: 'wylder',
    name: 'Wylder',
    title: 'The Clanless Survivor',
    description: 'The sole survivor of his clan after a horrific battle on Windwail Knoll, driven by the memory of his fallen family.',
    lore: 'A long night persisted, driving his clansfolk to madness. After a horrific battle, all that remains upon Windwail Knoll is a sea of gravestones. After the deaths of cousin Farhad, Little Shirin, and his own father, the clan\'s chieftain, the Wylder discovers that only he remains. Once a member of a proud clan that called Windwail Knoll home, Wylder now stands as the sole survivor of a tragedy that claimed everyone he ever loved. The long night brought madness to his people, turning family against family in a battle so terrible that when dawn finally came, only gravestones remained. He carries the weight of being the last, the burden of memories, and the responsibility to honor those who fell. His Remembrance Quest reveals the deep pain of loss and the strength required to continue when everything familiar has been destroyed.',
    abilities: ['Clan Combat Techniques', 'Survival Instincts', 'Memory-Driven Fury', 'Lone Wolf Tactics'],
    strengths: ['Battle-hardened survivor', 'Driven by purpose', 'Adaptable fighter', 'Strong willpower'],
    weaknesses: ['Haunted by loss', 'Carries emotional burden', 'Tendency toward isolation'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/wylder.webp?v=2024'),
    category: 'nightfarer',
    tags: ['survivor', 'clan', 'tragedy', 'memory', 'lone-warrior']
  },
  {
    id: 'guardian',
    name: 'Guardian',
    title: 'The Protective Witch',
    description: 'A guardian bound to protect others, wielding mystical powers and bearing the burden of magical responsibility.',
    lore: 'The Guardian serves as a protector with deep connections to mystical forces and witchcraft. Their Remembrance Quest involves complex magical choices and moral decisions that test both their protective nature and their understanding of magical responsibility. Players must navigate through various challenges that reveal the Guardian\'s commitment to shielding others from harm, even at great personal cost. The quest culminates in significant decisions about magical artifacts like the Witch\'s Brooch or the Cracked Witch\'s Brooch, each representing different paths of magical practice. The Guardian\'s story explores themes of duty, sacrifice, and the price of wielding protective magic in a world where such power can be both blessing and curse.',
    abilities: ['Protective Magic', 'Witch Craft', 'Guardian Bond', 'Mystical Ward'],
    strengths: ['Magical protection', 'Strong moral compass', 'Defensive mastery', 'Selfless nature'],
    weaknesses: ['Burden of responsibility', 'Magical limitations', 'Self-sacrificing tendency'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/guardian.webp?v=2024'),
    category: 'nightfarer',
    tags: ['protection', 'magic', 'witch', 'guardian', 'responsibility']
  },
  {
    id: 'ironeye',
    name: 'Ironeye',
    title: 'The Fellowship Investigator',
    description: 'A methodical investigator and member of the Fellowship, dedicated to uncovering truth and completing dangerous missions.',
    lore: 'Ironeye serves as an investigator for the Fellowship, an organization dedicated to understanding and combating the threats that plague their world. As evidenced by the reports he writes addressed to the Fellowship, Ironeye approaches his work with methodical precision and analytical thinking. His Remembrance Quest involves challenging the Night Aspect Heolstor itself, requiring players to first unlock this ultimate Nightlord by defeating four different Nightlords. The final confrontation requires Ironeye to face the source of the Night\'s power, making his story one of investigation, determination, and ultimate confrontation with the darkest forces. His choice to "Clench Dagger" in the final moments reveals a warrior\'s resolve beneath the investigator\'s analytical exterior.',
    abilities: ['Investigation Skills', 'Analytical Combat', 'Fellowship Training', 'Precision Strikes'],
    strengths: ['Methodical approach', 'Strong deduction', 'Fellowship resources', 'Determined focus'],
    weaknesses: ['Overly analytical', 'Bound by duty', 'Emotional detachment'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/ironeye.webp?v=2024'),
    category: 'nightfarer',
    tags: ['investigator', 'fellowship', 'analytical', 'methodical', 'night-aspect']
  },
  {
    id: 'duchess',
    name: 'Duchess',
    title: 'The Noble Baker',
    description: 'A noble who has taken up the humble art of baking, finding purpose in providing sustenance and comfort to others.',
    lore: 'The Duchess has embraced an unexpected role in her post-noble life - that of a baker. Her Remembrance Quest involves interactions with other Nightfarers, particularly the Wylder, and reveals her dedication to providing comfort through the simple act of baking bread. As she herself notes, "Baking the bread you requested is proving to be far more difficult than expected," showing her commitment to mastering this craft despite its challenges. Her quest involves traveling to Limveld to investigate important locations and messages, demonstrating that even in her new role, she maintains the investigative skills and leadership qualities of her noble past. The Duchess represents transformation and finding new purpose, showing that nobility can be expressed through service and care for others.',
    abilities: ['Noble Training', 'Culinary Arts', 'Leadership Skills', 'Diplomatic Grace'],
    strengths: ['Natural leader', 'Caring nature', 'Adaptive skills', 'Noble bearing'],
    weaknesses: ['High standards', 'Perfectionist tendencies', 'Burden of expectations'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/duchess.webp?v=2024'),
    category: 'nightfarer',
    tags: ['noble', 'baker', 'service', 'transformation', 'leadership']
  },
  {
    id: 'raider',
    name: 'Raider',
    title: 'The Tournament Champion',
    description: 'A warrior who found glory in the Tournament of the Lands Between, always seeking greater challenges and victories.',
    lore: 'The Raider\'s identity is deeply tied to martial achievement and the pursuit of glory through combat. Having participated in and completed the Tournament of the Lands Between, he experienced the satisfaction of victory and the validation that comes with proving oneself against worthy opponents. As he reflects, "The Tourney of the Lands Between was finished, and once again he found himself peering at his white-horned helmet. It was a good feeling. But he wanted more." This desire for greater challenges and more significant victories drives his continuing journey. The Raider represents the warrior\'s eternal quest for meaning through combat, the need to constantly prove oneself, and the hunger for ever-greater achievements that can never be fully satisfied.',
    abilities: ['Tournament Combat', 'Competitive Fighting', 'Glory-Seeking Drive', 'Battle Prowess'],
    strengths: ['Proven warrior', 'Competitive spirit', 'Battle experience', 'Victory-focused'],
    weaknesses: ['Never satisfied', 'Glory-obsessed', 'Constantly seeking challenges'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/raider.webp?v=2024'),
    category: 'nightfarer',
    tags: ['tournament', 'champion', 'glory', 'competitive', 'warrior']
  },
  {
    id: 'revenant',
    name: 'Revenant',
    title: 'The Family Summoner',
    description: 'A warrior connected to ancestral spirits, able to summon family members to aid in battle against dark forces.',
    lore: 'The Revenant possesses a unique and deeply personal connection to the spiritual realm, specifically to family members who have passed on. This connection allows them to summon family member allies during combat, creating a powerful bond between the living and the dead. Their Remembrance Quest involves investigating mysterious locations like mansion-like buildings with paintings and confronting Corrosion enemies that threaten the spiritual balance. The Revenant\'s ability to call upon deceased family members in battle represents not just a combat technique, but a profound spiritual connection that bridges the gap between life and death. This power comes with both strength and burden, as maintaining such connections to the past can be both empowering and emotionally challenging.',
    abilities: ['Family Spirit Summoning', 'Spiritual Connection', 'Ancestral Combat', 'Death Resistance'],
    strengths: ['Spirit allies', 'Family bond power', 'Spiritual resilience', 'Unique summoning'],
    weaknesses: ['Tied to the past', 'Spiritual burden', 'Emotional vulnerability'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/revenant.webp?v=2024'),
    category: 'nightfarer',
    tags: ['spirits', 'family', 'summoning', 'ancestral', 'connection']
  },
  {
    id: 'recluse',
    name: 'Recluse',
    title: 'The Infant\'s Guardian',
    description: 'A solitary figure haunted by the disappearance of their Infant, convinced of a connection to the Nightlords.',
    lore: 'The Recluse carries a deeply personal and tragic burden - the mysterious disappearance of their Infant. This loss haunts them, and they have become convinced that their child\'s disappearance is somehow connected to the Nightlords themselves. As the Recluse states, "I am certain, after mine Infant disappeared itself that day, it must have had an audience with the Nightlord." Their Remembrance Quest involves complex magical procedures, including imbuing shards of Night with sorcerous power and investigating strange blue auras and mystical vestiges. The quest requires completing multiple expeditions and facing Heolstor the Nightlord, suggesting that their search for answers about their lost child will take them to the very heart of the Night\'s power. The Recluse represents parental love, loss, and the lengths one will go to find truth about a missing loved one.',
    abilities: ['Sorcerous Power', 'Night Shard Manipulation', 'Mystical Investigation', 'Solitary Survival'],
    strengths: ['Magical aptitude', 'Determined searcher', 'Independent nature', 'Mystical knowledge'],
    weaknesses: ['Consumed by loss', 'Isolated existence', 'Obsessive behavior'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/recluse.webp?v=2024'),
    category: 'nightfarer',
    tags: ['loss', 'mystery', 'infant', 'sorcery', 'nightlord-connection']
  },
  {
    id: 'executor',
    name: 'Executor',
    title: 'The Sacred Seeker',
    description: 'A warrior dedicated to finding sacred artifacts and assisting in holy missions across the dangerous lands.',
    lore: 'The Executor serves a higher purpose, working closely with religious figures like the Priestess to locate sacred artifacts and complete holy missions. Their Remembrance Quest involves accepting assignments from the Priestess at the Roundtable Hold and venturing into dangerous territories like Limveld to find mystical items such as golden sprouts. This work requires not only combat skills but also the dedication to serve a sacred cause, often at great personal risk. The Executor\'s willingness to undertake these perilous missions for the sake of higher powers demonstrates both faith and courage. Their role as a sacred seeker places them at the intersection of the spiritual and physical worlds, making them essential for missions that require both martial prowess and divine purpose.',
    abilities: ['Sacred Mission Training', 'Religious Dedication', 'Artifact Location', 'Divine Purpose'],
    strengths: ['Strong faith', 'Mission-focused', 'Brave explorer', 'Religious backing'],
    weaknesses: ['Bound by duty', 'Rigid beliefs', 'Dangerous assignments'],
    imageUrl: pagesWebpUrl('/Images/nightfarers/executor.webp?v=2024'),
    category: 'nightfarer',
    tags: ['sacred', 'priestess', 'mission', 'faith', 'artifacts']
  }
]

export const loreContent: LoreContent = {
  nightlords: nightlordsData,
  nightfarers: nightfarersData
}