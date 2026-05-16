"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const techStackData = {
  frontend: {
    category: "Frontend Development",
    items: [
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    ],
  },
  backend: {
    category: "Backend Development",
    items: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Python/Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
      { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
      { name: "Java/Spring", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Ruby on Rails", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original.svg" },
    ],
  },
  mobile: {
    category: "Mobile Development",
    items: [
      { name: "React Native", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
      { name: "Swift/iOS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
      { name: "Ionic", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg" },
      { name: "Kotlin/Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
    ],
  },
  database: {
    category: "Database & Storage",
    items: [
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" },
      { name: "Elasticsearch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg" },
      { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
    ],
  },
  cloud: {
    category: "Cloud & Infrastructure",
    items: [
      { name: "AWS", icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { name: "Google Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
      { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
      { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg" },
      { name: "Terraform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    ],
  },
  devops: {
    category: "DevOps & Monitoring",
    items: [
      { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
      { name: "Prometheus", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" },
      { name: "New Relic", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/newrelic/newrelic-original.svg" },
      { name: "Grafana", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
    ],
  },
};

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function TechBadge({ item, index }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-default"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative w-5 h-5 shrink-0">
        <Image
          src={item.icon}
          alt={item.name}
          fill
          className="object-contain"
          onError={(e) => {
            (e.target).style.display = "none";
          }}
        />
      </div>
      <span className="text-[13px] font-medium text-slate-700 whitespace-nowrap">
        {item.name}
      </span>
    </div>
  );
}

function CategoryBlock({
  category,
  items,
  visible,
  delay,
}) {
  return (
    <div
      className="p-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        {category}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <TechBadge key={item.name} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

export function TechStackSection() {
  const { ref, visible } = useInView(0.1);

  const leftCol = [techStackData.frontend, techStackData.mobile, techStackData.cloud];
  const rightCol = [techStackData.backend, techStackData.database, techStackData.devops];

  return (
    <div className="bg-white py-16 lg:py-24 lg:px-12" ref={ref}>
      <div className=" mx-auto px-6 lg:px-10">
        {/* Header */}
  


            <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 md:mb-16">
  <div className="inline-flex items-center gap-2 mb-3">
    <span className="h-0.5 w-8 rounded-full bg-accent" />
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
      Technology Stack
    </p>
    <span className="h-0.5 w-8 rounded-full bg-accent" />
  </div>

  <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-4xl">
    Modern tools powering scalable applications
 
  </h2>

  <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
    Modern technologies and frameworks we use to build secure,
    high-performance digital experiences.
  </p>
</div>

        {/* Grid */}
        <div className="border border-dashed border-slate-300 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {leftCol.map((section, i) => {
              const rightSection = rightCol[i];
              const isLast = i === leftCol.length - 1;
              return (
                <div key={section.category} className="contents">
                  {/* Left cell */}
                  <div
                    className={`${
                      !isLast ? "border-b border-dashed border-slate-300" : ""
                    } lg:border-r lg:border-dashed lg:border-slate-300`}
                  >
                    <CategoryBlock
                      category={section.category}
                      items={section.items}
                      visible={visible}
                      delay={i * 100}
                    />
                  </div>

                  {/* Right cell */}
                  <div
                    className={`${
                      !isLast ? "border-b border-dashed border-slate-300" : ""
                    }`}
                  >
                    <CategoryBlock
                      category={rightSection.category}
                      items={rightSection.items}
                      visible={visible}
                      delay={i * 100 + 50}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechStackSection;