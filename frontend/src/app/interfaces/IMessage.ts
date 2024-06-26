export default interface IMessage {
  id: string;
  message_type: string;
  is_system: boolean;
  img_url: string;
  //name: string;
  room_id: string;
  sender_id: string;
  message: string;
  create_at: string;
}
