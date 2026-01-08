"""Interactive sizing tools for mmgpy.

This module provides PyVista-based interactive tools for defining local
mesh sizing constraints through visual interaction.

Example:
-------
>>> from mmgpy import Mesh
>>> from mmgpy.interactive import SizingEditor
>>>
>>> mesh = Mesh("model.mesh")
>>> editor = SizingEditor(mesh)
>>> editor.add_sphere_tool()
>>> editor.run()  # Opens PyVista window
>>>
>>> # After editing, apply constraints
>>> editor.apply_to_mesh()
>>> mesh.remesh()

"""

from mmgpy.interactive.sizing_editor import SizingEditor

__all__ = ["SizingEditor"]
