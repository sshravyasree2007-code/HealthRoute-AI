---
name: HealthRoute AI prototype scope
description: Scope boundary for real patient and hospital data or external services in the HealthRoute AI prototype.
---

Keep the HealthRoute AI prototype on clearly labeled synthetic sample data. Do not add paid APIs or external integrations unless the user approves them.

**Why:** The user requested a basic runnable website prototype and explicitly said to use sample hospital data only and not add paid APIs or external integrations yet.

**How to apply:** For future HealthRoute AI changes, preserve the sample-data labeling and do not connect third-party services or source real healthcare records until the user approves that scope.

Preserve existing HealthRoute AI features and their current designs when adding new modules. Add new functionality alongside the established dashboard, directory, and booking flows rather than replacing or redesigning them.

**Why:** The user has repeatedly asked that enhancements not remove or redesign current features.

**How to apply:** Integrate new routes or modules additively, and verify the existing user flows after each change.
