"""Pin the vendored MMG library version.

Guards against accidental MMG bumps via ``extern/CMakeLists.txt``.
"""

import mmgpy


def test_mmg_version() -> None:
    """The bundled MMG library is the version we expect."""
    assert mmgpy.MMG_VERSION == "5.8.0"
