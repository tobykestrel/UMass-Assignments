#include <gtest/gtest.h>
// needed to access the C code
extern "C" {
#include "event.h"
}

// This class definition is required by Google Test.
// See the documentation for further details.
class event_time_test : public ::testing::Test {
 protected:
  // Constructor runs before each test
  event_time_test() {}
  // Destructor cleans up after tests
  virtual ~event_time_test() {}
  // Sets up before each test (after constructor)
  virtual void SetUp() {}
  // Clean up after each test (before destructor)
  virtual void TearDown() {}
};

TEST(event_time_test, causality_holds) {
  EXPECT_TRUE(1) << "Kudos if you can actually trigger this message\n";
  EXPECT_FALSE(0) << "Kudos if you can actually trigger this message\n";
}


int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
