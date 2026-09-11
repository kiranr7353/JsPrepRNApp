export interface TopicStudyGuide {
  topicId: string;
  categoryId: string;
  title: string;
  level: string;
  detailedOverview: string;
  keyTakeaways: string[];
  interviewTraps: string[];
  codeExample: {
    title: string;
    language: string;
    code: string;
    explanation: string;
  };
  subtopicNotes: {
    name: string;
    description: string;
    points: string[];
  }[];
}

export const TOPIC_STUDY_GUIDES: Record<string, TopicStudyGuide> = {
  // JAVASCRIPT TOPICS
  javascriptBasics: {
    topicId: 'javascriptBasics',
    categoryId: 'javascript',
    title: 'JavaScript Fundamentals',
    level: 'Beginner',
    detailedOverview: 'JavaScript executes inside an Execution Context containing a Variable Environment and Lexical Environment. Understanding how the parser allocates memory during the creation phase before execution phase is the bedrock of explaining hoisting, TDZ, and scope.',
    keyTakeaways: [
      'Primitive types (Number, String, Boolean, null, undefined, Symbol, BigInt) are stored in the stack and copied by value.',
      'Non-primitive types (Objects, Arrays, Functions) are stored in the heap and passed by memory reference pointer.',
      'var is function-scoped and hoisted with undefined; let and const are block-scoped and stay in the Temporal Dead Zone (TDZ).',
      'Double equals (==) performs type coercion; triple equals (===) strictly checks types without conversion.'
    ],
    interviewTraps: [
      'typeof null returns "object" due to a legacy 31-bit zero-type-tag bug in the original JavaScript engine.',
      'NaN === NaN evaluates to false. Always use Number.isNaN() or Object.is() for exact comparison.',
      'Temporal Dead Zone: accessing a let/const variable before declaration throws ReferenceError, not undefined.'
    ],
    codeExample: {
      title: 'Hoisting & Temporal Dead Zone (TDZ)',
      language: 'javascript',
      code: `console.log(varVar); // undefined (hoisted & initialized)
// console.log(letVar); // ReferenceError: Cannot access 'letVar' before initialization

var varVar = "I am hoisted";
let letVar = "I am in TDZ until this line executes";

// Type coercion trap:
console.log([] == ![]); // true
// Explanation: ![] -> false -> 0, [] -> "" -> 0, 0 == 0 -> true`,
      explanation: 'The creation phase allocates memory for var and assigns undefined. let/const allocate memory but are marked uninitialized until runtime reaches the declaration line.'
    },
    subtopicNotes: [
      {
        name: 'Primitive vs Non-primitive',
        description: 'Memory allocation and mutation mechanics',
        points: ['Primitives are immutable in memory', 'Objects can be mutated even if declared with const']
      },
      {
        name: 'var vs let vs const',
        description: 'Scope boundaries and re-declaration rules',
        points: ['var creates window properties in browsers', 'const requires immediate initializer']
      },
      {
        name: 'Hoisting mechanics',
        description: 'Function declarations vs function expressions',
        points: ['Function declarations are hoisted completely with body', 'Function expressions follow variable hoisting rules']
      }
    ]
  },
  advancedJavascript: {
    topicId: 'advancedJavascript',
    categoryId: 'javascript',
    title: 'Advanced JavaScript',
    level: 'Advanced',
    detailedOverview: 'Deep dive into closures, prototypal chains, memory retention, and the binding rules of the "this" keyword in standard functions, arrow functions, and method invocations.',
    keyTakeaways: [
      'A closure captures variables from its lexical environment by reference, not by snapshot copy.',
      'Prototypal inheritance works via the hidden [[Prototype]] link. Object.create(parent) avoids constructor execution side effects.',
      '"this" is determined at call-time by 4 rules: Default binding, Implicit binding, Explicit binding (call/apply/bind), and New binding.',
      'Arrow functions do NOT possess their own "this", "arguments", or "super"; they capture from enclosing lexical scope.'
    ],
    interviewTraps: [
      'Returning an arrow function from an object method binds "this" to whatever "this" was when the outer method ran.',
      'Memory leaks can occur if long-lived event listeners or intervals retain references via closures to large objects.'
    ],
    codeExample: {
      title: 'Module Pattern with Closures & Context Binding',
      language: 'javascript',
      code: `function createStore(initialState) {
  let state = initialState; // Private variable via closure
  const listeners = new Set();

  return {
    getState: () => state,
    dispatch: (action) => {
      state = { ...state, ...action };
      listeners.forEach(fn => fn(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener); // Clean-up closure
    }
  };
}

const store = createStore({ count: 0 });
store.subscribe(s => console.log('Updated:', s));
store.dispatch({ count: 1 });`,
      explanation: 'Encapsulates private state that cannot be directly modified or accessed from outer scopes.'
    },
    subtopicNotes: [
      {
        name: 'Prototypal Inheritance',
        description: 'Prototype chain traversal and performance',
        points: ['All objects link to Object.prototype at chain end', 'hasOwn or hasOwnProperty checks own keys']
      },
      {
        name: 'Lexical Closures',
        description: 'Retaining enclosing variables across async calls',
        points: ['Essential for debounce, memoize, and Redux reducers']
      }
    ]
  },
  asyncJs: {
    topicId: 'asyncJs',
    categoryId: 'javascript',
    title: 'Asynchronous JavaScript',
    level: 'Intermediate',
    detailedOverview: 'Mastering the JavaScript concurrency model: the Call Stack, Web APIs background threads, Microtask Queue, Macrotask Queue, and Promise resolution lifecycle.',
    keyTakeaways: [
      'JavaScript is single-threaded in the main execution thread; concurrency is provided by browser Web APIs or libuv in Node.',
      'Microtasks (.then, .catch, queueMicrotask, MutationObserver) always have higher priority than macrotasks.',
      'Promise.all rejects immediately on first error; Promise.allSettled waits for all outcomes.',
      'async/await is syntactic sugar over generator coroutines and promises.'
    ],
    interviewTraps: [
      'Uncaught Promise rejections in older Node versions or silent failures if catch handler is missing.',
      'setTimeout(fn, 0) does not run immediately; it runs only after all synchronous code and microtasks have completed.'
    ],
    codeExample: {
      title: 'Event Loop Execution Priority',
      language: 'javascript',
      code: `console.log('1 - Sync Start');

setTimeout(() => {
  console.log('4 - Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - Microtask (Promise)');
});

console.log('2 - Sync End');

// Execution order: 1 -> 2 -> 3 -> 4`,
      explanation: 'Microtasks are processed immediately when the call stack clears, before taking the next macrotask.'
    },
    subtopicNotes: [
      {
        name: 'Event Loop Architecture',
        description: 'Call Stack, Web APIs, Microtask vs Macrotask',
        points: ['Run-to-completion semantics', 'Starvation danger if microtask queue continuously enqueues microtasks']
      },
      {
        name: 'Promise combinators',
        description: 'Promise.all, race, any, allSettled',
        points: ['Promise.all fails fast', 'Promise.any resolves on FIRST fulfilled promise', 'Promise.race resolves/rejects on FIRST settled']
      }
    ]
  },
  javascriptinterviewQuestions: {
    topicId: 'javascriptinterviewQuestions',
    categoryId: 'javascript',
    title: 'JavaScript Interview Q&A',
    level: 'Intermediate',
    detailedOverview: 'Compilation of high-yield questions covering ES6+ syntax, destructuring nuances, Set & Map data structures, WeakMap for garbage collection, and custom polyfills.',
    keyTakeaways: [
      'Maps preserve insertion order and allow any data type as keys, unlike plain objects.',
      'WeakMap and WeakSet hold weak references to object keys, allowing automatic garbage collection when unreferenced.',
      'Rest parameter creates real arrays; arguments object is array-like without array methods.',
      'Symbol creates unique, immutable primitives used for hidden object properties and well-known symbols like Symbol.iterator.'
    ],
    interviewTraps: [
      'Object.freeze() is shallow. Nested objects can still be modified unless deeply frozen.',
      'JSON.parse(JSON.stringify(obj)) loses functions, Symbols, undefined values, and throws on circular references.'
    ],
    codeExample: {
      title: 'Object.freeze Shallow Trap & Deep Freeze Polyfill',
      language: 'javascript',
      code: `function deepFreeze(object) {
  const propNames = Reflect.ownKeys(object);
  for (const name of propNames) {
    const value = object[name];
    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const config = { api: { timeout: 3000 } };
deepFreeze(config);
// config.api.timeout = 5000; // Throws error in strict mode!`,
      explanation: 'Deep freeze recursively traverses own properties to freeze nested objects and arrays.'
    },
    subtopicNotes: [
      {
        name: 'ES6+ Features',
        description: 'Destructuring, optional chaining, nullish coalescing',
        points: ['?? only falls back on null/undefined, whereas || falls back on 0, false, and ""']
      },
      {
        name: 'Map vs Object',
        description: 'Performance and key types',
        points: ['Map has O(1) size check with .size property', 'Object keys are string or symbol only']
      }
    ]
  },
  jsCodeSnippets: {
    topicId: 'jsCodeSnippets',
    categoryId: 'javascript',
    title: 'Tricky Code Snippets',
    level: 'Advanced',
    detailedOverview: 'Predicting execution output in tricky interview problems involving closures inside loops, prototype method overrides, and variable shadowing.',
    keyTakeaways: [
      'Using var in a for loop binds a single variable across all iterations. Using let creates a fresh binding per iteration.',
      'Array.prototype.sort() converts elements to strings by default, sorting [10, 2, 5] into [10, 2, 5] instead of [2, 5, 10].',
      'Function parameter defaults have their own scope between outer scope and function body scope.'
    ],
    interviewTraps: [
      'var i in setTimeout loop logs the final value for every call if not wrapped in IIFE or replaced with let.',
      'delete operator only deletes object properties; it does not delete local variables.'
    ],
    codeExample: {
      title: 'Loop Closure with var vs let',
      language: 'javascript',
      code: `// Buggy loop with var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var i:', i), 100);
}
// Outputs: 3, 3, 3

// Fixed with let (block scoped per iteration):
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let j:', j), 100);
}
// Outputs: 0, 1, 2`,
      explanation: 'let creates a brand new variable binding for each loop iteration, preserving j inside the closure.'
    },
    subtopicNotes: [
      {
        name: 'Closure in loops',
        description: 'Block scoping vs function scoping',
        points: ['IIFE workaround for ES5 environments', 'let creates separate lexical environment per turn']
      }
    ]
  },
  jsTrickyConcepts: {
    topicId: 'jsTrickyConcepts',
    categoryId: 'javascript',
    title: 'Tricky Edge Cases',
    level: 'Advanced',
    detailedOverview: 'Deep dive into floating point precision (0.1 + 0.2 !== 0.3), automatic semicolon insertion (ASI) traps, and JavaScript internal object conversions.',
    keyTakeaways: [
      'IEEE 754 double-precision binary floating-point representation causes 0.1 + 0.2 to equal 0.30000000000000004.',
      'Automatic Semicolon Insertion inserts semicolons after return statements if a line break follows, returning undefined.',
      'Symbol.toPrimitive, valueOf, and toString define the order of coercion when objects are converted to primitives.'
    ],
    interviewTraps: [
      'return \\n { name: "Alice" } returns undefined because ASI inserts a semicolon after return.',
      'Math.max() returns -Infinity and Math.min() returns +Infinity when called with no arguments.'
    ],
    codeExample: {
      title: 'ASI & Float Arithmetic Traps',
      language: 'javascript',
      code: `// ASI Trap:
function getUser() {
  return // ASI puts ';' here!
  {
    name: 'Kiran'
  };
}
console.log(getUser()); // undefined!

// Float Fix with Number.EPSILON:
function numbersEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log(numbersEqual(0.1 + 0.2, 0.3)); // true`,
      explanation: 'Never place a line break immediately after return. Use Number.EPSILON for floating point comparisons.'
    },
    subtopicNotes: [
      {
        name: 'Floating Point Precision',
        description: 'Binary representation of decimal numbers',
        points: ['Use Number.EPSILON or integer arithmetic (cents instead of dollars)']
      }
    ]
  },
  jsProgrammingQA: {
    topicId: 'jsProgrammingQA',
    categoryId: 'javascript',
    title: 'JS Programming Challenges',
    level: 'Intermediate',
    detailedOverview: 'Hands-on polyfills and utility implementations commonly asked in senior engineering technical interviews: Debounce, Throttle, Deep Clone, Currying, and Promise.all.',
    keyTakeaways: [
      'Debounce resets a timer on every event; Throttle enforces a maximum execution rate per window.',
      'Function currying transforms f(a, b, c) into f(a)(b)(c) using recursion and arity checks (func.length).',
      'Custom Promise.all requires tracking resolved counter against total length and preserving result indices.'
    ],
    interviewTraps: [
      'Forgetting to maintain "this" context and arguments via func.apply(context, args).',
      'Using results.length === total in Promise.all polyfills fails if promises resolve out of order.'
    ],
    codeExample: {
      title: 'Currying Polyfill with Arity Checking',
      language: 'javascript',
      code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6`,
      explanation: 'Checks current argument count against target function arity (fn.length) and recurses until satisfied.'
    },
    subtopicNotes: [
      {
        name: 'Currying & Partial Application',
        description: 'Transforming multi-argument functions',
        points: ['fn.length returns expected parameter count', 'Supports point-free programming']
      }
    ]
  },

  // REACT TOPICS
  reactBasics: {
    topicId: 'reactBasics',
    categoryId: 'react',
    title: 'React Fundamentals',
    level: 'Beginner',
    detailedOverview: 'React is a declarative, component-based library for building user interfaces. It uses JSX (a syntax extension to JavaScript) which compiles to React.createElement calls, producing Virtual DOM objects.',
    keyTakeaways: [
      'Virtual DOM is a lightweight JavaScript representation of actual DOM nodes.',
      'Reconciliation uses a heuristic O(n) diffing algorithm assuming elements of different types generate different trees.',
      'Keys give elements a stable identity across renders, allowing React to preserve state in lists.',
      'Props are read-only inputs passed from parent to child; State is private, mutable data managed by the component.'
    ],
    interviewTraps: [
      'Using array index as key when list items can be reordered, inserted, or deleted causes state desync in inputs.',
      'Mutating state directly (state.items.push(x)) skips re-renders because React relies on shallow reference equality.'
    ],
    codeExample: {
      title: 'Virtual DOM & Correct Key Usage',
      language: 'javascript',
      code: `// WRONG: Using array index as key
{items.map((item, index) => <Item key={index} data={item} />)}

// CORRECT: Using unique, stable identity
{items.map(item => <Item key={item.id} data={item} />)}

// Immutable state update:
setItems(prev => [...prev, newItem]);`,
      explanation: 'Stable keys ensure React matches items across renders without re-mounting DOM elements.'
    },
    subtopicNotes: [
      {
        name: 'Virtual DOM & Diffing',
        description: 'How React calculates minimal DOM mutations',
        points: ['Element type changes rebuild entire subtree', 'Key prop preserves component state']
      }
    ]
  },
  reactHooks: {
    topicId: 'reactHooks',
    categoryId: 'react',
    title: 'React Hooks In-Depth',
    level: 'Intermediate',
    detailedOverview: 'Hooks let you use state and other React features without writing class components. Under the hood, hooks are stored as a singly linked list attached to the Fiber node, requiring strict call order consistency.',
    keyTakeaways: [
      'Rules of Hooks: Only call hooks at the top level (no loops or conditionals), and only call from React functions.',
      'useEffect runs after paint; useLayoutEffect runs synchronously before paint.',
      'useCallback memoizes function references; useMemo memoizes computed values.',
      'useRef creates a mutable object whose .current property persists across renders without triggering a re-render.'
    ],
    interviewTraps: [
      'Stale closures in useEffect or callbacks when dependencies are omitted from dependency array.',
      'Passing inline arrow functions to memoized child components breaks React.memo unless wrapped in useCallback.'
    ],
    codeExample: {
      title: 'Custom Hook with Cleanup & AbortController',
      language: 'typescript',
      code: `import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setLoading(false);
      });

    return () => controller.abort(); // Cleanup on unmount or url change!
  }, [url]);

  return { data, loading };
}`,
      explanation: 'AbortController prevents memory leaks and state updates on unmounted components.'
    },
    subtopicNotes: [
      {
        name: 'Hooks Linked List',
        description: 'Why hooks cannot be inside if-statements',
        points: ['Fiber node stores memoizedState linked list', 'Index desync breaks state assignment']
      }
    ]
  },
  advancedReact: {
    topicId: 'advancedReact',
    categoryId: 'react',
    title: 'Advanced React Architecture',
    level: 'Advanced',
    detailedOverview: 'React Fiber architecture rewrite enables cooperative multitasking, time-slicing, and interruptible rendering for buttery smooth 60fps UIs.',
    keyTakeaways: [
      'Fiber is a unit of work that can be paused, resumed, or discarded based on priority.',
      'Concurrent React introduces useTransition and useDeferredValue to prioritize urgent inputs over background renders.',
      'Error Boundaries catch JavaScript errors in component trees and display fallback UIs using static getDerivedStateFromError.',
      'Suspense lets components suspend rendering while data or code is being fetched asynchronously.'
    ],
    interviewTraps: [
      'Error Boundaries do NOT catch errors inside async callbacks (setTimeout, fetch) or event handlers; use try/catch for those.',
      'startTransition should only wrap state updates that can be interrupted without confusing the user.'
    ],
    codeExample: {
      title: 'useTransition for Responsive Filtering',
      language: 'typescript',
      code: `import { useState, useTransition } from 'react';

export function SearchDashboard({ allItems }: { allItems: string[] }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(allItems);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // Urgent update: keep input typing responsive

    startTransition(() => {
      // Non-urgent update: filtering thousands of items
      setFiltered(allItems.filter(item => item.toLowerCase().includes(value.toLowerCase())));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Search..." />
      {isPending && <span>Filtering results...</span>}
      <List items={filtered} />
    </div>
  );
}`,
      explanation: 'startTransition marks the heavy filter computation as secondary priority, keeping typing input at 60fps.'
    },
    subtopicNotes: [
      {
        name: 'Fiber Reconciler',
        description: 'Reconciliation phase vs Commit phase',
        points: ['Reconciliation is interruptible', 'Commit phase mutates DOM synchronously']
      }
    ]
  },
  reactRouter: {
    topicId: 'reactRouter',
    categoryId: 'react',
    title: 'React Router v6+',
    level: 'Intermediate',
    detailedOverview: 'React Router v6 provides nested routing, layout encapsulation via <Outlet />, data loaders, form actions, and programmatic navigation.',
    keyTakeaways: [
      '<Outlet /> renders child route components within parent layout hierarchies.',
      'Data loaders fetch data before the component renders, avoiding client waterfall requests.',
      'useParams extracts URL dynamic segments; useSearchParams handles query parameters.',
      'createBrowserRouter enables the modern Data APIs (loaders, actions, errorElement).'
    ],
    interviewTraps: [
      'Forgetting to render <Outlet /> in a parent layout results in child routes failing to display.',
      'useNavigate should not be called synchronously in the render body; call it inside effects or handlers.'
    ],
    codeExample: {
      title: 'React Router v6 Nested Route Setup',
      language: 'typescript',
      code: `import { createBrowserRouter, RouterProvider, Outlet, useParams } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'topics', element: <TopicsList /> },
      { path: 'topics/:topicId', element: <TopicStudyView /> }
    ]
  }
]);

function AppLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main><Outlet /></main> {/* Child routes render here */}
    </div>
  );
}`,
      explanation: 'Outlet acts as a placeholder where child route elements mount dynamically.'
    },
    subtopicNotes: [
      {
        name: 'Nested Layouts',
        description: 'Persistent layouts across navigation',
        points: ['Preserves parent scroll position and state', 'Minimizes re-renders of outer chrome']
      }
    ]
  },

  // HTML5 TOPICS
  htmlConcepts: {
    topicId: 'htmlConcepts',
    categoryId: 'html5',
    title: 'HTML5 Core Concepts',
    level: 'Beginner',
    detailedOverview: 'HTML5 is the standard markup language for documents designed to be displayed in a web browser. It features rich semantics, audio/video elements, canvas for 2D rendering, Web Workers, and offline storage.',
    keyTakeaways: [
      'Semantic tags (<header>, <main>, <nav>, <article>, <footer>) improve accessibility and SEO.',
      'Web Workers run heavy JavaScript in background threads without freezing UI rendering.',
      'HTML5 input types (email, number, date) offer native mobile keyboard optimization and client validation.',
      'Canvas provides scriptable 2D pixel rendering; SVG provides scalable vector XML graphics.'
    ],
    interviewTraps: [
      'Web Workers do NOT have access to the DOM, window, or document objects. Communication occurs via postMessage.',
      'doctype html is required at line 1 to prevent browsers from triggering quirks mode rendering.'
    ],
    codeExample: {
      title: 'Dedicated Web Worker Pattern',
      language: 'javascript',
      code: `// main.js:
const worker = new Worker('compute.js');
worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

worker.onmessage = (e) => {
  console.log('Result from background thread:', e.data.sum);
};

// compute.js (Runs in background thread!):
self.onmessage = (e) => {
  const sum = e.data.numbers.reduce((a, b) => a + b, 0);
  self.postMessage({ sum });
};`,
      explanation: 'Web Workers offload heavy computations to keep the main browser thread at a steady 60fps.'
    },
    subtopicNotes: [
      {
        name: 'Semantic Elements',
        description: 'Document landmark structure',
        points: ['article is self-contained', 'section groups related thematic content']
      }
    ]
  },
  htmlInterviewQuestions: {
    topicId: 'htmlInterviewQuestions',
    categoryId: 'html5',
    title: 'HTML5 Technical Interview Q&A',
    level: 'Intermediate',
    detailedOverview: 'In-depth interview preparation on accessibility (WCAG & WAI-ARIA), script loading (async vs defer), responsive images with srcset, and SEO meta tags.',
    keyTakeaways: [
      'async scripts execute immediately upon download; defer scripts wait until HTML parsing finishes.',
      'aria-label and role attributes bridge accessibility gaps when custom interactive widgets are constructed.',
      'srcset and <picture> allow browsers to choose optimal image resolutions for user device pixel density.',
      'rel="noopener noreferrer" prevents tab-nabbing vulnerabilities when opening external links with target="_blank".'
    ],
    interviewTraps: [
      'First rule of ARIA: Do not use ARIA if a native HTML element already exists (e.g. use <button> instead of <div role="button">).',
      'Missing alt text on images fails WCAG 2.1 Level A compliance.'
    ],
    codeExample: {
      title: 'Responsive Images with <picture> and srcset',
      language: 'html',
      code: `<picture>
  <source media="(min-width: 800px)" srcset="hero-large.webp" type="image/webp">
  <source media="(min-width: 400px)" srcset="hero-medium.webp" type="image/webp">
  <img src="hero-fallback.jpg" alt="Developer preparing for frontend interview" loading="lazy" width="800" height="400">
</picture>`,
      explanation: 'Serves modern WebP formats based on viewport width, falling back gracefully for older browsers.'
    },
    subtopicNotes: [
      {
        name: 'Script Loading Attributes',
        description: 'async vs defer execution timing',
        points: ['defer preserves script execution order', 'async executes out of order as soon as ready']
      }
    ]
  },

  // CSS3 TOPICS
  cSSConcepts: {
    topicId: 'cSSConcepts',
    categoryId: 'css3',
    title: 'Modern CSS3 Concepts',
    level: 'Intermediate',
    detailedOverview: 'Mastering CSS layout algorithms: Flexbox, CSS Grid, Box Model sizing, Block Formatting Context (BFC), custom properties (CSS variables), and modern clamp() responsive math.',
    keyTakeaways: [
      'box-sizing: border-box includes padding and border within the specified element width and height.',
      'CSS Grid handles two-dimensional layouts (rows and columns); Flexbox handles one-dimensional layouts.',
      'A Block Formatting Context (BFC) prevents margin collapsing and contains internal floating elements.',
      'CSS Custom Properties (--color-primary) cascade and can be dynamically read/written via JavaScript.'
    ],
    interviewTraps: [
      'Margin collapsing only occurs on vertical margins between block elements, never on horizontal margins or flex/grid items.',
      'z-index does not work unless the element has a position other than static (or is a flex/grid child).'
    ],
    codeExample: {
      title: 'Responsive Grid with auto-fit and clamp()',
      language: 'css',
      code: `/* Fluid grid without media queries: */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Fluid responsive typography: */
h1 {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
}`,
      explanation: 'auto-fit collapses empty tracks so items expand to fill remaining horizontal space smoothly.'
    },
    subtopicNotes: [
      {
        name: 'Box Model Mechanics',
        description: 'content-box vs border-box',
        points: ['Standardize on * { box-sizing: border-box } across applications']
      }
    ]
  },
  cssInterviewQA: {
    topicId: 'cssInterviewQA',
    categoryId: 'css3',
    title: 'CSS3 Technical Interview Q&A',
    level: 'Intermediate',
    detailedOverview: 'High-frequency styling interview questions: specificity calculation, stacking context formation, pseudo-elements vs pseudo-classes, and hardware-accelerated animations.',
    keyTakeaways: [
      'Specificity weights: Inline (1000) > ID (100) > Class/Attribute/Pseudo-class (10) > Element (1).',
      'Creating a Stacking Context: opacity < 1, transform != none, filter, or will-change creates a local z-index stack.',
      'Animate transform and opacity for 60fps performance; avoid animating width, height, or top/left (which trigger layout/reflow).',
      'Mobile-first responsive design uses min-width queries to build upward from small screens.'
    ],
    interviewTraps: [
      'A higher z-index element inside a lower stacking context will still render underneath elements in higher stacking contexts.',
      '!important overrides all specificity, but makes global CSS unmaintainable.'
    ],
    codeExample: {
      title: 'Hardware-Accelerated Animation Pattern',
      language: 'css',
      code: `/* BAD: Triggers Layout & Repaint on every frame (Laggy): */
.bad-button:hover {
  left: 20px;
  width: 150px;
}

/* GOOD: Uses GPU Composite layer (Butter-smooth 60fps): */
.good-button {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
  will-change: transform;
}
.good-button:hover {
  transform: translateX(20px) scale(1.05);
}`,
      explanation: 'Transform mutations run directly on the GPU compositor thread without triggering layout calculations.'
    },
    subtopicNotes: [
      {
        name: 'Stacking Context & Z-Index',
        description: 'Why z-index: 99999 sometimes fails',
        points: ['Check parent stacking contexts', 'transform and filter create new contexts']
      }
    ]
  },

  // NEXT.JS TOPICS
  nextFundamentals: {
    topicId: 'nextFundamentals',
    categoryId: 'next',
    title: 'Next.js 14+ Fundamentals',
    level: 'Beginner',
    detailedOverview: 'Next.js is a production React framework featuring hybrid static and server rendering, smart route prefetching, image/font optimization, and the modern App Router.',
    keyTakeaways: [
      'App Router uses file-system based routing inside the app directory (page.tsx, layout.tsx).',
      'By default, all components inside the app directory are React Server Components (RSC).',
      'Next/Image automatically resizes images, converts to modern formats (WebP/AVIF), and prevents layout shifts.',
      'Next/Font automatically optimizes Google fonts and hosts them locally with zero external network requests.'
    ],
    interviewTraps: [
      'You cannot import server-only packages (like database drivers) into components marked with "use client".',
      'Server components cannot use React hooks (useState, useEffect) or browser event listeners (onClick).'
    ],
    codeExample: {
      title: 'App Router Layout & Page Structure',
      language: 'typescript',
      code: `// app/layout.tsx (Server Component Layout):
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <header><nav>App Nav</nav></header>
        {children}
      </body>
    </html>
  );
}

// app/page.tsx (Home Page):
export default async function HomePage() {
  return <main><h1>Welcome to JsPrep Mobile</h1></main>;
}`,
      explanation: 'Layouts persist across page transitions without unmounting or re-rendering.'
    },
    subtopicNotes: [
      {
        name: 'App Router vs Pages Router',
        description: 'Evolution of Next.js architecture',
        points: ['Nested layouts replace _app and _document', 'Server components by default']
      }
    ]
  },
  nextAppRouter: {
    topicId: 'nextAppRouter',
    categoryId: 'next',
    title: 'App Router & Routing Deep Dive',
    level: 'Intermediate',
    detailedOverview: 'Exploring advanced App Router paradigms: Route Handlers (GET/POST API routes), Parallel Routes (@modal), Intercepted Routes, and dynamic segment catching ([...slug]).',
    keyTakeaways: [
      'Route Handlers (route.ts) replace legacy pages/api routes with Web standard Request and Response objects.',
      'Parallel routes (@modal) allow rendering multiple independent pages in the same layout simultaneously.',
      'Intercepted routes ((.)photo) allow loading a route within the current layout while masking the URL.',
      'loading.tsx automatically wraps the page segment in a React Suspense boundary.'
    ],
    interviewTraps: [
      'Route Handlers return Response objects directly; using res.status().json() like Express will cause an error.',
      'Dynamic segments ([id]) must match params object in the page component props.'
    ],
    codeExample: {
      title: 'Next.js App Router Route Handler',
      language: 'typescript',
      code: `// app/api/questions/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  // Query database or service
  return NextResponse.json({
    status: 'success',
    data: [{ id: 'js-1', category }]
  });
}`,
      explanation: 'Uses modern Web Fetch API standards (Request, NextResponse) supported on Edge and Node runtimes.'
    },
    subtopicNotes: [
      {
        name: 'Route Handlers',
        description: 'Custom request handlers for API endpoints',
        points: ['Supports GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS', 'Runs on Node or Edge runtime']
      }
    ]
  },
  nextRendering: {
    topicId: 'nextRendering',
    categoryId: 'next',
    title: 'Server vs Client Components',
    level: 'Advanced',
    detailedOverview: 'Deep dive into React Server Components (RSC): mental models, serialization boundaries, Server Actions with mutation revalidation, and Streaming SSR.',
    keyTakeaways: [
      'Server Components execute exclusively on the server and ship ZERO JavaScript bundle to the browser.',
      '"use client" does not make a component client-only; it defines the boundary where client interactivity begins.',
      'Props passed from Server to Client components must be serializable across the network.',
      'Server Actions ("use server") allow client forms and buttons to execute server-side database mutations directly.'
    ],
    interviewTraps: [
      'Marking the top-level layout with "use client" inadvertently turns your entire application into a client bundle.',
      'Passing functions as props from Server Components to Client Components throws a serialization error.'
    ],
    codeExample: {
      title: 'Server Action with revalidatePath',
      language: 'typescript',
      code: `// app/actions.ts:
'use server';

import { revalidatePath } from 'next/cache';

export async function submitBookmark(topicId: string) {
  // Direct server DB mutation:
  // await db.bookmarks.insert({ topicId });
  revalidatePath('/topics'); // Invalidates cached page on CDN
  return { success: true };
}

// ClientComponent.tsx:
'use client';
import { submitBookmark } from './actions';

export function BookmarkButton({ topicId }: { topicId: string }) {
  return <button onClick={() => submitBookmark(topicId)}>Save</button>;
}`,
      explanation: 'Server Actions eliminate boilerplate REST API routes for simple database mutations.'
    },
    subtopicNotes: [
      {
        name: 'RSC Wire Format',
        description: 'How server component trees stream to the client',
        points: ['JSON-like representation of UI tree and slot placeholders', 'Enables progressive hydration']
      }
    ]
  },

  // AWS TOPICS
  awsIAM: {
    topicId: 'awsIAM',
    categoryId: 'aws',
    title: 'AWS IAM & Access Management',
    level: 'Beginner',
    detailedOverview: 'AWS Identity and Access Management (IAM) is the foundational security service providing granular authentication and authorization controls for AWS resources.',
    keyTakeaways: [
      'IAM Users represent persistent identities; IAM Groups manage permissions for collections of users.',
      'IAM Roles provide temporary credentials via AWS STS; essential for EC2 instances and Lambda functions.',
      'Policy evaluation defaults to Implicit Deny. Any Explicit Deny overrides all Allows.',
      'Principle of Least Privilege: Grant only the minimum permissions required to perform a task.'
    ],
    interviewTraps: [
      'Hardcoding AWS access keys inside source code or Docker images.',
      'Forgetting that root user access keys should be deleted immediately after account creation.'
    ],
    codeExample: {
      title: 'Least Privilege IAM Policy JSON',
      language: 'json',
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadSpecificBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::jsprep-assets-prod",
        "arn:aws:s3:::jsprep-assets-prod/*"
      ]
    }
  ]
}`,
      explanation: 'Restricts S3 read permissions specifically to the designated bucket rather than using wildcard *.'
    },
    subtopicNotes: [
      {
        name: 'Users vs Roles',
        description: 'Long-term vs temporary STS credentials',
        points: ['Roles eliminate secret rotation overhead', 'Instance profiles attach roles to EC2']
      }
    ]
  },
  awEC2InterviewQA: {
    topicId: 'awEC2InterviewQA',
    categoryId: 'aws',
    title: 'Amazon EC2 & Auto Scaling',
    level: 'Intermediate',
    detailedOverview: 'Elastic Compute Cloud (EC2) sizing, pricing models (On-Demand, Reserved, Spot), Auto Scaling Groups (ASG), and Elastic Block Store (EBS) volumes.',
    keyTakeaways: [
      'Spot Instances offer up to 90% discount for stateless, fault-tolerant workloads with 2-minute termination warnings.',
      'Auto Scaling Groups maintain application availability by automatically adding/removing instances based on metrics.',
      'EBS volumes are network-attached block devices tied to a specific Availability Zone (AZ).',
      'EC2 User Data scripts execute with root privileges once during the initial instance launch.'
    ],
    interviewTraps: [
      'EBS gp3 volumes offer baseline 3,000 IOPS and 125 MB/s throughput independent of volume size, unlike older gp2.',
      'Standard EBS volumes cannot be attached across multiple AZs; use EFS or multi-attach io2.'
    ],
    codeExample: {
      title: 'EC2 Auto Scaling Group Launch Template',
      language: 'hcl',
      code: `resource "aws_launch_template" "app_lt" {
  name_prefix   = "jsprep-lt-"
  image_id      = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  iam_instance_profile {
    name = aws_iam_instance_profile.app_profile.name
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              docker run -d -p 80:3000 myapp:latest
              EOF
  )
}`,
      explanation: 'Defines instance configuration for automated scaling without manual server provisioning.'
    },
    subtopicNotes: [
      {
        name: 'Pricing Models',
        description: 'On-Demand vs Reserved vs Spot vs Savings Plans',
        points: ['Spot for worker queues', 'Reserved/Savings Plans for steady-state databases']
      }
    ]
  },
  awS3InterviewQA: {
    topicId: 'awS3InterviewQA',
    categoryId: 'aws',
    title: 'Amazon S3 & Storage Tiers',
    level: 'Beginner',
    detailedOverview: 'Object storage fundamentals: 99.999999999% (11 9s) durability, bucket policies, lifecycle rules, S3 Glacier tiers, and CORS configuration.',
    keyTakeaways: [
      'S3 stores objects (key, value, metadata) in globally unique buckets.',
      'Storage tiers: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Flexible, Glacier Deep Archive.',
      'Presigned URLs grant temporary read/write access to private S3 objects without granting IAM credentials.',
      'S3 Versioning protects against accidental deletions and overwrites.'
    ],
    interviewTraps: [
      'Bucket policies govern access to S3 resources directly; IAM policies govern what a principal can access.',
      'Glacier Deep Archive retrieval takes 12-48 hours unless expedited tiers are used.'
    ],
    codeExample: {
      title: 'Generate S3 Presigned Upload URL in Node.js',
      language: 'typescript',
      code: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export async function getUploadUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: "jsprep-uploads",
    Key: key,
    ContentType: "image/png"
  });

  // Client can upload directly to S3 without passing through backend server!
  return await getSignedUrl(s3, command, { expiresIn: 300 });
}`,
      explanation: 'Presigned URLs offload file uploads directly to AWS S3, reducing application server bandwidth.'
    },
    subtopicNotes: [
      {
        name: 'S3 Durability & Availability',
        description: '11 9s of durability across multiple facilities',
        points: ['Cross-Region Replication for disaster recovery', 'Lifecycle transition rules save 70%+ on costs']
      }
    ]
  },
  awsVPCInterviewQA: {
    topicId: 'awsVPCInterviewQA',
    categoryId: 'aws',
    title: 'Amazon VPC & Networking',
    level: 'Advanced',
    detailedOverview: 'Virtual Private Cloud (VPC) isolation: CIDR notation, Public vs Private Subnets, Internet Gateways (IGW), NAT Gateways, Route Tables, and VPC Peering.',
    keyTakeaways: [
      'Public Subnets have a route table entry pointing 0.0.0.0/0 to an Internet Gateway (IGW).',
      'Private Subnets route outbound internet traffic through a NAT Gateway located in a Public Subnet.',
      'AWS reserves 5 IP addresses in every subnet (first 4 and last 1).',
      'VPC Peering connects two VPCs non-transitively without routing through the public internet.'
    ],
    interviewTraps: [
      'A NAT Gateway must reside in a PUBLIC subnet with an Elastic IP to function.',
      'Security Groups are stateful; NACLs are stateless and require ephemeral port ranges for return traffic.'
    ],
    codeExample: {
      title: 'VPC Route Table Configuration',
      language: 'hcl',
      code: `# Public Route Table (direct route to Internet Gateway):
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Private Route Table (route to NAT Gateway for secure outbound):
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}`,
      explanation: 'Isolates application servers in private subnets while granting secure outbound access for OS updates.'
    },
    subtopicNotes: [
      {
        name: 'Subnet Architecture',
        description: 'High availability across multiple AZs',
        points: ['Deploy at least 2 public and 2 private subnets across 2 AZs', 'Use NAT Gateways per AZ for fault tolerance']
      }
    ]
  },
  awsRoute53InterviewQA: {
    topicId: 'awsRoute53InterviewQA',
    categoryId: 'aws',
    title: 'Amazon Route 53 & DNS',
    level: 'Intermediate',
    detailedOverview: 'Highly available and scalable cloud Domain Name System (DNS) web service: Record types (A, AAAA, CNAME, Alias) and sophisticated routing policies.',
    keyTakeaways: [
      'Alias Records route traffic directly to AWS resources (ALB, CloudFront, S3) at the zone apex without DNS lookup charges.',
      'Routing policies: Simple, Weighted, Latency, Failover, Geolocation, Geoproximity, and Multivalue Answer.',
      'Route 53 Health Checks monitor endpoint health and trigger automatic DNS failover to backup regions.',
      'Private Hosted Zones resolve internal domain names within your VPCs without public exposure.'
    ],
    interviewTraps: [
      'DNS CNAME records cannot be created at the zone apex (example.com); you must use an Alias record.',
      'DNS TTL (Time to Live) determines how long resolvers cache DNS records before re-querying.'
    ],
    codeExample: {
      title: 'Route 53 Alias Record to Application Load Balancer',
      language: 'hcl',
      code: `resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "jsprep.dev"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}`,
      explanation: 'Alias records point apex domains directly to AWS ALBs and automatically track target IP changes.'
    },
    subtopicNotes: [
      {
        name: 'Routing Policies',
        description: 'Active-Active vs Active-Passive failover',
        points: ['Latency routing sends users to lowest latency region', 'Geolocation routes based on user continent/country']
      }
    ]
  },
  awsIAMInterviewQA: {
    topicId: 'awsIAMInterviewQA',
    categoryId: 'aws',
    title: 'AWS Security & IAM Deep Dive',
    level: 'Advanced',
    detailedOverview: 'Advanced cloud security engineering: Cross-account STS AssumeRole, AWS Organizations Service Control Policies (SCPs), and AWS KMS envelope encryption.',
    keyTakeaways: [
      'AWS KMS uses Envelope Encryption: a Customer Master Key (CMK) encrypts a plaintext Data Key which encrypts data.',
      'Service Control Policies (SCPs) define the maximum available permissions across an AWS Organization.',
      'Cross-account access uses STS AssumeRole with external IDs to mitigate confused deputy attacks.',
      'AWS Secrets Manager automatically rotates database credentials on a schedule using Lambda.'
    ],
    interviewTraps: [
      'SCPs do NOT grant permissions; they only set guardrails. An identity still needs an IAM policy allow.',
      'If an action is explicitly denied in an SCP, no IAM policy within that account can allow it.'
    ],
    codeExample: {
      title: 'STS AssumeRole Script in TypeScript',
      language: 'typescript',
      code: `import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

const sts = new STSClient({ region: "us-east-1" });

export async function assumeCrossAccountRole(roleArn: string) {
  const command = new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: "JsPrepCrossAccountSession",
    DurationSeconds: 3600
  });

  const response = await sts.send(command);
  // Returns temporary AccessKeyId, SecretAccessKey, and SessionToken!
  return response.Credentials;
}`,
      explanation: 'Enables microservices to assume roles in external AWS accounts securely without persistent secrets.'
    },
    subtopicNotes: [
      {
        name: 'Envelope Encryption',
        description: 'How AWS KMS protects sensitive data',
        points: ['KMS never exposes plaintext CMK', 'Data keys are generated and discarded after encryption']
      }
    ]
  },
  awsScenarioQA: {
    topicId: 'awsScenarioQA',
    categoryId: 'aws',
    title: 'AWS Scenario-Based Solutions',
    level: 'Advanced',
    detailedOverview: 'Solving real-world system architecture interview prompts: building resilient, fault-tolerant, auto-scaling web tiers with RTO and RPO disaster recovery metrics.',
    keyTakeaways: [
      'RTO (Recovery Time Objective): Maximum acceptable downtime before service restoration.',
      'RPO (Recovery Point Objective): Maximum acceptable data loss measured in time.',
      'Disaster Recovery strategies: Backup & Restore -> Pilot Light -> Warm Standby -> Multi-Region Active-Active.',
      'Decouple heavy tasks using Amazon SQS queues and AWS Lambda workers for asynchronous scale.'
    ],
    interviewTraps: [
      'Multi-Region Active-Active carries significant cross-region data transfer costs and database sync complexity.',
      'Failing to drain connection queues on Application Load Balancers during rolling deployments causes 502 errors.'
    ],
    codeExample: {
      title: 'Decoupled Worker Architecture (SQS + Lambda)',
      language: 'typescript',
      code: `// Express API handler: Offload heavy PDF/AI generation to SQS
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });

export async function handleGenerateReport(userId: string) {
  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.REPORT_QUEUE_URL,
    MessageBody: JSON.stringify({ userId, requestedAt: Date.now() })
  }));

  // Immediate response to user; background Lambda processes the queue!
  return { status: "queued", message: "Report is generating in background" };
}`,
      explanation: 'Decouples web tier from heavy background compute, preventing web request timeouts.'
    },
    subtopicNotes: [
      {
        name: 'Disaster Recovery Tiers',
        description: 'Balancing cost vs recovery time',
        points: ['Pilot Light keeps minimal core active', 'Warm standby runs scaled-down replica']
      }
    ]
  },
  awsInterviewQA: {
    topicId: 'awsInterviewQA',
    categoryId: 'aws',
    title: 'AWS General Solutions Architect Q&A',
    level: 'Intermediate',
    detailedOverview: 'The AWS Well-Architected Framework: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.',
    keyTakeaways: [
      'Reliability: Automatically recover from failure, test recovery procedures, and scale horizontally.',
      'Cost Optimization: Adopt a consumption model, measure overall efficiency, and stop spending on undifferentiated heavy lifting.',
      'Performance: Democratize advanced technologies, go global in minutes, and use serverless architectures.',
      'CloudWatch metrics and alarms trigger automated SNS notifications and Auto Scaling actions.'
    ],
    interviewTraps: [
      'CloudWatch standard metrics publish at 5-minute intervals; detailed monitoring publishes every 1 minute at additional cost.',
      'Overprovisioning provisioned IOPS when gp3 volumes could meet throughput requirements.'
    ],
    codeExample: {
      title: 'CloudWatch Metric Alarm for CPU Auto Scaling',
      language: 'hcl',
      code: `resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "high-cpu-utilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 75

  alarm_actions = [aws_autoscaling_policy.scale_out.arn]
}`,
      explanation: 'Triggers scale-out policy when average CPU utilization stays above 75% for two consecutive periods.'
    },
    subtopicNotes: [
      {
        name: 'Well-Architected Pillars',
        description: 'Core evaluation criteria for AWS designs',
        points: ['Security is priority #1', 'Design for automated self-healing']
      }
    ]
  },

  // DOCKER TOPICS
  dockerBasics: {
    topicId: 'dockerBasics',
    categoryId: 'docker',
    title: 'Docker Essentials',
    level: 'Beginner',
    detailedOverview: 'Containerization principles: Linux namespaces (PID, NET, MNT) for process isolation, cgroups for resource limiting, copy-on-write union filesystems, and Dockerfile layers.',
    keyTakeaways: [
      'Images are read-only blueprints made of stacked filesystem layers; Containers are runnable image instances.',
      'Order Dockerfile instructions from least frequently changing to most frequently changing to maximize layer cache hits.',
      'Volumes store persistent data outside container layers; Bind mounts link host directories directly.',
      'Multi-stage builds eliminate compilers and dev dependencies from production images.'
    ],
    interviewTraps: [
      'Running containers as the root user exposes the host system to privilege escalation attacks.',
      'COPY . . before npm install busts the package caching layer whenever any source code file changes.'
    ],
    codeExample: {
      title: 'Optimized Node.js Multi-Stage Dockerfile',
      language: 'dockerfile',
      code: `# Stage 1: Build dependencies & code
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
      explanation: 'Separates build tools from production runtime, cutting image size by 80% and removing dev dependencies.'
    },
    subtopicNotes: [
      {
        name: 'Layer Caching',
        description: 'How Docker accelerates image builds',
        points: ['Place package.json before source files', 'Combine RUN commands to minimize layers']
      }
    ]
  },
  dockerInterviewQA: {
    topicId: 'dockerInterviewQA',
    categoryId: 'docker',
    title: 'Docker Interview Q&A',
    level: 'Intermediate',
    detailedOverview: 'CMD vs ENTRYPOINT, Docker networking modes (bridge, host, overlay), zombie process reaping with dumb-init/tini, and container security scanning.',
    keyTakeaways: [
      'ENTRYPOINT sets the default binary; CMD supplies default parameters that can be overridden at run time.',
      'Bridge network is default for standalone containers; Host network shares host network namespace for maximum throughput.',
      'Dangling images (<none>) consume disk space; docker image prune removes unreferenced layers.',
      'Docker Compose coordinates multi-container local dev stacks with automated internal DNS resolution.'
    ],
    interviewTraps: [
      'Using shell form (CMD node server.js) prevents node from receiving SIGTERM on docker stop.',
      'Always use exec form (CMD ["node", "server.js"]) so your app runs as PID 1 or use tini.'
    ],
    codeExample: {
      title: 'Docker Compose Full-Stack Configuration',
      language: 'yaml',
      code: `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/jsprep
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=pass

volumes:
  pgdata:`,
      explanation: 'Docker Compose creates an internal network where services discover each other by service name.'
    },
    subtopicNotes: [
      {
        name: 'Networking Modes',
        description: 'Bridge vs Host vs None vs Overlay',
        points: ['Overlay network enables multi-host Swarm/Kubernetes communication']
      }
    ]
  },

  // KUBERNETES TOPICS
  k8sArch: {
    topicId: 'k8sArch',
    categoryId: 'kubernetes',
    title: 'K8s Architecture & Workloads',
    level: 'Advanced',
    detailedOverview: 'Kubernetes architecture: Control Plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager) and Worker Nodes (kubelet, kube-proxy, container runtime).',
    keyTakeaways: [
      'etcd is a consistent, highly available key-value store holding the complete cluster state.',
      'kube-apiserver is the central hub exposing the REST API; all components interact exclusively through it.',
      'Pods are the smallest deployable compute units in Kubernetes, sharing network namespace and storage volumes.',
      'Deployments manage declarative updates for stateless Pods; StatefulSets provide stable network identities and persistent storage.'
    ],
    interviewTraps: [
      'Liveness probes verify if the container is running; Readiness probes verify if the container is ready to accept incoming traffic.',
      'Configuring a faulty liveness probe that calls a failing database will cause cascading cluster-wide pod restarts.'
    ],
    codeExample: {
      title: 'Production Kubernetes Deployment Manifest',
      language: 'yaml',
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: jsprep-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: jsprep
  template:
    metadata:
      labels:
        app: jsprep
    spec:
      containers:
      - name: web
        image: jsprep/backend:v1.0
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10`,
      explanation: 'Declares 3 replicas with resource limits and readiness probes to prevent traffic hitting unready pods.'
    },
    subtopicNotes: [
      {
        name: 'Control Plane vs Worker',
        description: 'Cluster component roles',
        points: ['kubelet registers node with API server', 'kube-proxy configures iptables/IPVS rules']
      }
    ]
  },
  kubernetesInterviewQA: {
    topicId: 'kubernetesInterviewQA',
    categoryId: 'kubernetes',
    title: 'Kubernetes Technical Interview Q&A',
    level: 'Advanced',
    detailedOverview: 'Kubernetes operations: Horizontal Pod Autoscaler (HPA), Ingress Controllers, Persistent Volumes (PV) and Claims (PVC), and debugging CrashLoopBackOff.',
    keyTakeaways: [
      'HPA automatically scales pod replicas based on observed CPU utilization or custom Prometheus metrics.',
      'Services provide stable internal IPs (ClusterIP) and DNS names across dynamic, ephemeral pod lifecycles.',
      'Ingress manages external HTTP/HTTPS access, SSL termination, and path routing to backend services.',
      'PersistentVolumeClaims (PVC) abstract storage requests, allowing pods to mount persistent block or file storage.'
    ],
    interviewTraps: [
      'A pod with an OOMKilled status (Exit Code 137) was terminated by the Linux kernel because it exceeded its memory limit.',
      'Updating a ConfigMap does NOT automatically restart dependent pods unless an operator or roll-out tool is used.'
    ],
    codeExample: {
      title: 'Horizontal Pod Autoscaler (HPA) Manifest',
      language: 'yaml',
      code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: jsprep-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: jsprep-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
      explanation: 'Scales replicas from 2 to 10 automatically when average CPU across pods exceeds 70%.'
    },
    subtopicNotes: [
      {
        name: 'Troubleshooting Pods',
        description: 'kubectl describe, logs, exec',
        points: ['Check events section in describe pod', 'Use kubectl logs --previous for crash analysis']
      }
    ]
  },

  // JENKINS TOPICS
  jenkinsPipelines: {
    topicId: 'jenkinsPipelines',
    categoryId: 'jenkins',
    title: 'Jenkins Pipelines & Automation',
    level: 'Intermediate',
    detailedOverview: 'Automated CI/CD pipelines as code: Declarative vs Scripted pipelines, Jenkinsfile structure, stages, parallel execution, agents, and credential binding.',
    keyTakeaways: [
      'Declarative Pipeline uses a structured, readable hierarchy with built-in validation and post actions.',
      'Master-Agent architecture distributes build workloads across multiple worker nodes, keeping the controller responsive.',
      'Jenkins Shared Libraries allow teams to share reusable Groovy functions and standardized stages across hundreds of repos.',
      'Credentials Plugin encrypts API tokens, SSH keys, and passwords, injecting them securely as environment variables.'
    ],
    interviewTraps: [
      'Running heavy compilations directly on the Jenkins Controller node can crash the entire Jenkins instance.',
      'Hardcoding secrets in Jenkinsfile exposes credentials in Git history.'
    ],
    codeExample: {
      title: 'Declarative Jenkinsfile with Parallel Stages',
      language: 'groovy',
      code: `pipeline {
  agent any
  tools {
    nodejs 'Node20'
  }
  stages {
    stage('Install & Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
    stage('Test & Quality') {
      parallel {
        stage('Unit Tests') {
          steps { sh 'npm test' }
        }
        stage('Lint Check') {
          steps { sh 'npm run lint' }
        }
      }
    }
  }
  post {
    failure {
      mail to: 'devs@jsprep.dev', subject: "Pipeline Failed: \${env.JOB_NAME}"
    }
  }
}`,
      explanation: 'Demonstrates declarative stages with parallel execution of unit tests and linting to reduce CI run time.'
    },
    subtopicNotes: [
      {
        name: 'Distributed Builds',
        description: 'Controller and Agent topology',
        points: ['Use Docker agents for ephemeral, clean build environments', 'Tag agents with labels (linux, arm64)']
      }
    ]
  },
  jenkinsQA: {
    topicId: 'jenkinsQA',
    categoryId: 'jenkins',
    title: 'Jenkins Interview Questions',
    level: 'Intermediate',
    detailedOverview: 'Jenkins interview scenarios: webhook triggers from GitHub, Blue-Green deployments, pipeline failure notifications, and plugin management.',
    keyTakeaways: [
      'GitHub Webhooks trigger Jenkins builds automatically on git push or pull request creation.',
      'Blue-Green deployments minimize downtime by deploying to an idle environment and switching router traffic.',
      'Replay feature in Jenkins allows rerunning a failed build with modified pipeline scripts for fast debugging.',
      'Backup strategies: back up JENKINS_HOME directory to preserve jobs, configurations, and build history.'
    ],
    interviewTraps: [
      'Installing untested plugins can introduce dependency conflicts and security vulnerabilities.',
      'Forgetting to configure webhook secret tokens allows unauthorized external triggers.'
    ],
    codeExample: {
      title: 'Docker-in-Jenkins Agent Pipeline',
      language: 'groovy',
      code: `pipeline {
  agent {
    docker {
      image 'node:20-alpine'
      args '-v /tmp:/tmp'
    }
  }
  stages {
    stage('Build in Container') {
      steps {
        sh 'node -v'
        sh 'npm ci'
      }
    }
  }
}`,
      explanation: 'Executes build steps inside an isolated Docker container on the Jenkins agent.'
    },
    subtopicNotes: [
      {
        name: 'Pipeline Best Practices',
        description: 'Keeping pipelines resilient and fast',
        points: ['Cache dependencies across runs', 'Use timeouts on stages to avoid hung builds']
      }
    ]
  },

  // TERRAFORM TOPICS
  terraformBasics: {
    topicId: 'terraformBasics',
    categoryId: 'terraform',
    title: 'Terraform State & Workflows',
    level: 'Intermediate',
    detailedOverview: 'Infrastructure as Code (IaC) principles: declarative HashiCorp Configuration Language (HCL), provider plugins, resource dependency graphs, and the state lifecycle.',
    keyTakeaways: [
      'Terraform core workflow: init (downloads providers), plan (shows execution diff), apply (creates/updates infra), destroy.',
      'State file (terraform.tfstate) maps declared HCL configuration to real-world cloud resources.',
      'Remote Backends (AWS S3 + DynamoDB) provide secure state storage and prevent concurrent apply race conditions.',
      'Terraform Modules encapsulate reusable infrastructure components with defined inputs and outputs.'
    ],
    interviewTraps: [
      'Never commit terraform.tfstate to Git; it contains plain-text passwords and sensitive resource attributes.',
      'Running terraform apply without state locking can cause dual writes and state file corruption.'
    ],
    codeExample: {
      title: 'Terraform AWS S3 & DynamoDB Remote State',
      language: 'hcl',
      code: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "jsprep-terraform-state"
    key            = "prod/vpc.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}`,
      explanation: 'Stores infrastructure state in an encrypted S3 bucket with DynamoDB table state locking.'
    },
    subtopicNotes: [
      {
        name: 'State Locking',
        description: 'How DynamoDB prevents race conditions',
        points: ['Acquires LockID before plan/apply', 'Releases LockID upon finish']
      }
    ]
  },
  terraformInterviewQA: {
    topicId: 'terraformInterviewQA',
    categoryId: 'terraform',
    title: 'Terraform Interview Questions',
    level: 'Advanced',
    detailedOverview: 'Advanced Terraform engineering: managing state drift, terraform import for existing resources, count vs for_each, and lifecycle rules.',
    keyTakeaways: [
      'State drift occurs when resources are modified out-of-band in the cloud console without Terraform.',
      'terraform refresh reconciles state with actual cloud resources before generating a plan.',
      'for_each is preferred over count because count references items by numerical index, causing destructive updates on list reordering.',
      'lifecycle { prevent_destroy = true } protects critical databases from accidental deletion.'
    ],
    interviewTraps: [
      'Removing an item from the middle of a list managed by count causes Terraform to recreate all subsequent resources.',
      'terraform import imports existing cloud resources into state, but you must still manually write the matching HCL code.'
    ],
    codeExample: {
      title: 'for_each vs count Best Practice',
      language: 'hcl',
      code: `# BEST PRACTICE: for_each uses unique map keys:
variable "subnets" {
  type = map(string)
  default = {
    "subnet-a" = "10.0.1.0/24"
    "subnet-b" = "10.0.2.0/24"
  }
}

resource "aws_subnet" "public" {
  for_each          = var.subnets
  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value
  availability_zone = "us-east-1a"
  tags = {
    Name = each.key
  }
}`,
      explanation: 'for_each creates resources keyed by name, so adding or removing one subnet does not affect others.'
    },
    subtopicNotes: [
      {
        name: 'Drift Detection',
        description: 'Reconciling out-of-band changes',
        points: ['Run terraform plan in CI to detect drift', 'Use terraform apply to bring resources back into compliance']
      }
    ]
  },

  // ANSIBLE TOPICS
  ansiblePlaybooks: {
    topicId: 'ansiblePlaybooks',
    categoryId: 'ansible',
    title: 'Ansible Playbooks & Idempotency',
    level: 'Intermediate',
    detailedOverview: 'Agentless IT automation: YAML playbooks, inventory files, tasks, modules, handlers for service reloads, and the mathematical property of idempotency.',
    keyTakeaways: [
      'Ansible is agentless; it uses standard OpenSSH on Linux and WinRM on Windows.',
      'Idempotency ensures running a playbook multiple times produces the exact same end state without unintended side effects.',
      'Handlers only execute when notified by a task that reported a "changed" state.',
      'Ansible Roles provide a standardized directory structure (tasks, handlers, vars, templates, defaults).'
    ],
    interviewTraps: [
      'Using the command or shell module often bypasses idempotency unless creates or removes arguments are provided.',
      'Ansible evaluates tasks sequentially in the order written in the playbook.'
    ],
    codeExample: {
      title: 'Idempotent Nginx Web Server Playbook',
      language: 'yaml',
      code: `---
- name: Configure Production Web Servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Deploy Nginx VirtualHost Configuration
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      systemd:
        name: nginx
        state: reloaded`,
      explanation: 'The handler only reloads Nginx if the template task resulted in an actual configuration change.'
    },
    subtopicNotes: [
      {
        name: 'Ansible Roles Structure',
        description: 'Standardized layout for reusable automation',
        points: ['tasks/main.yml holds execution steps', 'templates/ holds Jinja2 configuration templates']
      }
    ]
  },
  ansibleInterviewQA: {
    topicId: 'ansibleInterviewQA',
    categoryId: 'ansible',
    title: 'Ansible Technical Interview Q&A',
    level: 'Intermediate',
    detailedOverview: 'Ansible interview scenarios: Ansible Vault encryption, Dynamic Inventory for AWS/GCP, forks parameter for parallel execution, and debugging failed tasks.',
    keyTakeaways: [
      'Ansible Vault encrypts sensitive passwords, API tokens, and private keys with AES-256.',
      'Dynamic Inventory scripts automatically discover EC2 or Kubernetes nodes based on cloud tags.',
      'The forks setting in ansible.cfg controls how many target hosts Ansible manages concurrently (default 5).',
      '--check mode (dry run) simulates playbook execution without making actual system changes.'
    ],
    interviewTraps: [
      'ansible-playbook with --check mode may fail if downstream tasks depend on files created by earlier tasks in the same run.',
      'Command module does not support shell features like pipes (|) or environment variables; use shell module for that.'
    ],
    codeExample: {
      title: 'Ansible Vault Encrypted Variables Usage',
      language: 'yaml',
      code: `# Encrypt file: ansible-vault encrypt vars/secrets.yml
# Run playbook: ansible-playbook site.yml --ask-vault-pass

- name: Deploy App with Vault Secret
  hosts: app
  vars_files:
    - vars/secrets.yml # Contains encrypted db_password
  tasks:
    - name: Output status securely
      debug:
        msg: "Connecting with database user {{ db_user }}"
      no_log: true # Prevents secret exposure in build logs!`,
      explanation: 'no_log: true prevents sensitive passwords from printing to stdout during playbook execution.'
    },
    subtopicNotes: [
      {
        name: 'Dynamic Inventory',
        description: 'Auto-discovering cloud instances',
        points: ['Uses aws_ec2.yml plugin', 'Groups instances dynamically by tag:Environment or tag:Role']
      }
    ]
  }
};

// Fallback generator for any topic without a hardcoded guide
export function getTopicStudyGuide(topicId: string, categoryId: string, topicTitle: string): TopicStudyGuide {
  if (TOPIC_STUDY_GUIDES[topicId]) {
    return TOPIC_STUDY_GUIDES[topicId];
  }

  // Generate tailored study guide based on title and category
  return {
    topicId,
    categoryId,
    title: topicTitle,
    level: topicTitle.toLowerCase().includes('advanced') || topicTitle.toLowerCase().includes('arch') ? 'Advanced' : 'Intermediate',
    detailedOverview: `Deep-dive guide and technical interview preparation for ${topicTitle}. Covers fundamental principles, production implementation patterns, edge cases, and architectural best practices.`,
    keyTakeaways: [
      `Core conceptual foundation and architecture of ${topicTitle}.`,
      `Practical trade-offs, performance implications, and debugging strategies in production.`,
      `Standard best practices for clean code, error boundaries, and system reliability.`,
      `High-yield interview questions and structured mental models for technical discussions.`
    ],
    interviewTraps: [
      `Failing to consider asynchronous execution timing or unintended state mutation.`,
      `Assuming default configurations without analyzing throughput or memory consumption.`,
      `Neglecting edge cases, network boundaries, and error recovery mechanisms.`
    ],
    codeExample: {
      title: `${topicTitle} Production Pattern`,
      language: 'typescript',
      code: `// Key architectural pattern for ${topicTitle}
export function execute${topicTitle.replace(/[^a-zA-Z]/g, '')}() {
  console.log("Initializing ${topicTitle} workflow...");
  // 1. Validate inputs and configuration parameters
  // 2. Execute primary business logic with proper error boundaries
  // 3. Clean up resources and return structured result
  return {
    status: 'success',
    topic: '${topicTitle}',
    timestamp: new Date().toISOString()
  };
}`,
      explanation: `Standard architectural pattern demonstrating parameter validation, execution encapsulation, and structured return types.`
    },
    subtopicNotes: [
      {
        name: `${topicTitle} Core Mechanics`,
        description: `How the runtime processes and schedules ${topicTitle}`,
        points: ['Focus on memory efficiency', 'Understand concurrency and lifecycle hooks', 'Adhere to least privilege and modularity']
      },
      {
        name: `${topicTitle} Common Pitfalls`,
        description: 'Frequent mistakes in production environments',
        points: ['Monitor logs and system metrics', 'Ensure comprehensive test coverage for edge cases']
      }
    ]
  };
}
