# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: MIT
"""Property definitions for MMGpy Blender extension."""

from __future__ import annotations

import bpy
from bpy.props import (
    BoolProperty,
    CollectionProperty,
    EnumProperty,
    FloatProperty,
    IntProperty,
    PointerProperty,
)
from bpy.types import PropertyGroup


class MMGPYSizingConstraint(PropertyGroup):
    """A local sizing constraint (sphere or box refinement zone)."""

    constraint_type: EnumProperty(
        name="Type",
        items=[
            ("SPHERE", "Sphere", "Spherical refinement zone"),
            ("BOX", "Box", "Box-shaped refinement zone"),
        ],
        default="SPHERE",
    )

    # Reference to an Empty object that defines the constraint
    empty_object: PointerProperty(
        name="Empty",
        type=bpy.types.Object,
        description="Empty object defining the constraint location and size",
    )

    # Target edge size within the constraint
    target_size: FloatProperty(
        name="Target Size",
        description="Target edge size within this region",
        default=0.01,
        min=0.0001,
        soft_max=1.0,
        precision=4,
        unit="LENGTH",
    )


class MMGPYSettings(PropertyGroup):
    """Main settings for MMGpy remeshing."""

    # Preset selection
    preset: EnumProperty(
        name="Preset",
        description="Quick preset for remeshing settings",
        items=[
            ("CUSTOM", "Custom", "Manual settings"),
            ("FINE", "Fine", "High quality, smaller elements"),
            ("MEDIUM", "Medium", "Balanced quality and performance"),
            ("COARSE", "Coarse", "Fast remeshing, larger elements"),
        ],
        default="MEDIUM",
    )

    # Size control parameters
    use_hmin: BoolProperty(
        name="Use Min Size",
        description="Enable minimum edge size constraint",
        default=False,
    )
    hmin: FloatProperty(
        name="Min Size",
        description="Minimum edge size (hmin)",
        default=0.001,
        min=0.00001,
        soft_max=1.0,
        precision=5,
        unit="LENGTH",
    )

    use_hmax: BoolProperty(
        name="Use Max Size",
        description="Enable maximum edge size constraint",
        default=True,
    )
    hmax: FloatProperty(
        name="Max Size",
        description="Maximum edge size (hmax)",
        default=0.1,
        min=0.00001,
        soft_max=10.0,
        precision=4,
        unit="LENGTH",
    )

    use_hsiz: BoolProperty(
        name="Use Uniform Size",
        description="Use constant edge size (overrides hmin/hmax)",
        default=False,
    )
    hsiz: FloatProperty(
        name="Uniform Size",
        description="Constant edge size (hsiz)",
        default=0.05,
        min=0.00001,
        soft_max=10.0,
        precision=4,
        unit="LENGTH",
    )

    # Geometry parameters
    use_hausd: BoolProperty(
        name="Use Hausdorff",
        description="Enable Hausdorff distance constraint for geometry approximation",
        default=True,
    )
    hausd: FloatProperty(
        name="Hausdorff Distance",
        description="Maximum distance between original and remeshed surface",
        default=0.01,
        min=0.000001,
        soft_max=1.0,
        precision=5,
        unit="LENGTH",
    )

    # Angle detection
    use_ar: BoolProperty(
        name="Use Angle Detection",
        description="Enable angle-based ridge detection",
        default=False,
    )
    ar: FloatProperty(
        name="Angle",
        description="Angle threshold for ridge detection (degrees)",
        default=45.0,
        min=0.0,
        max=180.0,
        precision=1,
        subtype="ANGLE",
    )

    # Gradation
    use_hgrad: BoolProperty(
        name="Use Gradation",
        description="Enable gradation control",
        default=False,
    )
    hgrad: FloatProperty(
        name="Gradation",
        description="Gradation parameter (controls size transition between elements)",
        default=1.3,
        min=1.0,
        soft_max=3.0,
        precision=2,
    )

    # Advanced options
    verbose: IntProperty(
        name="Verbosity",
        description="Verbosity level (-1=silent, 0=errors, 1=info)",
        default=-1,
        min=-1,
        max=10,
    )

    # Optimization flags
    optim: BoolProperty(
        name="Optimize Only",
        description="Only optimize mesh quality without changing topology",
        default=False,
    )

    noinsert: BoolProperty(
        name="No Insert",
        description="Disable point insertion",
        default=False,
    )

    noswap: BoolProperty(
        name="No Swap",
        description="Disable edge/face swapping",
        default=False,
    )

    nomove: BoolProperty(
        name="No Move",
        description="Disable point relocation",
        default=False,
    )

    # Local sizing constraints collection
    sizing_constraints: CollectionProperty(
        type=MMGPYSizingConstraint,
        name="Sizing Constraints",
    )

    active_constraint_index: IntProperty(
        name="Active Constraint",
        default=0,
    )

    # UI state
    show_advanced: BoolProperty(
        name="Show Advanced",
        description="Show advanced options",
        default=False,
    )
