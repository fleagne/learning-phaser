export class Constants {
  // 衝突判定から除外したいタイルのインデックスを配列で指定する
  // "-1" は空のタイルなので衝突しない。それ以外は衝突する
  // "12" は部屋移動のタイルなので衝突しない。
  // "13" は鍵のタイルなので衝突しない
  // "14" はゴールのタイルなので衝突しない
  static readonly EXCLUDE_COLLIDE_INDEXES = [-1, 0, 12, 13, 14];
  static readonly TILE_SIZE = 64;
  static readonly ID = self.crypto.randomUUID();
}