export default interface IMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: string;
  message: string;
  img_url: string;
  is_system: boolean;
  create_at: string;
}
