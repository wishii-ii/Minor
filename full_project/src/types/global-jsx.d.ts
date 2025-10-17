// Temporary global JSX declarations to satisfy the editor until full React types are installed.
// This file intentionally keeps types permissive so the project can open and the TS server
// can resolve the `JSX` namespace. Replace/remove once `@types/react` is installed.

declare namespace JSX {
    // Minimal Element type — use a generic object shape to satisfy lint rules
    interface Element { [key: string]: unknown }

    // Allow intrinsic attributes but use unknown to avoid eslint/no-explicit-any
    interface IntrinsicAttributes {
        [key: string]: unknown;
    }

    // Allow any DOM element names with unknown props — replace when @types/react is available
    interface IntrinsicElements {
        [elemName: string]: unknown;
    }
}
