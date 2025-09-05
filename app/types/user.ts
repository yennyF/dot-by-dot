import { User as ApiUser } from "@supabase/supabase-js";

export type User = {
  id: string;
  email?: string;
};

export function mapUserResponse(data: ApiUser): User {
  return {
    id: data.id,
    email: data.email,
  };
}
