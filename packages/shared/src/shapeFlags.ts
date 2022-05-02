export const enum ShapeFlags {
  // 使用二进制数记录
  ELEMENT = 1, // 0b1
  FUNCTIONAL_COMPONENT = 1 << 1, // 0b10
  STATEFUL_COMPONENT = 1 << 2, // 0b100
  TEXT_CHILDREN = 1 << 3, // 0b1000
  ARRAY_CHILDREN = 1 << 4, // 0b10000
}
