INSERT INTO public."RoomChat"("id", "name", "avatarUri") VALUES
(1,'Phòng chat số 1', null),
(2,'Phòng chat số 2', null);

INSERT INTO public."UsersOnRoomChats"("userId", "roomId","lastMessageSeenId") VALUES
(1, 1, null),
(2, 1, 1);