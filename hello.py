import mmgpy

# Create a mesh object
mesh = mmgpy.Mesh()

# Load input files
mesh.load_mesh("input.mesh")
mesh.load_solution("input.sol")

# Set some options
mesh.set_option("hmin", 0.1)
mesh.set_option("hmax", 2.0)
mesh.set_option("hausd", 0.01)

# Perform remeshing
if mesh.remesh():
    # Save results
    mesh.save_mesh("output.mesh")
    mesh.save_solution("output.sol")
