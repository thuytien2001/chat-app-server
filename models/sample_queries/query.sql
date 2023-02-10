CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION public.immutable_unaccent(regdictionary, text)
  RETURNS text
  LANGUAGE c IMMUTABLE PARALLEL SAFE STRICT AS
'$libdir/unaccent', 'unaccent_dict';

CREATE OR REPLACE FUNCTION public.f_unaccent(text)
  RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  BEGIN ATOMIC
SELECT public.immutable_unaccent(regdictionary 'public.unaccent', $1);
END;

ALTER TABLE "Message" ADD COLUMN full_txt_search_idx tsvector GENERATED ALWAYS AS (to_tsvector('simple', f_unaccent(content))) STORED;
CREATE INDEX message_fts_idx ON "Message" USING GIN (full_txt_search_idx);

-- ALTER TABLE "Message" ADD COLUMN search_idx tsvector GENERATED ALWAYS AS (f_unaccent(content)) STORED;
-- CREATE INDEX message_idx ON "Message" USING GIN(search_idx);


INSERT INTO "User"("id", "userName", "password", "name", "imageUri") VALUES
(1,'admin','123456','admin',null),
(2,'thuytien','123456','Thuỷ Tiên',null),
(3,'minhnhuc','123456','Minh Nhực', null);

INSERT INTO "RoomChat"("id", "name", "avatarUri") VALUES
(1,'Phòng chat số 1', null),
(2,'Phòng chat số 2', null),
(3,'Phòng chat số 3', null);

INSERT INTO "Message"("id", "content", "createdById", "roomId") VALUES
(1, 'Xin chào, cho mình làm quen nha', 1, 1),
(2, 'Chào bạn, mình tên Nhực', 2, 1),
(3, 'Xin chào mọi người, mình là thành viên mới', 2, 3);

INSERT INTO "UsersOnRoomChats"("userId", "roomId","lastMessageSeenId") VALUES
(1, 1, null),
(2, 1, 1),
(1, 3, null),
(2, 3, 3),
(3, 3, null);