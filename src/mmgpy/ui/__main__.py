"""Allow running the UI with `python -m mmgpy.ui` or `mmgpy-ui` command.

Usage:
    mmgpy-ui
    mmgpy-ui --port 8080
    mmgpy-ui --server  # Don't open browser

    # With uvx (no install needed)
    uvx --from "mmgpy[ui]" mmgpy-ui

"""

import argparse
import sys


def main() -> None:
    """Run the mmgpy UI."""
    parser = argparse.ArgumentParser(
        prog="mmgpy-ui",
        description="mmgpy web interface for mesh remeshing",
        epilog="Run with uvx: uvx --from 'mmgpy[ui]' mmgpy-ui",
    )
    parser.add_argument(
        "--server",
        action="store_true",
        help="Server mode: don't open browser automatically",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=0,
        help="Port to run on (0 = auto-select available port)",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug mode with HTML structure printing",
    )
    parser.add_argument(
        "--version",
        action="store_true",
        help="Show mmgpy version and exit",
    )
    args = parser.parse_args()

    if args.version:
        try:
            from importlib.metadata import version

            print(f"mmgpy-ui (mmgpy {version('mmgpy')})")
        except Exception:
            print("mmgpy-ui (version unknown)")
        sys.exit(0)

    # Check if trame is available
    try:
        import trame  # noqa: F401
    except ImportError:
        print("Error: trame is not installed.")
        print("Install with: pip install 'mmgpy[ui]'")
        print("Or run with: uvx --from 'mmgpy[ui]' mmgpy-ui")
        sys.exit(1)

    from mmgpy.ui import run_ui

    run_ui(
        port=args.port,
        open_browser=not args.server,
        debug=args.debug,
    )


if __name__ == "__main__":
    main()
