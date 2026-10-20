#include <gtest/gtest.h>

// needed to access the C code
extern "C" {
#include "llist.h"
}

// This class definition is required by Google Test.
// See the documentation for further details.
class linked_list_test : public ::testing::Test {
 protected:
  // Constructor runs before each test
  linked_list_test() {}
  // Destructor cleans up after tests
  virtual ~linked_list_test() {}
  // Sets up before each test (after constructor)
  virtual void SetUp() {}
  // Clean up after each test (before destructor)
  virtual void TearDown() {}
};

TEST(linked_list_test, causality_holds) {
  EXPECT_TRUE(1) << "Kudos if you can actually trigger this message";
  EXPECT_FALSE(0) << "Kudos if you can actually trigger this message";
}


int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
