import { notFound } from "next/navigation";
import JobDetailsClient from "./jobDetailsClient";
import jobs from "../jobs.json";

type Job = (typeof jobs)[number];

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const job = (jobs as Job[]).find((j) => j.slug === params.slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} | Careers`,
    description: job.overview,
  };
}

export default function JobPage({ params }: { params: { slug: string } }) {
  const job = (jobs as Job[]).find((j) => j.slug === params.slug);
  if (!job) notFound();
  return <JobDetailsClient job={job} />;
}


