"""Regression checks for documentation charting and release deployment."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def test_download_chart_uses_elapsed_dates_for_x_coordinates() -> None:
    """Missing tracker days must occupy their real width on the x-axis."""
    script = (ROOT / "docs/assets/js/blender-extension-stats.js").read_text(
        encoding="utf-8"
    )

    assert "x: dateValue(row.date)" in script
    assert "x: dateValue(review.date)" in script
    assert "x: dateValue(event.date)" in script
    assert "min: dateValue(first.date)" in script
    assert "max: dateValue(latest.date)" in script


def test_dispatched_release_build_deploys_versioned_docs() -> None:
    """The release orchestrator dispatch must update Mike's latest alias."""
    workflow = (ROOT / ".github/workflows/build-wheels.yml").read_text(encoding="utf-8")
    deploy_job = workflow.split("  deploy-versioned-docs:", maxsplit=1)[1]

    assert "github.event_name == 'workflow_dispatch'" in deploy_job
    assert "inputs.publish_to_pypi" in deploy_job
    assert "startsWith(github.ref, 'refs/tags/v')" in deploy_job
