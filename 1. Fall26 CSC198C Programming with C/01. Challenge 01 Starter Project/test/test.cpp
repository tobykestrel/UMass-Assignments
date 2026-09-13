#include <gtest/gtest.h>

extern "C" {
#include "hellofunc.h"
}

TEST(starter_test, test_sum_positive) {
  int r = sum(1, 2);
  EXPECT_EQ(r, 3);
}


int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
