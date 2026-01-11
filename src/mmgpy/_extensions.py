"""Type-safe method extension utilities for pybind11 classes.

This module provides utilities for adding methods to pybind11-generated classes
in a type-safe manner, avoiding the need for scattered `type: ignore` comments.
"""

from __future__ import annotations

from typing import Any


def add_method(cls: type, name: str, method: Any) -> None:  # noqa: ANN401
    """Add a method to a class in a type-safe manner.

    This function uses setattr() to add methods to classes, which is the
    standard pattern for extending pybind11 classes at runtime. The stub
    file (_mmgpy.pyi) declares these methods for type checking.

    Parameters
    ----------
    cls : type
        The class to add the method to.
    name : str
        The name of the method.
    method : Any
        The method implementation (function, classmethod, property, etc.).

    """
    setattr(cls, name, method)


def replace_method(cls: type, name: str, method: Any) -> None:  # noqa: ANN401
    """Replace an existing method on a class.

    This is used for wrapping existing methods with additional functionality.
    The stub file declares the final method signature.

    Parameters
    ----------
    cls : type
        The class to modify.
    name : str
        The name of the method to replace.
    method : Any
        The new method implementation.

    """
    setattr(cls, name, method)
