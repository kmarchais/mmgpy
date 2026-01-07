"""Shared VTK module definitions for wheel optimization scripts."""

import os
import re


def get_vtk_major_minor():
    """Get VTK major.minor version from environment or auto-detect.

    Uses VTK_VERSION environment variable (e.g., "9.4.1" -> "9.4").
    Falls back to "9.4" if not set.
    """
    vtk_version = os.environ.get("VTK_VERSION", "")
    if vtk_version:
        match = re.match(r"(\d+\.\d+)", vtk_version)
        if match:
            return match.group(1)
    return "9.4"  # Fallback default


# VTK major.minor version string (e.g., "9.4", "9.5")
VTK_MAJOR_MINOR = get_vtk_major_minor()

# VTK modules required for MMG I/O (matching Windows minimal set)
# This list is shared between filter_vtk.py and optimize_wheels.py
ESSENTIAL_VTK_MODULES = {
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
