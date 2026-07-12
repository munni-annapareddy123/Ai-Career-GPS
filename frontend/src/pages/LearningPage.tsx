import React, { useEffect, useState } from 'react';
import { BookOpen, Play, ExternalLink, GraduationCap, Clock, ChevronDown, ChevronUp, CheckCircle, X, FileText, Video, Award, User, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { getProfile } from '../services/user';
import { getSkillGaps } from '../services/skillGap';
import { getLatestResume } from '../services/resume';
import { Profile, SkillGap } from '../types';
import { cn } from '../lib/utils';

const languages = [
  { code: 'en', label: 'English', suffix: '' },
  { code: 'te', label: 'Telugu', suffix: '+in+telugu' },
  { code: 'hi', label: 'Hindi', suffix: '+in+hindi' },
];

const courseYoutubeUrls: Record<string, string> = {
  dsa: 'data structures and algorithms full course free',
  'system-design': 'system design interview full course free',
  'python-data-science': 'python for data science full course free',
  'react-complete': 'react js full course free',
  'aws-solutions-architect': 'aws solutions architect full course free',
  'ml-specialization': 'machine learning full course free',
  'typescript-mastery': 'typescript full course free',
  'node-backend': 'node js express full course free',
  'docker-kubernetes': 'docker kubernetes full course free',
  'sql-databases': 'sql database full course free',
  'mongodb-nosql': 'mongodb full course free',
  'git-version-control': 'git github full course free',
  'nextjs-fullstack': 'next js full course free',
  'go-programming': 'golang full course free',
  'react-native-mobile': 'react native full course free',
  'python-automation': 'python automation full course free',
  'css-tailwind': 'css tailwind full course free',
  'devops-pipeline': 'devops ci cd full course free',
  'graphql-apis': 'graphql full course free',
  'java-spring': 'java spring boot full course free',
  'data-engineering': 'data engineering full course free',
  'cybersecurity-essentials': 'cybersecurity full course free',
  'flutter-mobile': 'flutter full course free',
  'blockchain-dev': 'blockchain development full course free',
  'agile-scrum': 'agile scrum full course free',
  'ai-prompt-engineering': 'prompt engineering full course free',
  'rust-programming': 'rust programming full course free',
};

const courseWebsiteUrls: Record<string, string> = {
  dsa: 'https://www.geeksforgeeks.org/data-structures/',
  'system-design': 'https://github.com/donnemartin/system-design-primer',
  'python-data-science': 'https://www.w3schools.com/python/python_ml_getting_started.asp',
  'react-complete': 'https://react.dev/learn',
  'aws-solutions-architect': 'https://aws.amazon.com/free/',
  'ml-specialization': 'https://developers.google.com/machine-learning/crash-course',
  'typescript-mastery': 'https://www.typescriptlang.org/docs/',
  'node-backend': 'https://nodejs.org/en/learn/',
  'docker-kubernetes': 'https://docs.docker.com/get-started/',
  'sql-databases': 'https://www.w3schools.com/sql/',
  'mongodb-nosql': 'https://www.mongodb.com/docs/manual/tutorial/getting-started/',
  'git-version-control': 'https://git-scm.com/doc',
  'nextjs-fullstack': 'https://nextjs.org/docs',
  'go-programming': 'https://go.dev/doc/tutorial/getting-started',
  'react-native-mobile': 'https://reactnative.dev/docs/getting-started',
  'python-automation': 'https://automatetheboringstuff.com/',
  'css-tailwind': 'https://tailwindcss.com/docs',
  'devops-pipeline': 'https://www.freecodecamp.org/news/tag/devops/',
  'graphql-apis': 'https://graphql.org/learn/',
  'java-spring': 'https://spring.io/guides',
  'data-engineering': 'https://www.freecodecamp.org/news/tag/data-engineering/',
  'cybersecurity-essentials': 'https://www.freecodecamp.org/news/tag/cybersecurity/',
  'flutter-mobile': 'https://flutter.dev/learn',
  'blockchain-dev': 'https://ethereum.org/en/developers/tutorials/',
  'agile-scrum': 'https://www.atlassian.com/agile',
  'ai-prompt-engineering': 'https://platform.openai.com/docs/guides/prompt-engineering',
  'rust-programming': 'https://doc.rust-lang.org/book/',
};

const courses = [
  { id: 'dsa', title: 'Data Structures & Algorithms', platform: 'Coursera', type: 'Course', skill: 'DSA', level: 'Intermediate', duration: '16 weeks', lessons: 64, description: 'Master data structures and algorithms for technical interviews. Covers arrays, linked lists, trees, graphs, dynamic programming, and more.', youtubeUrl: courseYoutubeUrls['dsa'], curriculum: [
    { title: 'Arrays & Strings', done: false, topics: ['Array manipulation', 'Two pointers', 'Sliding window', 'String algorithms'] },
    { title: 'Linked Lists', done: false, topics: ['Singly & doubly linked lists', 'Fast & slow pointers', 'Merge & reverse'] },
    { title: 'Stacks & Queues', done: false, topics: ['Stack operations', 'Queue variants', 'Monotonic stacks'] },
    { title: 'Trees & Graphs', done: false, topics: ['Binary trees', 'BST', 'Graph traversal (BFS/DFS)', 'Topological sort'] },
    { title: 'Dynamic Programming', done: false, topics: ['Memoization', 'Tabulation', 'Knapsack', 'LCS', 'LIS'] },
    { title: 'Sorting & Searching', done: false, topics: ['Quick sort', 'Merge sort', 'Binary search', 'Heap'] },
  ]},
  { id: 'system-design', title: 'System Design Interview', platform: 'YouTube', type: 'Video Series', skill: 'System Design', level: 'Advanced', duration: '8 weeks', lessons: 24, description: 'Learn how to design large-scale systems. Covers architecture patterns, load balancing, caching, databases, and real-world case studies.', youtubeUrl: courseYoutubeUrls['system-design'], curriculum: [
    { title: 'Foundations', done: false, topics: ['Client-server model', 'Network protocols', 'CAP theorem', 'Load balancing'] },
    { title: 'Databases', done: false, topics: ['SQL vs NoSQL', 'Sharding', 'Replication', 'Indexing strategies'] },
    { title: 'Caching & CDN', done: false, topics: ['Redis', 'CDN fundamentals', 'Cache invalidation'] },
    { title: 'Microservices', done: false, topics: ['Service decomposition', 'API gateways', 'Message queues', 'Event-driven'] },
    { title: 'Real-World Designs', done: false, topics: ['Design YouTube', 'Design Twitter', 'Design Uber', 'Design WhatsApp'] },
  ]},
  { id: 'python-data-science', title: 'Python for Data Science', platform: 'Udemy', type: 'Course', skill: 'Python', level: 'Beginner', duration: '12 weeks', lessons: 48, description: 'Learn Python programming for data analysis, visualization, and machine learning. Hands-on projects with real datasets.', youtubeUrl: courseYoutubeUrls['python-data-science'], curriculum: [
    { title: 'Python Basics', done: false, topics: ['Variables & data types', 'Control flow', 'Functions', 'File I/O'] },
    { title: 'NumPy & Pandas', done: false, topics: ['Arrays & matrices', 'DataFrames', 'Data cleaning', 'Grouping & aggregation'] },
    { title: 'Data Visualization', done: false, topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Interactive dashboards'] },
    { title: 'Machine Learning Intro', done: false, topics: ['Scikit-learn', 'Regression', 'Classification', 'Clustering'] },
  ]},
  { id: 'react-complete', title: 'React - The Complete Guide', platform: 'Udemy', type: 'Course', skill: 'React', level: 'Beginner-Advanced', duration: '20 weeks', lessons: 80, description: 'Comprehensive React course covering hooks, state management, routing, performance optimization, and full-stack development.', youtubeUrl: courseYoutubeUrls['react-complete'], curriculum: [
    { title: 'React Fundamentals', done: false, topics: ['JSX', 'Components', 'Props', 'State & lifecycle'] },
    { title: 'Hooks Deep Dive', done: false, topics: ['useState', 'useEffect', 'useContext', 'useReducer', 'Custom hooks'] },
    { title: 'State Management', done: false, topics: ['Context API', 'Redux/Zustand', 'React Query'] },
    { title: 'Routing & Navigation', done: false, topics: ['React Router', 'Dynamic routes', 'Lazy loading'] },
    { title: 'Performance', done: false, topics: ['Memoization', 'Code splitting', 'Virtualization'] },
    { title: 'Full-Stack Project', done: false, topics: ['API integration', 'Auth', 'Deployment'] },
  ]},
  { id: 'aws-solutions-architect', title: 'AWS Certified Solutions Architect', platform: 'AWS Training', type: 'Certification', skill: 'AWS', level: 'Intermediate', duration: '10 weeks', lessons: 40, description: 'Prepare for the AWS Solutions Architect certification. Covers compute, storage, networking, security, and architectural best practices.', youtubeUrl: courseYoutubeUrls['aws-solutions-architect'], curriculum: [
    { title: 'AWS Fundamentals', done: false, topics: ['Global infrastructure', 'IAM', 'AWS CLI', 'Billing & pricing'] },
    { title: 'Compute Services', done: false, topics: ['EC2', 'Lambda', 'ECS/EKS', 'Elastic Beanstalk'] },
    { title: 'Storage & Databases', done: false, topics: ['S3', 'RDS', 'DynamoDB', 'ElastiCache'] },
    { title: 'Networking', done: false, topics: ['VPC', 'Route 53', 'CloudFront', 'ELB'] },
    { title: 'Security & Compliance', done: false, topics: ['KMS', 'WAF', 'Shield', 'Security groups'] },
  ]},
  { id: 'ml-specialization', title: 'Machine Learning Specialization', platform: 'Coursera (Stanford)', type: 'Course', skill: 'Machine Learning', level: 'Intermediate', duration: '24 weeks', lessons: 96, description: 'Stanford\'s ML course taught by Andrew Ng. Covers supervised learning, neural networks, advice for ML applications, and decision trees.', youtubeUrl: courseYoutubeUrls['ml-specialization'], curriculum: [
    { title: 'Linear Regression', done: false, topics: ['Gradient descent', 'Multiple features', 'Feature scaling', 'Polynomial regression'] },
    { title: 'Logistic Regression', done: false, topics: ['Classification', 'Decision boundary', 'Regularization'] },
    { title: 'Neural Networks', done: false, topics: ['Perceptron', 'Activation functions', 'Backpropagation', 'TensorFlow'] },
    { title: 'Advice for ML', done: false, topics: ['Bias/variance', 'Learning curves', 'Error analysis', 'Precision/recall'] },
    { title: 'Decision Trees', done: false, topics: ['Entropy', 'Information gain', 'Random forests', 'XGBoost'] },
    { title: 'Unsupervised Learning', done: false, topics: ['K-means', 'PCA', 'Anomaly detection'] },
  ]},
  { id: 'typescript-mastery', title: 'TypeScript Mastery', platform: 'Frontend Masters', type: 'Course', skill: 'TypeScript', level: 'Intermediate', duration: '10 weeks', lessons: 45, description: 'Deep dive into TypeScript types, generics, decorators, and advanced patterns used in production applications.', youtubeUrl: courseYoutubeUrls['typescript-mastery'], curriculum: [
    { title: 'TypeScript Basics', done: false, topics: ['Types & interfaces', 'Enums', 'Type inference', 'Union & intersection'] },
    { title: 'Generics & Advanced Types', done: false, topics: ['Generic constraints', 'Conditional types', 'Mapped types', 'Template literals'] },
    { title: 'Decorators & Metadata', done: false, topics: ['Class decorators', 'Property decorators', 'Method decorators', 'Reflect metadata'] },
    { title: 'TypeScript with React', done: false, topics: ['Typing components', 'Event handlers', 'Context & hooks', 'Prop drilling'] },
    { title: 'Production Patterns', done: false, topics: ['Module augmentation', 'Declaration files', 'Type testing', 'Migration strategies'] },
  ]},
  { id: 'node-backend', title: 'Node.js & Express Backend', platform: 'Udemy', type: 'Course', skill: 'Node.js', level: 'Intermediate', duration: '14 weeks', lessons: 60, description: 'Build scalable REST APIs and backend services with Node.js, Express, authentication, databases, and deployment.', youtubeUrl: courseYoutubeUrls['node-backend'], curriculum: [
    { title: 'Node.js Fundamentals', done: false, topics: ['Event loop', 'Streams & buffers', 'File system', 'Modules & NPM'] },
    { title: 'Express Framework', done: false, topics: ['Routing', 'Middleware', 'Error handling', 'Request validation'] },
    { title: 'Authentication & Security', done: false, topics: ['JWT', 'OAuth2', 'BCrypt', 'Helmet & CORS'] },
    { title: 'Databases & ORM', done: false, topics: ['Prisma/TypeORM', 'MongoDB/Mongoose', 'PostgreSQL', 'Migrations'] },
    { title: 'Testing & Deployment', done: false, topics: ['Jest & Supertest', 'Docker', 'CI/CD', 'PM2 & Nginx'] },
  ]},
  { id: 'docker-kubernetes', title: 'Docker & Kubernetes', platform: 'KodeKloud', type: 'Course', skill: 'Docker', level: 'Intermediate', duration: '12 weeks', lessons: 55, description: 'Master containerization with Docker and orchestration with Kubernetes. Covers pods, services, deployments, Helm, and production best practices.', youtubeUrl: courseYoutubeUrls['docker-kubernetes'], curriculum: [
    { title: 'Docker Fundamentals', done: false, topics: ['Images & containers', 'Dockerfile', 'Docker Compose', 'Volumes & networks'] },
    { title: 'Kubernetes Core', done: false, topics: ['Pods', 'Deployments', 'Services', 'ConfigMaps & Secrets'] },
    { title: 'Storage & Networking', done: false, topics: ['Persistent volumes', 'Ingress', 'Network policies', 'Service mesh'] },
    { title: 'Monitoring & Logging', done: false, topics: ['Prometheus & Grafana', 'ELK stack', 'Metrics server', 'Liveness probes'] },
    { title: 'Production K8s', done: false, topics: ['Helm charts', 'Kustomize', 'RBAC', 'Cluster autoscaling'] },
  ]},
  { id: 'sql-databases', title: 'SQL & Database Design', platform: 'Coursera', type: 'Course', skill: 'SQL', level: 'Beginner', duration: '8 weeks', lessons: 35, description: 'Master SQL queries, database design, normalization, indexing, and performance optimization for relational databases.', youtubeUrl: courseYoutubeUrls['sql-databases'], curriculum: [
    { title: 'SQL Basics', done: false, topics: ['SELECT', 'WHERE', 'JOINs', 'GROUP BY & HAVING'] },
    { title: 'Advanced Queries', done: false, topics: ['Subqueries', 'CTEs', 'Window functions', 'UNION & CASE'] },
    { title: 'Database Design', done: false, topics: ['Normalization', 'ER diagrams', 'Indexes', 'Constraints'] },
    { title: 'Performance Tuning', done: false, topics: ['Query plans', 'Index strategies', 'Partitioning', 'Caching'] },
  ]},
  { id: 'mongodb-nosql', title: 'MongoDB & NoSQL', platform: 'MongoDB University', type: 'Course', skill: 'MongoDB', level: 'Intermediate', duration: '6 weeks', lessons: 28, description: 'Learn MongoDB from basics to advanced: CRUD, aggregation pipeline, indexing, replication, sharding, and Mongoose ODM.', youtubeUrl: courseYoutubeUrls['mongodb-nosql'], curriculum: [
    { title: 'CRUD Operations', done: false, topics: ['Documents & collections', 'Insert & find', 'Update & delete', 'Bulk writes'] },
    { title: 'Aggregation Pipeline', done: false, topics: ['$match & $group', '$lookup', '$unwind', 'Pipeline optimization'] },
    { title: 'Indexing & Performance', done: false, topics: ['Single & compound indexes', 'Text indexes', 'Explain plans', 'TTL indexes'] },
    { title: 'Replication & Sharding', done: false, topics: ['Replica sets', 'Primary election', 'Shard keys', 'Balancing'] },
  ]},
  { id: 'git-version-control', title: 'Git & Version Control', platform: 'Atlassian', type: 'Tutorial', skill: 'Git', level: 'Beginner', duration: '3 weeks', lessons: 15, description: 'Master Git from basics to advanced workflows: branching strategies, rebasing, cherry-picking, and collaboration on GitHub/GitLab.', youtubeUrl: courseYoutubeUrls['git-version-control'], curriculum: [
    { title: 'Git Basics', done: false, topics: ['init, add, commit', 'Branches', 'Merge', 'diff & log'] },
    { title: 'Advanced Git', done: false, topics: ['Rebase vs merge', 'Cherry-pick', 'Stash', 'Interactive rebase'] },
    { title: 'Collaboration', done: false, topics: ['Pull requests', 'Code review', 'Git flow', 'GitHub Actions'] },
  ]},
  { id: 'nextjs-fullstack', title: 'Next.js Full-Stack', platform: 'Vercel', type: 'Course', skill: 'Next.js', level: 'Intermediate', duration: '12 weeks', lessons: 50, description: 'Build full-stack applications with Next.js including SSR, SSG, API routes, middleware, authentication, and deployment.', youtubeUrl: courseYoutubeUrls['nextjs-fullstack'], curriculum: [
    { title: 'Next.js Fundamentals', done: false, topics: ['Pages & routing', 'SSR & SSG', 'API routes', 'getServerSideProps'] },
    { title: 'Data Fetching', done: false, topics: ['SWR & React Query', 'ISR', 'Middleware', 'Edge functions'] },
    { title: 'Authentication', done: false, topics: ['NextAuth.js', 'JWT', 'Session management', 'Protected routes'] },
    { title: 'Production', done: false, topics: ['Vercel deployment', 'Analytics', 'Image optimization', 'Bundle analysis'] },
  ]},
  { id: 'go-programming', title: 'Go Programming Language', platform: 'Coursera (Google)', type: 'Course', skill: 'Go', level: 'Intermediate', duration: '10 weeks', lessons: 40, description: 'Learn Go for building fast, concurrent backends. Covers goroutines, channels, interfaces, testing, and HTTP servers.', youtubeUrl: courseYoutubeUrls['go-programming'], curriculum: [
    { title: 'Go Basics', done: false, topics: ['Variables & types', 'Structs & interfaces', 'Functions & methods', 'Packages'] },
    { title: 'Concurrency', done: false, topics: ['Goroutines', 'Channels', 'Select', 'Mutex & sync'] },
    { title: 'Web Development', done: false, topics: ['net/http', 'REST APIs', 'JSON handling', 'Middleware'] },
    { title: 'Testing & Tooling', done: false, topics: ['go test', 'Benchmarks', 'pprof', 'Modules'] },
  ]},
  { id: 'react-native-mobile', title: 'React Native Mobile Dev', platform: 'Udemy', type: 'Course', skill: 'React Native', level: 'Intermediate', duration: '16 weeks', lessons: 70, description: 'Build cross-platform mobile apps with React Native, Expo, navigation, state management, and app store deployment.', youtubeUrl: courseYoutubeUrls['react-native-mobile'], curriculum: [
    { title: 'React Native Basics', done: false, topics: ['JSX & components', 'StyleSheet', 'Flexbox', 'ScrollView & FlatList'] },
    { title: 'Navigation', done: false, topics: ['React Navigation', 'Stack & tabs', 'Deep linking', 'Navigation params'] },
    { title: 'State & Data', done: false, topics: ['AsyncStorage', 'Redux/Zustand', 'Firebase', 'GraphQL'] },
    { title: 'Device Features', done: false, topics: ['Camera', 'Location', 'Notifications', 'Biometrics'] },
    { title: 'Publishing', done: false, topics: ['App Store', 'Google Play', 'CodePush', 'CI/CD'] },
  ]},
  { id: 'python-automation', title: 'Python Automation & Scripting', platform: 'Real Python', type: 'Tutorial', skill: 'Python', level: 'Beginner', duration: '6 weeks', lessons: 25, description: 'Automate repetitive tasks with Python scripts. Covers file I/O, web scraping, APIs, email automation, and cron jobs.', youtubeUrl: courseYoutubeUrls['python-automation'], curriculum: [
    { title: 'Python Review', done: false, topics: ['Scripts & modules', 'File I/O', 'Error handling', 'Libraries'] },
    { title: 'Web Scraping', done: false, topics: ['BeautifulSoup', 'Selenium', 'Scrapy', 'Rate limiting'] },
    { title: 'API Automation', done: false, topics: ['Requests library', 'REST APIs', 'Webhooks', 'Polling'] },
    { title: 'Task Scheduling', done: false, topics: ['Cron jobs', 'Celery', 'Email automation', 'Report generation'] },
  ]},
  { id: 'css-tailwind', title: 'CSS & Tailwind Design', platform: 'YouTube', type: 'Video Series', skill: 'CSS', level: 'Beginner', duration: '6 weeks', lessons: 30, description: 'Modern CSS with Flexbox, Grid, animations, and Tailwind CSS utility framework for building beautiful responsive UIs.', youtubeUrl: courseYoutubeUrls['css-tailwind'], curriculum: [
    { title: 'CSS Fundamentals', done: false, topics: ['Selectors & specificity', 'Box model', 'Flexbox', 'CSS Grid'] },
    { title: 'Responsive Design', done: false, topics: ['Media queries', 'Mobile-first', 'Fluid layouts', 'Breakpoints'] },
    { title: 'Tailwind CSS', done: false, topics: ['Utility classes', 'Config customization', 'Components', 'Dark mode'] },
    { title: 'Animations', done: false, topics: ['Transitions', 'Keyframes', 'Framer Motion', 'Performance'] },
  ]},
  { id: 'devops-pipeline', title: 'DevOps CI/CD Pipeline', platform: 'KodeKloud', type: 'Course', skill: 'DevOps', level: 'Advanced', duration: '10 weeks', lessons: 45, description: 'Build end-to-end CI/CD pipelines with Jenkins, GitHub Actions, ArgoCD, Terraform, and monitoring tools.', youtubeUrl: courseYoutubeUrls['devops-pipeline'], curriculum: [
    { title: 'CI/CD Concepts', done: false, topics: ['Build pipelines', 'Artifact management', 'Environments', 'Gates & approvals'] },
    { title: 'GitHub Actions', done: false, topics: ['Workflows', 'Actions & runners', 'Matrix builds', 'Secrets & environments'] },
    { title: 'Infrastructure as Code', done: false, topics: ['Terraform', 'State management', 'Modules', 'Remote backends'] },
    { title: 'Monitoring', done: false, topics: ['Prometheus', 'Grafana', 'Alertmanager', 'SLI/SLO/SLA'] },
  ]},
  { id: 'graphql-apis', title: 'GraphQL API Development', platform: 'Apollo', type: 'Tutorial', skill: 'GraphQL', level: 'Intermediate', duration: '6 weeks', lessons: 28, description: 'Build efficient APIs with GraphQL using Apollo Server/Client, schemas, resolvers, subscriptions, and federation.', youtubeUrl: courseYoutubeUrls['graphql-apis'], curriculum: [
    { title: 'GraphQL Basics', done: false, topics: ['Schema & types', 'Queries & mutations', 'Resolvers', 'Input types'] },
    { title: 'Apollo Server', done: false, topics: ['Setup', 'Context', 'DataSources', 'Error handling'] },
    { title: 'Apollo Client', done: false, topics: ['React integration', 'Cache', 'Pagination', 'Error handling'] },
    { title: 'Advanced', done: false, topics: ['Subscriptions', 'Federation', 'Security', 'Performance'] },
  ]},
  { id: 'java-spring', title: 'Java Spring Boot', platform: 'Udemy', type: 'Course', skill: 'Java', level: 'Intermediate', duration: '18 weeks', lessons: 75, description: 'Build enterprise applications with Java Spring Boot, Spring Data JPA, Spring Security, microservices, and testing.', youtubeUrl: courseYoutubeUrls['java-spring'], curriculum: [
    { title: 'Spring Core', done: false, topics: ['IoC & DI', 'Beans & scopes', 'Configuration', 'Profiles'] },
    { title: 'Spring Data JPA', done: false, topics: ['Repositories', 'JPQL', 'Auditing', 'Pagination'] },
    { title: 'Spring Security', done: false, topics: ['Authentication', 'JWT', 'OAuth2', 'Method security'] },
    { title: 'Microservices', done: false, topics: ['Spring Cloud', 'Eureka', 'Gateway', 'Circuit breaker'] },
    { title: 'Testing', done: false, topics: ['JUnit 5', 'Mockito', 'Integration tests', 'TestContainers'] },
  ]},
  { id: 'data-engineering', title: 'Data Engineering Pipeline', platform: 'DataCamp', type: 'Course', skill: 'Data Engineering', level: 'Intermediate', duration: '14 weeks', lessons: 60, description: 'Build data pipelines with Apache Spark, Airflow, dbt, data warehouses, and stream processing with Kafka.', youtubeUrl: courseYoutubeUrls['data-engineering'], curriculum: [
    { title: 'Data Warehousing', done: false, topics: ['Star schema', 'Snowflake', 'Redshift', 'BigQuery'] },
    { title: 'Apache Spark', done: false, topics: ['RDDs & DataFrames', 'SQL', 'Streaming', 'MLlib'] },
    { title: 'Orchestration', done: false, topics: ['Airflow DAGs', 'Sensors', 'Task dependencies', 'Monitoring'] },
    { title: 'Stream Processing', done: false, topics: ['Kafka basics', 'Producers & consumers', 'Kafka Streams', 'KsqlDB'] },
    { title: 'dbt & Transformation', done: false, topics: ['Models & sources', 'Tests', 'Documentation', 'Incremental models'] },
  ]},
  { id: 'cybersecurity-essentials', title: 'Cybersecurity Essentials', platform: 'Cybrary', type: 'Course', skill: 'Cyber Security', level: 'Beginner', duration: '10 weeks', lessons: 40, description: 'Learn cybersecurity fundamentals including network security, cryptography, ethical hacking, incident response, and compliance.', youtubeUrl: courseYoutubeUrls['cybersecurity-essentials'], curriculum: [
    { title: 'Network Security', done: false, topics: ['TCP/IP', 'Firewalls', 'VPNs', 'IDS/IPS'] },
    { title: 'Cryptography', done: false, topics: ['Symmetric & asymmetric', 'PKI', 'TLS/SSL', 'Hashing'] },
    { title: 'Ethical Hacking', done: false, topics: ['Reconnaissance', 'Scanning', 'Exploitation', 'Reporting'] },
    { title: 'Incident Response', done: false, topics: ['Detection', 'Containment', 'Eradication', 'Recovery'] },
    { title: 'Compliance', done: false, topics: ['GDPR', 'HIPAA', 'SOC2', 'ISO 27001'] },
  ]},
  { id: 'flutter-mobile', title: 'Flutter Cross-Platform', platform: 'Google Codelabs', type: 'Course', skill: 'Flutter', level: 'Intermediate', duration: '12 weeks', lessons: 50, description: 'Build beautiful cross-platform apps with Flutter and Dart. Covers widgets, state management, Firebase, and platform channels.', youtubeUrl: courseYoutubeUrls['flutter-mobile'], curriculum: [
    { title: 'Dart Language', done: false, topics: ['Types & null safety', 'Functions & classes', 'Async & streams', 'Collections'] },
    { title: 'Flutter Widgets', done: false, topics: ['Stateless & stateful', 'Layout widgets', 'Navigation', 'Forms & gestures'] },
    { title: 'State Management', done: false, topics: ['Provider', 'Riverpod', 'Bloc', 'GetX'] },
    { title: 'Firebase Integration', done: false, topics: ['Auth', 'Firestore', 'Storage', 'Push notifications'] },
    { title: 'Platform Features', done: false, topics: ['Camera', 'Location', 'Platform channels', 'App store'] },
  ]},
  { id: 'blockchain-dev', title: 'Blockchain Development', platform: 'Coursera', type: 'Course', skill: 'Blockchain', level: 'Advanced', duration: '12 weeks', lessons: 48, description: 'Build decentralized apps (dApps) with Solidity, Ethereum, Web3.js, smart contracts, and Hardhat framework.', youtubeUrl: courseYoutubeUrls['blockchain-dev'], curriculum: [
    { title: 'Blockchain Basics', done: false, topics: ['Blocks & chains', 'Consensus mechanisms', 'Wallets', 'Gas'] },
    { title: 'Solidity', done: false, topics: ['Variables & types', 'Functions & modifiers', 'Inheritance', 'Events'] },
    { title: 'Smart Contracts', done: false, topics: ['ERC-20', 'ERC-721', 'DeFi patterns', 'Oracles'] },
    { title: 'dApp Development', done: false, topics: ['Web3.js/Ethers', 'React dApp', 'Hardhat', 'Testing & deployment'] },
  ]},
  { id: 'agile-scrum', title: 'Agile & Scrum Master', platform: 'LinkedIn Learning', type: 'Course', skill: 'Agile', level: 'Beginner', duration: '4 weeks', lessons: 20, description: 'Master Agile methodology and Scrum framework for effective project management and team delivery.', youtubeUrl: courseYoutubeUrls['agile-scrum'], curriculum: [
    { title: 'Agile Principles', done: false, topics: ['Agile manifesto', '12 principles', 'Lean thinking', 'Waterfall vs Agile'] },
    { title: 'Scrum Framework', done: false, topics: ['Roles', 'Events', 'Artifacts', 'Sprint planning'] },
    { title: 'Managing Sprints', done: false, topics: ['Daily standups', 'Sprint reviews', 'Retrospectives', 'Backlog refinement'] },
    { title: 'Scaling Agile', done: false, topics: ['SAFe', 'LeSS', 'JIRA administration', 'Metrics & reporting'] },
  ]},
  { id: 'ai-prompt-engineering', title: 'AI & Prompt Engineering', platform: 'DeepLearning.AI', type: 'Course', skill: 'AI', level: 'Beginner', duration: '4 weeks', lessons: 20, description: 'Learn prompt engineering techniques for LLMs, RAG systems, AI agents, and building applications with OpenAI and Claude APIs.', youtubeUrl: courseYoutubeUrls['ai-prompt-engineering'], curriculum: [
    { title: 'LLM Fundamentals', done: false, topics: ['How LLMs work', 'Temperature & tokens', 'System vs user prompts', 'Context length'] },
    { title: 'Prompt Techniques', done: false, topics: ['Few-shot', 'Chain-of-thought', 'Role prompting', 'Structured outputs'] },
    { title: 'RAG Systems', done: false, topics: ['Embeddings', 'Vector databases', 'Retrieval strategies', 'Chunking'] },
    { title: 'AI Agents', done: false, topics: ['Tool use', 'Reasoning loops', 'Multi-agent', 'Safety & guardrails'] },
  ]},
  { id: 'rust-programming', title: 'Rust Systems Programming', platform: 'Rust Book', type: 'Tutorial', skill: 'Rust', level: 'Advanced', duration: '14 weeks', lessons: 55, description: 'Learn systems programming with Rust: ownership model, lifetimes, concurrency, unsafe Rust, and building CLI tools.', youtubeUrl: courseYoutubeUrls['rust-programming'], curriculum: [
    { title: 'Ownership & Borrowing', done: false, topics: ['Ownership rules', 'References & borrowing', 'Slices', 'Lifetimes'] },
    { title: 'Types & Generics', done: false, topics: ['Structs & enums', 'Generics', 'Traits', 'Lifetime annotations'] },
    { title: 'Error Handling & Testing', done: false, topics: ['Result & Option', 'Panic vs error', 'Unit tests', 'Integration tests'] },
    { title: 'Concurrency', done: false, topics: ['Threads', 'Message passing', 'Shared state', 'Async & await'] },
    { title: 'Unsafe Rust & FFI', done: false, topics: ['Raw pointers', 'FFI with C', 'Macros', 'Build tools'] },
  ]},
];

export default function LearningPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [resumeProjects, setResumeProjects] = useState<{ title: string; description: string; technologies: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [courseProgress, setCourseProgress] = useState<Record<string, { completed: number; total: number; curriculum: { title: string; done: boolean; topics: string[] }[] }>>({});
  const [filter, setFilter] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [videoType, setVideoType] = useState<'single' | 'playlist'>('single');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, skillGaps, resume] = await Promise.all([
          getProfile().catch(() => null),
          getSkillGaps().catch(() => []),
          getLatestResume().catch(() => null),
        ]);
        setProfile(prof);
        setGaps(skillGaps);
        if (resume?.parsedData) {
          try {
            const pd = typeof resume.parsedData === 'string' ? JSON.parse(resume.parsedData) : resume.parsedData;
            if (pd.skills && Array.isArray(pd.skills)) setResumeSkills(pd.skills.map((s: any) => typeof s === 'string' ? s : s.name || s));
            if (pd.projects && Array.isArray(pd.projects)) setResumeProjects(pd.projects);
          } catch {}
        }
      } catch { console.error('Failed to fetch learning data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const userSkillSet = new Set([
    ...(profile?.skills?.map(s => s.name.toLowerCase()) || []),
    ...resumeSkills.map(s => s.toLowerCase()),
  ]);

  const recommendedCourses = courses.filter(c =>
    userSkillSet.size > 0 && userSkillSet.has(c.skill.toLowerCase())
  );

  const filteredCourses = filter === 'all' ? courses :
    filter === 'recommended' ? recommendedCourses :
    courses.filter(c => c.skill.toLowerCase() === filter.toLowerCase());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, skillGaps] = await Promise.all([
          getProfile().catch(() => null),
          getSkillGaps().catch(() => []),
        ]);
        setProfile(prof);
        setGaps(skillGaps);
      } catch { console.error('Failed to fetch learning data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const openYoutube = (courseId: string | null) => {
    if (courseId && courseYoutubeUrls[courseId]) {
      const language = languages.find(l => l.code === selectedLanguage);
      const suffix = language?.suffix || '';
      const baseQuery = courseYoutubeUrls[courseId] + suffix;
      if (videoType === 'playlist') {
        const query = encodeURIComponent(baseQuery + ' full course playlist');
        window.open(`https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%3D%3D`, '_blank');
      } else {
        const query = encodeURIComponent(baseQuery + ' tutorial');
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
      }
    }
  };

  const openWebsite = (courseId: string | null) => {
    if (courseId && courseWebsiteUrls[courseId]) window.open(courseWebsiteUrls[courseId], '_blank');
  };

  const startCourse = (courseId: string) => {
    if (!courseProgress[courseId]) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseProgress(prev => ({
          ...prev,
          [courseId]: {
            completed: 0,
            total: course.curriculum.length,
            curriculum: course.curriculum.map(m => ({ ...m })),
          },
        }));
      }
    }
    setActiveCourse(courseId);
  };

  const toggleModule = (courseId: string, moduleIndex: number) => {
    const key = `${courseId}-${moduleIndex}`;
    setExpandedModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markModuleDone = (courseId: string, moduleIndex: number) => {
    setCourseProgress(prev => {
      const cp = prev[courseId];
      if (!cp) return prev;
      const wasDone = cp.curriculum[moduleIndex].done;
      const updated = { ...cp, curriculum: cp.curriculum.map((m, i) => i === moduleIndex ? { ...m, done: !m.done } : m) };
      updated.completed = updated.curriculum.filter(m => m.done).length;
      return { ...prev, [courseId]: updated };
    });
  };

  const closeCourse = () => setActiveCourse(null);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const activeCourseData = courses.find(c => c.id === activeCourse);
  const progress = activeCourse && activeCourseData ? courseProgress[activeCourse] : null;
  const pct = progress && progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  if (activeCourse && activeCourseData) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{activeCourseData.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{activeCourseData.platform} · {activeCourseData.level} · {activeCourseData.duration}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Language:</span>
              <select
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={closeCourse} className="gap-2">
              <X className="w-4 h-4" /> Back to Courses
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">{activeCourseData.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeCourseData.duration}</span>
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {activeCourseData.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {activeCourseData.level}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground px-1">Course Curriculum</h3>
              {activeCourseData.curriculum.map((module, idx) => {
                const cp = courseProgress[activeCourse];
                const isDone = cp?.curriculum[idx]?.done || false;
                const isExpanded = expandedModules[`${activeCourse}-${idx}`];
                return (
                  <Card key={idx} className={cn('glass-hover', isDone ? 'border-green-500/20' : '')}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleModule(activeCourse, idx)}>
                        <button onClick={(e) => { e.stopPropagation(); markModuleDone(activeCourse, idx); }} className="shrink-0">
                          {isDone ? <CheckCircle className="w-5 h-5 text-green-400" /> : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />}
                        </button>
                        <div className="flex-1">
                          <p className={cn('text-sm font-medium', isDone ? 'line-through text-muted-foreground' : '')}>{module.title}</p>
                          <p className="text-xs text-muted-foreground">{module.topics.length} topics</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
                          <ul className="space-y-1 mt-3">
                            {module.topics.map((topic, ti) => (
                              <li key={ti} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                  <span className="text-3xl font-bold text-primary">{pct}%</span>
                </div>
                <p className="text-sm font-medium">Course Progress</p>
                <p className="text-xs text-muted-foreground mt-1">{progress?.completed || 0}/{progress?.total || 0} modules</p>
                <Progress value={pct} className="mt-4 h-2" indicatorClassName={pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : ''} />
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex rounded-lg border border-border overflow-hidden mb-1">
                    <button
                      className={`flex-1 text-xs py-1.5 font-medium transition-colors ${videoType === 'single' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-secondary'}`}
                      onClick={() => setVideoType('single')}
                    >
                      Single Video
                    </button>
                    <button
                      className={`flex-1 text-xs py-1.5 font-medium transition-colors ${videoType === 'playlist' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-secondary'}`}
                      onClick={() => setVideoType('playlist')}
                    >
                      Playlist
                    </button>
                  </div>
                  <Button className="w-full gap-2" onClick={() => openYoutube(activeCourse)}>
                    <Video className="w-4 h-4" /> Watch on YouTube
                  </Button>
                  <Button className="w-full gap-2" variant="outline" onClick={() => openWebsite(activeCourse)}>
                    <ExternalLink className="w-4 h-4" /> Read Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">Courses and resources for your career growth</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Video:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              className={`text-xs px-3 py-1.5 font-medium transition-colors ${videoType === 'single' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-secondary'}`}
              onClick={() => setVideoType('single')}
            >
              Single Video
            </button>
            <button
              className={`text-xs px-3 py-1.5 font-medium transition-colors ${videoType === 'playlist' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-secondary'}`}
              onClick={() => setVideoType('playlist')}
            >
              Playlist
            </button>
          </div>
          <span className="text-sm text-muted-foreground ml-2">Language:</span>
          <select
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      {gaps.filter(g => g.priority === 'CRITICAL' || g.priority === 'RECOMMENDED').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" /> Recommended Skills to Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {gaps.filter(g => g.priority === 'CRITICAL' || g.priority === 'RECOMMENDED').map(gap => (
                <Badge key={gap.id} variant={gap.priority === 'CRITICAL' ? 'destructive' : 'warning'} className="text-xs py-1">
                  {gap.skillName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {resumeProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Projects from Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {resumeProjects.map((p, i) => {
                const relatedCourses = courses.filter(c =>
                  p.technologies.some(t => t.toLowerCase().includes(c.skill.toLowerCase())) ||
                  p.description.toLowerCase().includes(c.skill.toLowerCase())
                );
                return (
                  <Card key={i} className="border border-border/50">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium mb-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                      {p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {p.technologies.map((t, ti) => (
                            <Badge key={ti} variant="outline" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      )}
                      {relatedCourses.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {relatedCourses.slice(0, 2).map(rc => (
                            <Badge key={rc.id} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => startCourse(rc.id)}>
                              {rc.title}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All Courses ({courses.length})
        </Button>
        {recommendedCourses.length > 0 && (
          <Button size="sm" variant={filter === 'recommended' ? 'default' : 'outline'} onClick={() => setFilter('recommended')}>
            Based on Your Skills ({recommendedCourses.length})
          </Button>
        )}
        {[...new Set(courses.map(c => c.skill))].map(skill => (
          <Button key={skill} size="sm" variant={filter === skill ? 'default' : 'outline'} onClick={() => setFilter(skill)}>
            {skill}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => {
          const cp = courseProgress[course.id];
          const pct = cp && cp.total > 0 ? Math.round((cp.completed / cp.total) * 100) : 0;
          const isRecommended = userSkillSet.has(course.skill.toLowerCase());
          return (
            <Card key={course.id} className={cn('glass-hover flex flex-col', isRecommended && filter === 'all' ? 'ring-1 ring-primary/20' : '')}>
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-[10px]">{course.type}</Badge>
                  <Badge variant={isRecommended ? 'default' : 'secondary'} className="text-[10px]">
                    {course.skill}{isRecommended && ' ✓'}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm mb-1">{course.title}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Play className="w-3 h-3" /> {course.platform}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 mt-auto">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {course.lessons} lessons</span>
                </div>
                {cp && cp.completed > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{pct}% complete</span>
                      <span className="text-muted-foreground">{cp.completed}/{cp.total}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                )}
                <Button size="sm" className="w-full gap-1 mt-auto" onClick={() => startCourse(course.id)}>
                  <BookOpen className="w-3 h-3" /> {cp && cp.completed > 0 ? 'Continue Course' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {profile?.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Your Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <Badge key={skill.id} variant="default" className="flex items-center gap-1">
                  {skill.name}
                  {skill.level && <span className="text-[10px] opacity-70">· {skill.level}</span>}
                </Badge>
              ))}
              {resumeSkills.map((s, i) => (
                <Badge key={`resume-${i}`} variant="secondary" className="flex items-center gap-1">
                  {s} <span className="text-[10px] opacity-70">· Resume</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
