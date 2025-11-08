# Reflection: Using AI Agents for the FuelEU Maritime Assignment

This short reflection summarizes lessons learned while using AI tools to build the FuelEU Maritime compliance module.

What I learned
- AI agents accelerate boilerplate creation and help iterate quickly on domain logic. Large repetitive patterns (Express controllers, Prisma adapters, tests) were scaffolded rapidly, letting me focus on business rules.
- Tests and type checks are essential. The AI can produce code fast, but TypeScript strict mode and unit tests caught subtle typing and logic issues that required manual corrections.

Efficiency gains vs manual coding
- Time saved: generating function skeletons, routers, and tests saved many minutes per file. The agent produced a working shape that I validated and refined.
- Manual work: verifying types, wiring Prisma clients, and ensuring correct imports still required human attention. AI output occasionally assumed existing exports or slightly different file shapes.

Improvements for next time
- Keep business logic centralized: move emission estimation out of persistence adapters and into use-cases (this was partially done, but can be cleaned further).
- Add stricter tests and fixtures for DB interactions (test DB snapshots, transactional tests).
- Maintain a clear `tasks.md` for the agent with granular prompts to reduce hallucination and misaligned assumptions.

Overall
- AI agents were a powerful assistant for scaffolding and iteration, but human oversight (tests, tsc, runtime checks) was critical to produce a correct and maintainable implementation.

