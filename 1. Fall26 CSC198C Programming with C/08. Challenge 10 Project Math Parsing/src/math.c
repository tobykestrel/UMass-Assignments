#include "math.h"
#include <stdio.h>
#include <stdlib.h>

// goal: read equations from a file and write them in a solved state to another
// file
//   NOTE: format details specified in instructions
// param qfile: file with math questions to solve
// param afile: file to write equations with answers in
// example:
//   qfile at start of function:
//     12 + 13
//     24 / 5
//     8 * 234
//     65 - 78
//     239 % 13
//   afile after function:
//      12 +  13 = 25
//      24 /   5 = 4
//       8 * 234 = 1872
//      65 -  78 = -13
//     239 %  13 = 5
//
// TODO: Complete the function
void solve(const char *qfile, const char *afile) {
  FILE *inp;
  inp = fopen(qfile, "r");
  if (inp == NULL) {
    fprintf(stderr, "Couldn't open the input file.\n");
    return;
  }

  FILE *out;
  out = fopen(afile, "w");
  if (out == NULL) {
    fprintf(stderr, "Couldn't open the output file.\n");
    fclose(inp);
    return;
  }

  char line[32];
  while (fgets(line, sizeof(line), inp)) {
    int first, second, result;
    char op;
    if (sscanf(line, "%d %c %d", &first, &op, &second) != 3) {
      fprintf(stderr, "Invalid equation: %s", line);
      continue;
    }

    switch (op) {
      case '+': result = first + second; break;
      case '-': result = first - second; break;
      case '*': result = first * second; break;
      case '/': result = first / second; break;
      case '%': result = first % second; break;
      default:
        fprintf(stderr, "Invalid operator in equation: %s", line);
        continue;
    }
    fprintf(out, "%3d %c %3d = %d\n", first, op, second, result);
  }

  fclose(inp);
  fclose(out);
}
