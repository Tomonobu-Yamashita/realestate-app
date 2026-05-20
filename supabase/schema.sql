-- =============================================
-- 不動産管理アプリ: propertiesテーブル定義
-- Supabaseのクエリエディタで実行してください
-- =============================================

-- 物件テーブル作成
CREATE TABLE IF NOT EXISTS properties (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text        NOT NULL,                        -- 物件名
  rent       integer     NOT NULL CHECK (rent > 0),       -- 家賃（円）
  area       text        NOT NULL,                        -- エリア名
  layout     text        NOT NULL,                        -- 間取り（例: 1LDK）
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- 登録ユーザー
  created_at timestamptz DEFAULT now() NOT NULL
);

-- =============================================
-- Row Level Security (RLS) の設定
-- =============================================

-- RLSを有効化（無効だと全ユーザーのデータが見えてしまう）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分が登録した物件のみ取得可能
CREATE POLICY "自分の物件のみ参照可能"
  ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: user_idに自分のIDが設定されている場合のみ登録可能
CREATE POLICY "自分の物件のみ登録可能"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能"
  ON properties
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能"
  ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
