# Research: Checkout Console Rebuild

## Shared State and Component Structure

- **Decision**: Use Svelte 5 component-local state for view-specific behavior and shared reactive state only where multiple parts of the screen must stay synchronized.
- **Rationale**: The checkout, totals, admin modal, and live summary all update from the same interaction stream. Svelte 5's reactive state patterns and context support keep that coordination simple without prop drilling.
- **Alternatives considered**: A heavier global state library; prop drilling through deeply nested components; keeping all logic in one monolithic component.

## Responsive Styling

- **Decision**: Use Tailwind utility classes for the rebuilt UI, with responsive layout rules and container-aware composition where needed.
- **Rationale**: The interface needs to work on desktop and mobile, and Tailwind is well suited to compact responsive layouts with clear, testable markup.
- **Alternatives considered**: Handwritten CSS only; CSS modules; a component library that would constrain the current visual direction.

## Validation Strategy

- **Decision**: Cover core behavior with unit tests for state transitions and formatting, then verify end-to-end flows in a real browser for search, basket management, submission, and admin tasks.
- **Rationale**: The highest-risk behavior is interactive and cross-component, so browser-level verification is required in addition to smaller logic tests.
- **Alternatives considered**: Manual testing only; snapshot-only testing; unit tests without browser verification.

## External Data Contract

- **Decision**: Preserve the current read and write operations used by the existing checkout, summary, and admin experiences, including catalog, staff, dashboard, transaction, and maintenance actions.
- **Rationale**: The feature requirement is to keep behavior unchanged, so the rebuilt UI must continue speaking the same business contract to the data source.
- **Alternatives considered**: Replacing the data source; introducing local-only mock data; narrowing the admin feature set.
