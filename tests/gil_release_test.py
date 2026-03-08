"""Test that the GIL is released during remeshing operations."""

import threading
import time

import numpy as np

from mmgpy._mmgpy import MmgMesh3D


def test_gil_released_during_remesh(cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
    """Verify the GIL is released during remeshing.

    Runs a remesh in a background thread while the main thread does Python work.
    If the GIL were held during remeshing, the main thread would be blocked
    and unable to increment the counter.
    """
    vertices, elements = cube_mesh
    mesh = MmgMesh3D(vertices, elements)

    counter = 0
    remesh_done = threading.Event()

    def remesh_worker() -> None:
        mesh.remesh(verbose=False, hmax=0.5)
        remesh_done.set()

    thread = threading.Thread(target=remesh_worker)
    thread.start()

    # Do Python work while remesh runs in background
    while not remesh_done.is_set():
        counter += 1
        time.sleep(0.001)

    thread.join()

    # If GIL was released, we should have been able to increment the counter
    # at least once while remeshing was running
    assert counter > 0, (
        "Main thread was blocked - GIL may not be released during remesh"
    )
