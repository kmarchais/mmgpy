#!/usr/bin/env python3
"""Post-install script to fix RPATH for MMG executables."""

import os
import subprocess
import sys
from pathlib import Path


def fix_rpath():
    """Fix RPATH for MMG executables after installation."""
    try:
        # Find site-packages directory
        import site
        site_packages = Path(site.getsitepackages()[0])
        
        # Find all MMG executables
        bin_dir = site_packages / "bin"
        if not bin_dir.exists():
            print(f"Warning: {bin_dir} does not exist")
            return
        
        executables = list(bin_dir.glob("mmg*_O3"))
        if not executables:
            print("No MMG executables found")
            return
        
        for exe in executables:
            print(f"Fixing RPATH for {exe.name}...")
            
            # Check if RPATH already exists
            result = subprocess.run(
                ["otool", "-l", str(exe)], 
                capture_output=True, text=True, check=False
            )
            
            if "@loader_path/../mmgpy/lib" in result.stdout:
                print(f"  RPATH already correct for {exe.name}")
                continue
            
            # Remove any existing incorrect RPATH entries
            subprocess.run(
                ["install_name_tool", "-delete_rpath", "@rpath", str(exe)],
                check=False, capture_output=True
            )
            
            # Add correct RPATH
            result = subprocess.run(
                ["install_name_tool", "-add_rpath", "@loader_path/../mmgpy/lib", str(exe)],
                check=False, capture_output=True
            )
            
            if result.returncode == 0:
                print(f"  Successfully fixed RPATH for {exe.name}")
            else:
                print(f"  Warning: Failed to fix RPATH for {exe.name}")
                
    except Exception as e:
        print(f"Error fixing RPATH: {e}")


if __name__ == "__main__":
    fix_rpath()