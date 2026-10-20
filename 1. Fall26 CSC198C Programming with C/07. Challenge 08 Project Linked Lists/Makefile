_DEPS = llist.h
_OBJ = llist.o
_MOBJ = main.o
_TOBJ = test.o

APPBIN  = linked_list_app
TESTBIN = linked_list_test

IDIR = include
CC = gcc
CFLAGS = -I$(IDIR) -Wall -Wextra -g -pthread -fsanitize=address
ODIR = obj
SDIR = src
LDIR = lib
TDIR = test
LIBS = -lm
XXLIBS = -lstdc++ -lgtest -lgtest_main -lpthread $(LIBS)
DEPS = $(patsubst %,$(IDIR)/%,$(_DEPS))
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))
MOBJ = $(patsubst %,$(ODIR)/%,$(_MOBJ))
TOBJ = $(patsubst %,$(ODIR)/%,$(_TOBJ))
SRC = $(wildcard $(SDIR)/*.c)

$(ODIR)/%.o: $(SDIR)/%.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

$(ODIR)/%.o: $(TDIR)/%.cpp $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

all: $(APPBIN) $(TESTBIN) submission-linked-list.zip

# Shorter names for convenience and more granular targeting
app: $(APPBIN)

test: $(TESTBIN)

sub: submission-linked-list.zip

$(APPBIN): $(OBJ) $(MOBJ)
	$(CC) -o $@ $^ $(CFLAGS) $(LIBS)

$(TESTBIN): $(TOBJ) $(OBJ)
	$(CC) -o $@ $^ $(CFLAGS) $(XXLIBS)

submission-linked-list.zip: $(SRC) $(DEPS)
	zip submission-linked-list.zip $(SRC) $(DEPS)


.PHONY: clean

clean:
	rm -f $(ODIR)/*.o *~ core $(IDIR)/*~ $(SDIR)/*~
	rm -f $(APPBIN) $(TESTBIN)
	rm -f submission-linked-list.zip
