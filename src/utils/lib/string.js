String.prototype.equals = function (stringToCompare) {
  return this === stringToCompare
}
// Modify native object' prototypes is a bad practice, however, i don't have found a good way
