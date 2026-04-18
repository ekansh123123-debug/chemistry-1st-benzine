export const reactions = [
  {
    title: "1. Nitration",
    equation: "C₆H₆ + HNO₃ (conc.) &rarr; C₆H₅NO₂ + H₂O",
    description: "Benzene reacts with a mixture of concentrated nitric acid and concentrated sulfuric acid (nitrating mixture) at 50°C to form nitrobenzene. Sulfuric acid acts as a catalyst to generate the electrophile (NO₂⁺)."
  },
  {
    title: "2. Sulfonation",
    equation: "C₆H₆ + H₂SO₄ (fuming) &rarr; C₆H₅SO₃H + H₂O",
    description: "Heating benzene with fuming sulfuric acid (oleum) produces benzenesulfonic acid. The electrophile in this reaction is SO₃ or HSO₃⁺."
  },
  {
    title: "3. Halogenation (Chlorination)",
    equation: "C₆H₆ + Cl₂ &rarr; C₆H₅Cl + HCl",
    description: "In the presence of a Lewis acid catalyst like FeCl₃ or AlCl₃, benzene reacts with chlorine to form chlorobenzene. The catalyst generates the strong Cl⁺ electrophile."
  },
  {
    title: "4. Halogenation (Bromination)",
    equation: "C₆H₆ + Br₂ &rarr; C₆H₅Br + HBr",
    description: "Similar to chlorination, benzene reacts with bromine in the presence of FeBr₃ to form bromobenzene. The electrophile is Br⁺."
  },
  {
    title: "5. Friedel-Crafts Alkylation",
    equation: "C₆H₆ + CH₃Cl &rarr; C₆H₅CH₃ + HCl",
    description: "Benzene reacts with an alkyl halide (e.g., methyl chloride) in the presence of anhydrous AlCl₃ to form an alkylbenzene (e.g., toluene). The electrophile is a carbocation."
  },
  {
    title: "6. Friedel-Crafts Acylation",
    equation: "C₆H₆ + CH₃COCl &rarr; C₆H₅COCH₃ + HCl",
    description: "Reaction of benzene with an acyl chloride (e.g., acetyl chloride) and AlCl₃ produces an aromatic ketone (e.g., acetophenone). The electrophile is the acylium ion (CH₃CO⁺)."
  },
  {
    title: "7. Hydrogenation (Addition)",
    equation: "C₆H₆ + 3H₂ &rarr; C₆H₁₂",
    description: "Under high temperature and pressure, in the presence of a metal catalyst like Ni, Pt, or Pd, benzene adds three molecules of hydrogen to form cyclohexane."
  },
  {
    title: "8. Halogenation (Addition)",
    equation: "C₆H₆ + 3Cl₂ &rarr; C₆H₆Cl₆",
    description: "In the presence of ultraviolet (UV) light and absence of a catalyst, benzene adds three molecules of chlorine to form Benzene Hexachloride (BHC), also known as Gammexane."
  },
  {
    title: "9. Combustion",
    equation: "2C₆H₆ + 15O₂ &rarr; 12CO₂ + 6H₂O",
    description: "Like other hydrocarbons, benzene burns in an excess of oxygen to produce carbon dioxide and water. Because of its high carbon-to-hydrogen ratio, it typically burns with a sooty flame."
  },
  {
    title: "10. Oxidation (V₂O₅ Catalyst)",
    equation: "2C₆H₆ + 9O₂ &rarr; 2C₄H₂O₃ + 4CO₂ + 4H₂O",
    description: "Benzene undergoes oxidation when heated with oxygen at 450°C in the presence of a vanadium pentoxide (V₂O₅) catalyst to produce maleic anhydride."
  },
  {
    title: "11. Ozonolysis",
    equation: "C₆H₆ + 3O₃ &rarr; C₆H₆O₉ &rarr; 3 CHO-CHO",
    description: "Benzene reacts with ozone to form benzene triozonide. Subsequent reduction with zinc and water yields three molecules of glyoxal (ethanedial). This reaction proves the presence of three double bonds."
  },
  {
    title: "12. Gattermann-Koch Formylation",
    equation: "C₆H₆ + CO + HCl &rarr; C₆H₅CHO",
    description: "Benzene reacts with carbon monoxide and hydrogen chloride in the presence of AlCl₃/CuCl catalyst to form benzaldehyde. The effective electrophile is the formyl cation (HCO⁺)."
  },
  {
    title: "13. Birch Reduction",
    equation: "C₆H₆ + 2Na + 2NH₃ + 2ROH &rarr; C₆H₈ + 2RONa + 2NaNH₂",
    description: "Benzene is reduced to 1,4-cyclohexadiene by treating it with an alkali metal (like sodium or lithium) in liquid ammonia and an alcohol. This is a partial reduction."
  },
  {
    title: "14. Mercuration",
    equation: "C₆H₆ + Hg(OOCCH₃)₂ &rarr; C₆H₅HgOOCCH₃ + CH₃COOH",
    description: "Heating benzene with mercuric acetate results in the substitution of a hydrogen atom by the acetoxymercuri group, forming phenylmercuric acetate."
  },
  {
    title: "15. Chloromethylation",
    equation: "C₆H₆ + HCHO + HCl &rarr; C₆H₅CH₂Cl + H₂O",
    description: "Reaction of benzene with formaldehyde and hydrogen chloride in the presence of ZnCl₂ introduces a chloromethyl group (-CH₂Cl) onto the benzene ring, forming benzyl chloride."
  }
];

export function renderReactions() {
  const container = document.getElementById('reactions-container');

  reactions.forEach(reaction => {
    const card = document.createElement('div');
    card.className = 'reaction-card';

    card.innerHTML = `
      <h3 class="reaction-title">${reaction.title}</h3>
      <div class="reaction-equation">${reaction.equation}</div>
      <p class="reaction-desc">${reaction.description}</p>
    `;

    container.appendChild(card);
  });
}
