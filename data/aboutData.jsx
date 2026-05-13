export const values = [
   {
      icon: (
         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
      ),
      title: "Agile Software Development",
      desc: "Sprint-based delivery with full transparency. Our software developers ship faster, iterate smarter, and keep you in control at every milestone.",
   },
   {
      icon: (
         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
         </svg>
      ),
      title: "Scalable & Future-Proof Architecture",
      desc: "We engineer software solutions on proven stacks — React, Node.js, and cloud-native infrastructure — built to scale without costly rewrites.",
   },
   {
      icon: (
         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
         </svg>
      ),
      title: "Enterprise Security & Compliance",
      desc: "Every product from our software house follows OWASP standards, GDPR best practices, and rigorous QA — so your business and users stay protected.",
   },
   {
      icon: (
         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
         </svg>
      ),
      title: "24/7 Dedicated Support",
      desc: "Our software development company stays with you post-launch — monitoring performance, deploying updates, and resolving issues around the clock.",
   },
];

// Trusted clients - expanded list
export const trustedClients = [
   { name: "Google" },
   { name: "Microsoft" },
   { name: "Amazon" },
   { name: "Apple" },
   { name: "Meta" },
   { name: "Netflix" },
   { name: "Adobe" },
   { name: "Salesforce" },
   { name: "Oracle" },
   { name: "IBM" },
   { name: "Intel" },
   { name: "Nvidia" },
   { name: "Tesla" },
   { name: "Shopify" },
   { name: "Slack" },
   { name: "Discord" },
];

// Unsplash images for tech stack
export const techStackImages = {
   frontend: [
      "https://img.icons8.com/officel/80/react.png",
      "https://img.icons8.com/fluency/48/nextjs.png",
      "https://img.icons8.com/color/48/vue-js.png",
      "https://img.icons8.com/color/48/angularjs.png",
      "https://img.icons8.com/color/48/typescript.png",
      "https://img.icons8.com/fluency/48/tailwind_css.png",
   ],
   backend: [
      "https://img.icons8.com/color/48/nodejs.png",
      "https://img.icons8.com/fluency/48/python.png",
      "https://img.icons8.com/arcade/64/laravel.png",
      "https://img.icons8.com/color/48/ruby-gemstone.png",
      "https://img.icons8.com/color/48/go.png",
      "https://img.icons8.com/3d-sugary/100/java.png",
   ],
   mobile: [
      "https://img.icons8.com/color/48/react-native.png",
      "https://img.icons8.com/color/48/flutter.png",
      "https://img.icons8.com/officel/80/swift.png",
      "https://img.icons8.com/color/48/kotlin.png",
      "https://img.icons8.com/color/48/ionic.png",
      "https://img.icons8.com/color/48/flutter.png",
   ],
   database: [
      "https://img.icons8.com/color/48/firebase.png",
      "https://img.icons8.com/color/48/mongodb.png",
      "https://img.icons8.com/color/48/mysql.png",
      "https://img.icons8.com/color/48/postgreesql.png",
      "https://img.icons8.com/color/48/redis.png",
      "https://img.icons8.com/color/48/elasticsearch.png",
   ],
   cloud: [
      "https://img.icons8.com/color/48/amazon-web-services.png",
      "https://img.icons8.com/color/48/google-cloud.png",
      "https://img.icons8.com/fluency/48/azure-1.png",
      "https://img.icons8.com/color/48/docker.png",
      "https://img.icons8.com/color/48/kubernetes.png",
      "https://img.icons8.com/color/48/terraform.png",
   ],
   devops: [
      "https://img.icons8.com/ios-filled/50/github.png",
      "https://img.icons8.com/color/48/jenkins.png",
      "https://img.icons8.com/fluency/48/prometheus-app.png",
      // "https://img.icons8.com/color/48/grafana.png",
      // "https://img.icons8.com/color/48/datadog.png",
   ], 
};

export const techStackNames = {
   frontend: ["React.js", "Next.js", "Vue.js", "Angular", "TypeScript", "Tailwind CSS"],
   backend: ["Node.js", "Python/Django", "Laravel", "Ruby on Rails", "Go", "Java/Spring"],
   mobile: ["React Native", "Flutter", "Swift/iOS", "Kotlin/Android", "Ionic", "Xamarin"],
   database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Elasticsearch"],
   cloud: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform"],
   devops: ["GitHub Actions", "Jenkins", "Prometheus", "Grafana", "New Relic", "Datadog"],
};