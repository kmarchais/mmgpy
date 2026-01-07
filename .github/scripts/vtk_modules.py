#!/usr/bin/env python3
"""Shared VTK module definitions for wheel optimization scripts."""

from __future__ import annotations

import os
import re


def get_vtk_major_minor() -> str:
    """Get VTK major.minor version from environment or auto-detect.

    Uses VTK_VERSION environment variable (e.g., "9.4.1" -> "9.4").
    Falls back to "9.4" if not set.
    """
    vtk_version = os.environ.get("VTK_VERSION", "")
    if vtk_version:
        match = re.match(r"(\d+\.\d+)", vtk_version)
        if match:
            return match.group(1)
    return "9.4"


VTK_MAJOR_MINOR: str = get_vtk_major_minor()

ESSENTIAL_VTK_MODULES: set[str] = {
    "CommonColor",
    "CommonComputationalGeometry",
    "CommonCore",
    "CommonDataModel",
    "CommonExecutionModel",
    "CommonMath",
    "CommonMisc",
    "CommonSystem",
    "CommonTransforms",
    "DICOMParser",
    "FiltersCellGrid",
    "FiltersCore",
    "FiltersExtraction",
    "FiltersGeneral",
    "FiltersGeometry",
    "FiltersHybrid",
    "FiltersHyperTree",
    "FiltersModeling",
    "FiltersParallel",
    "FiltersReduction",
    "FiltersSources",
    "FiltersStatistics",
    "FiltersTexture",
    "FiltersVerdict",
    "IOCellGrid",
    "IOCore",
    "IOGeometry",
    "IOImage",
    "IOLegacy",
    "IOParallel",
    "IOParallelXML",
    "IOXML",
    "IOXMLParser",
    "ImagingCore",
    "ImagingSources",
    "ParallelCore",
    "ParallelDIY",
    "RenderingCore",
    "doubleconversion",
    "expat",
    "fmt",
    "jpeg",
    "jsoncpp",
    "kissfft",
    "loguru",
    "lz4",
    "lzma",
    "metaio",
    "png",
    "pugixml",
    "sys",
    "tiff",
    "token",
    "verdict",
    "zlib",
}
