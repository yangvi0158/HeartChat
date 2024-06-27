export default interface IUser {
  name: string;
  id: string;
  description: string;
  has_img: boolean;
  img_id: string;
  avatar_color: string;
  room_list: string[];
  created_at: string;
}
