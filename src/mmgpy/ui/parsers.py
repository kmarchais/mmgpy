"""Safe formula evaluation and re-exports for backward compatibility."""

from __future__ import annotations

import ast
import logging
import operator
from typing import TYPE_CHECKING, ClassVar

import numpy as np

from mmgpy._sol import parse_sol_file

if TYPE_CHECKING:
    from collections.abc import Callable

logger = logging.getLogger(__name__)

__all__ = ["SafeFormulaEvaluator", "evaluate_levelset_formula", "parse_sol_file"]


class SafeFormulaEvaluator:
    """Safely evaluate mathematical formulas without using eval().

    This evaluator parses mathematical expressions using Python's AST module
    and only allows a restricted set of safe operations. It prevents arbitrary
    code execution while supporting common mathematical operations needed for
    levelset formulas.

    Examples
    --------
    >>> evaluator = SafeFormulaEvaluator()
    >>> x = np.array([0, 1, 2])
    >>> y = np.array([0, 0, 0])
    >>> z = np.array([0, 0, 0])
    >>> result = evaluator.evaluate("x**2 + y**2 + z**2 - 0.25", x, y, z)
    >>> result[0]  # 0**2 + 0**2 + 0**2 - 0.25
    -0.25

    """

    # Safe binary operators
    SAFE_BINOPS: ClassVar[dict[type, Callable]] = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
    }

    # Safe unary operators
    SAFE_UNARYOPS: ClassVar[dict[type, Callable]] = {
        ast.UAdd: operator.pos,
        ast.USub: operator.neg,
    }

    # Safe comparison operators
    SAFE_CMPOPS: ClassVar[dict[type, Callable]] = {
        ast.Lt: operator.lt,
        ast.LtE: operator.le,
        ast.Gt: operator.gt,
        ast.GtE: operator.ge,
        ast.Eq: operator.eq,
        ast.NotEq: operator.ne,
    }

    # Safe numpy functions that can be called
    SAFE_NP_FUNCS: ClassVar[set[str]] = {
        "sin",
        "cos",
        "tan",
        "arcsin",
        "arccos",
        "arctan",
        "arctan2",
        "sinh",
        "cosh",
        "tanh",
        "exp",
        "log",
        "log10",
        "log2",
        "sqrt",
        "abs",
        "absolute",
        "sign",
        "floor",
        "ceil",
        "round",
        "clip",
        "minimum",
        "maximum",
        "where",
        "pi",
        "e",
    }

    def __init__(self) -> None:
        """Initialize the safe formula evaluator."""
        self._variables: dict[str, np.ndarray] = {}

    def evaluate(
        self,
        formula: str,
        x: np.ndarray,
        y: np.ndarray,
        z: np.ndarray,
    ) -> np.ndarray:
        """Safely evaluate a formula with x, y, z variables.

        Parameters
        ----------
        formula : str
            Mathematical formula using x, y, z variables and numpy functions.
        x : np.ndarray
            X coordinates array.
        y : np.ndarray
            Y coordinates array.
        z : np.ndarray
            Z coordinates array.

        Returns
        -------
        np.ndarray
            Result of evaluating the formula.

        Raises
        ------
        ValueError
            If the formula contains unsafe operations or syntax errors.

        """
        self._variables = {"x": x, "y": y, "z": z}

        try:
            tree = ast.parse(formula, mode="eval")
        except SyntaxError as e:
            msg = f"Invalid formula syntax: {e}"
            raise ValueError(msg) from e

        try:
            result = self._eval_node(tree.body)
        except (TypeError, KeyError, AttributeError) as e:
            msg = f"Error evaluating formula: {e}"
            raise ValueError(msg) from e

        return np.asarray(result, dtype=np.float64)

    def _eval_node(self, node: ast.AST) -> np.ndarray | float:
        """Recursively evaluate an AST node.

        Parameters
        ----------
        node : ast.AST
            The AST node to evaluate.

        Returns
        -------
        np.ndarray | float
            The result of evaluating the node.

        Raises
        ------
        ValueError
            If the node type is not allowed.

        """
        if isinstance(node, ast.Constant):
            # Numbers and constants
            if isinstance(node.value, (int, float)):
                return node.value
            msg = f"Unsupported constant type: {type(node.value)}"
            raise ValueError(msg)

        if isinstance(node, ast.Name):
            # Variables: x, y, z
            if node.id in self._variables:
                return self._variables[node.id]
            msg = f"Unknown variable: {node.id}. Only x, y, z are allowed."
            raise ValueError(msg)

        if isinstance(node, ast.BinOp):
            # Binary operations: +, -, *, /, **, etc.
            op_type = type(node.op)
            if op_type not in self.SAFE_BINOPS:
                msg = f"Unsupported binary operator: {op_type.__name__}"
                raise ValueError(msg)
            left = self._eval_node(node.left)
            right = self._eval_node(node.right)
            return self.SAFE_BINOPS[op_type](left, right)

        if isinstance(node, ast.UnaryOp):
            # Unary operations: +, -
            op_type = type(node.op)
            if op_type not in self.SAFE_UNARYOPS:
                msg = f"Unsupported unary operator: {op_type.__name__}"
                raise ValueError(msg)
            operand = self._eval_node(node.operand)
            return self.SAFE_UNARYOPS[op_type](operand)

        if isinstance(node, ast.Compare):
            # Comparison operations
            if len(node.ops) != 1 or len(node.comparators) != 1:
                msg = "Only simple comparisons are supported"
                raise ValueError(msg)
            op_type = type(node.ops[0])
            if op_type not in self.SAFE_CMPOPS:
                msg = f"Unsupported comparison operator: {op_type.__name__}"
                raise ValueError(msg)
            left = self._eval_node(node.left)
            right = self._eval_node(node.comparators[0])
            return self.SAFE_CMPOPS[op_type](left, right)

        if isinstance(node, ast.Call):
            return self._eval_call(node)

        if isinstance(node, ast.Attribute):
            return self._eval_attribute(node)

        if isinstance(node, ast.IfExp):
            # Ternary: a if condition else b -> np.where(condition, a, b)
            test = self._eval_node(node.test)
            body = self._eval_node(node.body)
            orelse = self._eval_node(node.orelse)
            return np.where(test, body, orelse)

        msg = f"Unsupported expression type: {type(node).__name__}"
        raise ValueError(msg)

    def _eval_call(self, node: ast.Call) -> np.ndarray | float:
        """Evaluate a function call node.

        Parameters
        ----------
        node : ast.Call
            The function call AST node.

        Returns
        -------
        np.ndarray | float
            The result of the function call.

        Raises
        ------
        ValueError
            If the function is not allowed.

        """
        # Handle np.function() calls
        if isinstance(node.func, ast.Attribute):
            if isinstance(node.func.value, ast.Name) and node.func.value.id == "np":
                func_name = node.func.attr
                if func_name not in self.SAFE_NP_FUNCS:
                    msg = f"Unsupported numpy function: np.{func_name}"
                    raise ValueError(msg)
                func = getattr(np, func_name)
                args = [self._eval_node(arg) for arg in node.args]
                return func(*args)
            msg = "Only np.function() calls are allowed"
            raise ValueError(msg)

        # Handle direct function calls like abs()
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            # Map Python builtins to numpy equivalents
            builtin_map = {
                "abs": np.abs,
                "min": np.minimum,
                "max": np.maximum,
            }
            if func_name in builtin_map:
                args = [self._eval_node(arg) for arg in node.args]
                return builtin_map[func_name](*args)
            if func_name in self.SAFE_NP_FUNCS:
                func = getattr(np, func_name)
                args = [self._eval_node(arg) for arg in node.args]
                return func(*args)
            msg = f"Unsupported function: {func_name}"
            raise ValueError(msg)

        msg = "Invalid function call"
        raise ValueError(msg)

    def _eval_attribute(self, node: ast.Attribute) -> float:
        """Evaluate an attribute access node.

        Parameters
        ----------
        node : ast.Attribute
            The attribute access AST node.

        Returns
        -------
        float
            The attribute value.

        Raises
        ------
        ValueError
            If the attribute is not allowed.

        """
        # Handle np.pi, np.e
        if isinstance(node.value, ast.Name) and node.value.id == "np":
            attr_name = node.attr
            if attr_name in {"pi", "e"}:
                return getattr(np, attr_name)
            msg = f"Unsupported numpy attribute: np.{attr_name}"
            raise ValueError(msg)
        msg = "Only np.pi and np.e attributes are allowed"
        raise ValueError(msg)


# Module-level instance for convenience
_evaluator = SafeFormulaEvaluator()


def evaluate_levelset_formula(
    formula: str,
    x: np.ndarray,
    y: np.ndarray,
    z: np.ndarray,
) -> np.ndarray:
    """Safely evaluate a levelset formula.

    This is a convenience function that uses the SafeFormulaEvaluator
    to safely evaluate mathematical formulas without using eval().

    Parameters
    ----------
    formula : str
        Mathematical formula using x, y, z variables.
        Supported operations:
        - Arithmetic: +, -, *, /, **, //, %
        - Comparisons: <, <=, >, >=, ==, !=
        - Numpy functions: np.sin, np.cos, np.sqrt, np.exp, np.log, etc.
        - Constants: np.pi, np.e
        - Ternary expressions: a if condition else b

    x : np.ndarray
        X coordinates array.
    y : np.ndarray
        Y coordinates array.
    z : np.ndarray
        Z coordinates array.

    Returns
    -------
    np.ndarray
        Result of evaluating the formula, shaped as (-1, 1).

    Raises
    ------
    ValueError
        If the formula contains unsafe operations or syntax errors.

    Examples
    --------
    >>> x = np.array([0, 1, 0])
    >>> y = np.array([0, 0, 1])
    >>> z = np.array([0, 0, 0])
    >>> result = evaluate_levelset_formula("x**2 + y**2 + z**2 - 0.25", x, y, z)
    >>> result.shape
    (3, 1)

    """
    result = _evaluator.evaluate(formula, x, y, z)
    return result.reshape(-1, 1)
