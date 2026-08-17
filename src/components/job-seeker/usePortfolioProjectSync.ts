"use client";

import type { PortfolioBuilderSubmit } from "@/components/job-seeker/PortfolioBuilder";
import {
  useCreatePortfolioProjectMutation,
  useDeletePortfolioProjectMutation,
  useUpdatePortfolioProjectMutation,
} from "@/services/jobSeekerApi";

/**
 * Projects are their own REST resources, but the builder edits them alongside
 * the portfolio. This reconciles one builder submission against the server:
 * removals first, then each remaining project created or patched in the order
 * the user arranged them, which is what `displayOrder` records.
 *
 * Calls run sequentially so `displayOrder` cannot be interleaved and a failure
 * stops before it can leave a half-reordered list behind.
 */
export function usePortfolioProjectSync() {
  const [createProject] = useCreatePortfolioProjectMutation();
  const [updateProject] = useUpdatePortfolioProjectMutation();
  const [deleteProject] = useDeletePortfolioProjectMutation();

  return async function syncProjects(
    portfolioId: string | number,
    { projects, removedProjectIds }: Pick<PortfolioBuilderSubmit, "projects" | "removedProjectIds">,
  ) {
    for (const projectId of removedProjectIds) {
      await deleteProject({ portfolioId, projectId }).unwrap();
    }

    for (const [index, project] of projects.entries()) {
      const body = {
        title: project.title.trim(),
        description: project.description.trim(),
        projectUrl: project.projectUrl.trim(),
        githubUrl: project.githubUrl.trim(),
        imageUrl: project.imageUrl,
        techStack: project.techStack.trim(),
        displayOrder: index,
      };

      if (project.id) {
        await updateProject({ portfolioId, projectId: project.id, body }).unwrap();
      } else {
        await createProject({ portfolioId, body }).unwrap();
      }
    }
  };
}
