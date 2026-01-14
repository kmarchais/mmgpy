"""Web interface for mmgpy using trame.

This module provides a web-based GUI for mesh remeshing operations.

Example:
    >>> from mmgpy.ui import run_ui
    >>> run_ui()  # Opens browser with the UI

    >>> # Or with a pre-loaded mesh
    >>> from mmgpy import Mesh
    >>> mesh = Mesh("model.vtk")
    >>> run_ui(mesh=mesh)

"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mmgpy import Mesh
    from mmgpy.ui.app import MmgpyApp


def run_ui(
    *,
    mesh: Mesh | None = None,
    port: int = 0,
    open_browser: bool = True,
    debug: bool = False,
) -> None:
    """Launch the mmgpy web interface.

    Parameters
    ----------
    mesh : Mesh, optional
        Pre-loaded mesh to display. If None, starts with empty viewer.
    port : int, default=0
        Port to run the server on. 0 means auto-select.
    open_browser : bool, default=True
        Whether to automatically open a browser window.
    debug : bool, default=False
        Enable debug mode with HTML structure printing.

    Examples
    --------
    >>> from mmgpy.ui import run_ui
    >>> run_ui()  # Opens in browser

    >>> run_ui(open_browser=False)  # Server only

    >>> # From command line:
    >>> # mmgpy-ui
    >>> # uvx --from "mmgpy[ui]" mmgpy-ui

    """
    from mmgpy.ui.app import MmgpyApp

    app = MmgpyApp(mesh=mesh, debug=debug)
    app.server.start(port=port, open_browser=open_browser)


def print_html(app: MmgpyApp | None = None) -> str:
    """Print the HTML structure for debugging.

    Parameters
    ----------
    app : MmgpyApp, optional
        The application instance. If None, creates a temporary one.

    Returns
    -------
    str
        The HTML structure as a string.

    """
    from mmgpy.ui.app import MmgpyApp

    if app is None:
        app = MmgpyApp()
    return app.ui.html


__all__ = ["print_html", "run_ui"]
