from mmgpy import mmg3d

result = mmg3d.remesh(
    input_mesh="tests/Mesh.mesh",
    output_mesh="tests/output.mesh",
    # options={
    #     "ls": 0,
    #     "hsiz": 0.03,
    #     "imprim": -1,
    # },
)

print(f"Remeshing {'succeeded' if result else 'failed'}")
