"""Allow running the UI with `python -m mmgpy.ui` or `mmgpy-ui` command.

Usage:
    mmgpy-ui              # Desktop app (default)
    mmgpy-ui --browser    # Run in browser instead
    mmgpy-ui --port 8080  # Specify port (browser mode)
    mmgpy-ui --server     # Server only, don't open browser

    # With uvx (no install needed)
    uvx --from "mmgpy[ui]" mmgpy-ui

"""

import argparse
import sys


def main() -> None:
    """Run the mmgpy UI."""
    parser = argparse.ArgumentParser(
        prog="mmgpy-ui",
        description="mmgpy interface for mesh remeshing (runs as desktop app by default)",
        epilog="Run with uvx: uvx --from 'mmgpy[ui]' mmgpy-ui",
    )
    parser.add_argument(
        "--browser",
        action="store_true",
        help="Run in browser instead of desktop app",
    )
    parser.add_argument(
        "--server",
        action="store_true",
        help="Server mode: don't open browser automatically (implies --browser)",
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

    # --server implies --browser mode
    use_browser_mode = args.browser or args.server
    exec_mode = "main" if use_browser_mode else "desktop"

    run_ui(
        port=args.port,
        open_browser=not args.server,
        debug=args.debug,
        exec_mode=exec_mode,
        maximized=not use_browser_mode,  # Maximized only for desktop mode
    )


if __name__ == "__main__":
    main()
