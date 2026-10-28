"use strict";

// Authenticate the wheel run before checking out or unpacking its contents.
async function validateSource(github, repository, runId) {
  const id = Number(runId);
  if (!/^[1-9][0-9]*$/.test(String(runId)) || !Number.isSafeInteger(id)) {
    throw new Error("A positive workflow run ID is required");
  }
  const { owner, repo } = repository;
  const fullName = `${owner}/${repo}`;
  const { data: run } = await github.rest.actions.getWorkflowRun({ owner, repo, run_id: id });
  if (run.id !== id || run.repository?.full_name !== fullName || run.head_repository?.full_name !== fullName) {
    throw new Error("Wheel run must originate in this repository, not a fork");
  }
  if (run.status !== "completed" || run.conclusion !== "success") {
    throw new Error("Wheel run must have completed successfully");
  }
  const { data: workflow } = await github.rest.actions.getWorkflow({ owner, repo, workflow_id: run.workflow_id });
  if (workflow.path !== ".github/workflows/build-wheels.yml") {
    throw new Error("Artifacts must come from the Build Wheels workflow");
  }
  const tag = run.head_branch;
  if (!["release", "workflow_dispatch"].includes(run.event) ||
      typeof tag !== "string" || !/^v[0-9]+\.[0-9]+\.[0-9]+[A-Za-z0-9.+-]*$/.test(tag) ||
      typeof run.head_sha !== "string" || !/^[0-9a-f]{40}$/.test(run.head_sha)) {
    throw new Error("Wheel run must target a release version tag");
  }
  const { data: reference } = await github.rest.git.getRef({ owner, repo, ref: `tags/${tag}` });
  let object = reference.object;
  for (let depth = 0; object.type === "tag" && depth < 5; depth++) {
    const { data: annotated } = await github.rest.git.getTag({ owner, repo, tag_sha: object.sha });
    object = annotated.object;
  }
  if (object.type !== "commit" || object.sha !== run.head_sha) {
    throw new Error("Release tag no longer matches the wheel run commit");
  }
  const { data: release } = await github.rest.repos.getReleaseByTag({ owner, repo, tag });
  if (release.draft !== false || release.tag_name !== tag) {
    throw new Error("Wheel run must belong to a published release");
  }
  return { run_id: String(id), sha: run.head_sha, tag };
}

module.exports = { validateSource };
