/* Minimal reproducer for MmgTools/mmg#326.
 *
 * Build against MMG 5.8.0, then run with an output path ending in .solb.
 * The program writes scalar, vector, and tensor vertex fields through the
 * public MMG3D multi-solution API and reads them back.  MMG 5.8.0 corrupts
 * every vertex after the first because MMG3D_saveAllSols writes an ASCII
 * newline after each binary record.
 */

#include "mmg/mmg3d/libmmg3d.h"

#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define CHECK(call)                                                            \
  do {                                                                         \
    if ((call) != 1) {                                                         \
      fprintf(stderr, "%s failed\n", #call);                                   \
      status = EXIT_FAILURE;                                                   \
      goto cleanup;                                                            \
    }                                                                          \
  } while (0)

static int same_values(const double *actual, const double *expected,
                       int count) {
  int i;
  for (i = 0; i < count; ++i) {
    if (fabs(actual[i] - expected[i]) > 1.0e-12) {
      fprintf(stderr, "mismatch at component %d: expected %.17g, got %.17g\n",
              i, expected[i], actual[i]);
      return 0;
    }
  }
  return 1;
}

int main(int argc, char **argv) {
  MMG5_pMesh mesh = NULL;
  MMG5_pSol metric = NULL;
  MMG5_pSol written = NULL;
  MMG5_pSol loaded = NULL;
  MMG5_int entity_count = 0;
  int loaded_count = 0;
  int loaded_types[MMG5_NSOLS_MAX] = {0};
  int status = EXIT_SUCCESS;
  int types[] = {MMG5_Scalar, MMG5_Vector, MMG5_Tensor};
  double scalar[] = {1.0, 2.0, 3.0, 4.0};
  double vector[] = {1.0, 2.0, 3.0, 4.0,  5.0,  6.0,
                     7.0, 8.0, 9.0, 10.0, 11.0, 12.0};
  double tensor[] = {1.0,  2.0,  3.0,  4.0,  5.0,  6.0,  7.0,  8.0,
                     9.0,  10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0,
                     17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0};
  double actual[24] = {0.0};
  const char *filename = argc > 1 ? argv[1] : "mmg-multisols.solb";

  CHECK(MMG3D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                        &metric, MMG5_ARG_end));
  CHECK(MMG3D_Set_meshSize(mesh, 4, 1, 0, 0, 0, 0));
  CHECK(MMG3D_Set_vertex(mesh, 0.0, 0.0, 0.0, 0, 1));
  CHECK(MMG3D_Set_vertex(mesh, 1.0, 0.0, 0.0, 0, 2));
  CHECK(MMG3D_Set_vertex(mesh, 0.0, 1.0, 0.0, 0, 3));
  CHECK(MMG3D_Set_vertex(mesh, 0.0, 0.0, 1.0, 0, 4));
  CHECK(MMG3D_Set_tetrahedron(mesh, 1, 2, 3, 4, 0, 1));

  CHECK(MMG3D_Set_solsAtVerticesSize(mesh, &written, 3, 4, types));
  CHECK(MMG3D_Set_ithSols_inSolsAtVertices(written, 1, scalar));
  CHECK(MMG3D_Set_ithSols_inSolsAtVertices(written, 2, vector));
  CHECK(MMG3D_Set_ithSols_inSolsAtVertices(written, 3, tensor));
  CHECK(MMG3D_saveAllSols(mesh, &written, filename));
  CHECK(MMG3D_loadAllSols(mesh, &loaded, filename));
  CHECK(MMG3D_Get_solsAtVerticesSize(mesh, &loaded, &loaded_count,
                                     &entity_count, loaded_types));

  if (loaded_count != 3 || entity_count != 4 || loaded_types[0] != types[0] ||
      loaded_types[1] != types[1] || loaded_types[2] != types[2]) {
    fprintf(stderr, "round-trip changed the multi-solution header\n");
    status = EXIT_FAILURE;
    goto cleanup;
  }

  CHECK(MMG3D_Get_ithSols_inSolsAtVertices(loaded, 1, actual));
  if (!same_values(actual, scalar, 4)) {
    status = EXIT_FAILURE;
    goto cleanup;
  }
  CHECK(MMG3D_Get_ithSols_inSolsAtVertices(loaded, 2, actual));
  if (!same_values(actual, vector, 12)) {
    status = EXIT_FAILURE;
    goto cleanup;
  }
  CHECK(MMG3D_Get_ithSols_inSolsAtVertices(loaded, 3, actual));
  if (!same_values(actual, tensor, 24)) {
    status = EXIT_FAILURE;
    goto cleanup;
  }

  puts("binary multi-solution round-trip succeeded");

cleanup:
  if (loaded != NULL) {
    MMG3D_Free_allSols(mesh, &loaded);
  }
  if (written != NULL) {
    MMG3D_Free_allSols(mesh, &written);
  }
  MMG3D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                 &metric, MMG5_ARG_end);
  return status;
}
