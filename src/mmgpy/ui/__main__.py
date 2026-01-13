"""Allow running the UI with `python -m mmgpy.ui`."""

import argparse


def main() -> None:
    """Run the mmgpy UI."""
    parser = argparse.ArgumentParser(description="mmgpy web interface")
    parser.add_argument(
        "--server",
        action="store_true",
        help="Don't open browser automatically",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=0,
        help="Port to run on (0 = auto)",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug mode",
    )
    args = parser.parse_args()

    from mmgpy.ui import run_ui

    run_ui(
        port=args.port,
        open_browser=not args.server,
        debug=args.debug,
    )


if __name__ == "__main__":
    main()
