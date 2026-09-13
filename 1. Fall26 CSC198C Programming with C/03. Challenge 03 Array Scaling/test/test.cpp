#include <gtest/gtest.h>

// needed to access the C code
extern "C" {
#include "array.h"
}

// This class definition is required by Google Test.
// See the documentation for further details.
class array_scaling_test : public ::testing::Test {
 protected:
  // Constructor runs before each test
  array_scaling_test() {}
  // Destructor cleans up after tests
  virtual ~array_scaling_test() {}
  // Sets up before each test (after constructor)
  virtual void SetUp() {}
  // Clean up after each test (before destructor)
  virtual void TearDown() {}
};

TEST(array_scaling_test, causality_holds) {
  EXPECT_TRUE(1) << "Kudos if you can actually trigger this message";
  EXPECT_FALSE(0) << "Kudos if you can actually trigger this message";
}


int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
