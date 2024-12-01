from mmgpy._core import MMG3DMesh, version


class Mesh:
    """High-level wrapper for MMG3D mesh operations."""

    def __init__(self):
        """Initialize a new MMG3D mesh."""
        self._mesh = MMG3DMesh()

    @property
    def version(self):
        """Get MMG version."""
        return version()

    def load_mesh(self, filename):
        """Load a mesh from a file."""
        return self._mesh.load_mesh(filename)

    def load_solution(self, filename):
        """Load a solution from a file."""
        return self._mesh.load_sol(filename)

    def set_option(self, name, value):
        """Set a meshing option."""
        return self._mesh.set_option(name, value)

    def remesh(self):
        """Perform remeshing."""
        return self._mesh.remesh()

    def save_mesh(self, filename):
        """Save the mesh to a file."""
        return self._mesh.save_mesh(filename)

    def save_solution(self, filename):
        """Save the solution to a file."""
        return self._mesh.save_sol(filename)
