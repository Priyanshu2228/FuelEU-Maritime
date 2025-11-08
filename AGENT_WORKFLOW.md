## Agents Used

- ChatGPT / OpenAI assistant (used for iterative coding, refactoring, tests, and documentation generation)
- GitHub Copilot (used locally by developer for inline suggestions).

## Prompts & Outputs

### Example 1 — Create ComputeCB use-case

*Prompt:*

> “Write a TypeScript function computeCB that accepts ghgIntensity (gCO2e/MJ), fuelConsumption in tons, and optional targetIntensity (default 89.3368). Return cb*gCO2e and energyMJ using energy = fuelConsumption * 41,000 MJ/t and formula cb = (target - actual) \_ energy.”

*AI Output:*

bash
export function computeCB({ ghgIntensity, fuelConsumptionTons, targetIntensity = 89.3368 }) {
    const energyMJ = fuelConsumptionTons * 41000;
    const cb_gCO2e = (targetIntensity - ghgIntensity) * energyMJ;
    return { cb_gCO2e, energyMJ };
}


*Result:*  
Verified math against assignment formula and added unit comments. Created unit test computeCB.test.ts to validate outputs numerically.

### Example 2 — Implement pooling allocation

*Prompt:*

> “Implement a greedy pooling allocation in TypeScript: allocate surplus CB to deficits by sorting providers and deficits, transfer greedily, enforce rules that deficits do not get worse and surpluses do not become negative. Persist Pool and PoolMember via Prisma.”

*AI Output:*

bash
// pseudo: sort providers desc, deficits asc, iterate deficits and take from providers


*Result:*  
Added explicit checks and persisted Pool/PoolMember using Prisma client. Wrote a unit test that verifies cb_after sums equal cb_before and constraints are respected. Adjusted implementation to throw errors on invalid input.

## Validation / Corrections

Throughout the project, generated code was validated using a combination of methods:

- Always wrote unit tests (Jest) for each numeric use-case (ComputeCB, ComputeComparison, Banking, Pooling). Tests executed locally.
- For database-backed tests, I ran local npx prisma generate and npx prisma migrate dev to ensure Prisma client and schema matched code generation; patched a few places with as any until the client was generated to avoid blocking edits.
- Verified API endpoints using the frontend and Postman-like Invoke-RestMethod calls when exercising the UI.
- Iterative Debugging:
  - TypeScript errors (e.g., Partial<Pick<...>> type mismatches) were fixed by building conditional where clauses.
  - Backend error logs like “Route not found” helped identify missing constraints, which were then fixed by adding year filters in the repository adapter.

## Observations

- *Where agent saved time*

  - Quickly scaffolded use-cases, controller stubs, and tests from high-level prompts.
  - Generated consistent TypeScript boilerplate and CRUD wiring for Prisma and Express.

- *Where agent failed or hallucinated*

  - Initial suggestions sometimes assumed existing exports or router shapes that didn't match the repository layout; required small manual fixes.
  - Type errors (TS strict) needed iterative corrections; I used tests and tsc --noEmit to find issues.

- *How tools were combined*
  - Used the AI assistant to generate code and tests, then locally executed tests and tsc to validate. Copilot provided inline suggestions during small edits.

## Best Practices Followed

- Kept domain logic (computeCB, pooling algorithm) separate from persistence layer (Prisma) in src/application/usecases.
- Wrote unit tests before and after refactors to lock in behavior.
- Kept prompts focused (one small task per prompt) and validated outputs with tests and type checks.