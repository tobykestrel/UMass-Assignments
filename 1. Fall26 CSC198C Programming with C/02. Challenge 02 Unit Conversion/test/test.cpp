#include <gtest/gtest.h>

// needed to access the C code
extern "C" {
#include "unit.h"
}

// This class definition is required by Google Test.
// See the documentation for further details.
class unit_conversion_test : public ::testing::Test {
 protected:
  // Constructor runs before each test
  unit_conversion_test() {}
  // Destructor cleans up after tests
  virtual ~unit_conversion_test() {}
  // Sets up before each test (after constructor)
  virtual void SetUp() {}
  // Clean up after each test (before destructor)
  virtual void TearDown() {}
};

TEST(unit_conversion_test, causality_holds) {
  EXPECT_TRUE(1) << "Kudos if you can actually trigger this message";
  EXPECT_FALSE(0) << "Kudos if you can actually trigger this message";
}


int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
