// 当 T 是 any 时，返回 Y，否则返回 N
// 因为任何类型和 any 的相交类型(&)都是 any, 1 & 其它类型不可能返回 0
// 所以仅 T 为 any 时，0 extends 1 & any 为 true
export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N
