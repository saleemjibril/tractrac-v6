import jobs from "./jobs.json";

export type JobJson = {
  id?: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  summary?: string;
  overview?: string;
};

export type JobCardData = {
  id: string;
  title: string;
  location: string;
  type: string;
  summary: string;
  link: string;
};

export const jobCards: JobCardData[] = (jobs as JobJson[]).map((job) => ({
  id: job.id ?? job.slug,
  title: job.title,
  location: job.location,
  type: job.type,
  summary: job.summary ?? job.overview ?? "",
  link: `/careers/${job.slug}`,
}));
