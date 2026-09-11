import { Category, QuestionAnswer, ProgrammingQuestion, CodeSnippet } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Core concepts, ES6+, closures, event loop, promises, prototypes, and async programming',
    iconName: 'Code2',
    badge: 'Core',
    color: 'from-amber-500 to-yellow-600',
    totalQuestions: 65,
    totalSnippets: 28,
    topics: [
      {
        id: 'javascriptBasics',
        title: 'JavaScript Fundamentals',
        summary: 'Data types, execution context, hoisting, scope chain, and variable declarations',
        level: 'Beginner',
        subtopics: ['Primitive vs Non-primitive', 'var vs let vs const', 'Hoisting mechanics', 'Type coercion']
      },
      {
        id: 'advancedJavascript',
        title: 'Advanced JavaScript',
        summary: 'Prototypes, closures, the `this` keyword, call/apply/bind, and memory management',
        level: 'Advanced',
        subtopics: ['Prototypal Inheritance', 'Lexical Closures', 'Binding Context', 'Garbage Collection']
      },
      {
        id: 'asyncJs',
        title: 'Asynchronous JavaScript',
        summary: 'Event loop, microtasks vs macrotasks, Promises, async/await, and Web APIs',
        level: 'Intermediate',
        subtopics: ['Event Loop Architecture', 'Promise combinators', 'Async/Await error handling', 'Worker threads']
      },
      {
        id: 'javascriptinterviewQuestions',
        title: 'JavaScript Interview Q&A',
        summary: 'High-frequency frontend interview questions, conceptual breakdowns, and tricky interview problems',
        level: 'Intermediate',
        subtopics: ['Scope & Hoisting', 'ES6+ Features', 'Object & Array methods', 'Currying & Polyfills']
      },
      {
        id: 'jsCodeSnippets',
        title: 'Tricky Code Snippets',
        summary: 'Output prediction, timing gotchas, shallow copy traps, and type conversion puzzles',
        level: 'Advanced',
        subtopics: ['Event loop timing', 'Array prototype hacks', 'Object reference traps', 'Closure evaluation']
      },
      {
        id: 'jsTrickyConcepts',
        title: 'Tricky Edge Cases',
        summary: 'Deep dive into JavaScript idiosyncrasies, loose equality matrix, and floating-point quirks',
        level: 'Advanced',
        subtopics: ['Loose equality intricacies', 'Temporal Dead Zone', 'Floating point precision', 'Automatic semicolon insertion']
      },
      {
        id: 'jsProgrammingQA',
        title: 'JS Programming Challenges',
        summary: 'Algorithmic problem solving, data structure transformations, and utility polyfills',
        level: 'Intermediate',
        subtopics: ['Debounce & Throttle', 'Deep Clone implementation', 'Promise.all polyfill', 'Array flatten']
      }
    ]
  },
  {
    id: 'react',
    title: 'React & React Native',
    description: 'Component lifecycles, Hooks, Virtual DOM, state management, Fiber reconciler, and mobile architecture',
    iconName: 'Atom',
    badge: 'Popular',
    color: 'from-cyan-500 to-blue-600',
    totalQuestions: 72,
    totalSnippets: 35,
    topics: [
      {
        id: 'reactBasics',
        title: 'React Fundamentals',
        summary: 'JSX, component tree, props vs state, controlled components, and unidirectional data flow',
        level: 'Beginner',
        subtopics: ['Virtual DOM & Reconciliation', 'JSX compilation', 'Synthetic events', 'Key prop significance']
      },
      {
        id: 'reactHooks',
        title: 'React Hooks In-Depth',
        summary: 'useState, useEffect, useMemo, useCallback, useRef, and custom hooks architecture',
        level: 'Intermediate',
        subtopics: ['Hooks rules & closures', 'Dependency array nuances', 'Custom hooks encapsulation', 'useId & useTransition']
      },
      {
        id: 'advancedReact',
        title: 'Advanced React Architecture',
        summary: 'Fiber tree, Concurrent features, Suspense, Error boundaries, and Code splitting',
        level: 'Advanced',
        subtopics: ['React 18/19 Concurrent rendering', 'Server vs Client components', 'HOCs vs Render Props', 'Profiler API']
      },
      {
        id: 'reactRouter',
        title: 'React Router v6+',
        summary: 'Nested layouts, dynamic segments, loaders, actions, and client-side navigation',
        level: 'Intermediate',
        subtopics: ['createBrowserRouter', 'Outlet & nested routes', 'useNavigate & useParams', 'Route guards']
      },
      {
        id: 'reactContext',
        title: 'Context API & State Patterns',
        summary: 'createContext, useContext, Provider patterns, avoiding unnecessary re-renders, and compound components',
        level: 'Intermediate',
        subtopics: ['Context splitting', 'Custom provider hooks', 'Memoizing context value', 'Context vs Prop drilling']
      },
      {
        id: 'reactRedux',
        title: 'Redux Toolkit & Global State',
        summary: 'Store configuration, slices, createAsyncThunk, Immer immutability, and useSelector optimization',
        level: 'Advanced',
        subtopics: ['configureStore & Slices', 'Extra reducers for async flows', 'Normalized state', 'RTK Query basics']
      },
      {
        id: 'reactQuery',
        title: 'TanStack React Query',
        summary: 'Server state management, caching strategies, optimistic updates, and background refetching',
        level: 'Intermediate',
        subtopics: ['useQuery & useMutation', 'Query invalidation', 'Stale time vs Cache time', 'Pagination & infinite queries']
      },
      {
        id: 'apiCallInReact',
        title: 'API Calls & Data Fetching',
        summary: 'Axios integration, AbortController cleanup, handling race conditions, and loading/error states',
        level: 'Beginner',
        subtopics: ['Axios interceptors', 'Cancelling pending requests', 'Race condition mitigation', 'Custom useFetch hook']
      },
      {
        id: 'reactCodeSnippets',
        title: 'React Code Snippets & Patterns',
        summary: 'Practical UI patterns, infinite scroll, debounced input, safe async effects, and modal managers',
        level: 'Intermediate',
        subtopics: ['Debounced search hook', 'IntersectionObserver hook', 'Portal modals', 'Previous value hook']
      },
      {
        id: 'interviewQuestions',
        title: 'React Interview Questions',
        summary: 'Top 30+ React interview questions with in-depth answers, code snippets, and counter-arguments',
        level: 'Intermediate',
        subtopics: ['State batching', 'Class vs Function components', 'React Native bridge vs JSI', 'Performance profiling']
      },
      {
        id: 'reactRoadmap',
        title: 'Frontend Career Roadmap',
        summary: 'Step-by-step roadmap from junior developer to Staff React / React Native engineer',
        level: 'Beginner',
        subtopics: ['Core web fundamentals', 'State architecture', 'Testing & CI/CD', 'System design']
      },
      {
        id: 'trickySection',
        title: 'React Tricky Questions',
        summary: 'Subtle re-render pitfalls, stale state in closures, ref updates, and useEffect timing puzzles',
        level: 'Advanced',
        subtopics: ['Stale closure in setInterval', 'State setter with same value', 'Ref vs State re-render', 'LayoutEffect vs Effect']
      }
    ]
  },
  {
    id: 'html5',
    title: 'HTML5',
    description: 'Semantic markup, accessibility (ARIA), Web Storage, forms, web workers, and modern browser APIs',
    iconName: 'FileCode',
    badge: 'Web',
    color: 'from-red-500 to-orange-600',
    totalQuestions: 35,
    totalSnippets: 15,
    topics: [
      {
        id: 'htmlConcepts',
        title: 'HTML5 Core Concepts',
        summary: 'Document outline, landmark semantic tags, DOM tree construction, forms validation, and storage APIs',
        level: 'Beginner',
        subtopics: ['Semantic tag hierarchy', 'localStorage vs sessionStorage vs Cookies', 'Web Workers & Canvas', 'DOCTYPE & rendering modes']
      },
      {
        id: 'htmlInterviewQuestions',
        title: 'HTML5 Technical Interview Q&A',
        summary: 'Accessibility standards, ARIA landmark roles, SEO meta tags, lazy loading, and script loading attributes',
        level: 'Intermediate',
        subtopics: ['async vs defer scripts', 'ARIA accessibility standards', 'Responsive images with srcset', 'Shadow DOM vs Virtual DOM']
      }
    ]
  },
  {
    id: 'css3',
    title: 'CSS3 & Modern Styling',
    description: 'Flexbox, CSS Grid, Box Model, BFC, transitions, animations, responsive design, and Tailwind CSS',
    iconName: 'Palette',
    badge: 'Web',
    color: 'from-blue-500 to-indigo-600',
    totalQuestions: 42,
    totalSnippets: 22,
    topics: [
      {
        id: 'cSSConcepts',
        title: 'Modern CSS3 Concepts',
        summary: 'Flexbox axes, Grid layout, Box Model sizing, Block Formatting Context (BFC), and CSS variables',
        level: 'Intermediate',
        subtopics: ['Flexbox alignment & gap', 'CSS Grid minmax & auto-fit', 'Box-sizing border-box', 'BFC triggers & floats']
      },
      {
        id: 'cssInterviewQA',
        title: 'CSS3 Technical Interview Q&A',
        summary: 'Specificity calculation, stacking contexts, pseudo-classes, responsive design, and CSS animations',
        level: 'Intermediate',
        subtopics: ['Specificity weight calculation', 'Stacking context & z-index', 'Transitions vs Keyframe animations', 'Mobile-first media queries']
      }
    ]
  },
  {
    id: 'next',
    title: 'Next.js',
    description: 'Server Components, SSR, SSG, ISR, App Router, Route Handlers, and Edge runtime rendering',
    iconName: 'Server',
    badge: 'Modern',
    color: 'from-gray-800 to-slate-900',
    totalQuestions: 40,
    totalSnippets: 18,
    topics: [
      {
        id: 'nextFundamentals',
        title: 'Next.js 14+ Fundamentals',
        summary: 'Next.js architecture, file-based routing, App Router vs Pages Router, and server hydration',
        level: 'Beginner',
        subtopics: ['App Router architecture', 'Layout & template files', 'Static vs dynamic routes', 'Next Image & Font optimization']
      },
      {
        id: 'nextAppRouter',
        title: 'App Router & Routing Deep Dive',
        summary: 'Layouts, loading.tsx, error.tsx, parallel routes, intercepted routes, and route handlers',
        level: 'Intermediate',
        subtopics: ['Nested layouts & state preservation', 'Route handlers GET/POST', 'Parallel & intercepted routes', 'Dynamic segment matching']
      },
      {
        id: 'nextRendering',
        title: 'Server vs Client Components',
        summary: 'Zero-bundle server components, "use client" boundaries, Server Actions, and streaming with Suspense',
        level: 'Advanced',
        subtopics: ['"use client" boundary rule', 'Server actions with revalidatePath', 'Streaming SSR with Suspense', 'ISR with fetch revalidate']
      }
    ]
  },
  {
    id: 'aws',
    title: 'AWS Cloud',
    description: 'EC2, S3, Lambda, IAM, VPC, CloudFront, Route53, and enterprise cloud architecture',
    iconName: 'Cloud',
    badge: 'Cloud',
    color: 'from-orange-500 to-amber-600',
    totalQuestions: 60,
    totalSnippets: 20,
    topics: [
      {
        id: 'awsIAM',
        title: 'AWS IAM & Access Management',
        summary: 'Users, user groups, IAM roles, policies, STS temporary credentials, and least privilege security',
        level: 'Beginner',
        subtopics: ['IAM Users vs Roles', 'Policy JSON structure', 'MFA enforcement', 'Cross-account STS assume role']
      },
      {
        id: 'awEC2InterviewQA',
        title: 'Amazon EC2 & Auto Scaling',
        summary: 'Instance types, AMIs, Auto Scaling Groups (ASG), Elastic Block Store (EBS), and spot instances',
        level: 'Intermediate',
        subtopics: ['On-Demand vs Spot vs Reserved', 'ASG scaling policies', 'EBS volume types (gp3/io2)', 'EC2 User Data scripts']
      },
      {
        id: 'awS3InterviewQA',
        title: 'Amazon S3 & Storage Tiers',
        summary: 'S3 Standard, Infrequent Access, Glacier tiers, lifecycle policies, bucket policies, and versioning',
        level: 'Beginner',
        subtopics: ['S3 Storage Classes comparison', 'Lifecycle management rules', 'Cross-Region Replication', 'Presigned URLs']
      },
      {
        id: 'awsVPCInterviewQA',
        title: 'Amazon VPC & Networking',
        summary: 'Public vs private subnets, Internet Gateways, NAT Gateways, Route Tables, and CIDR blocks',
        level: 'Advanced',
        subtopics: ['VPC subnet design', 'NAT Gateway vs NAT Instance', 'Route table associations', 'VPC Peering vs Transit Gateway']
      },
      {
        id: 'awsRoute53InterviewQA',
        title: 'Amazon Route 53 & DNS',
        summary: 'DNS record types (A, CNAME, Alias), routing policies (Latency, Weighted, Failover, Geolocation)',
        level: 'Intermediate',
        subtopics: ['Alias record vs CNAME', 'Health checks & DNS Failover', 'Latency-based routing', 'Private hosted zones']
      },
      {
        id: 'awsIAMInterviewQA',
        title: 'AWS Security & IAM Deep Dive',
        summary: 'Security Groups vs NACLs, IAM policy evaluation logic, Service Control Policies (SCP), and KMS encryption',
        level: 'Advanced',
        subtopics: ['Stateful SGs vs Stateless NACLs', 'Explicit Deny evaluation', 'KMS envelope encryption', 'Secrets Manager vs SSM Parameter Store']
      },
      {
        id: 'awsScenarioQA',
        title: 'AWS Scenario-Based Solutions',
        summary: 'High availability architecture scenarios, disaster recovery (RTO/RPO), multi-region active-active setups',
        level: 'Advanced',
        subtopics: ['Multi-AZ web tier with ALB', 'Disaster recovery strategies', 'Decoupled architecture with SQS & Lambda', 'DDoS protection with Shield & WAF']
      },
      {
        id: 'awsInterviewQA',
        title: 'AWS General Solutions Architect Q&A',
        summary: 'Well-Architected Framework pillars, cost optimization, CloudWatch monitoring, and serverless best practices',
        level: 'Intermediate',
        subtopics: ['5 Pillars of Well-Architected Framework', 'CloudWatch metrics & alarms', 'Serverless architecture with Lambda & DynamoDB', 'CloudFront CDN edge caching']
      }
    ]
  },
  {
    id: 'docker',
    title: 'Docker & Containers',
    description: 'Containerization, Dockerfile optimization, multi-stage builds, networking, and Docker Compose',
    iconName: 'Box',
    badge: 'DevOps',
    color: 'from-sky-500 to-blue-700',
    totalQuestions: 38,
    totalSnippets: 16,
    topics: [
      {
        id: 'dockerBasics',
        title: 'Docker Essentials',
        summary: 'Images vs Containers, layer caching, volume mounts, Dockerfile instructions, and network bridges',
        level: 'Beginner',
        subtopics: ['Dockerfile best practices', 'Layer optimization', 'Bind mounts vs Volumes', 'Multi-stage builds']
      },
      {
        id: 'dockerInterviewQA',
        title: 'Docker Interview Q&A',
        summary: 'CMD vs ENTRYPOINT, Docker container isolation, dangling images, Docker Compose networking, and security scanning',
        level: 'Intermediate',
        subtopics: ['CMD vs ENTRYPOINT difference', 'Container networking modes', 'Non-root user in production', 'Docker Compose service orchestration']
      }
    ]
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes (K8s)',
    description: 'Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, HPA, and cluster orchestration',
    iconName: 'Cpu',
    badge: 'DevOps',
    color: 'from-indigo-600 to-blue-800',
    totalQuestions: 45,
    totalSnippets: 18,
    topics: [
      {
        id: 'k8sArch',
        title: 'K8s Architecture & Workloads',
        summary: 'Control plane components (API server, etcd, scheduler), worker nodes, Deployments, and DaemonSets',
        level: 'Advanced',
        subtopics: ['Kube-apiserver & etcd', 'ClusterIP vs NodePort vs LoadBalancer', 'Rolling updates & rollbacks', 'Readiness vs Liveness probes']
      },
      {
        id: 'kubernetesInterviewQA',
        title: 'Kubernetes Technical Interview Q&A',
        summary: 'Services, Ingress controllers, Persistent Volumes, Horizontal Pod Autoscaling (HPA), and troubleshooting CrashLoopBackOff',
        level: 'Advanced',
        subtopics: ['Debugging CrashLoopBackOff', 'PV, PVC & StorageClasses', 'HPA metric scaling', 'StatefulSets vs Deployments']
      }
    ]
  },
  {
    id: 'jenkins',
    title: 'Jenkins CI/CD',
    description: 'Automated build pipelines, Declarative Jenkinsfile, agents, credentials, and webhooks',
    iconName: 'Workflow',
    badge: 'CI/CD',
    color: 'from-stone-600 to-stone-800',
    totalQuestions: 32,
    totalSnippets: 12,
    topics: [
      {
        id: 'jenkinsPipelines',
        title: 'Jenkins Pipelines & Automation',
        summary: 'Stages, steps, post actions, pipeline as code, and master-agent distributed execution',
        level: 'Intermediate',
        subtopics: ['Declarative vs Scripted syntax', 'Shared libraries', 'Webhook triggers & security credentials', 'Parallel stages']
      },
      {
        id: 'jenkinsQA',
        title: 'Jenkins Interview Questions',
        summary: 'CI/CD best practices, blue-green deployments, pipeline troubleshooting, and artifact management',
        level: 'Intermediate',
        subtopics: ['Pipeline error handling', 'Jenkins credentials storage', 'Triggering downstream jobs', 'Docker integration with Jenkins']
      }
    ]
  },
  {
    id: 'terraform',
    title: 'Terraform (IaC)',
    description: 'Infrastructure as Code, HCL, remote state locking, modules, providers, and drift detection',
    iconName: 'Layers',
    badge: 'IaC',
    color: 'from-purple-600 to-indigo-700',
    totalQuestions: 34,
    totalSnippets: 14,
    topics: [
      {
        id: 'terraformBasics',
        title: 'Terraform State & Workflows',
        summary: 'Terraform init, plan, apply, destroy lifecycle, state file management, and S3 backend with DynamoDB locking',
        level: 'Intermediate',
        subtopics: ['terraform plan vs apply', 'State locking with DynamoDB', 'Modules & variable validation', 'Resource lifecycle rules']
      },
      {
        id: 'terraformInterviewQA',
        title: 'Terraform Interview Questions',
        summary: 'State drift management, terraform import, count vs for_each, provisioners, and secret management in IaC',
        level: 'Advanced',
        subtopics: ['Managing state drift with refresh', 'count vs for_each differences', 'Terraform taint and replace', 'Remote backends vs Local state']
      }
    ]
  },
  {
    id: 'ansible',
    title: 'Ansible',
    description: 'Agentless configuration management, Playbooks, Roles, inventory, Jinja2, and idempotency',
    iconName: 'Terminal',
    badge: 'Config',
    color: 'from-rose-600 to-red-700',
    totalQuestions: 28,
    totalSnippets: 10,
    topics: [
      {
        id: 'ansiblePlaybooks',
        title: 'Ansible Playbooks & Idempotency',
        summary: 'YAML syntax, handlers, variables, Jinja2 templating, and inventory group management',
        level: 'Intermediate',
        subtopics: ['Idempotency in tasks', 'Ansible Roles directory layout', 'Dynamic inventory', 'Handlers notification']
      },
      {
        id: 'ansibleInterviewQA',
        title: 'Ansible Technical Interview Q&A',
        summary: 'Ad-hoc commands vs Playbooks, Ansible Vault for encryption, forks for parallelism, and modules vs raw shell',
        level: 'Intermediate',
        subtopics: ['Ansible Vault secret encryption', 'Forks and performance tuning', 'Command vs Shell vs Raw modules', 'Agentless architecture over SSH']
      }
    ]
  }
];

export const QUESTIONS_ANSWERS: QuestionAnswer[] = [
  // JAVASCRIPT QUESTIONS
  {
    id: 'js-1',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    difficulty: 'Senior',
    question: 'How does the JavaScript Event Loop work with Microtasks and Macrotasks?',
    answer: 'The JavaScript runtime executes code synchronously in the Call Stack. When asynchronous tasks are initiated (such as fetch, setTimeout, or Promise resolution), they are delegated to Web APIs and their callbacks are queued into two distinct queues: the Microtask Queue and the Macrotask (Callback) Queue.',
    codeSnippet: `console.log('1'); // Synchronous

setTimeout(() => {
  console.log('2'); // Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask
});

console.log('4'); // Synchronous

// Output order: 1 -> 4 -> 3 -> 2
// Rule: Microtask queue drains completely before the next macrotask runs!`,
    tags: ['Event Loop', 'Microtasks', 'Promises', 'Async'],
    explanationPoints: [
      'Call Stack executes synchronous code to completion (Run-to-completion).',
      'Microtask Queue holds Promise callbacks (.then, .catch, .finally) and queueMicrotask().',
      'Macrotask Queue holds setTimeout, setInterval, setImmediate, and I/O callbacks.',
      'The Event Loop checks the Call Stack. When empty, it drains the ENTIRE Microtask queue before picking a single task from the Macrotask queue.'
    ],
    isBookmarked: true
  },
  {
    id: 'js-2',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    difficulty: 'Mid',
    question: 'What is a Closure and what are its practical use cases?',
    answer: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, closures give inner functions access to an outer function’s scope even after the outer function has returned.',
    codeSnippet: `function createCounter(initial = 0) {
  let count = initial; // Encapsulated private state
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.get());       // 11
// count variable cannot be accessed directly from the outside!`,
    tags: ['Closures', 'Scope', 'Encapsulation', 'Design Patterns'],
    explanationPoints: [
      'Encapsulating private variables (Data Privacy / Module Pattern).',
      'Function currying and partial application.',
      'Maintaining state in asynchronous callbacks and event handlers.',
      'Memory consideration: Variables retained by closures are not garbage collected until the closure itself is eligible for collection.'
    ]
  },
  {
    id: 'js-3',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    difficulty: 'Senior',
    question: 'Explain Prototypal Inheritance and how Object.create() differs from class inheritance.',
    answer: 'JavaScript uses prototype-based inheritance rather than classical class-based inheritance. Every object has an internal link [[Prototype]] (exposed via Object.getPrototypeOf or __proto__) pointing to another object. Property lookups traverse this prototype chain until found or reaching null.',
    codeSnippet: `const animal = {
  makeSound() {
    return this.sound || 'Silence';
  }
};

const dog = Object.create(animal);
dog.sound = 'Woof!';
console.log(dog.makeSound()); // 'Woof!' (found on dog)
console.log(Object.getPrototypeOf(dog) === animal); // true

// ES6 'class' is syntactic sugar over prototype chains`,
    tags: ['Prototypes', 'OOP', 'Object.create', 'Inheritance'],
    explanationPoints: [
      'Objects inherit directly from other objects without needing a class blueprint.',
      'ES6 classes are syntactic sugar over constructor functions and prototype objects.',
      'Object.create(proto) creates a new object with its prototype set strictly to proto.',
      'End of chain is always Object.prototype, whose prototype is null.'
    ]
  },
  {
    id: 'js-4',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    difficulty: 'Senior',
    question: 'What is the Temporal Dead Zone (TDZ) and how does Hoisting work for var, let, and const?',
    answer: 'During the compilation/creation phase, JavaScript hoists declarations to the top of their enclosing scope. Variables declared with var are hoisted and initialized with undefined. Variables declared with let and const are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ). Any read/write before their declaration line throws a ReferenceError.',
    codeSnippet: `console.log(a); // undefined (hoisted & initialized)
// console.log(b); // ReferenceError: Cannot access 'b' before initialization (in TDZ)

var a = 10;
let b = 20;

function checkTDZ() {
  // TDZ applies to inner scope even if outer variable exists:
  let x = 'outer';
  {
    // console.log(x); // ReferenceError! Block scope TDZ for inner x
    let x = 'inner';
  }
}`,
    tags: ['Hoisting', 'TDZ', 'Scope', 'let/const'],
    explanationPoints: [
      'var is function-scoped; let and const are block-scoped.',
      'let and const enter TDZ from the start of their enclosing block until execution evaluates the declaration.',
      'Function declarations (function foo(){}) are hoisted with both declaration AND full definition body.'
    ]
  },
  {
    id: 'js-5',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    difficulty: 'Mid',
    question: 'Explain the difference between == (loose equality) and === (strict equality), and describe type coercion.',
    answer: 'Strict equality (===) checks both value and type without converting types. Loose equality (==) uses the Abstract Equality Comparison Algorithm to perform implicit type coercion before comparing values.',
    codeSnippet: `console.log(0 == false);   // true (false coerced to 0)
console.log("" == 0);       // true ("" coerced to 0)
console.log(null == undefined); // true (special rule in spec)
console.log(null === undefined); // false (different types)

console.log([] == ![]);    // true
// Step 1: ![] becomes false
// Step 2: [] == false -> [] == 0
// Step 3: [].toString() is "" -> "" == 0 -> 0 == 0 -> true`,
    tags: ['Type Coercion', 'Equality', 'JavaScript Gotchas'],
    explanationPoints: [
      'Always prefer === to avoid unexpected implicit coercion bugs.',
      'NaN is the only value in JavaScript that is NOT equal to itself (NaN === NaN is false). Use Number.isNaN().',
      'Object.is(NaN, NaN) returns true, and Object.is(+0, -0) returns false.'
    ]
  },
  {
    id: 'js-6',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    difficulty: 'Senior',
    question: 'How does the "this" keyword bind in JavaScript across different contexts?',
    answer: '"this" is determined at call-time by 4 binding rules evaluated in order of precedence: 1) New binding (new Constructor()), 2) Explicit binding (call, apply, bind), 3) Implicit binding (obj.method()), and 4) Default binding (global window/global or undefined in strict mode). Arrow functions capture "this" lexically from their enclosing scope.',
    codeSnippet: `const user = {
  name: 'Alice',
  regularFunc: function() {
    return this.name;
  },
  arrowFunc: () => {
    return this.name; // Lexical this from outer module/window
  }
};

console.log(user.regularFunc()); // "Alice" (Implicit binding)
const detached = user.regularFunc;
console.log(detached()); // undefined or window.name (Default binding)

console.log(user.arrowFunc()); // undefined (Arrow functions do NOT have own this!)`,
    tags: ['this', 'Arrow Functions', 'Call/Apply/Bind', 'Context'],
    explanationPoints: [
      'Arrow functions cannot be bound with call/apply/bind and cannot be used as constructors with new.',
      'bind() returns a new permanently bound function; call() and apply() invoke the function immediately.',
      'In strict mode ("use strict"), default binding assigns undefined instead of the global object.'
    ]
  },

  // REACT & REACT NATIVE QUESTIONS
  {
    id: 'react-1',
    categoryId: 'react',
    categoryName: 'React & React Native',
    difficulty: 'Senior',
    question: 'How does React Reconciliation and the Virtual DOM Diffing Algorithm work?',
    answer: 'React maintains a lightweight in-memory representation of the UI called the Virtual DOM. When state or props change, React generates a new Virtual DOM tree and runs a heuristic O(n) diffing algorithm against the previous tree to compute minimal DOM mutations.',
    codeSnippet: `// Heuristic 1: Elements of different types produce completely different trees
// <div><Counter /></div> -> <span><Counter /></span>
// React destroys <div> and rebuilds from scratch, resetting Counter state!

// Heuristic 2: Keys in lists identify identity across renders
<ul>
  <li key="task-1">Task 1</li>
  <li key="task-2">Task 2</li>
</ul>
// Keys allow React to reorder/preserve elements rather than mutating every node.`,
    tags: ['Virtual DOM', 'Reconciliation', 'Diffing', 'Performance'],
    explanationPoints: [
      'Two elements of different types will produce completely different trees.',
      'Keys provide stable identity across renders for lists, preventing unwarranted re-mounts and state loss.',
      'React 16+ utilizes the Fiber architecture to allow incremental rendering and interruption of low-priority work.'
    ],
    isBookmarked: true
  },
  {
    id: 'react-2',
    categoryId: 'react',
    categoryName: 'React & React Native',
    difficulty: 'Mid',
    question: 'What are the differences between useMemo, useCallback, and React.memo?',
    answer: 'useMemo caches a computed value between renders. useCallback caches a function definition between renders. React.memo is a higher-order component that memoizes the rendered output of a component, skipping re-renders if props have not changed.',
    codeSnippet: `// 1. useMemo: cache expensive computation
const sortedList = useMemo(() => {
  return items.slice().sort((a, b) => a.score - b.score);
}, [items]);

// 2. useCallback: cache function reference
const handleClick = useCallback((id: string) => {
  setSelectedId(id);
}, []); // Stable reference passed to child

// 3. React.memo: skip child re-renders if props are shallowly identical
const ChildCard = React.memo(({ onItemClick }: { onItemClick: (id: string) => void }) => {
  return <button onClick={() => onItemClick('1')}>Select</button>;
});`,
    tags: ['Hooks', 'useMemo', 'useCallback', 'React.memo', 'Optimization'],
    explanationPoints: [
      'useMemo(() => fn(), deps) returns the computed result.',
      'useCallback(fn, deps) is shorthand for useMemo(() => fn, deps).',
      'Passing inline arrow functions to memoized children defeats React.memo unless stabilized with useCallback.',
      'Avoid premature optimization: memoization has memory and comparison overhead.'
    ]
  },
  {
    id: 'react-3',
    categoryId: 'react',
    categoryName: 'React & React Native',
    difficulty: 'Senior',
    question: 'How do React Native bridge and the New Architecture (TurboModules & Fabric) function?',
    answer: 'In the legacy React Native architecture, JavaScript and Native code communicated asynchronously across a JSON serialized bridge. The New Architecture replaces the bridge with JSI (JavaScript Interface), TurboModules (lazy-loaded native modules), and Fabric (concurrent native rendering engine).',
    codeSnippet: `// JSI (JavaScript Interface) enables direct C++ bindings:
// JS can hold direct references to host C++ objects without JSON serialization!

// Benefits of Fabric & TurboModules:
// 1. Synchronous layout & measure (no layout flickers in lists)
// 2. Direct memory access for high-frequency animations & gestures
// 3. React 18 Concurrent features (startTransition, Suspense) on mobile!`,
    tags: ['React Native', 'JSI', 'Fabric', 'TurboModules', 'Mobile'],
    explanationPoints: [
      'Legacy Bridge was asynchronous and had JSON serialization overhead.',
      'JSI enables JavaScript engine (Hermes/V8) to directly invoke C++ methods.',
      'Fabric brings React 18 concurrent rendering to native iOS and Android views.',
      'TurboModules load on demand rather than all at application boot time.'
    ]
  },
  {
    id: 'react-4',
    categoryId: 'react',
    categoryName: 'React & React Native',
    difficulty: 'Senior',
    question: 'How does React batch state updates and how did React 18 change batching behavior?',
    answer: 'Batching is when React groups multiple state updates into a single re-render for performance. In React 17 and earlier, React only batched updates inside React event handlers (like onClick). In React 18, Automatic Batching was introduced: state updates inside promises, setTimeout, native event listeners, or callbacks are all automatically batched.',
    codeSnippet: `// In React 18: Both updates trigger ONE single re-render!
function handleFetch() {
  fetch('/api/user').then(() => {
    setLoading(false);
    setUser(data);
    // React 17 would trigger 2 renders here!
    // React 18 batches these into 1 render automatically.
  });
}

// If you need synchronous render (rare):
import { flushSync } from 'react-dom';
flushSync(() => {
  setCount(c => c + 1); // Triggers DOM update immediately
});`,
    tags: ['React 18', 'Batching', 'State', 'Performance'],
    explanationPoints: [
      'Automatic batching reduces layout thrashing and unnecessary re-renders.',
      'flushSync can opt out of automatic batching when immediate DOM measurement is required.',
      'State setter functions can accept an updater callback: setCount(prev => prev + 1) ensures fresh state.'
    ]
  },
  {
    id: 'react-5',
    categoryId: 'react',
    categoryName: 'React & React Native',
    difficulty: 'Mid',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    answer: 'useEffect runs asynchronously AFTER the browser has painted the screen, preventing render-blocking. useLayoutEffect runs synchronously immediately after React mutates the DOM but BEFORE the browser paints. It is used to measure DOM layout or prevent visual flickering.',
    codeSnippet: `useLayoutEffect(() => {
  // Runs synchronously before paint:
  const rect = ref.current.getBoundingClientRect();
  setTooltipPosition(rect.top - 30);
  // User NEVER sees the tooltip flicker in wrong position!
}, []);

useEffect(() => {
  // Runs after paint: ideal for data fetching, subscriptions, logging
  fetchUserData();
}, []);`,
    tags: ['useEffect', 'useLayoutEffect', 'DOM', 'Rendering'],
    explanationPoints: [
      'useLayoutEffect blocks browser paint; overusing it causes visible stutter/lag.',
      'Use useEffect by default for 99% of side effects.',
      'In SSR / Next.js, useLayoutEffect emits a server warning; use useEffect or isomorphic wrappers.'
    ]
  },

  // HTML5 QUESTIONS
  {
    id: 'html-1',
    categoryId: 'html5',
    categoryName: 'HTML5',
    difficulty: 'Beginner',
    question: 'Why are semantic HTML tags crucial and how do they differ from non-semantic tags like <div>?',
    answer: 'Semantic HTML tags clearly describe their meaning to both the browser and the developer (e.g. <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>). Non-semantic tags like <div> and <span> tell nothing about their content. Semantic tags provide essential landmark roles for screen readers (accessibility) and improve search engine indexing (SEO).',
    codeSnippet: `<!-- Non-Semantic (Soup of divs): -->
<div class="header"><div class="menu">...</div></div>

<!-- Semantic HTML5: -->
<header>
  <nav aria-label="Primary Navigation">
    <ul>
      <li><a href="/topics">Curriculum</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Deep-Dive Title</h1>
    <section>...</section>
  </article>
</main>`,
    tags: ['HTML5', 'Semantics', 'Accessibility', 'SEO'],
    explanationPoints: [
      'Screen readers use landmarks (<main>, <nav>, <header>) to let vision-impaired users jump between page sections.',
      'Search engine crawlers weigh text inside <article> and <header> higher than generic <div> containers.',
      'Improves codebase maintainability and clean structure.'
    ]
  },
  {
    id: 'html-2',
    categoryId: 'html5',
    categoryName: 'HTML5',
    difficulty: 'Mid',
    question: 'Compare localStorage, sessionStorage, and Cookies in terms of capacity, lifecycle, and transmission.',
    answer: 'Cookies store up to 4KB of data, have configurable expiration (or session expiry), and are automatically sent to the server with every HTTP request. localStorage stores 5-10MB, persists indefinitely until explicitly cleared, and stays client-side. sessionStorage stores 5-10MB and is wiped when the browser tab closes.',
    codeSnippet: `/* Feature Comparison:
Feature          | Cookie         | localStorage   | sessionStorage
-----------------+----------------+----------------+----------------
Capacity         | ~4 KB          | ~5-10 MB       | ~5-10 MB
Sent with HTTP?  | YES (each req) | NO             | NO
Expiration       | Manually set   | Never expires  | Tab close
Access           | Window/Server  | Same Origin    | Same Tab/Origin
Security Flags   | HttpOnly, Secure| None (XSS risk)| None (XSS risk)
*/`,
    tags: ['Storage', 'Cookies', 'localStorage', 'sessionStorage', 'Security'],
    explanationPoints: [
      'Sensitive auth tokens should be stored in HttpOnly, Secure, SameSite cookies to mitigate XSS script theft.',
      'localStorage is synchronous and can block the main thread if reading/writing massive JSON blobs.',
      'IndexedDB should be used for structured offline data exceeding 10MB.'
    ]
  },
  {
    id: 'html-3',
    categoryId: 'html5',
    categoryName: 'HTML5',
    difficulty: 'Mid',
    question: 'What is the difference between <script>, <script async>, and <script defer>?',
    answer: 'Standard <script> pauses HTML parsing immediately while downloading and executing the script. <script async> downloads in parallel with HTML parsing and executes immediately once downloaded (pausing parsing during execution; execution order not guaranteed). <script defer> downloads in parallel with HTML parsing but waits to execute until HTML parsing is completely finished, preserving script document order.',
    codeSnippet: `<!-- Blocks parsing while downloading and executing: -->
<script src="analytics.js"></script>

<!-- Downloads in background; executes ASAP (order not guaranteed): -->
<script async src="ads.js"></script>

<!-- Downloads in background; executes AFTER HTML parsing in order: -->
<script defer src="app.js"></script>`,
    tags: ['HTML5', 'Performance', 'script tags', 'Critical Rendering Path'],
    explanationPoints: [
      'defer is ideal for scripts that depend on the complete DOM or depend on other scripts.',
      'async is ideal for independent third-party widgets, ads, and telemetry scripts.',
      'Both async and defer only apply to external scripts (with src attribute).'
    ]
  },

  // CSS3 QUESTIONS
  {
    id: 'css-1',
    categoryId: 'css3',
    categoryName: 'CSS3 & Modern Styling',
    difficulty: 'Mid',
    question: 'How is CSS Specificity calculated and how do you resolve specificity conflicts?',
    answer: 'CSS Specificity is calculated as a 4-part weight (Inline, ID, Class/Attribute/Pseudo-class, Element/Pseudo-element). When multiple rules target an element, the rule with higher specificity wins. If weights are equal, the last defined rule in the stylesheet takes precedence.',
    codeSnippet: `/* Specificity breakdown:
(Inline, IDs, Classes, Elements)
- Inline style: (1, 0, 0, 0)
- #header nav:   (0, 1, 0, 1)  -> 1 ID + 1 element
- .nav-link.active: (0, 0, 2, 0) -> 2 classes
- div p span:    (0, 0, 0, 3)  -> 3 elements

Rule: (0, 1, 0, 0) BEATS (0, 0, 99, 99)! An ID always wins over any number of classes.
*/

/* Modern solutions:
1. CSS @layer (Cascade Layers) allows defining precedence regardless of specificity:
@layer base, components, utilities;
2. :where() pseudo-class always has (0, 0, 0) specificity! */`,
    tags: ['CSS Specificity', 'Cascade', 'Cascade Layers', 'Styling'],
    explanationPoints: [
      '!important overrides normal specificity but makes maintenance difficult; avoid in application code.',
      ':is(.a, .b) takes the specificity of its most specific argument.',
      ':where(.a, .b) always has ZERO specificity, making it ideal for reusable CSS resets and component libraries.'
    ]
  },
  {
    id: 'css-2',
    categoryId: 'css3',
    categoryName: 'CSS3 & Modern Styling',
    difficulty: 'Mid',
    question: 'Compare CSS Flexbox and CSS Grid: when should you choose one over the other?',
    answer: 'Flexbox is designed for one-dimensional layouts (either in a row OR a column). It excels at content-first alignment, distributing extra space, and flex-wrapping items. CSS Grid is designed for two-dimensional layouts (rows AND columns simultaneously). It excels at layout-first designs where elements must align across both horizontal and vertical grid tracks.',
    codeSnippet: `/* Flexbox (1D - row alignment): */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* CSS Grid (2D - responsive dashboard cards without media queries): */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
    tags: ['Flexbox', 'CSS Grid', 'Layout', 'Responsive'],
    explanationPoints: [
      'Use Flexbox for UI components (buttons, navbars, tag pills, media objects).',
      'Use Grid for overall page scaffolding, bento layouts, and complex data tables.',
      'Grid supports subgrid, allowing nested children to participate in parent track sizing.'
    ]
  },

  // NEXT.JS QUESTIONS
  {
    id: 'next-1',
    categoryId: 'next',
    categoryName: 'Next.js',
    difficulty: 'Senior',
    question: 'How do React Server Components (RSC) differ from traditional SSR in Next.js App Router?',
    answer: 'In traditional SSR, components execute on the server to generate HTML, but the entire JavaScript bundle for those components is still sent to the client for hydration. With React Server Components (RSC), server components execute ONLY on the server and their code is never included in the client JavaScript bundle.',
    codeSnippet: `// app/users/page.tsx (Server Component by default)
import db from '@/lib/db';

export default async function UsersPage() {
  // Direct database query on the server - no API route needed!
  // Zero client JS bundle size for database libraries
  const users = await db.users.findMany();

  return (
    <div>
      <h1>Users Directory</h1>
      {users.map(u => <p key={u.id}>{u.name}</p>)}
    </div>
  );
}`,
    tags: ['Next.js', 'RSC', 'App Router', 'Performance', 'SSR'],
    explanationPoints: [
      'Server components do not ship their dependencies (e.g. markdown parsers, DB clients) to browser.',
      'Client components use "use client" at the top of the file.',
      'Streaming HTML + RSC wire format enables fast First Contentful Paint with selective hydration.'
    ]
  },
  {
    id: 'next-2',
    categoryId: 'next',
    categoryName: 'Next.js',
    difficulty: 'Senior',
    question: 'Explain Incremental Static Regeneration (ISR) and how revalidate works in Next.js.',
    answer: 'ISR enables you to update static pages in the background without needing to rebuild your entire application. When a request comes in after the revalidate window, Next.js serves the cached static page and simultaneously triggers a background regeneration to produce fresh static HTML for future visitors.',
    codeSnippet: `// Using App Router fetch caching & revalidation:
export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(\`https://api.example.com/products/\${params.id}\`, {
    next: { revalidate: 60 } // Revalidate this page at most once every 60 seconds
  });
  const product = await res.json();

  return <ProductView product={product} />;
}

// On-demand revalidation via Server Action:
import { revalidateTag, revalidatePath } from 'next/cache';
export async function updateProduct() {
  'use server';
  // ... update DB
  revalidatePath('/products/[id]');
}`,
    tags: ['Next.js', 'ISR', 'Caching', 'Static Generation'],
    explanationPoints: [
      'Stale-While-Revalidate caching model eliminates database bottlenecks during traffic spikes.',
      'On-demand revalidation (revalidatePath / revalidateTag) regenerates static pages immediately upon data mutation.',
      'Combines the speed of CDN static caching with the dynamism of server rendering.'
    ]
  },

  // AWS QUESTIONS
  {
    id: 'aws-1',
    categoryId: 'aws',
    categoryName: 'AWS Cloud',
    difficulty: 'Senior',
    question: 'Explain the difference between Security Groups and NACLs in AWS VPC.',
    answer: 'Both are virtual firewalls in an AWS VPC, but Security Groups operate at the instance/ENI level and are stateful, whereas Network Access Control Lists (NACLs) operate at the subnet boundary and are stateless.',
    codeSnippet: `/* Comparison Matrix:
Security Groups:
- Scope: Instance / Elastic Network Interface (ENI)
- Rule types: Allow rules ONLY (no explicit deny)
- Statefulness: STATEFUL (return traffic automatically permitted)
- Evaluation: All rules evaluated before decision

NACLs (Network ACLs):
- Scope: Subnet boundary
- Rule types: Both ALLOW and DENY rules
- Statefulness: STATELESS (inbound and outbound rules evaluated separately)
- Evaluation: Evaluated in numerical order (lowest number first)
*/`,
    tags: ['AWS', 'VPC', 'Security', 'Networking', 'NACL'],
    explanationPoints: [
      'Security Groups automatically allow response traffic regardless of inbound rules because they are stateful.',
      'NACLs require explicit ephemeral port rules for outbound return traffic because they are stateless.',
      'NACLs are ideal for blocking specific IP addresses or CIDR ranges using deny rules.'
    ],
    isBookmarked: true
  },
  {
    id: 'aws-2',
    categoryId: 'aws',
    categoryName: 'AWS Cloud',
    difficulty: 'Intermediate',
    question: 'What are the different Amazon S3 storage classes and how do Lifecycle Policies optimize cost?',
    answer: 'Amazon S3 provides multiple storage tiers tailored to data access patterns: S3 Standard (frequent access), S3 Intelligent-Tiering (automatic tiering based on usage), S3 Standard-IA (infrequent access), S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval, and S3 Glacier Deep Archive (lowest cost archive, 12-hour retrieval). Lifecycle policies automate transitioning objects between tiers over time.',
    codeSnippet: `# Terraform S3 Lifecycle Rule:
resource "aws_s3_bucket_lifecycle_configuration" "bucket_policy" {
  bucket = aws_s3_bucket.logs.id

  rule {
    id     = "archive_old_logs"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 365
    }
  }
}`,
    tags: ['AWS', 'S3', 'Storage', 'Cost Optimization'],
    explanationPoints: [
      'S3 Intelligent-Tiering has no retrieval fees and automatically shifts objects between frequent and infrequent tiers.',
      'Glacier Deep Archive provides cold storage at fractions of a cent per GB per month.',
      'S3 versioning allows restoring overwritten or deleted objects.'
    ]
  },
  {
    id: 'aws-3',
    categoryId: 'aws',
    categoryName: 'AWS Cloud',
    difficulty: 'Senior',
    question: 'What is the difference between IAM Roles and IAM Users, and why are Roles preferred in applications?',
    answer: 'An IAM User represents a persistent identity with long-term credentials (password, access key ID, secret access key). An IAM Role does not have long-term credentials; instead, entities assume the role to obtain short-lived, temporary security credentials via AWS Security Token Service (STS). Roles are preferred for EC2, ECS, and Lambda to prevent credential leaks.',
    codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      }
    }
  ]
}
// Attach this role to an EC2 instance profile:
// EC2 SDK automatically fetches temporary STS tokens without hardcoded secrets!`,
    tags: ['AWS', 'IAM', 'Security', 'STS'],
    explanationPoints: [
      'Never store AWS access keys inside container images or Git repositories.',
      'IAM Instance Profiles automatically rotate STS credentials every few hours.',
      'Roles enable cross-account access without sharing root or master account credentials.'
    ]
  },

  // DOCKER QUESTIONS
  {
    id: 'docker-1',
    categoryId: 'docker',
    categoryName: 'Docker & Containers',
    difficulty: 'Mid',
    question: 'What is a multi-stage Docker build and why is it essential in production?',
    answer: 'Multi-stage builds allow you to use multiple FROM statements in your Dockerfile. Each FROM instruction can use a different base image and you can selectively copy artifacts from one stage to another, leaving behind compilers, source code, and build tools to keep the final image minimal and secure.',
    codeSnippet: `# Stage 1: Build & compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
    tags: ['Docker', 'Multi-stage', 'Optimization', 'Security'],
    explanationPoints: [
      'Dramatically decreases final container image size (e.g. 1GB -> 80MB).',
      'Reduces attack surface by omitting build tools, git, compilers, and dev dependencies.',
      'Enables caching of compilation layers separately from runtime layers.'
    ]
  },
  {
    id: 'docker-2',
    categoryId: 'docker',
    categoryName: 'Docker & Containers',
    difficulty: 'Mid',
    question: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile?',
    answer: 'ENTRYPOINT specifies the command that will always be executed when the container starts. CMD specifies default arguments or a default command that can be easily overridden by arguments passed to docker run.',
    codeSnippet: `# Pattern: Combine ENTRYPOINT and CMD for flexible CLI containers
ENTRYPOINT ["node"]
CMD ["server.js"]

# If run as:
# docker run my-app -> runs: node server.js
# docker run my-app test.js -> runs: node test.js (overrides CMD)

# To override ENTRYPOINT, you must explicitly use --entrypoint:
# docker run --entrypoint sh my-app`,
    tags: ['Docker', 'Dockerfile', 'CMD', 'ENTRYPOINT'],
    explanationPoints: [
      'Exec form (["executable", "param1"]) is preferred over shell form ("executable param1") because shell form does not forward POSIX signals (SIGTERM).',
      'CMD is best for providing default parameters that users might customize at runtime.'
    ]
  },

  // KUBERNETES QUESTIONS
  {
    id: 'k8s-1',
    categoryId: 'kubernetes',
    categoryName: 'Kubernetes (K8s)',
    difficulty: 'Senior',
    question: 'Explain the Kubernetes Service types: ClusterIP, NodePort, LoadBalancer, and Ingress.',
    answer: 'Kubernetes Services provide stable networking and load balancing across dynamic pods. ClusterIP exposes pods internally within the cluster. NodePort exposes the service on a static port on each node’s IP. LoadBalancer provisions an external cloud load balancer. Ingress routes HTTP/HTTPS traffic to services based on hostnames or paths.',
    codeSnippet: `# Ingress manifest routing by path/host:
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80`,
    tags: ['Kubernetes', 'Networking', 'Ingress', 'Services'],
    explanationPoints: [
      'ClusterIP is the default and only accessible inside the cluster.',
      'NodePort opens a port in range 30000-32767 on all nodes.',
      'LoadBalancer creates a cloud provider load balancer (e.g. AWS NLB/ALB).',
      'Ingress operates at Layer 7 (HTTP) and provides TLS termination, path routing, and virtual hosting without needing a separate LoadBalancer per service.'
    ]
  },
  {
    id: 'k8s-2',
    categoryId: 'kubernetes',
    categoryName: 'Kubernetes (K8s)',
    difficulty: 'Senior',
    question: 'What causes a CrashLoopBackOff status in Kubernetes and how do you diagnose it?',
    answer: 'CrashLoopBackOff means that a pod container repeatedly starts, fails, and crashes, causing Kubernetes to back off with an increasing delay between restarts. Root causes include application runtime exceptions, missing environment variables/secrets, failed liveness probes, port conflicts, or out-of-memory (OOMKilled) errors.',
    codeSnippet: `# Diagnostic command sequence:
# 1. Inspect pod events and exit codes:
kubectl describe pod <pod-name>

# 2. View application crash stack trace:
kubectl logs <pod-name> --previous

# 3. Check for OOMKilled status in terminated section:
# Reason: OOMKilled (Exit Code 137 -> exceeded memory limit)`,
    tags: ['Kubernetes', 'Troubleshooting', 'Pods', 'DevOps'],
    explanationPoints: [
      'Exit Code 137 indicates the OS killed the process because memory exceeded container limits.',
      'Exit Code 1 typically indicates an uncaught JavaScript/Python/Go exception.',
      'kubectl logs --previous retrieves stdout/stderr from the crashed instance before restart.'
    ]
  },

  // JENKINS QUESTIONS
  {
    id: 'jenkins-1',
    categoryId: 'jenkins',
    categoryName: 'Jenkins CI/CD',
    difficulty: 'Intermediate',
    question: 'What is the difference between Declarative and Scripted Pipelines in Jenkins?',
    answer: 'Declarative Pipeline uses a strict, structured syntax enclosed in a pipeline {} block. It offers built-in syntax validation, post-build actions, and integrates cleanly with the Blue Ocean UI. Scripted Pipeline uses a Groovy-based syntax enclosed in a node {} block, providing full programmatic flexibility with loops and custom logic at the cost of higher complexity.',
    codeSnippet: `// Declarative Pipeline (Standard & Recommended):
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
  post {
    failure {
      mail to: 'devs@example.com', subject: 'Pipeline Failed'
    }
  }
}`,
    tags: ['Jenkins', 'CI/CD', 'Pipelines', 'DevOps'],
    explanationPoints: [
      'Declarative pipelines are easier to read and maintain for 95% of software teams.',
      'The post section guarantees execution of cleanup/notification steps regardless of stage outcomes.',
      'Jenkins Shared Libraries allow sharing common Groovy functions across multiple repositories.'
    ]
  },

  // TERRAFORM QUESTIONS
  {
    id: 'terraform-1',
    categoryId: 'terraform',
    categoryName: 'Terraform (IaC)',
    difficulty: 'Senior',
    question: 'How does Terraform State work, and why must teams use Remote State with State Locking in production?',
    answer: 'Terraform State (terraform.tfstate) is a JSON database mapping your declarative HCL configuration to real-world infrastructure resources created in the cloud. Teams must use Remote State (e.g. AWS S3 bucket) paired with State Locking (e.g. DynamoDB table) to ensure that two developers or CI/CD pipelines cannot run terraform apply concurrently and corrupt the state file.',
    codeSnippet: `# Production Remote S3 Backend with DynamoDB Locking:
terraform {
  backend "s3" {
    bucket         = "company-terraform-state-prod"
    key            = "vpc/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}`,
    tags: ['Terraform', 'IaC', 'State Locking', 'S3'],
    explanationPoints: [
      'State contains sensitive outputs (passwords, private keys); encrypting at rest is mandatory.',
      'DynamoDB acquires an exclusive LockID before terraform apply begins and releases it upon completion.',
      'terraform state commands allow inspecting and refactoring resources without destroying them.'
    ]
  },

  // ANSIBLE QUESTIONS
  {
    id: 'ansible-1',
    categoryId: 'ansible',
    categoryName: 'Ansible',
    difficulty: 'Intermediate',
    question: 'What is Idempotency in Ansible and how does Ansible achieve it without agents?',
    answer: 'Idempotency is the property where an operation can be applied multiple times without changing the result beyond the initial execution. Ansible is agentless; it connects to target servers via standard SSH, executes Python scripts that check the current state of a resource, and only makes modifications if the current state differs from the desired state.',
    codeSnippet: `# Idempotent Ansible Playbook task:
- name: Ensure Nginx is installed and running
  hosts: webservers
  become: yes
  tasks:
    - name: Install Nginx package
      apt:
        name: nginx
        state: present  # Does nothing if already installed!

    - name: Ensure Nginx service is started
      systemd:
        name: nginx
        state: started
        enabled: yes`,
    tags: ['Ansible', 'Idempotency', 'Automation', 'DevOps'],
    explanationPoints: [
      'Running an Ansible playbook 10 times produces the same system state as running it once.',
      'Tasks report "ok" when no changes are needed, and "changed" when an update occurred.',
      'Ansible Vault encrypts sensitive variables and passwords within playbooks.'
    ]
  }
];

export const PROGRAMMING_QUESTIONS: ProgrammingQuestion[] = [
  {
    id: 'p-1',
    title: 'Implement Custom Debounce Function',
    difficulty: 'Medium',
    category: 'JavaScript',
    description: 'Implement a debounce function that delays invoking a callback until after wait milliseconds have elapsed since the last time the debounced function was invoked.',
    starterCode: `function debounce(func, wait) {
  // Your implementation here
}`,
    solutionCode: `function debounce(func, wait) {
  let timeoutId = null;

  return function(...args) {
    const context = this;
    
    // Clear the previous pending execution
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    // Schedule a new execution
    timeoutId = setTimeout(() => {
      func.apply(context, args);
      timeoutId = null;
    }, wait);
  };
}`,
    testCases: [
      { input: 'Calls in rapid succession at 0ms, 50ms, 100ms with wait=200ms', expected: 'Executes once at 300ms' },
      { input: 'Passes correct arguments and maintains `this` context', expected: 'Function called with latest arguments' }
    ],
    explanation: 'Debouncing ensures that a function is not triggered repeatedly within a rapid succession of events (e.g. search auto-complete, window resizing). Every call cancels the previous timer and starts a fresh timeout.',
    timeComplexity: 'O(1) per invocation',
    spaceComplexity: 'O(1) closure retention',
    isBookmarked: true
  },
  {
    id: 'p-2',
    title: 'Deep Clone an Object with Circular Reference Handling',
    difficulty: 'Hard',
    category: 'JavaScript',
    description: 'Write a function deepClone(value) that creates a deep copy of any JavaScript object or array, including handling nested objects, arrays, Date, RegExp, and circular references.',
    starterCode: `function deepClone(target, map = new WeakMap()) {
  // Your implementation here
}`,
    solutionCode: `function deepClone(target, map = new WeakMap()) {
  // 1. Primitive values and functions
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 2. Handle Date and RegExp
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);

  // 3. Handle circular references
  if (map.has(target)) {
    return map.get(target);
  }

  // 4. Create clone container
  const clone = Array.isArray(target) ? [] : {};
  map.set(target, clone);

  // 5. Recursively copy own properties
  for (const key of Object.keys(target)) {
    clone[key] = deepClone(target[key], map);
  }

  return clone;
}`,
    testCases: [
      { input: 'deepClone({ a: 1, b: { c: 2 } })', expected: '{ a: 1, b: { c: 2 } } (independent memory reference)' },
      { input: 'obj.self = obj (Circular reference)', expected: 'Successfully cloned without stack overflow' }
    ],
    explanation: 'A WeakMap keeps track of previously visited objects. If an object has already been cloned in the current branch, we retrieve its clone directly, breaking infinite recursion.',
    timeComplexity: 'O(N) where N is total number of nodes/properties',
    spaceComplexity: 'O(N) for recursion call stack and cloned object tree'
  },
  {
    id: 'p-3',
    title: 'Implement Promise.all Polyfill',
    difficulty: 'Medium',
    category: 'JavaScript',
    description: 'Create a custom implementation of Promise.all(iterable). It should resolve when all promises in the array resolve, preserving index order, or reject immediately if any promise rejects.',
    starterCode: `function promiseAll(promises) {
  // Return a promise that resolves with an array of values
}`,
    solutionCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }

    const results = [];
    let completedCount = 0;
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((item, index) => {
      // Wrap in Promise.resolve in case an item is a non-promise value
      Promise.resolve(item)
        .then((value) => {
          results[index] = value; // Keep original index order!
          completedCount++;

          if (completedCount === total) {
            resolve(results);
          }
        })
        .catch((error) => {
          // Reject fast on the very first error
          reject(error);
        });
    });
  });
}`,
    testCases: [
      { input: 'promiseAll([Promise.resolve(1), 2, Promise.resolve(3)])', expected: '[1, 2, 3]' },
      { input: 'promiseAll([Promise.resolve(1), Promise.reject("err")])', expected: 'Rejects with "err"' }
    ],
    explanation: 'Keys: 1) Save result into results[index] to maintain position regardless of completion order. 2) Track completed count explicitly instead of results.length. 3) Handle empty array synchronously.',
    timeComplexity: 'O(N) where N is promise count',
    spaceComplexity: 'O(N) to store results array'
  },
  {
    id: 'p-4',
    title: 'Implement Custom Throttle Function',
    difficulty: 'Medium',
    category: 'JavaScript',
    description: 'Implement a throttle function that guarantees a callback is invoked at most once per specified time interval, maintaining arguments and context.',
    starterCode: `function throttle(func, limit) {
  // Your code here
}`,
    solutionCode: `function throttle(func, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastContext = null;

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}`,
    testCases: [
      { input: 'Scroll event firing 60 times/sec with limit=200ms', expected: 'Invoked at most once every 200ms' }
    ],
    explanation: 'Throttling enforces a maximum frequency of execution, making it essential for scroll handlers, resize observers, and mouse movements.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'p-5',
    title: 'Flatten an Array of Arbitrary Depth',
    difficulty: 'Easy',
    category: 'JavaScript',
    description: 'Implement a function flatten(arr, depth = 1) that flattens a nested array up to the specified depth.',
    starterCode: `function flatten(arr, depth = 1) {
  // Your code here
}`,
    solutionCode: `function flatten(arr, depth = 1) {
  if (depth <= 0) return arr.slice();

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}`,
    testCases: [
      { input: 'flatten([1, [2, [3, [4]]]], 2)', expected: '[1, 2, 3, [4]]' },
      { input: 'flatten([1, 2, 3], 1)', expected: '[1, 2, 3]' }
    ],
    explanation: 'Uses Array.prototype.reduce with recursive calls while decrementing the depth parameter. Once depth reaches 0, the item is returned as-is.',
    timeComplexity: 'O(N) total elements',
    spaceComplexity: 'O(D) call stack depth'
  }
];

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-1',
    title: 'React Native useAsync Custom Hook',
    category: 'React Native',
    language: 'typescript',
    description: 'Safely execute async operations in React Native with loading, error, and data states, preventing unmounted state updates.',
    code: `import { useState, useEffect, useCallback } from 'react';

export function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (err: any) {
      setError(err);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === 'pending' };
}`,
    tags: ['React Native', 'Custom Hook', 'TypeScript', 'Async']
  },
  {
    id: 'snip-2',
    title: 'React Native Safe Area & Status Bar Setup',
    category: 'React Native',
    language: 'typescript',
    description: 'Cross-platform configuration for iPhone Dynamic Island and Android system bars.',
    code: `import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#0f172a"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
});`,
    tags: ['React Native', 'SafeArea', 'iOS', 'Android', 'Layout']
  },
  {
    id: 'snip-3',
    title: 'Firebase Firestore Data Service for Mobile',
    category: 'Firebase',
    language: 'typescript',
    description: 'Type-safe Firestore service with real-time onSnapshot synchronization and offline cache for React Native.',
    code: `import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

export interface UserProgress {
  userId: string;
  completedQuestions: string[];
  bookmarkedIds: string[];
  updatedAt: string;
}

export const syncProgress = async (progress: UserProgress) => {
  const ref = doc(db, 'user_progress', progress.userId);
  await setDoc(ref, {
    ...progress,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const subscribeToProgress = (userId: string, callback: (data: UserProgress) => void) => {
  const ref = doc(db, 'user_progress', userId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserProgress);
    }
  });
};`,
    tags: ['Firebase', 'Firestore', 'Realtime', 'Database']
  }
];
