with open('script.js', 'r') as f:
    content = f.read()

new_molecule = """    polyacetylene: {
        title: "Trans-Polyacetylene",
        formula: "(C₂H₂)n",
        desc: "Polyacetylene is an organic polymer. The highly conductive form is the all-trans-isomer. Shown here is an all-trans oligomer (octatetraene) illustrating the alternating single and double bonds that allow for electrical conductivity when doped.",
        cid: "cid:5463164"
    },
    ppp: {
        title: "Poly(p-phenylene)",
        formula: "(C₆H₄)n",
        desc: "Poly(p-phenylene) (PPP) is a conductive polymer consisting of repeating p-phenylene rings. It is notable for its high thermal stability and potential applications in organic electronics. Shown here is a 3-ring oligomer (p-terphenyl) to represent its repeating backbone.",
        cid: "cid:7115"
    }"""

content = content.replace(
"""    polyacetylene: {
        title: "Trans-Polyacetylene",
        formula: "(C₂H₂)n",
        desc: "Polyacetylene is an organic polymer. The highly conductive form is the all-trans-isomer. Shown here is an all-trans oligomer (octatetraene) illustrating the alternating single and double bonds that allow for electrical conductivity when doped.",
        cid: "cid:5463164"
    }""",
    new_molecule
)

with open('script.js', 'w') as f:
    f.write(content)
