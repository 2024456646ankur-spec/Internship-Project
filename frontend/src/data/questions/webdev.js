// ---------------------------------------------------------------------------
// Web Dev — 6 topics x 15 questions
// ---------------------------------------------------------------------------

export const javascriptEs6Questions = [
    {
        id: "webdev-js-01",
        topicId: "javascript-es6",
        question: "What is the key difference between `let` and `var` in JavaScript?",
        options: [
            "`let` is block-scoped while `var` is function-scoped",
            "`let` can be redeclared in the same scope while `var` cannot",
            "`var` supports the temporal dead zone while `let` does not",
            "There is no functional difference, only stylistic preference",
        ],
        correctIndex: 0,
        explanation:
            "`let` declarations are scoped to the nearest enclosing block (e.g. an `if` or `for` block), whereas `var` is scoped to the entire function it's declared in, ignoring block boundaries. This is why `var` inside a loop can leak outside the loop body.",
    },
    {
        id: "webdev-js-02",
        topicId: "javascript-es6",
        question: "What does the following arrow function return?\n```js\nconst double = x => x * 2;\n```",
        options: [
            "Twice the value of `x`, using an implicit return",
            "`undefined`, because arrow functions need explicit `return`",
            "A new function that takes no arguments",
            "A syntax error, since arrow functions require parentheses around a single parameter",
        ],
        correctIndex: 0,
        explanation:
            "When an arrow function body is a single expression without curly braces, that expression's value is implicitly returned. Parentheses around a single parameter are optional, so `x => x * 2` is valid and returns `x * 2`.",
    },
    {
        id: "webdev-js-03",
        topicId: "javascript-es6",
        question: "What will this destructuring assignment produce?\n```js\nconst { a, b = 10 } = { a: 5 };\nconsole.log(a, b);\n```",
        options: ["5 10", "5 undefined", "undefined 10", "ReferenceError"],
        correctIndex: 0,
        explanation:
            "Destructuring pulls `a` from the object, giving it the value `5`. Since `b` isn't present in the object, its default value of `10` is used instead, so the output is `5 10`.",
    },
    {
        id: "webdev-js-04",
        topicId: "javascript-es6",
        question: "What is the purpose of the spread operator (`...`) in `const merged = [...arr1, ...arr2];`?",
        options: [
            "It expands the elements of `arr1` and `arr2` into a new array",
            "It concatenates the arrays into nested sub-arrays",
            "It converts both arrays into a single string",
            "It mutates `arr1` to include the elements of `arr2`",
        ],
        correctIndex: 0,
        explanation:
            "The spread operator unpacks the individual elements of an iterable. Inside an array literal, `...arr1` and `...arr2` insert each element in place, producing a new flat array without mutating either original array.",
    },
    {
        id: "webdev-js-05",
        topicId: "javascript-es6",
        question: "Why are template literals (`` `Hello, ${name}!` ``) preferred over string concatenation?",
        options: [
            "They allow embedded expressions and multi-line strings with cleaner syntax",
            "They execute faster than the `+` operator in all JavaScript engines",
            "They automatically HTML-escape any interpolated values",
            "They are the only way to include a variable inside a string",
        ],
        correctIndex: 0,
        explanation:
            "Template literals use backticks and `${}` to embed expressions directly inside a string, and they natively support line breaks without escape characters, which makes multi-line and expression-heavy strings much more readable than repeated `+` concatenation.",
    },
    {
        id: "webdev-js-06",
        topicId: "javascript-es6",
        question: "What does `Object.freeze(obj)` do?",
        options: [
            "Prevents new properties from being added and existing ones from being changed or deleted",
            "Deep-clones the object so mutations don't affect the original",
            "Converts the object into an immutable class instance",
            "Locks the object so it can only be read from a `try/catch` block",
        ],
        correctIndex: 0,
        explanation:
            "`Object.freeze` makes an object's own properties non-writable and non-configurable at the top level, so attempts to add, remove, or reassign properties silently fail in non-strict mode (or throw in strict mode). Note it is shallow — nested objects are not frozen.",
    },
    {
        id: "webdev-js-07",
        topicId: "javascript-es6",
        question: "What value does a `Promise` returned by `async function foo() { return 42; }` resolve to?",
        options: ["42", "A pending Promise that never resolves", "undefined", "A Promise wrapping another Promise indefinitely"],
        correctIndex: 0,
        explanation:
            "Any `async` function implicitly wraps its return value in a resolved Promise. Returning `42` produces a Promise that resolves to `42`, which callers can access via `.then()` or `await`.",
    },
    {
        id: "webdev-js-08",
        topicId: "javascript-es6",
        question: "What is the main advantage of `Promise.all()` over awaiting multiple promises sequentially?",
        options: [
            "It runs all promises concurrently and resolves once every promise settles successfully",
            "It guarantees promises execute in the exact order they were declared",
            "It automatically retries any promise that rejects",
            "It converts async functions into synchronous ones",
        ],
        correctIndex: 0,
        explanation:
            "`Promise.all()` takes an array of promises and starts them all at once rather than waiting for one to finish before starting the next. It resolves with an array of results only when every promise fulfills, or rejects immediately if any one of them rejects.",
    },
    {
        id: "webdev-js-09",
        topicId: "javascript-es6",
        question: "What does the optional chaining operator do in `user?.address?.city`?",
        options: [
            "Returns `undefined` instead of throwing if `user` or `address` is null/undefined",
            "Creates `address` and `city` as empty objects if they don't exist",
            "Throws a custom error message when a property is missing",
            "Only works on arrays, not on plain objects",
        ],
        correctIndex: 0,
        explanation:
            "Optional chaining short-circuits and evaluates to `undefined` as soon as it encounters a `null` or `undefined` reference in the chain, instead of throwing a `TypeError` for accessing a property on `null`/`undefined`. This avoids verbose manual null checks.",
    },
    {
        id: "webdev-js-10",
        topicId: "javascript-es6",
        question: "What is a JavaScript `Map` used for, compared to a plain object?",
        options: [
            "It allows keys of any type (including objects and functions) and preserves insertion order reliably",
            "It can only store string keys, just like a regular object",
            "It is automatically garbage collected differently and cannot be iterated",
            "It is purely a performance optimization with an identical API to objects",
        ],
        correctIndex: 0,
        explanation:
            "Unlike plain objects, whose keys are coerced to strings (or Symbols), a `Map` can use any value — including objects, functions, or NaN — as a key, and it guarantees iteration order matches insertion order, which plain objects historically did not guarantee for all key types.",
    },
    {
        id: "webdev-js-11",
        topicId: "javascript-es6",
        question: "What will `[1, [2, 3], [4, [5, 6]]].flat(2)` return?",
        options: ["[1, 2, 3, 4, 5, 6]", "[1, 2, 3, 4, [5, 6]]", "[1, [2, 3], 4, 5, 6]", "[1, 2, 3, 4, 5, [6]]"],
        correctIndex: 0,
        explanation:
            "`.flat(depth)` flattens nested arrays up to the specified depth. With depth `2`, it flattens both the outer `[2, 3]` nesting and the inner `[5, 6]` nesting, producing a single flat array `[1, 2, 3, 4, 5, 6]`.",
    },
    {
        id: "webdev-js-12",
        topicId: "javascript-es6",
        question: "In `class Animal { #name; constructor(name) { this.#name = name; } }`, what does `#name` represent?",
        options: [
            "A private class field, only accessible from within the class body",
            "A public field that is hidden from `console.log` output only",
            "A deprecated syntax replaced by `private` keyword in modern JS",
            "A computed property name based on a hash function",
        ],
        correctIndex: 0,
        explanation:
            "The `#` prefix denotes a private class field, a feature that enforces true encapsulation at the language level — attempting to access `#name` from outside the class (e.g. `animal.#name`) throws a syntax error, unlike the older convention of prefixing names with an underscore.",
    },
    {
        id: "webdev-js-13",
        topicId: "javascript-es6",
        question: "What does the nullish coalescing operator (`??`) do differently from `||`?",
        options: [
            "`??` only falls back when the left side is `null` or `undefined`, while `||` falls back on any falsy value",
            "`??` and `||` behave identically in all cases",
            "`??` throws an error if the left side is falsy",
            "`??` only works with numbers, while `||` works with all types",
        ],
        correctIndex: 0,
        explanation:
            "`||` treats any falsy value (`0`, `''`, `false`, `NaN`, `null`, `undefined`) as a reason to use the right-hand side. `??` is stricter — it only uses the fallback when the left side is specifically `null` or `undefined`, which avoids accidentally overriding valid values like `0` or `''`.",
    },
    {
        id: "webdev-js-14",
        topicId: "javascript-es6",
        question: "What is the output of the following code?\n```js\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
        options: ["0 1 2", "3 3 3", "0 0 0", "undefined undefined undefined"],
        correctIndex: 0,
        explanation:
            "Because `let` creates a new binding of `i` scoped to each loop iteration, each `setTimeout` callback closes over its own separate `i`. This is different from `var`, which would share a single binding and print `3 3 3`.",
    },
    {
        id: "webdev-js-15",
        topicId: "javascript-es6",
        question: "What is a JavaScript `Set` best used for?",
        options: [
            "Storing a collection of unique values with fast membership checks",
            "Storing key-value pairs like a dictionary",
            "Guaranteeing values are sorted automatically",
            "Replacing arrays entirely since it supports index-based access",
        ],
        correctIndex: 0,
        explanation:
            "A `Set` automatically discards duplicate values — adding an existing value again has no effect — and provides an efficient `.has()` method for checking membership, which makes it ideal for deduplicating data or tracking unique items.",
    },
];

export const typescriptBasicsQuestions = [
    {
        id: "webdev-ts-01",
        topicId: "typescript-basics",
        question: "What is the primary benefit TypeScript adds on top of JavaScript?",
        options: [
            "Static type checking at compile time to catch type-related errors before runtime",
            "A completely different runtime that executes faster than JavaScript",
            "Automatic memory management not present in JavaScript",
            "Built-in database connectivity without external libraries",
        ],
        correctIndex: 0,
        explanation:
            "TypeScript is a superset of JavaScript that adds a static type system. The TypeScript compiler analyzes your code and flags type mismatches — like passing a string where a number is expected — before the code ever runs, which JavaScript alone cannot do.",
    },
    {
        id: "webdev-ts-02",
        topicId: "typescript-basics",
        question: "What does this interface declaration describe?\n```ts\ninterface User {\n  id: number;\n  name: string;\n  email?: string;\n}\n```",
        options: [
            "An object shape where `email` is optional but `id` and `name` are required",
            "A class that must be instantiated with `new User()`",
            "A type where all three properties are optional by default",
            "A runtime validator that throws if `email` is missing",
        ],
        correctIndex: 0,
        explanation:
            "The `?` after `email` marks it as an optional property, meaning an object can satisfy the `User` interface with or without an `email` field. `id` and `name` have no `?`, so they are required on any object typed as `User`.",
    },
    {
        id: "webdev-ts-03",
        topicId: "typescript-basics",
        question: "What is the difference between `type` aliases and `interface` in TypeScript for defining object shapes?",
        options: [
            "They're largely interchangeable for objects, but interfaces support declaration merging and are more common for public API shapes",
            "`type` can only describe primitives, never objects",
            "`interface` compiles to different JavaScript than `type`",
            "`type` aliases cannot be extended or reused anywhere",
        ],
        correctIndex: 0,
        explanation:
            "Both can describe object shapes and are largely interchangeable for that use case. A key practical difference is that multiple `interface` declarations with the same name merge together automatically, while `type` aliases cannot be redeclared — this makes interfaces convenient for extensible public APIs.",
    },
    {
        id: "webdev-ts-04",
        topicId: "typescript-basics",
        question: "What does the `any` type do, and why is it generally discouraged?",
        options: [
            "It opts a value out of type checking entirely, which defeats the purpose of using TypeScript",
            "It restricts a value to only string or number types",
            "It is required for all function parameters",
            "It automatically infers the most specific type possible",
        ],
        correctIndex: 0,
        explanation:
            "`any` tells the compiler to skip type checking for that value — it can be reassigned to anything and have any property accessed on it without error. Overusing `any` silently disables the safety net TypeScript is meant to provide, so `unknown` or specific types are usually preferred.",
    },
    {
        id: "webdev-ts-05",
        topicId: "typescript-basics",
        question: "What is a generic function, as in `function identity<T>(arg: T): T { return arg; }`?",
        options: [
            "A function that works with a variety of types while preserving the relationship between input and output types",
            "A function that can accept any number of arguments",
            "A function that only works with generic (non-specific) business logic",
            "A shorthand for defining function overloads",
        ],
        correctIndex: 0,
        explanation:
            "The `<T>` introduces a type parameter that gets filled in at the call site. Calling `identity(5)` infers `T` as `number` and returns `number`; calling `identity('hi')` infers `T` as `string`. This lets one function definition stay type-safe across many types instead of duplicating logic.",
    },
    {
        id: "webdev-ts-06",
        topicId: "typescript-basics",
        question: "What does a union type like `let value: string | number;` allow?",
        options: [
            "`value` can hold either a string or a number, but operations must be valid for whichever type is actually present",
            "`value` must simultaneously be both a string and a number",
            "`value` is automatically converted between string and number as needed",
            "TypeScript picks one of the two types randomly at compile time",
        ],
        correctIndex: 0,
        explanation:
            "A union type means the value could be any one of the listed types. TypeScript enforces that you only use operations valid for all members of the union unless you first narrow the type (e.g. with `typeof value === 'string'`), which prevents calling string-only methods on a value that might be a number.",
    },
    {
        id: "webdev-ts-07",
        topicId: "typescript-basics",
        question: "What is 'type narrowing' in TypeScript?",
        options: [
            "Using runtime checks like `typeof` or `instanceof` so the compiler refines a broader type into a more specific one within a code branch",
            "Reducing the number of properties an interface can have",
            "A compiler flag that shrinks the size of the compiled JavaScript file",
            "Converting a wide union type into a `never` type",
        ],
        correctIndex: 0,
        explanation:
            "When you write a conditional like `if (typeof value === 'string')`, TypeScript recognizes that check and treats `value` as `string` inside that block, even if its declared type was a broader union — that's narrowing, and it lets you safely call type-specific methods.",
    },
    {
        id: "webdev-ts-08",
        topicId: "typescript-basics",
        question: "What does the `tsconfig.json` file control?",
        options: [
            "Compiler options for how TypeScript checks and compiles the project, such as target JS version and strictness",
            "The runtime configuration for a deployed Node.js server",
            "The list of npm dependencies used by the project",
            "The visual styling rules applied by a linter",
        ],
        correctIndex: 0,
        explanation:
            "`tsconfig.json` tells the TypeScript compiler how to behave — which JavaScript version to output, which files to include, how strict the type checking should be (e.g. `strict: true`), and other project-wide compilation settings.",
    },
    {
        id: "webdev-ts-09",
        topicId: "typescript-basics",
        question: "What is the purpose of an `enum` in TypeScript?",
        options: [
            "To define a set of named constant values, improving readability over raw string or number literals",
            "To create a runtime-only construct with no compiled JavaScript output",
            "To replace interfaces entirely for object typing",
            "To define asynchronous operations with built-in retries",
        ],
        correctIndex: 0,
        explanation:
            "An `enum` like `enum Status { Active, Inactive }` gives meaningful names to a fixed set of related values, so code can refer to `Status.Active` instead of a magic number or string, which improves clarity and reduces typo-related bugs.",
    },
    {
        id: "webdev-ts-10",
        topicId: "typescript-basics",
        question: "Given `function greet(name: string): string { return 'Hi ' + name; }`, what happens if you call `greet(42)`?",
        options: [
            "A compile-time type error, because `42` is a number and the parameter expects a string",
            "It runs fine and returns 'Hi 42'",
            "It throws a runtime `TypeError`",
            "TypeScript automatically converts `42` to `'42'` silently with no warning",
        ],
        correctIndex: 0,
        explanation:
            "TypeScript's type checker compares the argument's type against the declared parameter type at compile time. Passing a `number` where `string` is expected produces a compile error like 'Argument of type number is not assignable to parameter of type string', preventing the code from compiling until fixed.",
    },
    {
        id: "webdev-ts-11",
        topicId: "typescript-basics",
        question: "What does marking a class property `readonly` do, as in `readonly id: number;`?",
        options: [
            "Prevents the property from being reassigned after its initial assignment in the constructor",
            "Makes the property invisible outside the class",
            "Automatically makes the property optional",
            "Forces the property to be a getter function",
        ],
        correctIndex: 0,
        explanation:
            "`readonly` allows a property to be set once, typically in the constructor, but the compiler then flags any later attempt to reassign it as an error. This is a compile-time guarantee only — it doesn't freeze the object at runtime the way `Object.freeze` does.",
    },
    {
        id: "webdev-ts-12",
        topicId: "typescript-basics",
        question: "What is the `unknown` type, and how does it differ from `any`?",
        options: [
            "`unknown` also accepts any value, but requires a type check before you can perform operations on it, unlike `any`",
            "`unknown` is identical to `any` in every respect",
            "`unknown` can only be used for function return types, never parameters",
            "`unknown` is a deprecated alias for `void`",
        ],
        correctIndex: 0,
        explanation:
            "Like `any`, a variable typed `unknown` can hold any value. But unlike `any`, TypeScript won't let you call methods on it or access its properties until you've narrowed the type (e.g. via `typeof` or `instanceof`), which preserves type safety while still allowing flexible input.",
    },
    {
        id: "webdev-ts-13",
        topicId: "typescript-basics",
        question: "What does `Partial<User>` produce, given a `User` interface with several required properties?",
        options: [
            "A new type identical to `User` but with every property made optional",
            "A type with only half of `User`'s properties",
            "A runtime function that partially validates a `User` object",
            "A type where all properties become `readonly`",
        ],
        correctIndex: 0,
        explanation:
            "`Partial<T>` is a built-in utility type that maps over every property of `T` and adds a `?`, making them all optional. This is commonly used for update functions where a caller might only supply some of an object's fields, like `function updateUser(patch: Partial<User>)`.",
    },
    {
        id: "webdev-ts-14",
        topicId: "typescript-basics",
        question: "Why might a team enable `\"strict\": true` in `tsconfig.json`?",
        options: [
            "It bundles a group of stricter type-checking rules (like disallowing implicit `any`) that catch more potential bugs",
            "It makes the compiled JavaScript run faster",
            "It disables all warnings so the build always succeeds",
            "It is required to use interfaces at all",
        ],
        correctIndex: 0,
        explanation:
            "`strict: true` turns on a bundle of related flags — including `noImplicitAny`, `strictNullChecks`, and others — that collectively tighten type checking. Teams commonly enable it to catch more bugs at compile time, even though it can require more upfront type annotations.",
    },
    {
        id: "webdev-ts-15",
        topicId: "typescript-basics",
        question: "What does this function signature communicate?\n```ts\nfunction fetchUser(id: number): Promise<User> { ... }\n```",
        options: [
            "It takes a number and returns a Promise that will eventually resolve with a `User` object",
            "It takes a `User` object and returns a number synchronously",
            "It is a synchronous function despite the `Promise` label",
            "It can accept either a number or a `User` as its argument",
        ],
        correctIndex: 0,
        explanation:
            "The parameter type `number` means `id` must be a number, and the return type `Promise<User>` tells the compiler (and anyone reading the code) that calling this function yields a Promise which will resolve to a `User` value once the asynchronous operation completes.",
    },
];

export const reactFundamentalsQuestions = [
    {
        id: "webdev-react-01",
        topicId: "react-fundamentals",
        question: "What is JSX?",
        options: [
            "A syntax extension that lets you write HTML-like markup directly inside JavaScript, which compiles to `React.createElement` calls",
            "A templating language that runs entirely in the browser without compilation",
            "A CSS-in-JS library bundled with React",
            "A new JavaScript runtime designed specifically for React",
        ],
        correctIndex: 0,
        explanation:
            "JSX looks like HTML but is actually syntactic sugar for function calls. Under the hood, a tool like Babel transforms `<div>Hi</div>` into `React.createElement('div', null, 'Hi')`, which is what actually builds the React element tree.",
    },
    {
        id: "webdev-react-02",
        topicId: "react-fundamentals",
        question: "What does the `useState` hook return?",
        options: [
            "An array containing the current state value and a function to update it",
            "A single object with a `.value` and `.setValue` property",
            "A Promise that resolves to the current state",
            "A class instance representing the component's entire state",
        ],
        correctIndex: 0,
        explanation:
            "`const [count, setCount] = useState(0)` destructures a two-element array: the current state value (`count`) and a setter function (`setCount`) that updates it and triggers a re-render. The array form is what allows convenient naming via destructuring.",
    },
    {
        id: "webdev-react-03",
        topicId: "react-fundamentals",
        question: "Why does React require a unique `key` prop when rendering a list of elements?",
        options: [
            "It helps React efficiently identify which items changed, were added, or were removed between renders",
            "It sets the CSS class for each list item",
            "It is only used for accessibility screen readers",
            "It determines the alphabetical sort order of the list",
        ],
        correctIndex: 0,
        explanation:
            "React's reconciliation algorithm uses `key` to match elements across renders. Without stable keys, React may re-render or reorder DOM nodes incorrectly, losing component state or causing performance issues — using the array index as a key is discouraged when list order can change.",
    },
    {
        id: "webdev-react-04",
        topicId: "react-fundamentals",
        question: "What is the purpose of the dependency array in `useEffect(() => { ... }, [count])`?",
        options: [
            "It tells React to re-run the effect only when `count` changes between renders",
            "It lists variables that must never change",
            "It defines the props the component accepts",
            "It sets a delay in milliseconds before the effect runs",
        ],
        correctIndex: 0,
        explanation:
            "React compares each value in the dependency array to its value from the previous render. If any dependency changed, the effect function runs again after the render commits; if none changed, React skips re-running it, which avoids unnecessary work like redundant network requests.",
    },
    {
        id: "webdev-react-05",
        topicId: "react-fundamentals",
        question: "What are 'props' in React?",
        options: [
            "Read-only data passed from a parent component into a child component",
            "Internal state variables a component manages itself",
            "CSS properties applied directly to a component",
            "Global variables accessible from any component in the app",
        ],
        correctIndex: 0,
        explanation:
            "Props (short for properties) flow one-way from parent to child, similar to function arguments. A component receives its props as an object and should treat them as immutable — a component should never modify its own props directly.",
    },
    {
        id: "webdev-react-06",
        topicId: "react-fundamentals",
        question: "What is a 'controlled component' in the context of a form input?",
        options: [
            "An input whose value is driven by React state and updated via an `onChange` handler",
            "An input that can only be modified by the browser, not by React",
            "A component that controls the lifecycle of its parent",
            "Any component wrapped in `React.memo`",
        ],
        correctIndex: 0,
        explanation:
            "In a controlled component, the input's `value` attribute is bound to a piece of React state, and every keystroke fires `onChange`, which updates that state and re-renders the input with the new value. This gives React full control over the form data at all times.",
    },
    {
        id: "webdev-react-07",
        topicId: "react-fundamentals",
        question: "What problem does `useContext` solve?",
        options: [
            "It lets components access shared data without manually passing props through every level of the component tree",
            "It replaces `useState` for all local component state",
            "It fetches data from a remote API automatically",
            "It memoizes expensive calculations",
        ],
        correctIndex: 0,
        explanation:
            "Without context, sharing data across distant components means passing props down through every intermediate component ('prop drilling'). `useContext` lets any descendant of a `Context.Provider` read that shared value directly, skipping the intermediate layers.",
    },
    {
        id: "webdev-react-08",
        topicId: "react-fundamentals",
        question: "What does `React.memo(MyComponent)` do?",
        options: [
            "Prevents the component from re-rendering if its props haven't changed since the last render",
            "Caches the component's state to localStorage automatically",
            "Converts a functional component into a class component",
            "Forces the component to always re-render on every state change in the app",
        ],
        correctIndex: 0,
        explanation:
            "`React.memo` wraps a component and performs a shallow comparison of its props between renders. If the props are equal to the previous render, React skips re-rendering that component and its subtree, which can improve performance for components that render often with unchanged data.",
    },
    {
        id: "webdev-react-09",
        topicId: "react-fundamentals",
        question: "What is the Virtual DOM?",
        options: [
            "An in-memory representation of the UI that React uses to compute the minimal set of real DOM updates needed",
            "A separate DOM tree stored on the server",
            "A deprecated feature replaced entirely by direct DOM manipulation",
            "The browser's native DOM API renamed for React",
        ],
        correctIndex: 0,
        explanation:
            "React builds a lightweight JavaScript object tree (the Virtual DOM) representing what the UI should look like. When state changes, React compares the new virtual tree to the previous one (diffing) and applies only the necessary changes to the real DOM, which is typically more efficient than re-rendering everything.",
    },
    {
        id: "webdev-react-10",
        topicId: "react-fundamentals",
        question: "What is a 'custom hook' in React?",
        options: [
            "A reusable JavaScript function, prefixed with `use`, that calls other hooks to encapsulate shared logic",
            "A hook provided by a third-party npm package only",
            "A special kind of class component",
            "A hook that can only be used once per application",
        ],
        correctIndex: 0,
        explanation:
            "Custom hooks are just functions that follow the `useXyz` naming convention and internally use built-in hooks like `useState` or `useEffect`. They let you extract and reuse stateful logic (like a `useFetch` hook for data fetching) across multiple components without duplicating code.",
    },
    {
        id: "webdev-react-11",
        topicId: "react-fundamentals",
        question: "Why shouldn't you call hooks conditionally, like inside an `if` statement?",
        options: [
            "React relies on hooks being called in the same order on every render to correctly associate state between renders",
            "Conditional hooks cause a syntax error at build time",
            "It only affects performance, not correctness",
            "Hooks are only allowed inside `useEffect` callbacks",
        ],
        correctIndex: 0,
        explanation:
            "React tracks hook state internally using the call order of hooks within a component, not by name. If a hook is skipped conditionally on some renders but not others, the internal bookkeeping gets misaligned, causing state to be associated with the wrong hook — this is why the Rules of Hooks require calling them unconditionally at the top level.",
    },
    {
        id: "webdev-react-12",
        topicId: "react-fundamentals",
        question: "What does 'lifting state up' mean in React?",
        options: [
            "Moving shared state to the closest common ancestor of the components that need it",
            "Moving all state into a global Redux store",
            "Converting local state into props passed down without change",
            "Storing state in the browser's URL instead of in React",
        ],
        correctIndex: 0,
        explanation:
            "When two sibling components need to share or stay in sync with the same piece of state, that state is moved ('lifted') to their nearest common parent component. The parent then passes the state and updater functions down as props to both children.",
    },
    {
        id: "webdev-react-13",
        topicId: "react-fundamentals",
        question: "What is the difference between `useMemo` and `useCallback`?",
        options: [
            "`useMemo` memoizes a computed value, while `useCallback` memoizes a function reference",
            "`useMemo` is for class components while `useCallback` is only for functional components",
            "They are exact aliases of each other with no functional difference",
            "`useCallback` runs on the server while `useMemo` runs on the client",
        ],
        correctIndex: 0,
        explanation:
            "`useMemo(() => computeValue(a, b), [a, b])` recomputes and caches a value only when dependencies change. `useCallback(fn, [deps])` is functionally equivalent to `useMemo(() => fn, [deps])` — it returns the same function reference across renders as long as dependencies are unchanged, useful for avoiding unnecessary re-renders of memoized children.",
    },
    {
        id: "webdev-react-14",
        topicId: "react-fundamentals",
        question: "What happens when you call the state setter function returned by `useState` with a new value?",
        options: [
            "React schedules a re-render of the component with the updated state on the next render cycle",
            "The component's DOM is updated instantly and synchronously mid-function",
            "It throws an error if called more than once per render",
            "It permanently stores the value in the browser's localStorage",
        ],
        correctIndex: 0,
        explanation:
            "Calling a state setter doesn't mutate state immediately in place — it tells React that this component needs to re-render with the new value. React then re-executes the component function, and the updated state is reflected the next time it renders, often batched with other updates for efficiency.",
    },
    {
        id: "webdev-react-15",
        topicId: "react-fundamentals",
        question: "What is the purpose of the `children` prop in React?",
        options: [
            "It represents whatever content is nested between a component's opening and closing tags",
            "It lists all child components in the entire application tree",
            "It is a required prop that every component must explicitly define",
            "It only works with class components, not functional ones",
        ],
        correctIndex: 0,
        explanation:
            "When you write `<Card><p>Hello</p></Card>`, the `<p>Hello</p>` content is automatically passed to `Card` as `props.children`. This lets components like `Card` wrap arbitrary nested content, making them flexible, reusable containers.",
    },
];

export const nodejsExpressQuestions = [
    {
        id: "webdev-node-01",
        topicId: "nodejs-express",
        question: "What makes Node.js well-suited for I/O-heavy applications like APIs?",
        options: [
            "Its non-blocking, event-driven architecture handles many concurrent operations without spawning a thread per request",
            "It compiles JavaScript directly into native machine code for each request",
            "It runs multiple full copies of the V8 engine automatically per request",
            "It disables the JavaScript event loop in favor of raw OS threads",
        ],
        correctIndex: 0,
        explanation:
            "Node.js uses a single-threaded event loop combined with non-blocking I/O — operations like file reads or network calls are delegated and their callbacks are invoked once complete, rather than blocking the thread. This lets Node handle many simultaneous connections efficiently without the overhead of one OS thread per request.",
    },
    {
        id: "webdev-node-02",
        topicId: "nodejs-express",
        question: "What does `app.use(express.json())` do in an Express application?",
        options: [
            "Adds middleware that parses incoming requests with a JSON body and populates `req.body`",
            "Converts all outgoing responses into JSON format automatically",
            "Enables CORS for all JSON requests",
            "Validates that the request URL ends in `.json`",
        ],
        correctIndex: 0,
        explanation:
            "`express.json()` is built-in middleware that reads the raw request body, checks the `Content-Type` header for `application/json`, parses it, and attaches the resulting object to `req.body` so route handlers can access it directly.",
    },
    {
        id: "webdev-node-03",
        topicId: "nodejs-express",
        question: "In Express, what is 'middleware'?",
        options: [
            "A function with access to the request, response, and next function, used to process requests before they reach the final handler",
            "A database layer used to store session information",
            "A build tool for bundling Express applications",
            "A special type of route that only handles error pages",
        ],
        correctIndex: 0,
        explanation:
            "Middleware functions have the signature `(req, res, next)` and run in sequence for matching requests. Each middleware can modify `req`/`res`, end the request-response cycle, or call `next()` to pass control to the next middleware or route handler in the chain.",
    },
    {
        id: "webdev-node-04",
        topicId: "nodejs-express",
        question: "What is the purpose of `next(err)` inside an Express middleware function?",
        options: [
            "It passes control to Express's error-handling middleware, skipping remaining regular middleware",
            "It restarts the request from the beginning",
            "It logs the error to the console and continues normally",
            "It automatically sends a 200 OK response",
        ],
        correctIndex: 0,
        explanation:
            "Calling `next()` with an argument signals to Express that an error occurred. Express then skips all remaining non-error-handling middleware and routes directly to any error-handling middleware defined with four parameters `(err, req, res, next)`.",
    },
    {
        id: "webdev-node-05",
        topicId: "nodejs-express",
        question: "What does `require('module')` do in Node.js's CommonJS module system?",
        options: [
            "Synchronously loads and returns the exported values of the specified module",
            "Asynchronously fetches the module from an npm registry at runtime",
            "Declares a new global variable named `module`",
            "Only works for built-in Node modules, not third-party packages",
        ],
        correctIndex: 0,
        explanation:
            "`require()` synchronously reads a module file, executes it (caching the result), and returns whatever was assigned to `module.exports` in that file. This is how Node.js implements modularity in its original CommonJS system, as opposed to ES modules' `import`/`export` syntax.",
    },
    {
        id: "webdev-node-06",
        topicId: "nodejs-express",
        question: "In Node.js's Event Loop, what happens during the 'callback' phase relevant to I/O operations?",
        options: [
            "Callbacks for completed asynchronous operations (like finished I/O) are executed",
            "New HTTP servers are created",
            "Synchronous top-level code executes for the first time",
            "The event loop pauses until manually resumed",
        ],
        correctIndex: 0,
        explanation:
            "The event loop cycles through phases, and I/O callbacks (like the result of a completed file read) are queued and executed in the corresponding phase once the underlying operation finishes, allowing Node to continue running other code while waiting for I/O rather than blocking.",
    },
    {
        id: "webdev-node-07",
        topicId: "nodejs-express",
        question: "How do you define a route in Express that responds only to GET requests at `/users/:id`?",
        options: [
            "`app.get('/users/:id', (req, res) => { ... })`",
            "`app.route('/users/:id').get()`",
            "`app.listen('/users/:id', callback)`",
            "`app.use('/users/:id', 'GET', callback)`",
        ],
        correctIndex: 0,
        explanation:
            "`app.get(path, handler)` registers a handler that runs specifically for GET requests matching the given path pattern. The `:id` segment is a route parameter, accessible in the handler via `req.params.id`.",
    },
    {
        id: "webdev-node-08",
        topicId: "nodejs-express",
        question: "What is the purpose of a `package.json` file in a Node.js project?",
        options: [
            "It declares project metadata, dependencies, and scripts needed to run and build the project",
            "It stores the compiled output of the application",
            "It is only used by TypeScript projects, not plain JavaScript",
            "It replaces the need for a `node_modules` folder",
        ],
        correctIndex: 0,
        explanation:
            "`package.json` lists the project's name, version, dependencies (and their version ranges), and npm scripts (like `start` or `test`). Tools like npm read this file to know what packages to install and how to run common project tasks.",
    },
    {
        id: "webdev-node-09",
        topicId: "nodejs-express",
        question: "What does `process.env.PORT` typically refer to in a Node.js server?",
        options: [
            "An environment variable, often used to configure which port the server listens on in different environments",
            "The number of active processes running on the machine",
            "A hard-coded constant defined by Node.js itself",
            "The percentage of CPU currently in use",
        ],
        correctIndex: 0,
        explanation:
            "`process.env` exposes environment variables to a running Node.js process. Reading `PORT` from it (often with a fallback like `process.env.PORT || 3000`) lets the same code run on different ports across local development, staging, and production without changing the source code.",
    },
    {
        id: "webdev-node-10",
        topicId: "nodejs-express",
        question: "Why might you use `async/await` with `try/catch` in an Express route handler?",
        options: [
            "To cleanly handle errors from asynchronous operations like database calls without deeply nested callbacks",
            "It's required syntax for every Express route regardless of async operations",
            "It automatically parses request bodies",
            "It replaces the need for middleware entirely",
        ],
        correctIndex: 0,
        explanation:
            "`await` lets asynchronous code (like a database query) read like synchronous code, and wrapping it in `try/catch` lets you catch rejected promises and forward the error appropriately (e.g. via `next(err)`), avoiding the callback pyramid that raw Promise chains or callbacks can produce.",
    },
    {
        id: "webdev-node-11",
        topicId: "nodejs-express",
        question: "What is the role of `express.static('public')`?",
        options: [
            "Serves static files (like images, CSS, or client-side JS) from the specified directory directly to clients",
            "Compiles and minifies JavaScript files in the `public` folder",
            "Restricts access to the `public` folder to authenticated users only",
            "Creates a public API endpoint automatically for each file",
        ],
        correctIndex: 0,
        explanation:
            "`express.static` is built-in middleware that maps incoming request URLs to files within the given folder and serves them directly, which is how Express apps typically serve assets like stylesheets, client bundles, or images without writing custom route handlers for each file.",
    },
    {
        id: "webdev-node-12",
        topicId: "nodejs-express",
        question: "What is npm's `node_modules` folder?",
        options: [
            "The local directory where installed dependencies and their own dependencies are stored",
            "A folder containing only Node.js's built-in core modules",
            "A cache that gets deleted automatically after each `npm install`",
            "A configuration file listing all module names",
        ],
        correctIndex: 0,
        explanation:
            "When you run `npm install`, npm downloads each dependency (and any packages those dependencies themselves depend on) into `node_modules`. Node's module resolution algorithm looks here when you `require()` or `import` a package that isn't a relative path or built-in module.",
    },
    {
        id: "webdev-node-13",
        topicId: "nodejs-express",
        question: "What does Express's `app.listen(3000)` do?",
        options: [
            "Starts the HTTP server and binds it to listen for incoming connections on port 3000",
            "Registers a new middleware that runs on port 3000 only",
            "Only listens for WebSocket connections, not standard HTTP",
            "Pauses the application until a request arrives, blocking all other code",
        ],
        correctIndex: 0,
        explanation:
            "`app.listen(port, callback)` creates and starts an underlying Node.js HTTP server bound to the specified port, so the application can begin accepting and routing incoming HTTP requests to the appropriate handlers.",
    },
    {
        id: "webdev-node-14",
        topicId: "nodejs-express",
        question: "Why is it problematic to run heavy synchronous computation directly in a Node.js request handler?",
        options: [
            "Because Node.js is single-threaded, a long synchronous task blocks the event loop and delays every other concurrent request",
            "Synchronous code cannot access `req` or `res` objects",
            "Node.js automatically throws an error for any code that takes longer than 100ms",
            "It has no real effect, since Node.js runs each request on its own thread",
        ],
        correctIndex: 0,
        explanation:
            "Since Node.js executes JavaScript on a single main thread, a CPU-intensive synchronous operation (like a large in-memory sort) monopolizes that thread, so no other requests — even unrelated ones — can be processed until it finishes. This is why CPU-heavy work is often offloaded to worker threads or separate services.",
    },
    {
        id: "webdev-node-15",
        topicId: "nodejs-express",
        question: "What is the typical purpose of a `.env` file in a Node.js/Express project?",
        options: [
            "To store environment-specific configuration and secrets (like API keys) outside of the source code",
            "To define the routes available in the Express application",
            "To list the npm packages required by the project",
            "To store compiled JavaScript output for production",
        ],
        correctIndex: 0,
        explanation:
            "A `.env` file typically holds key-value pairs like database URLs or API keys, loaded into `process.env` (often via a package like `dotenv`). Keeping secrets here — and excluding the file from version control — avoids hard-coding sensitive values directly into source files.",
    },
];

export const gitGithubQuestions = [
    {
        id: "webdev-git-01",
        topicId: "git-github",
        question: "What is the difference between `git fetch` and `git pull`?",
        options: [
            "`git fetch` downloads changes without merging them, while `git pull` fetches and immediately merges into the current branch",
            "`git fetch` only works on GitHub, while `git pull` works with any Git server",
            "`git pull` only downloads changes, while `git fetch` merges them",
            "They are functionally identical commands with different names",
        ],
        correctIndex: 0,
        explanation:
            "`git fetch` retrieves commits, branches, and tags from a remote repository into your local copy's remote-tracking branches, without touching your working directory. `git pull` performs a fetch and then automatically merges (or rebases) the fetched changes into your current branch.",
    },
    {
        id: "webdev-git-02",
        topicId: "git-github",
        question: "What does `git commit` do, versus `git add`?",
        options: [
            "`git add` stages changes for the next commit, while `git commit` permanently records the staged changes into the repository's history",
            "`git add` and `git commit` both immediately save changes to the remote repository",
            "`git commit` stages changes, while `git add` records them in history",
            "`git add` is only used for new files, never for modifications",
        ],
        correctIndex: 0,
        explanation:
            "Git uses a two-step process: `git add <file>` moves changes into the 'staging area' (also called the index), marking them to be included in the next commit. `git commit` then takes everything currently staged and creates a permanent snapshot in the repository's history with a message.",
    },
    {
        id: "webdev-git-03",
        topicId: "git-github",
        question: "What is a merge conflict, and when does it typically occur?",
        options: [
            "When Git cannot automatically reconcile changes because the same lines were modified differently in two branches being merged",
            "When two developers push to different repositories at the same time",
            "When a commit message exceeds a certain character limit",
            "When a branch has more commits than its target branch",
        ],
        correctIndex: 0,
        explanation:
            "Git can usually merge changes automatically when they touch different parts of a file, but if both branches modify the exact same lines (or one branch deletes a file another modifies), Git can't determine which version to keep and flags a conflict that a person must resolve manually.",
    },
    {
        id: "webdev-git-04",
        topicId: "git-github",
        question: "What does `git branch feature-x` followed by `git checkout feature-x` accomplish (or `git checkout -b feature-x` in one step)?",
        options: [
            "Creates a new branch called `feature-x` and switches the working directory to it",
            "Deletes the current branch and replaces it with `feature-x`",
            "Merges `feature-x` into the current branch immediately",
            "Only works if `feature-x` already exists on the remote",
        ],
        correctIndex: 0,
        explanation:
            "`git branch feature-x` creates a new branch pointer at the current commit without moving to it. `git checkout feature-x` then switches your working directory and HEAD pointer to that branch. `git checkout -b feature-x` is a shorthand that does both steps at once.",
    },
    {
        id: "webdev-git-05",
        topicId: "git-github",
        question: "What is the purpose of a `.gitignore` file?",
        options: [
            "It lists file and folder patterns that Git should not track or include in commits",
            "It lists files that must be committed before every push",
            "It configures which branches can be merged into `main`",
            "It stores a backup of deleted files",
        ],
        correctIndex: 0,
        explanation:
            "`.gitignore` contains patterns (like `node_modules/` or `*.log`) that tell Git to skip those files entirely when tracking changes, `git status`, or `git add .`. This keeps build artifacts, dependencies, and secrets out of version control.",
    },
    {
        id: "webdev-git-06",
        topicId: "git-github",
        question: "In GitHub, what is a 'pull request' (PR)?",
        options: [
            "A request to merge changes from one branch (often in a fork) into another, allowing review and discussion before merging",
            "A command that pulls the latest changes to your local machine",
            "An automatic process that merges branches without any review",
            "A feature exclusive to private repositories",
        ],
        correctIndex: 0,
        explanation:
            "A pull request proposes merging changes from a source branch into a target branch. It provides a space on GitHub for reviewers to comment on specific lines, request changes, run automated checks, and ultimately approve the merge — it's a collaboration and review mechanism layered on top of Git itself.",
    },
    {
        id: "webdev-git-07",
        topicId: "git-github",
        question: "What does `git rebase main` do when run on a feature branch?",
        options: [
            "Replays the feature branch's commits on top of the latest `main`, producing a linear history",
            "Deletes all commits on the feature branch",
            "Merges `main` into the feature branch, creating a merge commit",
            "Renames the feature branch to `main`",
        ],
        correctIndex: 0,
        explanation:
            "Rebasing takes the commits unique to your current branch and re-applies them one by one on top of the target branch's latest commit, effectively rewriting history to look as if you'd branched off from the newest point on `main`. This avoids the extra merge commit that `git merge` would create, at the cost of rewriting commit hashes.",
    },
    {
        id: "webdev-git-08",
        topicId: "git-github",
        question: "What is the purpose of `git clone <url>`?",
        options: [
            "Downloads a full copy of a remote repository, including its entire history, to your local machine",
            "Creates an empty repository with no history",
            "Only downloads the latest commit without any history",
            "Duplicates a repository on the same remote server",
        ],
        correctIndex: 0,
        explanation:
            "`git clone` copies the entire repository — all branches, commits, and tags — from a remote location (like GitHub) to a new local directory, and automatically sets up the remote as `origin` so you can fetch and push future changes.",
    },
    {
        id: "webdev-git-09",
        topicId: "git-github",
        question: "What does `git revert <commit>` do, compared to `git reset <commit>`?",
        options: [
            "`git revert` creates a new commit that undoes the changes from a specific commit, preserving history; `git reset` moves the branch pointer and can discard history",
            "They are identical commands with different names",
            "`git revert` deletes a commit permanently, while `git reset` only hides it",
            "`git reset` is safe to use on shared/public branches, while `git revert` is not",
        ],
        correctIndex: 0,
        explanation:
            "`git revert` is generally safer for shared branches because it adds a new commit that inverses the target commit's changes, keeping the original commit intact in history. `git reset` instead moves the current branch pointer to a different commit and, depending on the mode, can discard commits from history entirely, which is risky if others have already pulled them.",
    },
    {
        id: "webdev-git-10",
        topicId: "git-github",
        question: "What does `HEAD` refer to in Git?",
        options: [
            "A reference to the commit currently checked out in your working directory",
            "The very first commit ever made in the repository",
            "The remote repository's default branch",
            "A file that stores all commit messages",
        ],
        correctIndex: 0,
        explanation:
            "`HEAD` is a pointer that usually points to the tip of the branch you currently have checked out, representing 'where you are' in the repository's history. Commands like `git log`, `git commit`, and `git diff` frequently operate relative to `HEAD`.",
    },
    {
        id: "webdev-git-11",
        topicId: "git-github",
        question: "What is a 'fork' on GitHub?",
        options: [
            "A personal copy of someone else's repository under your own account, which you can modify independently",
            "A command-line Git operation with no equivalent term in plain Git",
            "A backup snapshot taken automatically every 24 hours",
            "A branch that can never be merged back into the original repository",
        ],
        correctIndex: 0,
        explanation:
            "Forking creates a full copy of a repository under your GitHub account, letting you experiment or make changes freely without affecting the original ('upstream') repository. It's a common workflow for contributing to projects you don't have direct write access to — you fork, make changes, then open a pull request back to the original.",
    },
    {
        id: "webdev-git-12",
        topicId: "git-github",
        question: "What does `git stash` do?",
        options: [
            "Temporarily saves uncommitted changes so you can switch branches with a clean working directory, then reapply them later",
            "Permanently deletes uncommitted changes",
            "Automatically commits all uncommitted changes",
            "Pushes uncommitted changes to the remote repository",
        ],
        correctIndex: 0,
        explanation:
            "`git stash` takes your modified tracked files and staged changes, saves them on a stack, and reverts your working directory to match `HEAD`. This is useful when you need to switch tasks or branches without committing half-finished work; running `git stash pop` later reapplies those changes.",
    },
    {
        id: "webdev-git-13",
        topicId: "git-github",
        question: "What is the significance of a repository's 'default branch' (often `main`)?",
        options: [
            "It's the branch that's checked out by default when the repository is cloned and typically the base for pull requests",
            "It's the only branch that can be deleted",
            "It automatically deploys to production without any CI/CD configuration",
            "It's a branch that cannot receive any commits directly",
        ],
        correctIndex: 0,
        explanation:
            "The default branch (commonly named `main` or historically `master`) is what a fresh `git clone` checks out automatically, and it's usually treated as the stable, canonical line of development that feature branches are created from and merged back into.",
    },
    {
        id: "webdev-git-14",
        topicId: "git-github",
        question: "What does a GitHub Actions workflow file typically define?",
        options: [
            "Automated steps (like tests or builds) that run in response to repository events such as a push or pull request",
            "The visual theme of the GitHub repository page",
            "Which users have write access to the repository",
            "The commit message format required for all commits",
        ],
        correctIndex: 0,
        explanation:
            "GitHub Actions workflows are YAML files (usually in `.github/workflows/`) that specify triggers (like `on: push`) and jobs (like running a test suite or building a Docker image). This automates CI/CD tasks directly within GitHub whenever the specified repository events occur.",
    },
    {
        id: "webdev-git-15",
        topicId: "git-github",
        question: "Why is writing clear, descriptive commit messages considered a best practice?",
        options: [
            "They make it much easier for collaborators (and your future self) to understand the history and reasoning behind changes",
            "Git requires a minimum message length to accept a commit",
            "They automatically generate the project's changelog with no other input",
            "They are the only way to search for a specific commit",
        ],
        correctIndex: 0,
        explanation:
            "Commit history is a form of documentation. A message like 'Fix null pointer when user has no address' explains not just what changed but why, which helps anyone reviewing the log later (via `git log` or `git blame`) understand the reasoning without having to read the full diff.",
    },
];

export const restApisHttpQuestions = [
    {
        id: "webdev-rest-01",
        topicId: "rest-apis-http",
        question: "What does the HTTP status code 404 indicate?",
        options: [
            "The requested resource could not be found on the server",
            "The server encountered an internal error while processing the request",
            "The request was successful and a new resource was created",
            "The client must authenticate before accessing the resource",
        ],
        correctIndex: 0,
        explanation:
            "404 (Not Found) is a client-error status code meaning the server couldn't locate a resource matching the requested URL. This differs from 401 (Unauthorized), 403 (Forbidden), or 500 (Internal Server Error), each of which signals a different category of problem.",
    },
    {
        id: "webdev-rest-02",
        topicId: "rest-apis-http",
        question: "In REST conventions, what does a `PATCH` request typically represent, compared to `PUT`?",
        options: [
            "`PATCH` applies a partial update to a resource, while `PUT` typically replaces the entire resource",
            "`PATCH` and `PUT` are functionally identical in every REST API",
            "`PATCH` creates a new resource, while `PUT` deletes one",
            "`PUT` is used only for reading data, never for writing",
        ],
        correctIndex: 0,
        explanation:
            "By convention, `PUT` sends a complete representation of a resource meant to replace what currently exists at that URL, while `PATCH` sends only the fields that should change, leaving the rest of the resource untouched. Not all APIs strictly follow this, but it's the common REST convention.",
    },
    {
        id: "webdev-rest-03",
        topicId: "rest-apis-http",
        question: "What does it mean for an HTTP method to be 'idempotent'?",
        options: [
            "Making the same request multiple times produces the same result as making it once",
            "The request can only be made a single time ever",
            "The response is cached indefinitely by the browser",
            "The method requires authentication",
        ],
        correctIndex: 0,
        explanation:
            "An idempotent method means repeating an identical request doesn't change the outcome beyond the first successful call. `GET`, `PUT`, and `DELETE` are conventionally idempotent (deleting an already-deleted resource still results in it being gone), whereas `POST` typically is not, since calling it repeatedly can create multiple new resources.",
    },
    {
        id: "webdev-rest-04",
        topicId: "rest-apis-http",
        question: "What is the primary purpose of the HTTP `Authorization` header?",
        options: [
            "To pass credentials or a token so the server can verify the client's identity or permissions",
            "To specify what content type the client can accept in the response",
            "To indicate which HTTP method is being used",
            "To cache the response on the client for future requests",
        ],
        correctIndex: 0,
        explanation:
            "The `Authorization` header commonly carries a scheme and credentials, such as `Bearer <token>` for token-based auth or `Basic <base64-credentials>` for basic auth, letting the server authenticate the request and decide whether to grant access to the requested resource.",
    },
    {
        id: "webdev-rest-05",
        topicId: "rest-apis-http",
        question: "What does the HTTP status code 201 signify?",
        options: [
            "A new resource was successfully created as a result of the request",
            "The request succeeded but returned no content",
            "The resource has moved permanently to a new URL",
            "The request was malformed and could not be processed",
        ],
        correctIndex: 0,
        explanation:
            "201 (Created) is typically returned after a successful `POST` request that results in a new resource, often accompanied by a `Location` header pointing to the URL of the newly created resource.",
    },
    {
        id: "webdev-rest-06",
        topicId: "rest-apis-http",
        question: "What is the key architectural constraint that makes an API 'RESTful' in terms of server-side session handling?",
        options: [
            "Statelessness — each request must contain all information needed to process it, without relying on stored server-side session context",
            "The server must store the client's entire session history",
            "All requests must use the `POST` method exclusively",
            "The API must be written in a specific programming language",
        ],
        correctIndex: 0,
        explanation:
            "One of REST's defining constraints is statelessness: the server shouldn't need to remember anything about a client between requests. Each request carries whatever context (like an auth token) is needed, which makes RESTful APIs easier to scale horizontally since any server instance can handle any request.",
    },
    {
        id: "webdev-rest-07",
        topicId: "rest-apis-http",
        question: "What is the difference between HTTP status codes in the 4xx range versus the 5xx range?",
        options: [
            "4xx indicates a client-side error (like a bad request), while 5xx indicates a server-side error",
            "4xx codes are only used in development, 5xx only in production",
            "4xx means success, 5xx means failure",
            "There is no meaningful distinction between the two ranges",
        ],
        correctIndex: 0,
        explanation:
            "4xx codes (like 400 Bad Request or 404 Not Found) signal that the client's request itself was problematic in some way. 5xx codes (like 500 Internal Server Error or 503 Service Unavailable) indicate the server failed to fulfill an otherwise valid request due to a problem on its end.",
    },
    {
        id: "webdev-rest-08",
        topicId: "rest-apis-http",
        question: "What does the `Content-Type: application/json` header tell the receiving server or client?",
        options: [
            "The body of the request or response is formatted as JSON and should be parsed accordingly",
            "The connection must be closed immediately after this request",
            "The response should be cached for exactly one year",
            "The client only accepts responses in XML format",
        ],
        correctIndex: 0,
        explanation:
            "`Content-Type` describes the media type of the data being sent, telling the recipient how to interpret the body. When set to `application/json`, the receiver knows to parse the payload as JSON rather than, say, form-encoded data or plain text.",
    },
    {
        id: "webdev-rest-09",
        topicId: "rest-apis-http",
        question: "In a well-designed REST API, what would the URL `/api/users/42/orders` typically represent?",
        options: [
            "The collection of orders belonging to the user with ID 42",
            "A single order with the ID '42/orders'",
            "An endpoint that always returns exactly 42 orders",
            "A configuration setting for the users endpoint",
        ],
        correctIndex: 0,
        explanation:
            "RESTful URL design typically nests resources hierarchically to express relationships: `/users/42` identifies a specific user, and appending `/orders` represents the sub-collection of orders that belong to that user, following REST's convention of resource-oriented, noun-based URLs.",
    },
    {
        id: "webdev-rest-10",
        topicId: "rest-apis-http",
        question: "What is CORS (Cross-Origin Resource Sharing)?",
        options: [
            "A browser security mechanism that restricts web pages from making requests to a different origin unless the server explicitly allows it",
            "A protocol for compressing HTTP responses",
            "A method for encrypting data in transit",
            "A caching strategy used by CDNs",
        ],
        correctIndex: 0,
        explanation:
            "CORS is enforced by browsers to prevent a script on one origin (domain, protocol, and port) from freely reading responses from a different origin, unless that server responds with appropriate headers like `Access-Control-Allow-Origin` explicitly permitting it. This protects users from certain cross-site attacks.",
    },
    {
        id: "webdev-rest-11",
        topicId: "rest-apis-http",
        question: "What does HTTP status code 401 mean, versus 403?",
        options: [
            "401 means the client isn't authenticated at all; 403 means the client is authenticated but lacks permission for that resource",
            "401 and 403 are interchangeable and mean exactly the same thing",
            "401 is used for server errors, 403 for client errors",
            "403 always means the resource doesn't exist",
        ],
        correctIndex: 0,
        explanation:
            "401 (Unauthorized) signals that valid authentication credentials are missing or invalid — the server doesn't know who you are. 403 (Forbidden) means the server does know who you are, but you don't have permission to access that particular resource regardless.",
    },
    {
        id: "webdev-rest-12",
        topicId: "rest-apis-http",
        question: "What is the purpose of query parameters in a URL like `/api/products?category=shoes&sort=price`?",
        options: [
            "To pass optional filtering, sorting, or configuration data for a request without changing the base resource path",
            "To specify the HTTP method being used",
            "To authenticate the request",
            "To define which server should handle the request",
        ],
        correctIndex: 0,
        explanation:
            "Query parameters, appended after a `?` and separated by `&`, are commonly used to filter, sort, paginate, or otherwise modify what a GET request returns, without needing a different endpoint for every possible combination of filters.",
    },
    {
        id: "webdev-rest-13",
        topicId: "rest-apis-http",
        question: "Why is `GET` generally discouraged from having side effects like modifying data on the server?",
        options: [
            "Because `GET` requests are expected to be safe and idempotent — browsers, caches, and crawlers may repeat them without warning",
            "Because `GET` requests cannot include a request body at all under any circumstances",
            "Because `GET` requests are always slower than `POST` requests",
            "Because `GET` is a deprecated method in modern HTTP",
        ],
        correctIndex: 0,
        explanation:
            "HTTP conventions treat `GET` as a 'safe' method that only retrieves data. Browsers may prefetch links, crawlers may follow them, and caches may replay them — none of which anticipate `GET` having side effects, so using it to trigger state changes (like deleting a record) can lead to unintended consequences.",
    },
    {
        id: "webdev-rest-14",
        topicId: "rest-apis-http",
        question: "What does HTTP/2 improve over HTTP/1.1?",
        options: [
            "It allows multiplexing multiple requests over a single connection, reducing the overhead of opening many separate connections",
            "It replaces TCP entirely with a new transport protocol",
            "It removes the need for HTTP headers",
            "It only works with WebSocket connections",
        ],
        correctIndex: 0,
        explanation:
            "HTTP/1.1 typically needs multiple TCP connections (or sequential requests on one connection) to fetch several resources in parallel. HTTP/2 introduces multiplexing, letting many requests and responses share a single connection concurrently, which reduces latency and connection overhead.",
    },
    {
        id: "webdev-rest-15",
        topicId: "rest-apis-http",
        question: "What is the purpose of pagination in a REST API endpoint that returns a large collection, like `/api/articles?page=2&limit=20`?",
        options: [
            "To return data in smaller, manageable chunks instead of the entire dataset in a single response",
            "To sort the articles alphabetically",
            "To authenticate the request with a page-specific token",
            "To compress the response body for faster transfer",
        ],
        correctIndex: 0,
        explanation:
            "Returning thousands of records in one response is inefficient and slow for both server and client. Pagination parameters like `page` and `limit` (or cursor-based alternatives) let clients request one manageable slice of the data at a time, improving performance and responsiveness.",
    },
];