# Outcome chain (create and capture)

> Portable craft. Before claiming product or strategy SoT, name the three outcome layers **and** both value-create and value-capture. A chain that only shows customer value is incomplete as business strategy.

Primary sources (Paweł Huryn / The Product Compass):
- Business vs Product vs Customer outcomes
- Extended Opportunity Solution Tree (create vs capture; free-too-rich / paid-too-thin as a business opportunity)

Related: Teresa Torres Opportunity Solution Tree — excellent for customer opportunities; it was not designed to analyse capture.

## Trunk (three layers, bottom up)

1. **Customer outcome** — the customer's goal, in the customer's language. Not our dashboard names.
2. **Product outcome** — a measurable change in **human behaviour**. This is the only layer the team directly influences.
3. **Business outcome** — organisation metric (revenue, margin, churn, cost, risk). Usually lagging.

Product teams work the product-outcome layer, by solving customer problems that they believe will move it, which they believe will move the business outcome.

## Create and capture (both required)

The three-layer chain describes **value creation**. Every product also **captures** a share of that value for the organisation.

If you only walk the customer chain you will miss capture defects (example class: too much value in the free surface, too little in the paid surface). That is not a customer-opportunity miss; it is a business-opportunity miss. Name both paths.

## Coefficients

Links between layers need **measured** conversion, not a round-number guess.

- Data exists → use it.
- Data missing → build a **parametric** chain and name the **break-even** (what would have to be true for the bet to pay). Do not invent a coefficient and then treat it as fact.

## When it applies

Claiming product/strategy SoT, or recommending a bet that moves money, pricing, packaging, or tenancy. Does **not** apply to routine ingest ticks or a single bugfix with no strategy claim.

## Gate

`assertOutcomeChain` in `src/lib/outcome-chain.ts` (`npm run eval:outcome-chain`).

## Validity boundary

Does not invent pricing policy. When create and capture conflict, escalate an A/B/C with a recommendation — do not silently pick "always more customer value." Does not replace books-of-record money accuracy.
