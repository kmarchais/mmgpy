"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { validateSource } = require("./validate_blender_source.cjs");
const repository = { owner: "kmarchais", repo: "mmgpy" };
const sha = "a".repeat(40);

function fixture() {
  const data = {
    run: { id: 123, repository: { full_name: "kmarchais/mmgpy" },
      head_repository: { full_name: "kmarchais/mmgpy" }, status: "completed",
      conclusion: "success", workflow_id: 456, event: "workflow_dispatch",
      head_branch: "v0.17.1", head_sha: sha },
    workflow: { path: ".github/workflows/build-wheels.yml" },
    reference: { object: { type: "commit", sha } },
    annotated: { object: { type: "commit", sha } },
    release: { draft: false, tag_name: "v0.17.1" },
  };
  const result = key => async () => ({ data: data[key] });
  return { data, github: { rest: {
    actions: { getWorkflowRun: result("run"), getWorkflow: result("workflow") },
    git: { getRef: result("reference"), getTag: result("annotated") },
    repos: { getReleaseByTag: result("release") },
  } } };
}

for (const event of ["release", "workflow_dispatch"]) {
  test(`accepts a successful release wheel run: ${event}`, async () => {
    const { github, data } = fixture();
    data.run.event = event;
    assert.deepEqual(await validateSource(github, repository, "123"),
      { run_id: "123", sha, tag: "v0.17.1" });
  });
}

test("resolves an annotated release tag to its commit", async () => {
  const { github, data } = fixture();
  data.reference.object = { type: "tag", sha: "b".repeat(40) };
  assert.equal((await validateSource(github, repository, "123")).sha, sha);
});

for (const [name, change] of [
  ["fork run", data => { data.run.head_repository.full_name = "attacker/mmgpy"; }],
  ["different repository", data => { data.run.repository.full_name = "attacker/mmgpy"; }],
  ["wrong run ID", data => { data.run.id = 124; }],
  ["failed run", data => { data.run.conclusion = "failure"; }],
  ["unfinished run", data => { data.run.status = "in_progress"; }],
  ["wrong workflow", data => { data.workflow.path = ".github/workflows/untrusted.yml"; }],
  ["pull request run", data => { data.run.event = "pull_request"; }],
  ["branch build", data => { data.run.head_branch = "main"; }],
  ["shell injection", data => { data.run.head_branch = 'v0.17.1"; echo injected'; }],
  ["moved release tag", data => { data.reference.object.sha = "b".repeat(40); }],
  ["draft release", data => { data.release.draft = true; }],
]) {
  test(`rejects ${name}`, async () => {
    const { github, data } = fixture();
    change(data);
    await assert.rejects(validateSource(github, repository, "123"));
  });
}

for (const runId of ["", "-1", "1; echo injected", "9007199254740992"]) {
  test(`rejects invalid run ID ${JSON.stringify(runId)}`, async () => {
    await assert.rejects(validateSource(fixture().github, repository, runId));
  });
}
